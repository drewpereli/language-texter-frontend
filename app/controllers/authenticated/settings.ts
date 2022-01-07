import Controller from '@ember/controller';
import { dropTask, TaskGenerator } from 'ember-concurrency';
import { ReminderFrequency, TEXT_TIMES, TIMEZONES } from 'spanish-texter/models/user-settings';
import { SettingsRouteModel } from 'spanish-texter/routes/authenticated/settings';
import { inject as service } from '@ember/service';
import { EuiToasterService } from 'custom-types';

const TEXT_TIME_LABELS: Record<typeof TEXT_TIMES[number], string> = {
  '00:00': 'Midnight',
  '00:30': '12:30 AM',
  '01:00': '01:00 AM',
  '01:30': '01:30 AM',
  '02:00': '02:00 AM',
  '02:30': '02:30 AM',
  '03:00': '03:00 AM',
  '03:30': '03:30 AM',
  '04:00': '04:00 AM',
  '04:30': '04:30 AM',
  '05:00': '05:00 AM',
  '05:30': '05:30 AM',
  '06:00': '06:00 AM',
  '06:30': '06:30 AM',
  '07:00': '07:00 AM',
  '07:30': '07:30 AM',
  '08:00': '08:00 AM',
  '08:30': '08:30 AM',
  '09:00': '09:00 AM',
  '09:30': '09:30 AM',
  '10:00': '10:00 AM',
  '10:30': '10:30 AM',
  '11:00': '11:00 AM',
  '11:30': '11:30 AM',
  '12:00': '12:00 PM',
  '12:30': '12:30 PM',
  '13:00': '01:00 PM',
  '13:30': '01:30 PM',
  '14:00': '02:00 PM',
  '14:30': '02:30 PM',
  '15:00': '03:00 PM',
  '15:30': '03:30 PM',
  '16:00': '04:00 PM',
  '16:30': '04:30 PM',
  '17:00': '05:00 PM',
  '17:30': '05:30 PM',
  '18:00': '06:00 PM',
  '18:30': '06:30 PM',
  '19:00': '07:00 PM',
  '19:30': '07:30 PM',
  '20:00': '08:00 PM',
  '20:30': '08:30 PM',
  '21:00': '09:00 PM',
  '21:30': '09:30 PM',
  '22:00': '10:00 PM',
  '22:30': '10:30 PM',
  '23:00': '11:00 PM',
  '23:30': '11:30 PM',
};

export default class AuthenticatedSettings extends Controller {
  declare model: SettingsRouteModel;

  @service declare euiToaster: EuiToasterService;

  get languageOptions(): { value: string; text: string }[] {
    return this.model.languages.map((language) => {
      return {
        value: language.id,
        text: language.name,
      };
    });
  }

  get timezoneOptions(): { value: string; text: string }[] {
    return TIMEZONES.map((timezone) => {
      return { value: timezone, text: timezone };
    });
  }

  get textTimeOptions(): { value: string; text: string }[] {
    return TEXT_TIMES.map((time) => {
      return { value: time, text: TEXT_TIME_LABELS[time] };
    });
  }

  get reminderFrequencyOptions(): { value: string; text: string }[] {
    return [
      { value: ReminderFrequency.NoReminders, text: 'No reminders' },
      { value: ReminderFrequency.Hourly, text: 'Hourly' },
      { value: ReminderFrequency.EveryFourHours, text: 'Every four hours' },
      { value: ReminderFrequency.Daily, text: 'Daily' },
    ];
  }

  @dropTask
  *onSubmit(): TaskGenerator<void> {
    try {
      yield this.model.userSettings.save();

      this.euiToaster.show({ title: 'Settings updated', color: 'success' });
    } catch (error) {
      console.log(error);
      this.euiToaster.show({ title: 'There was an error.', body: 'Please try again later.', color: 'danger' });
    }
  }
}
