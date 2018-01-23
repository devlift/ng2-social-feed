import { SocialBase } from "../basemodule";
import { Utils } from "../utils";
const templateHtml = require("../resources").disqus;
export class Disqus extends SocialBase {
  protected apikey: string;

  constructor(ident, apikey) {
    super(ident);
    this.apikey = apikey;
  }

  protected url() {
    return (
      "https://disqus.com/api/3.0/users/listPosts.json?api_key=" +
      this.apikey +
      "&user:username=" +
      this.ident
    );
  }
  protected orderBy(item: any) {
    return -new Date(item.createdAt).getTime();
  }
  protected render(item: any) {
    return _.template(templateHtml, {
      profile_url: item.author.profileUrl,
      author_name: item.author.name,
      created_at: item.createdAt,
      time_since: _.timesince(item.createdAt),
      message: item.message
    });
  }
  // override!
  protected parse(resp) {
    return resp.response;
  }
}
