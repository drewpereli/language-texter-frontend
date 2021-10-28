import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export interface SelectOption {
  id: string | number;
  label: string;
  value?: unknown;
}

type OptionType = SelectOption | string | number;

interface Args<O extends OptionType> {
  options: O[];
  selectedOption?: string | number; // Only works if options is an array of strings or numbers
  selectedOptionId?: string | number; // Only works if options is an array of SelectOptions
  label?: string;
  onChange?: (option: O) => unknown;
  onChangeValue?: (value: SelectOption['value']) => unknown;
  error?: string;
  placeholder?: string;
}

interface ComputedSelectOption<O extends OptionType> extends SelectOption {
  originalOption: O;
}

export default class UiSelectComponent<O extends OptionType> extends Component<Readonly<Args<O>>> {
  inputId = `${guidFor(this)}-input`;

  protected get computedOptions(): ComputedSelectOption<O>[] {
    return this.args.options.map((option) => {
      let computedOption: ComputedSelectOption<O>;

      if (typeof option === 'object') {
        computedOption = {
          id: option.id,
          label: option.label,
          originalOption: option,
        };
      } else {
        computedOption = {
          id: option,
          label: option.toString(),
          originalOption: option,
        };
      }

      return computedOption;
    });
  }

  protected get selectedComputedOption(): ComputedSelectOption<O> | null {
    let options = this.computedOptions;
    let selected;

    if (this.args.selectedOptionId !== undefined) {
      selected = options.find((option) => option.id === this.args.selectedOptionId);
    } else if (this.args.selectedOption !== undefined) {
      selected = options.find((option) => option.originalOption === this.args.selectedOption);
    }

    return selected ?? null;
  }

  protected get includeLabelAndErrorSection(): boolean {
    return Boolean(this.args.label || this.args.error);
  }

  @action
  onChange(computedOption: typeof this.computedOptions[number]): void {
    let option = computedOption.originalOption;

    this.args.onChange?.(option);

    if (typeof option === 'object') {
      this.args.onChangeValue?.(option.value);
    }
  }
}
