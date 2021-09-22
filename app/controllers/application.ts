import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { SessionService } from 'custom-types';
import FlashMessageService from 'ember-cli-flash/services/flash-messages';

export default class ApplicationController extends Controller {
  @service declare session: SessionService;
  @service declare flashMessages: FlashMessageService;
}
