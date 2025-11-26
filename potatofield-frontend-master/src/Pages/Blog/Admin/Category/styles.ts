import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    '& .card-wrapper': {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),

      '& .card': {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),

        '&:first-child': {
          marginTop: 0,
        },

        '&:last-child': {
          marginBottom: 0,
        },

        '& .card-icon': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },

        '& .item-wrapper': {
          borderRadius: theme.shape.borderRadius,
          overflow: 'hidden',

          '& .item': {
            marginRight: '1em',
          },
        },
      },
    },
  },
})();
