import Evented from '@ember/object/evented';
import type RouterService from '@ember/routing/router-service';

export interface InfinityService {
  model: (model: string, params: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

export interface SessionService extends Evented {
  data: { authenticated: { token: string } };
  isAuthenticated: boolean;
  requireAuthentication: (transition: RouteTransition, redirectRoute: string) => boolean;
  authenticate: (authenticator: string, info: { username?: string; password?: string }) => void;
  invalidate: () => void;
  prohibitAuthentication: (route: string) => void;
}

export type RouteTransition = ReturnType<RouterService['transitionTo']> & { targetName: string };

export type Language = 'spanish' | 'english';

export interface AdapterErrorEntry {
  detail: string;
  source: { pointer: string };
  title: string;
}

export interface AdapterError extends Error {
  errors: AdapterErrorEntry[];
  isAdapterError: true;
}

type Validator<T = unknown> = (
  key: string,
  newValue: T,
  oldValue: T,
  changes: Record<string, unknown>,
  content: Record<string, unknown>
) => true | string;

type ValidationsObject = Record<string, Validator | Validator[]>;
