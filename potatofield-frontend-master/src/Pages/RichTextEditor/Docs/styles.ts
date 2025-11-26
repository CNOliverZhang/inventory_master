import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    [theme.breakpoints.up('sm')]: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },

    '& .content-wrapper': {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column-reverse',

      [theme.breakpoints.up('sm')]: {
        flexGrow: 1,
        flexDirection: 'row',
        height: 0,
      },

      '& .navigator-wrapper': {
        width: '100%',

        [theme.breakpoints.up('sm')]: {
          width: 240,
          height: '100%',
          marginRight: theme.spacing(4),
        },

        '& .navigator': {
          width: '100%',
          height: '100%',

          '& .MuiTabs-scrollButtons.Mui-disabled': {
            transition: '0.3s',
            opacity: 0.3,
          },

          '&-item': {
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',

            '&.child': {
              textIndent: '2em',
            },
          },
        },
      },

      '& .content': {
        width: '100%',

        [theme.breakpoints.only('xs')]: {
          paddingBottom: theme.spacing(2),
        },

        [theme.breakpoints.up('sm')]: {
          width: 0,
          flexGrow: 1,
          overflowY: 'auto',
          marginTop: theme.spacing(-2),
          marginBottom: theme.spacing(-2),
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
        },

        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },
    },
  },
})();
