import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';

export default class UiInputComponent extends Component {
  inputId = `${guidFor(this)}-input`;

  @action
  onChange(e) {
    this.args.onChange?.(e);
    this.args.onChangeValue?.(e.target.value);
  }

  @action
  onInput(e) {
    this.args.onInput?.(e);
    this.args.onInputValue?.(e.target.value);
  }
}
