import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';

interface Args {
  label?: string;
  type?: string;
  onChange?: (event: Event) => unknown;
  onChangeValue?: (value: string) => unknown;
  onInput?: (event: Event) => unknown;
  onInputValue?: (value: string) => unknown;
  error?: string;
}

export default class UiInputComponent extends Component<Args> {
  inputId = `${guidFor(this)}-input`;

  protected get includeLabelAndErrorSection(): boolean {
    return Boolean(this.args.label || this.args.error);
  }

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
