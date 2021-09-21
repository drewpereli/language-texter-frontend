import Component from '@glimmer/component';
import { action } from '@ember/object';

interface Args {
  onClick?: () => unknown;
}

export default class UtilsYieldableDivComponent extends Component<Args> {
  @action
  onClick(): void {
    this.args.onClick?.();
  }
}
