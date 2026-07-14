import * as Haptics from 'expo-haptics';

/**
 * Thin, meaning-named haptic helpers. Call the one that matches the *action*, not the widget —
 * `tap` for routine adds, `select` for discrete choices, `success`/`warn`/`failure` for outcomes.
 *
 * Rules baked in:
 * - Every call is fire-and-forget and swallows rejection: haptics can throw on unsupported
 *   hardware / the web build, and must never take down the flow that triggered them.
 * - Haptics are a *redundant* channel — never the only signal for anything. Some users disable
 *   them system-wide and they don't fire on web.
 * - Fire on `onPressIn` (with the visual), not on `onPress`, so the buzz lands with the touch.
 */

/** Routine, frequent action — add to cart/wishlist, arm a pull-to-refresh. A tap, not a thump. */
export const tap = () => {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};

/** Slightly heavier — a destructive or weightier action (remove item, cancel). */
export const bump = () => {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
};

/** Discrete selection — size/colour/quantity/filter chip. Purpose-built for picking among options. */
export const select = () => {
  void Haptics.selectionAsync().catch(() => {});
};

/** A consequential success — order placed, trial booked. Rare; deserves the weight. */
export const success = () => {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
};

/** A soft warning — hit a limit (max quantity, out of stock). */
export const warn = () => {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
};

/** A failure — payment declined, invalid OTP. The one place a heavier pattern is earned. */
export const failure = () => {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
};
