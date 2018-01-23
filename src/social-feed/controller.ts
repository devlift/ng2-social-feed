import { EventEmitter } from "events";
import { Utils } from "./utils";
import { API } from "./api";

export class Controller extends EventEmitter implements API {
  private modules = [];
  private feedRendered = null;
  private count: number;
  private _offset: number;
  private _sync_count = 0;

  constructor(options) {
    super();
    this.count = options.count || 1000;
    this._offset = options.offset || 0;
  }

  public on(eventType: any, cb: any) {
    this.emit(eventType, cb);
    return this;
  }

  public addModule(module) {
    this.modules.push(module);
    module.on("fetched", _.bind(this.moduleFetched, this));
    module.on("error", (...args) => {
      if (this.listeners("error").length > 0) {
        this.emit.apply(this, ["error"].concat(args));
      }
      this.moduleFetched(null, null, null);
    });
  }

  public start() {
    this.emit("preFetch");
    this.modules.forEach(function(module) {
      module.fetch();
    });
  }

  public moduleFetched(module, b, c) {
    this.emit("moduleAdded", module);
    if (++this._sync_count === this.modules.length) {
      // all done
      this.emit("postFetch", this.modules);
      this._sync_count = 0;
    }
  }

  public reload() {
    // this.$el.empty();// TODO;
    this._offset = 0;
    this.feedRendered = null;
    this.start();
  }

  public nextBulk() {
    return this.loadNumEntries(this.count);
  }

  public loadNumEntries(num) {
    if (this._offset >= this.feedRendered.length) {
      return this;
    }
    const tmp = this.count;
    this.count = num;
    this.render();
    this.count = tmp;
    return this;
  }

  public render() {
    // const $el = this.$el;
    const $el = { append: dummy => {} };
    if (this.feedRendered === null) {
      this.feedRendered = this._generateOrderedList();
      this.emit("dataReady", this.feedRendered, this.modules);
    }

    const list = this.feedRendered.slice(
      this._offset,
      this._offset + this.count
    );
    list.forEach(item => {
      $el.append(item.html);
    });
    this._offset += this.count;

    this.emit("rendered", list);
    return this;
  }

  public _generateOrderedList() {
    let list = [];
    this.modules.forEach(module => {
      if (!module || !module.collection) {
        return;
      }
      let collectionlist = module.collection.map(item => {
        const html = module.render(item);
        if (!html) {
          return null;
        }

        return {
          orderBy: module.orderBy(item),
          html: html
        };
      });
      collectionlist = collectionlist.filter(item => {
        return item !== null;
      });
      list = list.concat(collectionlist);
    });

    return this._orderList(list);
  }

  public _orderList(list) {
    return list.sort((x, y) => {
      const a = x.orderBy;
      const b = y.orderBy;
      if (a > b || a === void 0) {
        return 1;
      }
      if (a <= b || b === void 0) {
        return -1;
      }
    });
  }
}
