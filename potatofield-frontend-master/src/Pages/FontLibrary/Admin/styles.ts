import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
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

        '& .empty-font': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',

          '& .add-font': {
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
          },
        },

        '& .card-title': {
          width: 0,
        },

        '& .card-avatar': {
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

    '& .add-font-family': {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  },

  fonts: {
    width: 320,
    maxWidth: '100%',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,

    '& .font': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),

      '&:first-child': {
        marginTop: 0,
      },

      '&:last-child': {
        marginBottom: 0,
      },

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

        '& .buttons-wrapper': {
          display: 'flex',

          '& .button': {
            marginRight: theme.spacing(1),

            '&:last-child': {
              marginRight: 0,
            },
          },
        },
      },
    },
  },
})();
