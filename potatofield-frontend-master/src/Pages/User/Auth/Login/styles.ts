import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  login: {
    '& .form-controller': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),

      '&:first-child': {
        marginTop: 0,
      },

      '&:last-child': {
        marginBottom: 0,
      },
    },

    '& .extra-buttons': {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },

  loading: {
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    '& .info': {
      marginTop: theme.spacing(4),
    },
  },
})();
