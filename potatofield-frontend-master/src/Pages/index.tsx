import React from 'react';

import { DrawerProvider } from '@/Contexts/Drawer';

const index: React.FC = ({ children }) => (
  <DrawerProvider>
    {children}
  </DrawerProvider>
);

export default index;
