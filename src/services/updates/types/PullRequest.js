const User = require('./User');
const Repository = require('./Repository');

class PRBranch {
  constructor (payload) {
    const {label, ref, user, repo} = payload;

    this.label = label;
    this.ref = ref;
    this.user = new User(user);
    this.repo = new Repository(repo);
  }
}

class PullRequest {
  constructor (payload) {
    const {
      html_url: url,
      state,
      title,
      body,
      user,
      assignees,
      requested_reviewers: reviewers,
      repo,
      head,
      base,
      merged,
      merged_by: mergedBy
    } = payload;

    this.url = url;
    this.state = state;
    this.title = title;
    this.body = body;
    this.user = new User(user);
    this.assignees = assignees.map(data => new User(data));
    this.reviewers = reviewers.map(data => new User(data));
    this.repo = repo ? new Repository(repo) : null;
    this.head = new PRBranch(head);
    this.base = new PRBranch(base);
    this.merged = merged;
    this.mergedBy = mergedBy ? new User(mergedBy) : null;
  }
}

module.exports = PullRequest;
module.exports.PullRequest = PullRequest;
module.exports.PRBranch = PRBranch;
