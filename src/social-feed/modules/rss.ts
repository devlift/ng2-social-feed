import { SocialBase } from "../basemodule";
import { Utils } from "../utils";
const templateHtml = require("../resources").rss;
export class Rss extends SocialBase {
  protected count: number;
  private blogname: string;
  private blogurl: string;

  constructor(ident, count) {
    super(ident);
    this.count = count;
  }

  protected url() {
    // Use Google API feed service.
    return (
      "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" +
      this.count +
      "&q=" +
      encodeURIComponent(this.ident)
    );
  }
  protected orderBy(item: any) {
    return -new Date(item.publishedDate).getTime();
  }
  protected render(item: any) {
    return _.template(templateHtml, {
      blog_name: this.blogname,
      blog_url: this.blogurl,
      url: item.link,
      title: item.title,
      date: item.publishedDate,
      time_since: _.timesince(item.publishedDate)
    });
  }
  // override!
  protected parse(resp) {
    const feed = resp.responseData.feed;
    if (!feed) {
      return [];
    }
    this.blogname = feed.title;
    this.blogurl = feed.link;
    return feed.entries || [];
  }
}
