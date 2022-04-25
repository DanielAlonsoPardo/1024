import React from 'react';
import { Tracker } from 'meteor/tracker';

import { Leaderboard, Subscribe as SubscribeToLeaderboard } from '/imports/api/Leaderboard/Leaderboard.js';

export class LeaderboardTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scores: [],
    }
    SubscribeToLeaderboard();
  }

  componentDidMount() {
    Tracker.autorun(() => {
      let scores = Leaderboard.find({}, {
        limit: 100,
        sort: { score: -1 }
      }).fetch();
      this.setState({ scores });
    });
  }

  static renderEntry = (e, key) => {
    return (
      <tr key={ key }>
        <td>{ e.username }</td>
        <td>{ e.score }</td>
        <td>{ e.date.toDateString() }</td>
      </tr>
    );
  }

  render() {
    let i = 0;
    let renderAllEntries = _ => this.state.scores.map(LeaderboardTable.renderEntry, i++);
    return (
      <div style={{ background: "white", height: "300px" }}>
        <table>
          <thead>
            <tr>
              <th>Username</th><th>Score</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            { renderAllEntries() }
          </tbody>
        </table>

      </div>
    );
  }
}