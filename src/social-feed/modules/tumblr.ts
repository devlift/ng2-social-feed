import { SocialBase } from "../basemodule";
import { Utils } from "../utils";
const templateHtml = require("../resources").tumblr;
export class Tumblr extends SocialBase {
  protected apiKey: string;

  constructor(ident, apiKey) {
    super(ident);
    this.apiKey = apiKey;
  }

  protected url() {
    return (
      "http://api.tumblr.com/v2/blog/" +
      this.blogUrl +
      "/posts/text?api_key=" +
      this.apiKey
    );
  }
  protected orderBy(item: any) {
    return -new Date(item.date).getTime();
  }
  protected render(item: any) {
    item.time_since = _.timesince(item.date);
    return _.template(templateHtml, item);
  }
  // override!
  protected parse(resp) {
    if (!resp.meta || resp.meta.status !== 200) {
      return [];
    }
    return resp.response.posts || [];
  }
}
