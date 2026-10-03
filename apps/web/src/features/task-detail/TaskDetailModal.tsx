import { Modal } from '../../design-system/primitives/Modal';
import type { Task } from '../../domain/task/taskTypes';
import { TaskDetail } from './TaskDetail';

export function TaskDetailModal({ task, onClose }: { task: Task; onClose: () => void }) {
  return <Modal open title="任务详情" onClose={onClose}><TaskDetail key={task.id} task={task} onDeleted={onClose} /></Modal>;
}
