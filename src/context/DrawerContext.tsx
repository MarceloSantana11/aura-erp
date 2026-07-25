import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DrawerEntityType, DrawerStackItem } from '../types';

interface DrawerContextType {
  isOpen: boolean;
  drawerStack: DrawerStackItem[];
  activeItem: DrawerStackItem | null;
  openDrawer: (type: DrawerEntityType, data: any, initialTab?: string) => void;
  pushDrawer: (type: DrawerEntityType, data: any, initialTab?: string) => void;
  popDrawer: () => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drawerStack, setDrawerStack] = useState<DrawerStackItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const activeItem = drawerStack.length > 0 ? drawerStack[drawerStack.length - 1] : null;

  const openDrawer = useCallback((type: DrawerEntityType, data: any, initialTab?: string) => {
    setDrawerStack([{ type, data, initialTab }]);
    setIsOpen(true);
  }, []);

  const pushDrawer = useCallback((type: DrawerEntityType, data: any, initialTab?: string) => {
    setDrawerStack((prev) => [...prev, { type, data, initialTab }]);
    setIsOpen(true);
  }, []);

  const popDrawer = useCallback(() => {
    setDrawerStack((prev) => {
      if (prev.length <= 1) {
        setIsOpen(false);
        return [];
      }
      return prev.slice(0, -1);
    });
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    setDrawerStack([]);
  }, []);

  // Keyboard shortcut listener for Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        popDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, popDrawer]);

  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        drawerStack,
        activeItem,
        openDrawer,
        pushDrawer,
        popDrawer,
        closeDrawer,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};
