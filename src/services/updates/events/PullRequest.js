const User = require('../types/User');
const Repository = require('../types/Repository');
const PullRequest = require('../types/PullRequest');
const Label = require('../types/Label');
const Installation = require('../types/Installation');

const ACTIONS = {
  assigned: 'assigned',
  unassigned: 'unassigned',
  reviewRequested: 'review_requested',
  reviewRequestRemoved: 'review_request_removed',
  labeled: 'labeled',
  unlabeled: 'unlabeled',
  opened: 'opened',
  edited: 'edited',
  closed: 'closed',
  reopened: 'reopened',
  synchronize: 'synchronize'
};

class PullRequestEvent {
  static get EVENT () {
    return 'pull_request';
  }

  constructor (payload) {
    const {
      action,
      sender,
      repository,
      pull_request: pr,
      assignee,
      label,
      requested_reviewer: reviewer,
      changes,
      installation
    } = payload;

    this.action = action;
    this.sender = new User(sender);
    this.repo = new Repository(repository);
    this.pr = new PullRequest(pr);
    this.assignee = assignee ? new User(assignee) : null;
    this.label = label ? new Label(label) : null;
    this.reviewer = reviewer ? new User(reviewer) : null;
    this.changes = changes;
    this.installation = new Installation(installation);
  }

  getMessage () {
    let notification = {
      title: this.pr.title,
      url: this.pr.url,
      icon: this.sender.avatar,
      event: PullRequestEvent.EVENT,
      type: this.action,
      user: {
        value: this.sender.login,
        url: this.sender.url,
      },
      pr: {
        value: this.pr.title,
        url: this.pr.url
      }
    };

    switch (this.action) {
      case ACTIONS.opened:
        return {
          ...notification,
          head: {
            value: this.pr.head.ref,
            mono: true
          },
          base: {
            value: this.pr.base.ref,
            mono: true
          },
          message: '[user] opened pull request «[pr]» from [head] to [base]'
        };

      case ACTIONS.reopened:
        return {
          ...notification,
          head: {
            value: this.pr.head.ref,
            mono: true
          },
          base: {
            value: this.pr.base.red,
            mono: true
          },
          message: '[user] reopened pull request «[pr]» from [head] to [base]'
        };

      case ACTIONS.edited:
        notification = {
          ...notification
        };

        if (this.changes.title) {
          notification.pr = {
            value: this.changes.title.from,
            url: this.pr.url
          };
          notification.changes = {
            value: this.pr.title
          };
          notification.message = '[user] renamed pull request «[pr]» to «[changes]»';
        } else if (this.changes.body) {
          notification.pr = {
            value: this.pr.title,
            url: this.pr.url
          };
          notification.body = {
            value: this.pr.body
          };
          notification.message = '[user] changed pull request «[pr]» body to «[body]»';
        } else {
          notification.pr = {
            value: this.pr.title,
            url: this.pr.url
          };
          notification.message = '[user] edited the «[pr]» pull request';
        }
        return notification;

      case ACTIONS.closed:
        notification = {
          ...notification
        };

        if (!this.pr.merged) {
          notification.message = '[user] closed pull request «[pr]»';
        } else {
          notification.icon = this.pr.mergedBy.avatar;
          notification.user = {
            value: this.pr.mergedBy.login,
            url: this.pr.mergedBy.url
          };
          notification .head = {
            value: this.pr.head.ref,
            mono: true
          };
          notification.base = {
            value: this.pr.base.ref,
            mono: true
          };

          notification.message = '[user] merged pull request «[pr]» from [head] to [base]';
        }

        return notification;

      case ACTIONS.assigned:
        return {
          ...notification,
          icon: this.assignee.avatar,
          assignee: {
            value: this.assignee.login,
            url: this.assignee.url
          },
          sender: {
            value: this.sender.login,
            url: this.sender.url
          },
          message: '[assignee] has been assigned to the «[pr]» pull request by [sender]'
        };

      case ACTIONS.unassigned:
        return {
          ...notification,
          icon: this.assignee.avatar,
          assignee: {
            value: this.assignee.login,
            url: this.assignee.url
          },
          sender: {
            value: this.sender.login,
            url: this.sender.url
          },
          message: '[assignee] has been unassigned from the «[pr]» pull request by [sender]'
        };

      case ACTIONS.labeled:
        return {
          ...notification,
          label: {
            value: this.label.name,
            url: this.label.url,
            background: `#${this.label.color}`,
          },
          message: '[user] added [label] label to the «[pr]» pull request'
        };

      case ACTIONS.unlabeled:
        return {
          ...notification,
          label: {
            value: this.label.name,
            url: this.label.url,
            background: `#${this.label.color}`,
          },
          message: '[user] removed [label] label from the «[pr]» pull request'
        };

      case ACTIONS.reviewRequested:
        return {
          ...notification,
          icon: this.reviewer.avatar,
          reviewer: {
            value: this.reviewer.login,
            url: this.reviewer.url
          },
          message: '[user] requested [reviewer]`s review for the «[pr]» pull request',
        };

      case ACTIONS.reviewRequestRemoved:
        return {
          ...notification,
          reviewer: {
            value: this.reviewer.login,
            url: this.reviewer.url
          },
          message: '[user] removed request for [reviewer]`s review from the «[pr]» pull request'
        };

      case ACTIONS.synchronize:
        throw new Error('Unsupported action');

      default:
        return {
          pr: {
            value: this.pr.title,
            url: this.pr.url
          },
          message: 'Update in «[pr]» pull request',
          ...notification
        };
    }
  }
}

module.exports = PullRequestEvent;
module.exports.PullRequestEvent = PullRequestEvent;
