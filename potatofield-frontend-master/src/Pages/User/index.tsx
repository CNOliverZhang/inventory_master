import React from 'react';

import HeadBar from '@/Components/HeadBar';

const index: React.FC = ({ children }) => (
  <>
    <HeadBar position="fixed" changeTransparencyScrollHeight={100} />
    {children}
  </>
);

export default index;
