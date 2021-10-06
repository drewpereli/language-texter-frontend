export function passwordValidationInfo(password = ''): { valid: boolean; errors: string[]; warnings: string[] } {
  let info: ReturnType<typeof passwordValidationInfo> = { valid: false, errors: [], warnings: [] };

  if (password.length < 12) {
    info.errors.push('Password must be at least 12 characters long.');
  }

  if (/password/i.test(password)) {
    info.warnings.push('Password should not contain the word "password".');
  }

  if (info.errors.length === 0) {
    info.valid = true;
  }

  return info;
}
