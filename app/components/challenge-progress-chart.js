import Component from '@glimmer/component';
import moment from 'moment';

export default class ChallengeProgressChartComponent extends Component {
  get sortedAttempts() {
    return this.args.challenge.attempts.sortBy('createdAt');
  }

  get attemptsWithStreakCount() {
    let attemptsWithStreakCount = [];

    let currentStreakCount = 0;

    this.sortedAttempts.forEach((attempt, idx) => {
      if (attempt.isCorrect) {
        currentStreakCount++;
      } else {
        currentStreakCount = 0;
      }

      attemptsWithStreakCount.push({
        attempt,
        idx,
        streakCount: currentStreakCount,
      });
    });

    return attemptsWithStreakCount;
  }

  get traces() {
    let trace = {
      x: this.attemptsWithStreakCount.mapBy('attempt.createdAt'),
      y: this.attemptsWithStreakCount.mapBy('streakCount'),
      type: 'scatter',
      marker: {
        color: this.attemptsWithStreakCount.map(({ attempt }) => {
          return attempt.isCorrect ? '#4deb5d' : '#eb4d4d';
        }),
        size: 8,
        symbol: 'square',
      },
      customdata: this.attemptsWithStreakCount.map(({ attempt, streakCount }) => {
        let { text: attemptText, createdAt, attemptLanguage } = attempt;

        let attemptCreatedAt = moment(createdAt).format('MMM Do, YYYY, h:mm A');

        return { attemptText, attemptCreatedAt, streakCount, attemptLanguage };
      }),
      hovertemplate: `
				<b>Guess (%{customdata.attemptLanguage}):</b> "%{customdata.attemptText}"<br>
				<b>Streak count:</b> %{customdata.streakCount}<br>
				Guessed on %{customdata.attemptCreatedAt}
				<extra></extra>
			`,
      hoverlabel: {
        align: 'left',
      },
      line: {
        shape: 'hv',
      },
    };

    return [trace];
  }

  get layout() {
    let textColor = '#888';
    let bgColor = '#222';

    return {
      title: { text: `"${this.args.challenge.spanishText}" progress`, font: { color: textColor } },
      xaxis: {
        title: 'Attempt Date',
        color: textColor,
        tickformat: '%x',
        dtick: 86400000.0,
      },
      yaxis: {
        title: 'Streak',
        color: textColor,
      },
      paper_bgcolor: bgColor,
      plot_bgcolor: bgColor,
    };
  }
}
