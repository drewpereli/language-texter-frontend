import Component from '@glimmer/component';
import { action } from '@ember/object';
import WordCloud from 'wordcloud';
import { tracked } from '@glimmer/tracking';

export default class ChallengeAttemptWordcloudComponent extends Component {
  @tracked showTooltip = false;

  @tracked tooltipTop;
  @tracked tooltipLeft;
  @tracked tooltipData;

  get attempts() {
    return this.args.challenge.attempts.filterBy('attemptLanguage', this.args.attemptLanguage);
  }

  get queryText() {
    return this.args.attemptLanguage === 'spanish' ? this.args.challenge.englishText : this.args.challenge.spanishText;
  }

  get wordList() {
    let counts = {};

    this.attempts.forEach((attempt) => {
      let text = attempt.text.trim();

      if (counts[text]) {
        counts[text]++;
      } else {
        counts[text] = 1;
      }
    });

    return Object.entries(counts).map(([text, count]) => {
      // Get the percentage instead
      let percentage = Math.round((100 * count) / this.attempts.length);
      return [text, percentage, { count }];
    });
  }

  get tooltipStyle() {
    let { tooltipLeft, tooltipTop } = this;

    return `top: ${tooltipTop}px; left: ${tooltipLeft}px;`;
  }

  @action
  onInsertCanvas(element) {
    let component = this;

    WordCloud(element, {
      list: this.wordList,
      rotateRatio: 0.5,
      rotationSteps: 2,
      drawOutOfBound: false,
      shrinkToFit: true,
      hover([word, percentage, data] = [], wordDimensions) {
        if (word) {
          if (component.tooltipData?.word !== word) {
            component.showTooltip = true;
            component.tooltipLeft = wordDimensions.x + wordDimensions.w;
            component.tooltipTop = wordDimensions.y + wordDimensions.h;
            component.tooltipData = { word, percentage, count: data.count };
          }
        } else {
          component.showTooltip = false;
          component.tooltipData = null;
        }
      },
    });
  }

  @action
  onMouseout() {
    this.showTooltip = false;
    this.tooltipData = null;
  }
}
