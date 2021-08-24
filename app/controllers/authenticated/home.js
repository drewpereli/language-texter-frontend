import Controller from '@ember/controller';

export default class AuthenticatedHomeController extends Controller {
  challengeLists = [
    { status: 'queued', startCollapsed: true },
    { status: 'active', startCollapsed: false },
    { status: 'complete', startCollapsed: true },
  ];
}
