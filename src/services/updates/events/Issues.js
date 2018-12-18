const Issue = require('../types/Issue');
const User = require('../types/User');
const Label = require('../types/Label');
const Installation = require('../types/Installation');

const ACTIONS = {
  opened: 'opened',
  reopened: 'reopened',
  edited: 'edited',
  deleted: 'deleted',
  transferred: 'transferred',
  closed: 'closed',
  assigned: 'assigned',
  unassigned: 'unassigned',
  labeled: 'labeled',
  unlabeled: 'unlabeled'
};

class IssuesEvent {
  static get EVENT() {
    return 'issues';
  }

  constructor(payload) {
    const {
      action,
      issue,
      assignee,
      installation,
      sender,
      label
    } = payload;

    this.action = action;
    this.sender = new User(sender);
    this.assignee = assignee ? new User(assignee) : null;
    this.issue = new Issue(issue);
    this.label = label ? new Label(label) : null;
    this.installation = new Installation(installation);
  }

  getMessage () {
    let notification = {
      title: this.issue.title,
      url: this.issue.url,
      event: IssuesEvent.EVENT,
      type: this.action
    };

    switch (this.action) {
      case ACTIONS.opened:
        return {
          icon: this.issue.user.avatar,
          user: {
            value: this.issue.user.login,
            url: this.issue.user.url
          },
          issue: {
            value: this.issue.title,
            url: this.issue.url
          },
          message: '[user] opened the issue «[issue]»',
          ...notification
        };

      case ACTIONS.reopened:
        return {
          icon: this.issue.user.avatar,
          user: {
            value: this.issue.user.login,
            url: this.issue.user.url
          },
          issue: {
            value: this.issue.title,
            url: this.issue.url
          },
          message: '[user] reopened the issue «[issue]»',
          ...notification
        };

      case ACTIONS.edited:
        return {
          icon: this.issue.user.avatar,
          user: {
            value: this.issue.user.login,
            url: this.issue.user.url
          },
          issue: {
            value: this.issue.title,
            url: this.issue.url
          },
          message: '[user] edited the issue «[issue]»',
          ...notification
        };

      case ACTIONS.deleted:
        return {
          icon: this.issue.user.avatar,
          user: {
            value: this.issue.user.login,
            url: this.issue.user.url
          },
          issue: {
            value: this.issue.title,
            url: this.issue.url
          },
          message: '[user] deleted the issue «[issue]»',
          ...notification
        };

      case ACTIONS.transferred:
        return {
          icon: this.issue.user.avatar,
          user: {
            value: this.issue.user.login,
            url: this.issue.user.url
          },
          issue: {
            value: this.issue.title,
            url: this.issue.url
          },
          message: '[user] transferred the issue «[issue]»',
          ...notification
        };

      case ACTIONS.closed:
        return {
          icon: this.issue.user.avatar,
          user: {
            value: this.issue.user.login,
            url: this.issue.user.url
          },
          issue: {
            value: this.issue.title,
            url: this.issue.url
          },
          message: '[user] closed the issue «[issue]»',
          ...notification
        };

      case ACTIONS.assigned:
        return {
          icon: this.issue.user.avatar,
          sender: {
            value: this.sender.login,
            url: this.sender.url
          },
          issue: {
            value: this.issue.title,
            url: this.issue.url
          },
          assignee: {
            value: this.assignee.login,
            url: this.assignee.url
          },
          message: '[assignee] has been assigned to the issue «[issue]» by [sender]',
          ...notification
        };

      case ACTIONS.unassigned:
        return {
          icon: this.issue.user.avatar,
          sender: {
            value: this.sender.login,
            url: this.sender.url
          },
          issue: {
            value: this.issue.title,
            url: this.issue.url
          },
          assignee: {
            value: this.assignee.login,
            url: this.assignee.url
          },
          message: '[assignee] has been unassigned the issue «[issue]» by [sender]',
          ...notification
        };

      case ACTIONS.labeled:
        return {
          icon: this.issue.user.avatar,
          user: {
            value: this.issue.user.login,
            url: this.issue.user.url
          },
          issue: {
            value: this.issue.title,
            url: this.issue.url
          },
          label: {
            value: this.label.name,
            url: this.label.url,
            background: `#${this.label.color}`,
          },
          message: '[user] added [label] the «[issue]» issue',
          ...notification
        };

      case ACTIONS.unlabeled:
        return {
          icon: this.issue.user.avatar,
          user: {
            value: this.issue.user.login,
            url: this.issue.user.url
          },
          issue: {
            value: this.issue.title,
            url: this.issue.url
          },
          label: {
            value: this.label.name,
            url: this.label.url,
            background: `#${this.label.color}`,
          },
          message: '[user] removed [label] from the  «[issue]» issue',
          ...notification
        };
    }
  }

}

module.exports = IssuesEvent;
module.exports.PullRequestEvent = IssuesEvent;
