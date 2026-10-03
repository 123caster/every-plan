import { Drawer } from '../../design-system/primitives/Drawer';
import type { Task } from '../../domain/task/taskTypes';
import { TaskDetail } from './TaskDetail';

export function TaskDetailDrawer({ task, onClose }: { task: Task; onClose: () => void }) {
  return <Drawer open title="任务详情" onClose={onClose}><TaskDetail key={task.id} task={task} onDeleted={onClose} /></Drawer>;
}
