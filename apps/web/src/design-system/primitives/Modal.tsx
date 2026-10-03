import type { ComponentProps } from 'react';
import { DialogSurface } from './DialogSurface';

type ModalProps = Omit<ComponentProps<typeof DialogSurface>, 'kind'>;

export function Modal(props: ModalProps) {
  return <DialogSurface {...props} kind="modal" />;
}

