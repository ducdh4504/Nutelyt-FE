import { useEffect, useRef } from "react";
import { Animated, Easing, View, type ViewStyle } from "react-native";

const SHIMMER_CYCLE_MS = 1400;
const SHIMMER_BAND_WIDTH = 0.55;

const shimmerTranslate = new Animated.Value(0);
let shimmerLoop: Animated.CompositeAnimation | null = null;
let shimmerSubscribers = 0;

function ensureShimmerRunning() {
  shimmerSubscribers += 1;

  if (shimmerLoop) {
    return;
  }

  shimmerLoop = Animated.loop(
    Animated.timing(shimmerTranslate, {
      duration: SHIMMER_CYCLE_MS,
      easing: Easing.linear,
      toValue: 1,
      useNativeDriver: true,
    }),
  );
  shimmerLoop.start();
}

function releaseShimmer() {
  shimmerSubscribers = Math.max(0, shimmerSubscribers - 1);

  if (shimmerSubscribers === 0 && shimmerLoop) {
    shimmerLoop.stop();
    shimmerLoop = null;
    shimmerTranslate.setValue(0);
  }
}

type ShimmerProps = {
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
};

/**
 * Animated shimmer block. A single shared Animated.Value drives every
 * Shimmer on screen via the native driver, so even long lists stay smooth.
 *
 * Visual: a slightly-lighter "band" sweeps across a base surface color by
 * translating its scaleX. No background-color animation is needed (which
 * would force a JS-thread animation), keeping the cost at one shared
 * transform per frame.
 */
export function Shimmer({
  width = "100%",
  height = "100%",
  borderRadius = 0,
  style,
}: ShimmerProps) {
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    ensureShimmerRunning();

    return () => {
      mountedRef.current = false;
      releaseShimmer();
    };
  }, []);

  const bandTranslate = shimmerTranslate.interpolate({
    inputRange: [0, 1],
    outputRange: [
      `-${Math.round(SHIMMER_BAND_WIDTH * 100)}%`,
      `${Math.round(SHIMMER_BAND_WIDTH * 100)}%`,
    ],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          overflow: "hidden",
          backgroundColor: "#E5EEE7",
        },
        style,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          transform: [
            { translateX: bandTranslate },
            { scaleX: SHIMMER_BAND_WIDTH },
          ],
          backgroundColor: "#F4F8F5",
          opacity: 0.7,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${Math.round((1 - SHIMMER_BAND_WIDTH) * 50)}%`,
          right: `${Math.round((1 - SHIMMER_BAND_WIDTH) * 50)}%`,
          backgroundColor: "#FFFFFF",
          opacity: 0.55,
        }}
      />
    </Animated.View>
  );
}