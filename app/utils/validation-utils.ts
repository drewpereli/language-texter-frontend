class ValidationInfo {
  public errors: string[] = [];
  public warnings: string[] = [];

  public get valid(): boolean {
    return this.errors.length === 0;
  }

  public get errorMessage(): string | null {
    if (this.valid) {
      return null;
    }

    return this.errors.join(' ');
  }
}

export function getPasswordValidationInfo(password = ''): ValidationInfo {
  let info = new ValidationInfo();

  if (password.length < 12) {
    info.errors.push('Password must be at least 12 characters long.');
  }

  if (/password/i.test(password)) {
    info.warnings.push('Password should not contain the word "password".');
  }

  return info;
}
