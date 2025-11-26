import React, { useRef, useContext } from 'react';

import Drawer, { DrawerMethods } from '@/Components/Drawer';

interface DrawerContext {
  open: () => void;
  close: () => void;
}

const drawerContext = React.createContext<DrawerContext>({
  open: () => undefined,
  close: () => undefined,
});

export const DrawerProvider: React.FC<{
  children:React.ReactNode,
}> = (props: { children:React.ReactNode }) => {
  const drawer = useRef<DrawerMethods>(null);
  const { children } = props;
  const drawerController = {
    open: () => {
      drawer.current?.open();
    },
    close: () => {
      drawer.current?.close();
    },
  };
  return (
    <drawerContext.Provider value={drawerController}>
      <Drawer ref={drawer} />
      {children}
    </drawerContext.Provider>
  );
};

const useDrawer = (): DrawerContext => useContext(drawerContext);

export default useDrawer;
