import { useTasks } from '../../data/repositories/TaskDataProvider';
import { usePreferences } from '../../platform/preferences/preferenceStore';
import { TaskDetailDrawer } from './TaskDetailDrawer';
import { TaskDetailModal } from './TaskDetailModal';

export function DetailHost({ taskId, onClose }: { taskId: string | null; onClose: () => void }) {
  const { data: tasks = [] } = useTasks();
  const { preferences } = usePreferences();
  const task = tasks.find((item) => item.id === taskId);
  if (!taskId || !task) return null;
  return preferences.detailMode === 'modal'
    ? <TaskDetailModal task={task} onClose={onClose} />
    : <TaskDetailDrawer task={task} onClose={onClose} />;
}
