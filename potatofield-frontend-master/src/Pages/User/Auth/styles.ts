import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    '& .auth-wrapper': {
      width: '100%',
      paddingTop: 175,
      paddingBottom: theme.spacing(2),

      '& .auth': {
        position: 'relative',
        paddingTop: 100,
        overflow: 'visible',

        '& .icon-wrapper': {
          width: 150,
          height: 150,
          borderRadius: 75,
          position: 'absolute',
          left: 'calc(50% - 75px)',
          top: -75,

          '& .icon': {
            width: '100%',
            height: '100%',
          },
        },
      },
    },
  },
})();
