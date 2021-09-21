export interface InfinityService {
  model: (model: string, params: Record<string, unknown>) => Promise<Record<string, unknown>>;
}
