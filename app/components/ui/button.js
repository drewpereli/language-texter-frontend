import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class UiButtonComponent extends Component {
  @action
  onClick() {
    if (this.args.task) {
      this.args.task.perform();
    } else if (this.args.onClick) {
      this.args.onClick();
    }
  }

  get colorClasses() {
    if (this.args.variant === 'primary') {
      return 'bg-blue-700 hover:bg-blue-600';
    } else if (this.args.variant === 'secondary') {
      return 'bg-gray-500 hover:bg-gray-400';
    } else {
      return '';
    }
  }

  get sizeClasses() {
    if (this.args.size === 'sm') {
      return 'px-2 py-1 text-xs';
    } else {
      return 'px-4 py-2 text-base';
    }
  }
}
