import ApplicationAdapter from './application';

export default class User extends ApplicationAdapter {
  urlForQueryRecord(query: Record<string, unknown>, modelName: string | number): string {
    let originalUrl = super.urlForQueryRecord(query, modelName);

    if (query.me) {
      delete query.me;
      return `${originalUrl}/me`;
    }

    return originalUrl;
  }
}
