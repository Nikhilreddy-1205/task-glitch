import {
  computeFunnel,
  computeThroughputByWeek,
  computeWeightedPipeline,
  computeForecast,
  computeVelocityByPriority,
} from '@/utils/logic';
import { Task } from '@/types';

interface Props {
  tasks: Task[];
}

export default function AnalyticsDashboard({ tasks }: Props) {
  const funnel = computeFunnel(tasks);
  const weekly = computeThroughputByWeek(tasks);
  const forecast = computeForecast(
    weekly.map((w: { week: string; revenue: number }) => ({
      week: w.week,
      revenue: w.revenue,
    })),
    4
  );

  computeWeightedPipeline(tasks);
  computeVelocityByPriority(tasks);

  return null;
}
