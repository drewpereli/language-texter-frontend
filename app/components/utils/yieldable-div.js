import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class UtilsYieldableDivComponent extends Component {
  @action
  onClick() {
    this.args.onClick?.();
  }
}
