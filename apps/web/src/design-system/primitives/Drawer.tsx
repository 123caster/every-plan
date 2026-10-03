import type { ComponentProps } from 'react';
import { DialogSurface } from './DialogSurface';

type DrawerProps = Omit<ComponentProps<typeof DialogSurface>, 'kind'>;

export function Drawer(props: DrawerProps) {
  return <DialogSurface {...props} kind="drawer" />;
}

