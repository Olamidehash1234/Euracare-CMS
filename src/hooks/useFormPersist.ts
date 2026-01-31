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
      // console.log(`[useFormPersist] Persisted form state for key: ${storageKey}`);
    } catch (error) {
      console.error(`[useFormPersist] Error persisting form state:`, error);
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  
  const restoreFormState = () => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (!stored) {
        // console.log(`[useFormPersist] No persisted state found for key: ${storageKey}`);
        return null;
      }

      const parsed = JSON.parse(stored);
      const ageInMs = Date.now() - parsed.timestamp;
      const ageInMinutes = ageInMs / (1000 * 60);

      // Optionally expire persisted state after 24 hours
      if (ageInMinutes > 1440) {
        // console.log(`[useFormPersist] Persisted state expired for key: ${storageKey}`);
        sessionStorage.removeItem(storageKey);
        return null;
      }

      // console.log(`[useFormPersist] Restored form state for key: ${storageKey} (age: ${ageInMinutes.toFixed(2)} minutes)`);
      return parsed.data;
    } catch (error) {
      console.error(`[useFormPersist] Error restoring form state:`, error);
      return null;
    }
  };

  /**
   * Clear persisted form state (call after successful submission)
   */
  const clearFormState = () => {
    try {
      sessionStorage.removeItem(storageKey);
      // console.log(`[useFormPersist] Cleared form state for key: ${storageKey}`);
    } catch (error) {
      console.error(`[useFormPersist] Error clearing form state:`, error);
    }
  };

  return {
    restoreFormState,
    clearFormState,
  };
}
