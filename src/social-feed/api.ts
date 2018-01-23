export interface API {
  start();
  reload();
  addModule(module);
  nextBulk();
  loadNumEntries(num);
  on(eventType, cb);
}
