import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    '& .form-controller': {
      display: 'block',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),

      '&:first-child': {
        marginTop: 0,
      },

      '&:last-child': {
        marginBottom: 0,
      },
    },
  },
})();
