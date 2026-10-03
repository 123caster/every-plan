export function PluginTabHost() {
  return (
    <section className="detail-section plugin-tab-host">
      <div className="detail-tabs" role="tablist" aria-label="扩展信息">
        <button type="button" role="tab" aria-selected="true">插件</button>
        <button type="button" role="tab" aria-selected="false">活动</button>
      </div>
      <div className="plugin-empty">
        <span>⬡</span>
        <div><strong>这是插件的专属扩展区</strong><p>插件可以增加面板和操作，但不会改写标题、计划、截止等核心字段。</p></div>
      </div>
    </section>
  );
}
