import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class UiCollapsibleComponent extends Component {
  @tracked isCollapsed = this.args.startCollapsed;

  @action
  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
