import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    [theme.breakpoints.up('md')]: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },

    '& .control-panel-wrapper': {
      width: '100%',
      padding: theme.spacing(2),
      paddingBottom: 0,

      '& .control-panel': {
        padding: theme.spacing(2),

        [theme.breakpoints.up('md')]: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },

        '& .control-wrapper': {
          [theme.breakpoints.up('md')]: {
            display: 'flex',
          },

          '& .control': {
            width: 100,
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),

            [theme.breakpoints.down('md')]: {
              marginTop: theme.spacing(2),
            },

            '&:first-child': {
              marginLeft: 0,
            },

            '&:last-child': {
              marginRight: 0,
            },
          },
        },
      },
    },

    '& .content-wrapper': {
      padding: theme.spacing(1),

      [theme.breakpoints.up('md')]: {
        flexGrow: 1,
        display: 'flex',
        flexWrap: 'wrap',
      },

      '& .card-wrapper': {
        width: '100%',
        height: '80vw',
        padding: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',

        [theme.breakpoints.up('md')]: {
          width: '50%',
          height: '50%',
          minHeight: 400,
        },

        '& .card': {
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',

          '& .card-icon': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          },

          '& .chart-wrapper': {
            width: '100%',
            flexGrow: 1,
          },
        },
      },
    },
  },
})();
