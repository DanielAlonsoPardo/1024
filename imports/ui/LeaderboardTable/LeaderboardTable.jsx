import React from 'react';
import { Tracker } from 'meteor/tracker';

import Leaderboard from '/imports/api/Leaderboard/Leaderboard.js';
import { CompactTable } from '@table-library/react-table-library/compact';

export class LeaderboardTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scores: [],
    }
    Leaderboard.Subscribe();
  }

  componentDidMount() {
    Tracker.autorun(() => {
      let scores = Leaderboard.Collection.find({}, {
        limit: 100,
        sort: { score: -1 },
        fields: {
          username: 1,
          date: 1,
          score: 1,
        }
      }).fetch();
      scores.forEach(x => { x.id = x._id })
      this.setState({ scores });
    });
  }

  render() {
    const columns = [
      { label: 'User', renderCell: (item) => item.username },
      { label: 'Date',
        renderCell: (item) =>
          item.date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit' })},
      { label: 'Score', renderCell: (item) => item.score },
    ];

    const data = { nodes: this.state.scores };
    return <CompactTable columns={columns} data={data} />;
  }
}