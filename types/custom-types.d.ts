export interface InfinityService {
  model: (model: string, params: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

export interface SessionService {
  data: { authenticated: { token: string; user: { id: number; username: string } } };
  isAuthenticated: boolean;
  requireAuthentication: (transition: RouteTransition, redirectRoute: string) => boolean;
  authenticate: (authenticator: string, info: { username?: string; password?: string }) => void;
  invalidate: () => void;
  prohibitAuthentication: (route: string) => void;
}

import type RouterService from '@ember/routing/router-service';
export type RouteTransition = ReturnType<RouterService['transitionTo']> & { targetName: string };

type Language = 'spanish' | 'english';
