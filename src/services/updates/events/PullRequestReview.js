const Review = require('../types/Review');
const PullRequest = require('../types/PullRequest');
const Installation = require('../types/Installation');

const ACTIONS = {
  submitted: 'submitted',
  edited: 'edited',
  dismissed: 'dismissed'
};

const STATES = {
  commented: 'commented',
  approved: 'approved',
  changes_requested: 'changes_requested'
};

class PullRequestReviewEvent {
  static get EVENT() {
    return 'pull_request_review';
  }

  constructor(payload) {
    const {
      action,
      review,
      pull_request: pr,
      installation
    } = payload;

    this.action = action;
    this.review = new Review(review);
    this.pr = new PullRequest(pr);
    this.installation = new Installation(installation);
  }

  getMessage() {
    let notification = {
      title: `${this.pr.title} has been reviewed`,
      url: this.review.url
    };

    let message = '';

    switch (this.action) {
      case ACTIONS.submitted:

        switch (this.review.state) {
          case STATES.approved:
            message = '[user] approved review in pull request «[pr]»';
            break;
          case STATES.changes_requested:
            message = '[user] requested changes for review in pull request «[pr]»';
            break;
          case STATES.commented:
            message = '[user] commented review in pull request «[pr]»';
            break;
        }
        return {
          icon: this.review.user.avatar,
          user: {
            value: this.review.user.login,
            url: this.review.user.url
          },
          pr: {
            value: this.pr.title,
            url: this.review.url
          },
          message: message,
          ...notification
        };

      case ACTIONS.edited:
        return {
          icon: this.review.user.avatar,
          user: {
            value: this.review.user.login,
            url: this.review.user.url
          },
          pr: {
            value: this.pr.title,
            url: this.review.url
          },
          message: '[user] edited review in pull request «[pr]»',
          ...notification
        };

      case ACTIONS.dismissed:
        return {
          icon: this.review.user.avatar,
          user: {
            value: this.review.user.login,
            url: this.review.user.url
          },
          pr: {
            value: this.pr.title,
            url: this.review.url
          },
          message: '[user] dismissed review in pull request «[pr]»',
          ...notification
        };
    }
  }
}

module.exports = PullRequestReviewEvent;
module.exports.InstallationEvent = PullRequestReviewEvent;
