import { EventEmitter } from "events";
import { Utils } from "./utils";
import { Jsonp } from "@angular/http";
import { ServiceLocator } from "./locator.service";

export abstract class SocialBase extends EventEmitter {
  private collection = [];
  protected data: any = null;
  protected ident: any;
  private jsonp: Jsonp;
  private ajaxSettings: any = {
    dataType: "jsonp",
    type: "GET"
  };
  constructor(ident) {
    super();
    this.ident = ident;
    this.jsonp = ServiceLocator.injector.get(Jsonp);
  }

  protected abstract url();

  protected fetch(options) {
    options = options ? _.clone(options) : {};

    const url = this.url(),
      success = options.success,
      error = options.error;

    options.url = url;

    if (!url && this.data) {
      success(_.result(this, "data"));
      return void 0;
    }
    return this.jsonp.request({ ...this.ajaxSettings, ...options }).subscribe(
      resp => {
        const parsed = this.parse(resp);

        this.collection = parsed;
        if (success) {
          success(this, parsed, options);
        }
        this.emit("fetched", this, parsed, options);
      },
      err => {
        if (error) {
          error(this, error);
        }
        this.emit("error", this, error);
      }
    );
  }

  protected parse(resp) {
    return resp;
  }

  protected abstract orderBy(item);

  protected abstract render(item);
}
