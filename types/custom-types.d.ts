export interface InfinityService {
  model: (model: string, params: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

export interface SessionService {
  requireAuthentication: (transition: RouteTransition, redirectRoute: string) => boolean;
  invalidate: () => void;
  prohibitAuthentication: (route: string) => void;
}

import type RouterService from '@ember/routing/router-service';
export type RouteTransition = ReturnType<RouterService['transitionTo']> & { targetName: string };
