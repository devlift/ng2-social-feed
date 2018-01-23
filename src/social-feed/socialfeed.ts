import { API } from "./api";
import { Controller } from "./controller";
import { Utils } from "./utils";

export class SocialFeed implements API {
  private c: Controller;
  constructor(options) {
    if (!options.el) {
      options = {
        el: options
      };
    }
    this.c = new Controller(options);
  }

  start() {
    throw new Error("Method not implemented.");
  }
  reload() {
    throw new Error("Method not implemented.");
  }
  addModule(module: any) {
    throw new Error("Method not implemented.");
  }
  nextBulk() {
    throw new Error("Method not implemented.");
  }
  loadNumEntries(num: any) {
    throw new Error("Method not implemented.");
  }
  on(eventType: any, cb: any) {
    throw new Error("Method not implemented.");
  }

}

// // Make modules available:
// SocialFeed.Modules = {
//   Disqus: require("./modules/disqus"),
//   Github: require("./modules/github"),
//   YouTubeUploads: require("./modules/youtubeuploads"),
//   Delicious: require("./modules/delicious"),
//   RSS: require("./modules/rss"),
//   Vimeo: require("./modules/vimeo"),
//   Tumblr: require("./modules/tumblr"),
//   SocialBase: SocialBase,
//   extend: function(module) {
//     return SocialBase.extend(module);
//   }
// };

// module.exports = SocialFeed;
