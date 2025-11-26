import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    '& .stepper': {
      backgroundColor: 'unset',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(4),

      '& .step-icon-wrapper': {
        width: 24,
        height: 24,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        '& .active': {
          color: theme.palette.secondary.main,
        },

        '& .inactive': {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: theme.palette.text.secondary,
        },
      },

      '& .client-count': {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),

        '& .chip-icon': {
          backgroundColor: theme.palette.secondary.main,
        },

        '&:first-child': {
          marginLeft: 0,
        },

        '&:last-child': {
          marginRight: 0,
        },
      },
    },

    '& .add-version': {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  },
})();
