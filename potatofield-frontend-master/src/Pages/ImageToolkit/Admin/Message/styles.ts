import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    '& .stepper': {
      backgroundColor: 'unset',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(4),

      '& .card-icon': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },

      '& .card-title': {
        width: 0,
      },

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
    },

    '& .add-message': {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  },
})();
