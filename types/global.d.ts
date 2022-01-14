// Types for compiled templates
declare module 'language-texter/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  // eslint-disable-next-line prefer-let/prefer-let
  const tmpl: TemplateFactory;
  export default tmpl;
}

declare module 'active-model-adapter' {
  import JSONApiAdapter from 'ember-data__adapter/json-api';
  import JSONApiSerializer from 'ember-data__serializer/json-api';
  export default JSONApiAdapter;
  export { JSONApiSerializer as ActiveModelSerializer };
}
