import { SocialBase } from "../basemodule";
import { Utils } from "../utils";
const templateHtml = require("../resources").youtubeuploads;
export class YoutubeUploads extends SocialBase {
  protected maxCount: number;

  constructor(ident, maxCount) {
    super(ident);
    this.maxCount = maxCount;
  }

  protected url() {
    return (
      "http://gdata.youtube.com/feeds/users/" +
      this.ident +
      "/uploads?alt=json-in-script&format=5&max-results=" +
      this.maxCount
    );
  }
  protected orderBy(item: any) {
    return -new Date(item.updated.$t).getTime();
  }
  private hideAndMakeYoutubeClickable(item, html) {
    const $html = $(html),
      $iframe = $html.find("iframe"),
      thumbnail = item["media$group"]["media$thumbnail"][0].url;

    const $img = $("<img />", {
      src: thumbnail,
      class: "youtube-preview"
    })
      .insertAfter($iframe)
      .on("click", function() {
        $iframe.insertAfter($img);
        $img.remove();
      });
    $iframe.remove();

    return $html;
  }

  protected render(item: any) {
    const html = _.template(templateHtml, {
      profile_url: item.author[0].uri.$t,
      username: item.author[0].name.$t,
      video_url: item.link[0].href,
      video_name: item.title.$t,
      created_at: item.updated.$t,
      time_since: _.timesince(item.updated.$t),
      entry_id: item.id.$t.substring(38),
      desc: item["media$group"]["media$description"].$t
    });

    return this.hideAndMakeYoutubeClickable(item, html);
  }
  // override!
  protected parse(resp) {
    const feed = resp.feed;
    return feed.entry || [];
  }
}
