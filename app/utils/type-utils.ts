import { AdapterError } from 'custom-types';

export function isAdapterError(err?: unknown): err is AdapterError {
  if (!(err instanceof Error)) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (err as any).isAdapterError === true;
}
