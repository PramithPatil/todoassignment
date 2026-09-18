import { Task } from '../types';

export const getSortedTasks = (tasks: Task[]): Task[] => {
  const now = new Date().getTime();

  return [...tasks].sort((a, b) => {
    // 3. Completed tasks always sort to the bottom, ordered by most-recently-completed first (use updatedAt).
    if (a.status === 'completed' && b.status === 'completed') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    if (a.status === 'completed') return 1;
    if (b.status === 'completed') return -1;

    // Both are pending at this point
    const aDue = new Date(a.dueDateTime).getTime();
    const bDue = new Date(b.dueDateTime).getTime();
    const aIsOverdue = aDue < now;
    const bIsOverdue = bDue < now;

    // 1. Overdue, incomplete tasks always sort to the top
    if (aIsOverdue && !bIsOverdue) return -1;
    if (!aIsOverdue && bIsOverdue) return 1;

    // If both are overdue, order by priority, then by how overdue they are (most overdue first)
    if (aIsOverdue && bIsOverdue) {
      const priorityWeight: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      const aWeight = priorityWeight[a.priority];
      const bWeight = priorityWeight[b.priority];
      
      if (aWeight !== bWeight) {
        return bWeight - aWeight; // Higher priority first
      }
      return aDue - bDue; // Most overdue first
    }

    // 2. For all other pending tasks, compute a score:
    const getScore = (task: Task, dueTime: number) => {
      const priorityWeight = { High: 3, Medium: 2, Low: 1 }[task.priority] || 1;
      const hoursUntilDeadline = Math.max(0, (dueTime - now) / (1000 * 60 * 60));
      const urgencyScore = 100 / (hoursUntilDeadline + 1);
      return (priorityWeight * 10) + urgencyScore;
    };

    const aScore = getScore(a, aDue);
    const bScore = getScore(b, bDue);

    return bScore - aScore; // Sort descending by finalScore
  });
};
