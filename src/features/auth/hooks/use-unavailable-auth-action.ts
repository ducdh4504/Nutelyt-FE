import { useCallback, useEffect, useRef, useState } from "react";

export function useUnavailableAuthAction() {
  const [feedback, setFeedback] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const lock = useRef(false);
  const isMounted = useRef(true);

  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
  );

  const showUnavailable = useCallback(async (action: string, message: string) => {
    if (lock.current) return;
    lock.current = true;
    setPendingAction(action);
    setFeedback("");

    try {
      await Promise.resolve();
      if (isMounted.current) setFeedback(message);
    } finally {
      lock.current = false;
      if (isMounted.current) setPendingAction(null);
    }
  }, []);

  return { feedback, pendingAction, showUnavailable };
}
