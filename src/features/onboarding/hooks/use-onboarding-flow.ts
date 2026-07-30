import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { routes } from "@/config/routes";
import { logger } from "@/services/logger/logger";

import { ONBOARDING_SLIDE_COUNT } from "../config/onboarding-slides";

const TRANSITION_LOCK_MS = 320;

function clampIndex(index: number) {
  return Math.min(Math.max(index, 0), ONBOARDING_SLIDE_COUNT - 1);
}

export function useOnboardingFlow() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [navigationError, setNavigationError] = useState<string | null>(null);
  const activeIndexRef = useRef(0);
  const transitionLocked = useRef(false);
  const completionLocked = useRef(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (transitionTimer.current) {
        clearTimeout(transitionTimer.current);
      }
    },
    [],
  );

  const goTo = useCallback((nextIndex: number, nextDirection: 1 | -1) => {
    if (transitionLocked.current || completionLocked.current) {
      return;
    }

    const safeIndex = clampIndex(nextIndex);
    if (safeIndex === activeIndexRef.current) {
      return;
    }

    transitionLocked.current = true;
    activeIndexRef.current = safeIndex;
    setDirection(nextDirection);
    setIsTransitioning(true);
    setActiveIndex(safeIndex);
    transitionTimer.current = setTimeout(() => {
      transitionLocked.current = false;
      setIsTransitioning(false);
    }, TRANSITION_LOCK_MS);
  }, []);

  const complete = useCallback(() => {
    if (completionLocked.current) {
      return;
    }

    completionLocked.current = true;
    setIsCompleting(true);
    setNavigationError(null);

    try {
      router.replace(routes.login);
    } catch (error) {
      completionLocked.current = false;
      setIsCompleting(false);
      setNavigationError("Không thể mở màn hình đăng nhập. Vui lòng thử lại.");
      logger.error("Onboarding navigation failed:", error);
    }
  }, [router]);

  const continueToNext = useCallback(() => {
    if (activeIndex >= ONBOARDING_SLIDE_COUNT - 1) {
      complete();
      return;
    }

    goTo(activeIndex + 1, 1);
  }, [activeIndex, complete, goTo]);

  const goBack = useCallback(() => {
    goTo(activeIndex - 1, -1);
  }, [activeIndex, goTo]);

  return {
    activeIndex: clampIndex(activeIndex),
    complete,
    continueToNext,
    direction,
    goBack,
    isCompleting,
    isTransitioning,
    navigationError,
  } as const;
}
