import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    backgroundColor: theme.palette.background.paper,

    '& .page': {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.palette.background.default,

      '& .logo': {
        width: 300,

        [theme.breakpoints.up('md')]: {
          width: 450,
        },
      },

      '& .title': {
        fontSize: '2rem',
        margin: theme.spacing(4),

        [theme.breakpoints.up('md')]: {
          fontSize: '3rem',
        },
      },

      '& .intro': {
        fontSize: '1rem',

        [theme.breakpoints.up('md')]: {
          fontSize: '1.5rem',
        },
      },

      '& .actions': {
        display: 'flex',
        flexDirection: 'column',
        marginTop: theme.spacing(4),

        [theme.breakpoints.up('md')]: {
          flexDirection: 'row',
        },

        '& .action': {
          width: 200,
          borderRadius: 21,

          [theme.breakpoints.down('md')]: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),

            '&:first-child': {
              marginTop: 0,
            },

            '&:last-child': {
              marginBottom: 0,
            },
          },

          [theme.breakpoints.up('md')]: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),

            '&:first-child': {
              marginLeft: 0,
            },

            '&:last-child': {
              marginRight: 0,
            },
          },
        },
      },

      '& .latest-version-card': {
        width: 320,
      },
    },

    '& .content-wrapper': {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
    },
  },
})();
