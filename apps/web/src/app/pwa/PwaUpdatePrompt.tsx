import { useEffect, useState } from 'react';
import { Button } from '../../design-system/primitives/Button';
import { registerEveryPlanServiceWorker } from './registerServiceWorker';

export function PwaUpdatePrompt() {
  const [offlineReady, setOfflineReady] = useState(false);
  const [update, setUpdate] = useState<null | (() => Promise<void>)>(null);

  useEffect(() => {
    return void registerEveryPlanServiceWorker({
      onOfflineReady: () => setOfflineReady(true),
      onNeedRefresh: (updateServiceWorker) => setUpdate(() => () => updateServiceWorker(true)),
    });
  }, []);

  if (!offlineReady && !update) return null;

  return (
    <aside className="pwa-prompt" role="status">
      <div>
        <strong>{update ? '新版本已准备好' : '离线外壳已就绪'}</strong>
        <span>{update ? '由你决定何时刷新，不会打断正在编辑的任务。' : '再次打开时可离线访问本地任务。'}</span>
      </div>
      {update ? <Button variant="primary" onClick={() => void update()}>安全刷新</Button> : null}
      <Button variant="ghost" aria-label="关闭 PWA 提示" onClick={() => { setOfflineReady(false); setUpdate(null); }}>稍后</Button>
    </aside>
  );
}

