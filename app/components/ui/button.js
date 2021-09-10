import Component from '@glimmer/component';
import { action } from '@ember/object';

/**
 * @param {string} [label]
 * @param {string} [variant] -- "primary", "secondary", "success", "danger"
 * @param {function} [onClick] -- on-click action
 * @param {function} [task] -- on-click ember-concurrency task. Overrides "onClick" arg
 * @param {string} [icon] -- a font-awesome icon
 * @param {string} [size] -- "sm" or null
 */
export default class UiButtonComponent extends Component {
  @action
  onClick() {
    if (this.args.task) {
      if (this.args.task.isRunning) {
        return;
      }

      this.args.task.perform();
    } else if (this.args.onClick) {
      this.args.onClick();
    }
  }

  get colorClasses() {
    let bgClass, hoverBgClass;
    if (this.args.variant === 'primary') {
      bgClass = 'bg-blue-700';
      hoverBgClass = 'hover:bg-blue-600';
    } else if (this.args.variant === 'secondary') {
      bgClass = 'bg-gray-500';
      hoverBgClass = 'hover:bg-gray-400';
    } else if (this.args.variant === 'success') {
      bgClass = 'bg-green-500';
      hoverBgClass = 'hover:bg-green-400';
    } else if (this.args.variant === 'danger') {
      bgClass = 'bg-red-700';
      hoverBgClass = 'hover:bg-red-600';
    } else {
      return '';
    }

    let classes = [bgClass];

    if (!this.args.task?.isRunning) {
      classes.push(hoverBgClass);
    }

    return classes.join(' ');
  }

  get sizeClasses() {
    if (this.args.size === 'sm') {
      return 'px-2 py-1 text-xs';
    } else {
      return 'px-4 py-2 text-base';
    }
  }
}
