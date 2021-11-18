import { Validator } from 'custom-types';

export default function validatePasswordStrength(/* options = {} */): Validator<string> {
  return (_key, password) => {
    if (password.length < 12) {
      return 'Password must be at least 12 characters long.';
    }

    if (/password/i.test(password)) {
      return 'Password should not contain the word "password".';
    }

    return true;
  };
}
