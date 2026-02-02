import { useEffect, useRef } from 'react';

export function useFormPersist(storageKey: string, dependencies: any[] = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Only persist on updates, not on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Persist form state to sessionStorage
    try {
      const stateToSave = {
        timestamp: Date.now(),
        data: dependencies,
      };
      sessionStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      // Error persisting form state
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  
  const restoreFormState = () => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored);
      const ageInMs = Date.now() - parsed.timestamp;
      const ageInMinutes = ageInMs / (1000 * 60);

      // Optionally expire persisted state after 24 hours
      if (ageInMinutes > 1440) {
        sessionStorage.removeItem(storageKey);
        return null;
      }

      return parsed.data;
    } catch (error) {
      // Error restoring form state
      return null;
    }
  };

  /**
   * Clear persisted form state (call after successful submission)
   */
  const clearFormState = () => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch (error) {
      // Error clearing form state
    }
  };

  return {
    restoreFormState,
    clearFormState,
  };
}
