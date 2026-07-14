import { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  useAnimatedValue,
} from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Press-in is a fast timing (instant acknowledgement); release is a spring (organic settle). */
const PRESS_IN_MS = 90;
const RELEASE_SPRING = { stiffness: 400, damping: 15, mass: 0.5 } as const;

/** Mirror the OS "reduce motion" setting; keep the value live if the user toggles it. */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (mounted) setReduced(v);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);
  return reduced;
}

type Props = PressableProps & {
  /** How far to shrink on press. Large surfaces travel less — 0.97 for full-width CTAs,
   * ~0.85 for small icon buttons. */
  scaleTo?: number;
};

/**
 * A Pressable that acknowledges the touch within one frame: shrinks on `onPressIn` (never waiting
 * on `onPress`/the network) and springs back on release. The scale runs on the native thread
 * (`useNativeDriver`), so it stays smooth while JS is busy. A disabled control gets no motion —
 * feedback would imply it did something — and `reduceMotion` drops the movement while callers keep
 * whatever opacity/colour cue they own.
 *
 * Uses the React Native `Animated` API to match the rest of this codebase (it has no Reanimated
 * shared-value usage; that also keeps the React Compiler's immutability lint happy).
 */
export function PressableScale({ scaleTo = 0.97, disabled, onPressIn, onPressOut, style, ...rest }: Props) {
  const scale = useAnimatedValue(1);
  const reduced = useReducedMotion();

  const handleIn = (e: GestureResponderEvent) => {
    if (!reduced) {
      Animated.timing(scale, {
        toValue: scaleTo,
        duration: PRESS_IN_MS,
        useNativeDriver: true,
      }).start();
    }
    onPressIn?.(e);
  };

  const handleOut = (e: GestureResponderEvent) => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...RELEASE_SPRING }).start();
    onPressOut?.(e);
  };

  const transform = { transform: [{ scale }] };

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={handleIn}
      onPressOut={handleOut}
      style={
        typeof style === 'function'
          ? (state: PressableStateCallbackType) => [transform, style(state)]
          : [transform, style]
      }
      {...rest}
    />
  );
}
