// Types for compiled templates
declare module 'spanish-texter/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  // eslint-disable-next-line prefer-let/prefer-let
  const tmpl: TemplateFactory;
  export default tmpl;
}
