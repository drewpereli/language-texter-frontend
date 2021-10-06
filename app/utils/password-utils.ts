import IntlService from 'ember-intl/services/intl';

export function passwordValidationInfo(
  password = '',
  t: IntlService['t']
): { valid: boolean; errors: string[]; warnings: string[] } {
  let info: ReturnType<typeof passwordValidationInfo> = { valid: false, errors: [], warnings: [] };

  if (password.length < 12) {
    info.errors.push(t('error_messages.password_length'));
  }

  if (/password/i.test(password)) {
    info.warnings.push(t('error_messages.password_contains_password'));
  }

  if (info.errors.length === 0) {
    info.valid = true;
  }

  return info;
}
