import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';

interface Args {
  onChange?: (event: Event) => unknown;
  onChangeValue?: (value: string) => unknown;
  onInput?: (event: Event) => unknown;
  onInputValue?: (value: string) => unknown;
}

export default class UiInputComponent extends Component<Args> {
  inputId = `${guidFor(this)}-input`;

  @action
  onChange(e: Event): void {
    this.args.onChange?.(e);
    let element = e.target as HTMLInputElement;
    this.args.onChangeValue?.(element.value);
  }

  @action
  onInput(e: Event): void {
    this.args.onInput?.(e);
    let element = e.target as HTMLInputElement;
    this.args.onInputValue?.(element.value);
  }
}
