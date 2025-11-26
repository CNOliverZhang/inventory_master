import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    '& .auth-info-column': {
      display: 'flex',
      alignItems: 'center',

      '& .auth-logo': {
        width: 36,
        height: 36,
        borderRadius: 18,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 18,
        color: theme.palette.common.white,
        marginRight: theme.spacing(1),
      },

      '& .button': {
        [theme.breakpoints.up('sm')]: {
          width: 120,
          marginRight: 0,
          marginLeft: 'auto',
        },
      },

      '& .third-party-bound': {
        width: 18,
        height: 18,
        color: theme.palette.success.main,
        marginLeft: theme.spacing(1),
      },

      '& .third-party-unbound': {
        width: 18,
        height: 18,
        color: theme.palette.secondary.main,
        marginLeft: theme.spacing(1),
      },
    },
  },
})();
