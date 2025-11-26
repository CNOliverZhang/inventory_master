import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    '& .navigation': {
      width: 320,
      maxWidth: '100vw',

      '& .logo': {
        width: '100%',
        paddingTop: '15%',
        paddingBottom: '15%',
        textAlign: 'center',

        '& img': {
          width: '50%',
        },
      },

      '& .item': {
        paddingRight: '1em',

        '& .active': {
          color: theme.palette.primary.main,
        },

        '& .animate': {
          transition: '0.3s',
        },
      },
    },
  },
})();
