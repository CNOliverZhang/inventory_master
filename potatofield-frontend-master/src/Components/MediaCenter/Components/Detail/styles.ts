import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),

    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },

    '& .preview': {
      maxWidth: '100%',
      width: 'fit-content',
      height: 'fit-content',
      borderRadius: theme.shape.borderRadius,

      [theme.breakpoints.up('md')]: {
        width: 0,
        flexGrow: 1,
        marginRight: theme.spacing(2),
      },
    },

    '& .media-info': {
      marginTop: theme.spacing(2),

      [theme.breakpoints.up('md')]: {
        width: 360,
        marginTop: 0,
      },

      [theme.breakpoints.up('lg')]: {
        width: 480,
        marginTop: 0,
      },

      [theme.breakpoints.up('xl')]: {
        width: 720,
        marginTop: 0,
      },

      '& .line-wrapper': {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),

        [theme.breakpoints.up('sm')]: {
          display: 'flex',
          alignItems: 'flex-end',
        },

        '& .input': {
          width: '100%',

          [theme.breakpoints.up('sm')]: {
            flexGrow: 1,
          },
        },

        '& .action-buttons': {
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: theme.spacing(2),

          [theme.breakpoints.up('sm')]: {
            width: 240,
            flexShrink: 0,
            marginLeft: theme.spacing(2),
          },

          '& .action-button': {
            width: 0,
            flexGrow: 1,
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),

            '&:first-child': {
              marginLeft: 0,
            },

            '&:last-child': {
              marginRight: 0,
            },
          },
        },
      },

      '& .tags-container': {
        display: 'flex',
        flexWrap: 'wrap',
        margin: theme.spacing(-0.5),

        '& .tag': {
          margin: theme.spacing(0.5),
        },
      },
    },
  },
})();
