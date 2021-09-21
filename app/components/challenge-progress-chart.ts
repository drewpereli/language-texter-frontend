import Component from '@glimmer/component';
import moment from 'moment';
import AttemptModel from 'spanish-texter/models/attempt';
import ChallengeModel from 'spanish-texter/models/challenge';

interface Args {
  challenge: ChallengeModel;
}

interface AttemptWithStreakCount {
  attempt: AttemptModel;
  idx: number;
  streakCount: number;
}

type CustomScatterData = Plotly.ScatterData | { customdata: Record<string, unknown>[] };

export default class ChallengeProgressChartComponent extends Component<Args> {
  get sortedAttempts(): AttemptModel[] {
    return this.args.challenge.attempts.sortBy('createdAt');
  }

  get attemptsWithStreakCount(): AttemptWithStreakCount[] {
    let attemptsWithStreakCount: AttemptWithStreakCount[] = [];

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

  get traces(): CustomScatterData[] {
    let trace: CustomScatterData = {
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

  get layout(): Partial<Plotly.Layout> {
    let textColor = '#888';
    let bgColor = '#222';

    return {
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
      margin: {
        l: 80,
        r: 50,
        b: 80,
        t: 50,
        pad: 0,
      },
    };
  }
}
