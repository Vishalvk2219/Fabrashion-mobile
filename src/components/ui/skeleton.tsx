import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  type StyleProp,
  StyleSheet,
  useAnimatedValue,
  View,
  type ViewStyle,
} from 'react-native';

const BASE = '#EFECE5';

/** A shimmering placeholder block. Compose these into skeleton screens. */
export function Shimmer({ style }: { style?: StyleProp<ViewStyle> }) {
  const x = useAnimatedValue(0);
  const [w, setW] = useState(0);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(x, { toValue: 1, duration: 1300, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [x]);

  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={[styles.base, style]}>
      {w > 0 ? (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [-w, w] }) }] },
          ]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.65)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: BASE, overflow: 'hidden', borderCurve: 'continuous' },
});
