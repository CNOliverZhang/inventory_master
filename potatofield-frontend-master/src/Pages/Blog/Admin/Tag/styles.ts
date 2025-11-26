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

        '& .chips-wrapper': {
          display: 'flex',
          flexWrap: 'wrap',
          margin: theme.spacing(-0.5),

          '& .chip': {
            margin: theme.spacing(0.5),
          },
        },

        '& .input-wrapper': {
          display: 'flex',
          alignItems: 'flex-end',
          marginTop: theme.spacing(2),

          '& .input': {
            width: 0,
            flexGrow: 1,
          },

          '& .button': {
            width: 120,
            marginLeft: theme.spacing(2),
          },
        },
      },
    },
  },
})();
