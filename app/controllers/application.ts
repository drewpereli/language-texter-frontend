import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { SessionService } from 'custom-types';

export default class ApplicationController extends Controller {
  @service declare session: SessionService;
}
