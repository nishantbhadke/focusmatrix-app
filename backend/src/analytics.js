'use strict';

const QUADRANTS = ['Q1', 'Q2', 'Q3', 'Q4'];
const CATEGORIES = ['work', 'personal', 'health', 'learning', 'admin', 'creative'];
const ENERGY_LEVELS = ['high', 'medium', 'low'];

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function calcScore(tasks) {
  if (!tasks.length) {
    return 0;
  }

  const total = tasks.length;
  const done = tasks.filter((task) => task.done).length;
  const q2All = tasks.filter((task) => task.q === 'Q2').length;
  const q2Done = tasks.filter((task) => task.q === 'Q2' && task.done).length;
  const q1All = tasks.filter((task) => task.q === 'Q1').length;
  const q1Done = tasks.filter((task) => task.q === 'Q1' && task.done).length;
  const q4 = tasks.filter((task) => task.q === 'Q4').length;
  const completion = (done / total) * 50;
  const strategic = q2All > 0 ? (q2Done / q2All) * 25 : 12;
  const urgent = q1All > 0 ? (q1Done / q1All) * 15 : 8;
  const penalty = Math.min((q4 / total) * 20, 15);

  return clampScore(completion + strategic + urgent - penalty);
}

function gradeChar(score) {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'C+';
  if (score >= 65) return 'C';
  if (score >= 55) return 'D';
  return 'F';
}

function gradeLabel(score) {
  if (score >= 85) return 'Outstanding execution';
  if (score >= 75) return 'Strong performance';
  if (score >= 65) return 'Solid progress';
  if (score >= 50) return 'Room to improve';
  return 'Refocus and reset';
}

function scoreBand(score) {
  if (score >= 75) return 'green';
  if (score >= 50) return 'amber';
  return 'red';
}

function buildQuadrantCounts(tasks) {
  return QUADRANTS.reduce((acc, quadrant) => {
    acc[quadrant] = tasks.filter((task) => task.q === quadrant).length;
    return acc;
  }, {});
}

function buildCategoryCounts(tasks) {
  return CATEGORIES.reduce((acc, category) => {
    acc[category] = tasks.filter((task) => task.cat === category).length;
    return acc;
  }, {});
}

function buildEnergyCounts(tasks) {
  return ENERGY_LEVELS.reduce((acc, energy) => {
    acc[energy] = tasks.filter((task) => task.energy === energy).length;
    return acc;
  }, {});
}

function summarizeDay(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.done).length;
  const q2Count = tasks.filter((task) => task.q === 'Q2').length;
  const q4Count = tasks.filter((task) => task.q === 'Q4').length;
  const score = calcScore(tasks);

  return {
    totalTasks: total,
    completedTasks: completed,
    pendingTasks: total - completed,
    completionRate: total > 0 ? clampScore((completed / total) * 100) : 0,
    strategicRatio: total > 0 ? clampScore((q2Count / total) * 100) : 0,
    distractionIndex: q4Count,
    score,
    grade: gradeChar(score),
    label: gradeLabel(score),
    scoreBand: scoreBand(score),
    quadrants: buildQuadrantCounts(tasks),
    categories: buildCategoryCounts(tasks),
    energy: buildEnergyCounts(tasks)
  };
}

function startOfWeek(dateString) {
  const date = new Date(dateString);
  const day = date.getDay();
  const mondayOffset = (day + 6) % 7;
  date.setDate(date.getDate() - mondayOffset);
  return date;
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function generateInsights(days, tasks, averageScore, activeDays) {
  const insights = [];
  const scoredDays = days.filter((day) => day.tasks > 0);

  if (averageScore >= 75) {
    insights.push('Weekly discipline score is strong. You are completing what you plan.');
  } else if (averageScore >= 50) {
    insights.push('Progress is happening, but the gap between planning and execution can still shrink.');
  } else {
    insights.push('Try logging fewer, higher-quality tasks each day instead of over-planning.');
  }

  if (scoredDays.length >= 3) {
    const recentScores = scoredDays.slice(-3).map((day) => day.score);
    const trend = recentScores[recentScores.length - 1] - recentScores[0];
    if (trend > 8) {
      insights.push(`Score trend is up ${trend} points over the last 3 active days.`);
    } else if (trend < -8) {
      insights.push(`Score dropped ${Math.abs(trend)} points over the last 3 active days.`);
    }
  }

  if (tasks.length > 0) {
    const q2Ratio = clampScore((tasks.filter((task) => task.q === 'Q2').length / tasks.length) * 100);
    const q4Ratio = clampScore((tasks.filter((task) => task.q === 'Q4').length / tasks.length) * 100);

    if (q2Ratio < 20) {
      insights.push(`Only ${q2Ratio}% of weekly tasks were Q2 strategic work.`);
    } else {
      insights.push(`${q2Ratio}% of weekly tasks were Q2 strategic work.`);
    }

    if (q4Ratio > 15) {
      insights.push(`${q4Ratio}% of weekly tasks fell into Q4 distraction territory.`);
    }
  }

  if (activeDays >= 5) {
    insights.push(`${activeDays} active days logged this week. Consistency is becoming a habit.`);
  } else if (activeDays < 3) {
    insights.push(`Only ${activeDays} days have data this week. More consistency will improve insight quality.`);
  }

  insights.push('Next action: protect 90 minutes for one Q2 task before opening email or chat.');

  return insights;
}

function summarizeWeek(referenceDate, allTasks, history) {
  const monday = startOfWeek(referenceDate);
  const days = [];

  for (let index = 0; index < 7; index += 1) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + index);
    const key = dateKey(current);
    const tasks = allTasks.filter((task) => task.date === key);
    const snapshot = history[key] || null;
    const score = snapshot ? snapshot.score : calcScore(tasks);
    const taskCount = tasks.length > 0 ? tasks.length : (snapshot ? snapshot.tasks : 0);

    days.push({
      date: key,
      day: current.toLocaleDateString('en-US', { weekday: 'short' }),
      tasks: taskCount,
      completedTasks: tasks.filter((task) => task.done).length,
      score: taskCount > 0 || snapshot ? score : 0
    });
  }

  const activeDays = days.filter((day) => day.tasks > 0).length;
  const averageScore = activeDays > 0
    ? clampScore(days.filter((day) => day.tasks > 0).reduce((sum, day) => sum + day.score, 0) / activeDays)
    : 0;
  const weeklyTasks = allTasks.filter((task) => days.some((day) => day.date === task.date));
  const totalTasks = days.reduce((sum, day) => sum + day.tasks, 0);
  const completedTasks = weeklyTasks.filter((task) => task.done).length;

  return {
    range: {
      start: days[0].date,
      end: days[6].date
    },
    averageScore,
    grade: gradeChar(averageScore),
    label: gradeLabel(averageScore),
    scoreBand: scoreBand(averageScore),
    activeDays,
    totalTasks,
    completedTasks,
    quadrants: buildQuadrantCounts(weeklyTasks),
    categories: buildCategoryCounts(weeklyTasks),
    days,
    insights: generateInsights(days, weeklyTasks, averageScore, activeDays)
  };
}

function suggestQuadrant(text) {
  const value = String(text || '').toLowerCase();
  if (!value) {
    return null;
  }

  if (['scroll', 'browse', 'netflix', 'reddit', 'instagram', 'twitter', 'tiktok'].some((word) => value.includes(word))) {
    return 'Q4';
  }

  const urgent = ['urgent', 'asap', 'deadline', 'due today', 'emergency', 'critical', 'immediately'].some((word) => value.includes(word));
  const important = ['strategy', 'plan', 'learn', 'read', 'study', 'build', 'design', 'review', 'write', 'create', 'improve'].some((word) => value.includes(word));
  if (urgent && important) {
    return 'Q1';
  }
  if (!urgent && important) {
    return 'Q2';
  }
  if (['reply', 'email', 'call', 'meeting', 'ping', 'message'].some((word) => value.includes(word))) {
    return 'Q3';
  }
  return null;
}

module.exports = {
  CATEGORIES,
  ENERGY_LEVELS,
  QUADRANTS,
  calcScore,
  summarizeDay,
  summarizeWeek,
  suggestQuadrant
};
