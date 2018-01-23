import { SocialBase } from "../basemodule";
import { Utils } from "../utils";
const templateHtml = require("../resources").delicious;
export class Delicious extends SocialBase {
  constructor(ident) {
    super(ident);
  }

  protected url() {
    return "http://feeds.delicious.com/v2/json/" + this.ident;
  }
  protected orderBy(item: any) {
    return -new Date(item.dt).getTime();
  }
  protected render(item: any) {
    item.time_since = _.timesince(item.dt);
    return Utils.template(templateHtml, item);
  }
}
