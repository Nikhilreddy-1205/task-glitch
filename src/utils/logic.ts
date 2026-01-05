import { DerivedTask, Task } from '@/types';

export function computeROI(revenue: number, timeTaken: number): number {
  if (!Number.isFinite(revenue) || !Number.isFinite(timeTaken) || timeTaken <= 0) {
    return 0;
  }
  return Number((revenue / timeTaken).toFixed(2));
}

export function computePriorityWeight(priority: Task['priority']): 3 | 2 | 1 {
  switch (priority) {
    case 'High':
      return 3;
    case 'Medium':
      return 2;
    default:
      return 1;
  }
}

export function withDerived(task: Task): DerivedTask {
  return {
    ...task,
    roi: computeROI(task.revenue, task.timeTaken),
    priorityWeight: computePriorityWeight(task.priority),
  };
}

export function sortTasks(tasks: ReadonlyArray<DerivedTask>): DerivedTask[] {
  return [...tasks].sort((a, b) => {
    const aROI = a.roi ?? 0;
    const bROI = b.roi ?? 0;

    if (bROI !== aROI) return bROI - aROI;
    if (b.priorityWeight !== a.priorityWeight) {
      return b.priorityWeight - a.priorityWeight;
    }
    return a.title.localeCompare(b.title);
  });
}

export function computeTotalRevenue(tasks: ReadonlyArray<Task>): number {
  return tasks.filter(t => t.status === 'Done').reduce((s, t) => s + t.revenue, 0);
}

export function computeTotalTimeTaken(tasks: ReadonlyArray<Task>): number {
  return tasks.reduce((s, t) => s + t.timeTaken, 0);
}

export function computeTimeEfficiency(tasks: ReadonlyArray<Task>): number {
  if (!tasks.length) return 0;
  return (tasks.filter(t => t.status === 'Done').length / tasks.length) * 100;
}

export function computeRevenuePerHour(tasks: ReadonlyArray<Task>): number {
  const time = computeTotalTimeTaken(tasks);
  return time > 0 ? computeTotalRevenue(tasks) / time : 0;
}

export function computeAverageROI(tasks: ReadonlyArray<Task>): number {
  const rois = tasks.map(t => computeROI(t.revenue, t.timeTaken));
  return rois.length ? rois.reduce((s, r) => s + r, 0) / rois.length : 0;
}

export function computePerformanceGrade(avgROI: number): 'Excellent' | 'Good' | 'Needs Improvement' {
  if (avgROI > 500) return 'Excellent';
  if (avgROI >= 200) return 'Good';
  return 'Needs Improvement';
}

export function daysBetween(aISO: string, bISO: string): number {
  const a = new Date(aISO).getTime();
  const b = new Date(bISO).getTime();
  return Math.max(0, Math.round((b - a) / (24 * 3600 * 1000)));
}

export function computeFunnel(tasks: ReadonlyArray<Task>) {
  const todo = tasks.filter(t => t.status === 'Todo').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const done = tasks.filter(t => t.status === 'Done').length;
  return { todo, inProgress, done };
}

export function computeThroughputByWeek(tasks: ReadonlyArray<Task>) {
  const map = new Map<string, { week: string; count: number; revenue: number }>();

  tasks.forEach(t => {
    if (!t.completedAt) return;
    const d = new Date(t.completedAt);
    const weekKey = `${d.getFullYear()}-${d.getMonth() + 1}`;

    const curr = map.get(weekKey) ?? { week: weekKey, count: 0, revenue: 0 };
    curr.count += 1;
    curr.revenue += t.revenue;
    map.set(weekKey, curr);
  });

  return Array.from(map.values());
}

export function computeWeightedPipeline(tasks: ReadonlyArray<Task>): number {
  const weight = { Todo: 0.1, 'In Progress': 0.5, Done: 1 } as const;
  return tasks.reduce((s, t) => s + t.revenue * weight[t.status], 0);
}

export function computeForecast(
  weekly: Array<{ week: string; revenue: number }>,
  horizon = 4
) {
  const last = weekly[weekly.length - 1]?.revenue ?? 0;
  return Array.from({ length: horizon }, (_, i) => ({
    week: `+${i + 1}`,
    revenue: last,
  }));
}

export function computeVelocityByPriority(tasks: ReadonlyArray<Task>) {
  return {
    High: { avgDays: 0, medianDays: 0 },
    Medium: { avgDays: 0, medianDays: 0 },
    Low: { avgDays: 0, medianDays: 0 },
  };
}
