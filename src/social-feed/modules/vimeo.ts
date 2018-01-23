import { SocialBase } from "../basemodule";
import { Utils } from "../utils";

const resources = require("../resources"),
  _ = require("../utils"),
  tmpl = {
    like: resources.vimeo_like,
    add_comment: resources.vimeo_add_comment,
    upload: resources.vimeo_upload
  },
  defaultVisibility = {
    like: true,
    add_comment: true,
    upload: true
  },
  templateHelper = function(template, item) {
    return _.template(tmpl[template], {
      user_url: item.user_url,
      user_name: item.user_name,
      user_portrait: item.user_portrait_small,
      video_title: item.video_title,
      video_url: item.video_url,
      video_thumbnail_large: item.video_thumbnail_large,
      time_since: _.timesince(item.date),
      created_at: item.date
    });
  };
const templateHtml = require("../resources").tumblr;
export class Tumblr extends SocialBase {
  protected apiKey: string;
  protected show = {
    like: true,
    add_comment: true,
    upload: true
  };

  private renderMethods = {
    like: function(item) {
      return templateHelper("like", item);
    },

    add_comment: function(item) {
      return _.template(templateHelper("add_comment", item), {
        comment_text: item.comment_text
      });
    },

    upload: function(item) {
      return templateHelper("upload", item);
    }
  };

  constructor(ident, showEntities) {
    super(ident);
    this.show = { ...this.show, ...showEntities };
  }

  protected url() {
    return "http://vimeo.com/api/v2/activity/" + this.ident + "/user_did.json";
  }
  protected orderBy(item: any) {
    return -new Date(item.date).getTime();
  }
  protected render(item: any) {
    if (item.type && this.renderMethods[item.type] && !!this.show[item.type]) {
      return this.renderMethods[item.type].apply(this, [item]);
    }

    return null;
  }
}
