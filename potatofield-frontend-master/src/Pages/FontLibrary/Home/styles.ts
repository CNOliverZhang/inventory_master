import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    '& .header': {
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',

      '& .logo': {
        width: 200,

        [theme.breakpoints.up('md')]: {
          width: 300,
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
    },

    '& .container': {
      display: 'flex',
      flexWrap: 'wrap',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),

      [theme.breakpoints.only('xs')]: {
        width: 320,
      },

      '& .card-wrapper': {
        width: '100%',
        padding: theme.spacing(1),

        [theme.breakpoints.up('sm')]: {
          width: '50%',
        },

        [theme.breakpoints.up('md')]: {
          width: 'calc(100% / 3)',
        },

        [theme.breakpoints.up('lg')]: {
          width: '25%',
        },

        [theme.breakpoints.up('xl')]: {
          width: 'calc(100% / 6)',
        },

        '& .card-title': {
          width: 0,
        },

        '& .card-icon': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },

        '& .card-media': {
          width: '100%',
          padding: theme.spacing(1),
          filter: theme.palette.mode === 'dark' ? 'invert(100%)' : undefined,
        },
      },
    },
  },

  cardActionPanel: {
    '& .font-image': {
      width: 240,
      margin: theme.spacing(1),
      marginBottom: 0,
      filter: theme.palette.mode === 'dark' ? 'invert(100%)' : undefined,
    },

    '& .font-actions': {
      display: 'flex',
      justifyContent: 'space-between',

      '& .font-style': {
        marginLeft: theme.spacing(1),
      },
    },
  },
})();
