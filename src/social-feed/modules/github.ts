import { SocialBase } from "../basemodule";
import { Utils } from "../utils";
const resources = require("../resources");
const tmpl = {
  create: resources.github_create,
  createbranch: resources.github_createbranch,
  watch: resources.github_watch,
  push: resources.github_push,
  pullrequest: resources.github_pullrequest,
  fork: resources.github_fork,
  issue: resources.github_issue
};

const getRepoURL = function(item) {
    return "https://github.com/" + item.repo.name;
  },
  getUserURL = function(item) {
    return "https://github.com/" + item.actor.login;
  },
  templateHelper = function(template, item) {
    return _.template(tmpl[template], {
      profile_url: getUserURL(item),
      username: item.actor.login,
      repo_name: item.repo.name,
      repo_url: getRepoURL(item),
      time_since: _.timesince(item.created_at),
      created_at: item.created_at
    });
  };

export class Github extends SocialBase {
  protected show = {
    CreateEvent: true,
    WatchEvent: true,
    PushEvent: true,
    PullRequestEvent: true,
    ForkEvent: true,
    IssuesEvent: true
  };

  private renderMethods = {
    CreateEvent: function(item) {
      if (item.payload.ref === null) {
        return templateHelper("create", item);
      }

      return _.template(templateHelper("createbranch", item), {
        branch_url: getRepoURL(item) + "/tree/" + item.payload.ref,
        branch_name: item.payload.ref
      });
    },

    WatchEvent: function(item) {
      return templateHelper("watch", item);
    },

    PushEvent: function(item) {
      var $html = $(templateHelper("push", item));

      // Add commits:
      var $ul = $html.find(".socialfeed-commit-list"),
        $li = $ul.find("li:first");

      item.payload.commits.forEach(function(commit) {
        var $it = $li.clone();

        $it
          .find("a")
          .attr("href", getRepoURL(item) + "/commit/" + commit.sha)
          .text(commit.sha.substr(0, 7));
        $it.find("span").text(commit.message);
        $ul.prepend($it);
      });
      $li.remove();
      return $html;
    },

    PullRequestEvent: function(item) {
      return _.template(templateHelper("pullrequest", item), {
        action: item.payload.action,
        title: item.payload.pull_request.title,
        pullrequest_url: item.payload.pull_request.html_url,
        pullrequest_name: item.repo.name + "#" + item.payload.number
      });
    },

    ForkEvent: function(item) {
      return _.template(templateHelper("fork", item), {
        forkee_url: item.payload.forkee.html_url,
        forkee_name: item.payload.forkee.full_name
      });
    },

    IssuesEvent: function(item) {
      return _.template(templateHelper("issue", item), {
        action: item.payload.action,
        title: item.payload.issue.title,
        issue_url: item.payload.issue.html_url,
        issue_name: item.repo.name + "#" + item.payload.number
      });
    }
  };

  constructor(ident, showEntities) {
    super(ident);
    this.show = { ...this.show, ...showEntities };
  }

  protected url() {
    return "https://api.github.com/users/" + this.ident + "/events";
  }
  protected orderBy(item: any) {
    return -new Date(item.created_at).getTime();
  }
  protected render(item: any) {
    if (item.type && this.renderMethods[item.type] && !!this.show[item.type]) {
      return this.renderMethods[item.type].apply(this, [item]);
    }

    return null;
  }
  // override!
  protected parse(resp) {
    return resp.data;
  }
}
