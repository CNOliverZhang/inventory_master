import React from 'react';
import { useLocation } from 'react-router';

import HeadBar from '@/Components/HeadBar';
import MediaCenter from '@/Components/MediaCenter';

import styles from './styles';
import { MediaCenterRouterState } from '../types';

const index: React.FC = () => {
  const classes = styles();
  const { state } = useLocation<MediaCenterRouterState>();
  return (
    <div className={classes.root}>
      <HeadBar title="媒体库" changeTransparencyOnScroll={false} />
      <div className="container">
        <MediaCenter initialSelectedTag={state?.tag} />
      </div>
    </div>
  );
};

export default index;
