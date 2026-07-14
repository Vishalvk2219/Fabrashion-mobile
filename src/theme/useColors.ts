import { colors } from './colors';

/**
 * Returns the ANDRÓ color tokens. The palette is now a FIXED light-only theme (see
 * `plans/13-andro-redesign.md`), so there is no theme flip to subscribe to — this is a thin
 * accessor kept so components can `const c = useColors()` uniformly. Prefer this over importing
 * `colors` directly only for consistency; both are equivalent.
 */
export function useColors() {
  return colors;
}
