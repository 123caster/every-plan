import { registerSW } from 'virtual:pwa-register';

interface RegisterPwaOptions {
  onOfflineReady: () => void;
  onNeedRefresh: (update: (reloadPage?: boolean) => Promise<void>) => void;
}

export function registerEveryPlanServiceWorker({ onOfflineReady, onNeedRefresh }: RegisterPwaOptions) {
  let updateServiceWorker: (reloadPage?: boolean) => Promise<void> = async () => {};
  updateServiceWorker = registerSW({
    immediate: true,
    onOfflineReady,
    onNeedRefresh: () => onNeedRefresh(updateServiceWorker),
    onRegisterError: (error) => {
      console.error('Every Plan service worker registration failed', error);
    },
  });
  return updateServiceWorker;
}

