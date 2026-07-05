import { Image, type ImageContentFit, type ImageProps, type ImageSource } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Animated, type StyleProp, type ViewStyle } from "react-native";

import { Shimmer } from "./shimmer";

type ImageWithSkeletonProps = {
  source: ImageSource | string | number;
  width: number;
  height: number;
  borderRadius?: number;
  contentFit?: ImageContentFit;
  accessibilityLabel?: string;
  accessibilityIgnoresInvertColors?: boolean;
  transition?: ImageProps["transition"];
  cachePolicy?: ImageProps["cachePolicy"];
  style?: StyleProp<ViewStyle>;
};

const FADE_IN_MS = 220;

export function ImageWithSkeleton({
  source,
  width,
  height,
  borderRadius = 0,
  contentFit = "cover",
  accessibilityLabel,
  accessibilityIgnoresInvertColors,
  transition = 0,
  cachePolicy = "memory-disk",
  style,
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const fadeValue = useRef(new Animated.Value(0)).current;
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleLoad = () => {
    if (!mountedRef.current) {
      return;
    }
    setIsLoaded(true);
    Animated.timing(fadeValue, {
      duration: FADE_IN_MS,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

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
      {!isLoaded ? (
        <Shimmer
          borderRadius={borderRadius}
          height={height}
          width={width}
        />
      ) : null}
      <Animated.View
        pointerEvents={isLoaded ? "auto" : "none"}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: fadeValue,
        }}
      >
        <Image
          accessibilityIgnoresInvertColors={accessibilityIgnoresInvertColors}
          accessibilityLabel={accessibilityLabel}
          cachePolicy={cachePolicy}
          contentFit={contentFit}
          source={source}
          style={{
            width: "100%",
            height: "100%",
          }}
          transition={transition}
          onLoad={handleLoad}
        />
      </Animated.View>
    </Animated.View>
  );
}