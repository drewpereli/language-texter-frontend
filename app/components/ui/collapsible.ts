import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface Args {
  startCollapsed?: boolean;
}

export default class UiCollapsibleComponent extends Component<Args> {
  @tracked isCollapsed = !!this.args.startCollapsed;

  @action
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
