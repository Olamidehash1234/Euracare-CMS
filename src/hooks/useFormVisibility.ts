import { useState } from 'react';

/**
 * Custom hook for persisting form/modal visibility state across page reloads
 * 
 * Usage:
 * const { isOpen, setIsOpen, restoreState, clearState } = useFormVisibility('blog-form-open');
 * 
 * On mount:
 * useEffect(() => { restoreState(); }, []);
 * 
 * Before render:
 * if (isOpen) { return <Form /> }
 */
export function useFormVisibility(storageKey: string) {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Save form visibility state to sessionStorage
   */
  const saveState = (open: boolean) => {
    try {
      if (open) {
        sessionStorage.setItem(storageKey, JSON.stringify(true));
      } else {
        sessionStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error(`[useFormVisibility] Error saving visibility state:`, error);
    }
  };

  /**
   * Restore form visibility state from sessionStorage
   */
  const restoreState = () => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored === 'true') {
        setIsOpen(true);
        // console.log(`[useFormVisibility] Restored visibility state for key: ${storageKey}`);
      }
    } catch (error) {
      console.error(`[useFormVisibility] Error restoring visibility state:`, error);
    }
  };

  /**
   * Clear the visibility state
   */
  const clearState = () => {
    try {
      sessionStorage.removeItem(storageKey);
      setIsOpen(false);
    } catch (error) {
      console.error(`[useFormVisibility] Error clearing visibility state:`, error);
    }
  };

  /**
   * Update visibility state (use this instead of setIsOpen directly)
   */
  const setVisibility = (open: boolean) => {
    setIsOpen(open);
    saveState(open);
  };

  return {
    isOpen,
    setIsOpen: setVisibility,
    restoreState,
    clearState,
  };
}

/**
 * Hook for persisting form visibility and the data being edited
 * 
 * Usage:
 * const { isOpen, setIsOpen, editData, setEditData, restoreState, clearState } = useFormModal('blog-modal', initialData);
 */
export function useFormModal<T>(storageKey: string, initialData?: T) {
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<T | null>(initialData || null);

  const saveState = (open: boolean, data?: T | null) => {
    try {
      if (open && data) {
        sessionStorage.setItem(storageKey, JSON.stringify({ open: true, data }));
      } else {
        sessionStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error(`[useFormModal] Error saving modal state:`, error);
    }
  };

  const restoreState = () => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.open && parsed.data) {
          setIsOpen(true);
          setEditData(parsed.data);
          // console.log(`[useFormModal] Restored modal state for key: ${storageKey}`);
        }
      }
    } catch (error) {
      console.error(`[useFormModal] Error restoring modal state:`, error);
    }
  };

  const clearState = () => {
    try {
      sessionStorage.removeItem(storageKey);
      setIsOpen(false);
      setEditData(null);
    } catch (error) {
      console.error(`[useFormModal] Error clearing modal state:`, error);
    }
  };

  const setFormOpen = (open: boolean, data?: T | null) => {
    setIsOpen(open);
    setEditData(data || null);
    saveState(open, data || null);
  };

  return {
    isOpen,
    setIsOpen: setFormOpen,
    editData,
    setEditData: (data: T | null) => {
      setEditData(data);
      saveState(isOpen, data);
    },
    restoreState,
    clearState,
  };
}
