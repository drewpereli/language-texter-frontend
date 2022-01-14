type GlobalOptions = { message?: string };

declare module 'ember-changeset-validations/validators' {
  import { Validator } from 'custom-types';

  function validatePresence(mustBePresent: boolean): Validator;
  function validatePresence(
    options: { presence: boolean; ignoreBlank?: boolean; on?: string | string[] } & GlobalOptions
  ): Validator;

  function validateFormat(
    options: {
      allowBlank?: boolean;
      type?: 'email' | 'phone' | 'url';
      regex?: RegExp;
      inverse?: boolean;
    } & GlobalOptions
  ): Validator;

  function validateConfirmation(options: { on: string; allowBlank?: boolean } & GlobalOptions): Validator;

  function validateNumber(
    options?: {
      allowBlank?: boolean;
      allowNone?: boolean;
      allowString?: boolean;
      integer?: boolean;
      positive?: boolean;
      odd?: boolean;
      even?: boolean;
      is?: number;
      lt?: number;
      lte?: number;
      gt?: number;
      gte?: number;
      multipleOf?: number;
    } & GlobalOptions
  ): Validator;
}
