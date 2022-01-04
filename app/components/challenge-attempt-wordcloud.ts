import Component from '@glimmer/component';
import { action } from '@ember/object';
import WordCloud from 'wordcloud';
import { tracked } from '@glimmer/tracking';
import ChallengeModel from 'spanish-texter/models/challenge';
import AttemptModel, { LanguageType } from 'spanish-texter/models/attempt';

interface Args {
  challenge: ChallengeModel;
  nativeLanguageAttempts?: boolean;
}

interface TooltipData {
  word: string;
  percentage: number;
  count: number;
}

type WordCloudOptions = WordCloud.Options & { rotationSteps?: number; shrinkToFit?: boolean };

export default class ChallengeAttemptWordcloudComponent extends Component<Args> {
  @tracked showTooltip = false;

  @tracked tooltipTop: number | undefined; // Used for css for position the tooltip
  @tracked tooltipLeft: number | undefined; // Used for css for position the tooltip
  @tracked tooltipData: TooltipData | undefined;

  get attempts(): AttemptModel[] {
    let attemptLanguage = this.args.nativeLanguageAttempts
      ? LanguageType.NativeLanguage
      : LanguageType.LearningLanguage;

    return this.args.challenge.attempts.filter((attempt) => attempt.attemptLanguage === attemptLanguage);
  }

  get queryText(): string {
    return this.args.nativeLanguageAttempts
      ? this.args.challenge.learningLanguageText
      : this.args.challenge.nativeLanguageText;
  }

  get attemptCountsByText(): Record<string, { count: number; percentage: number }> {
    let counts: Record<string, { count: number; percentage: number }> = {};

    this.attempts.forEach((attempt) => {
      let text = attempt.text.trim();

      if (counts[text]) {
        counts[text].count++;
      } else {
        counts[text] = {
          count: 1,
          percentage: 0,
        };
      }
    });

    // Compute percentages
    Object.values(counts).forEach((countInfo) => {
      let percentage = Math.round((100 * countInfo.count) / this.attempts.length);
      countInfo.percentage = percentage;
    });

    return counts;
  }

  get wordList(): WordCloud.ListEntry[] {
    let counts = this.attemptCountsByText;

    return Object.entries(counts).map(([text, { percentage }]) => {
      return [text, percentage];
    });
  }

  get tooltipStyle(): string {
    let { tooltipLeft, tooltipTop } = this;

    return `top: ${tooltipTop}px; left: ${tooltipLeft}px;`;
  }

  @action
  onInsertCanvas(element: HTMLDivElement): void {
    let options: WordCloudOptions = {
      list: this.wordList,
      rotateRatio: 0.5,
      rotationSteps: 2,
      drawOutOfBound: false,
      shrinkToFit: true,
      hover: (entry: WordCloud.ListEntry | undefined, wordDimensions: Record<'x' | 'y' | 'w' | 'h', number>) => {
        if (entry !== undefined) {
          let [word, percentage] = entry;
          if (this.tooltipData?.word !== word) {
            this.showTooltip = true;
            this.tooltipLeft = wordDimensions.x + wordDimensions.w;
            this.tooltipTop = wordDimensions.y + wordDimensions.h;

            let count = this.attemptCountsByText[word].count;
            this.tooltipData = { word, percentage, count };
          }
        } else {
          this.showTooltip = false;
          this.tooltipData = undefined;
        }
      },
    };

    WordCloud(element, options);
  }

  @action
  onMouseout(): void {
    this.showTooltip = false;
    this.tooltipData = undefined;
  }
}
