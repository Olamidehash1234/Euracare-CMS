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
      // Error saving visibility state
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
      }
    } catch (error) {
      // Error restoring visibility state
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
      // Error clearing visibility state
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
      // Error saving modal state
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
        }
      }
    } catch (error) {
      // Error restoring modal state
    }
  };

  const clearState = () => {
    try {
      sessionStorage.removeItem(storageKey);
      setIsOpen(false);
      setEditData(null);
    } catch (error) {
      // Error clearing modal state
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
