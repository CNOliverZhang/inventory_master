import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    width: 320,
    maxWidth: '100%',

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

      '& .font-file': {
        border: 1,
        borderStyle: 'dashed',
        borderColor: theme.palette.text.secondary,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1),
        transition: '0.3s',

        '&:hover': {
          borderColor: theme.palette.text.primary,
        },

        '& .font-file-info': {
          marginTop: theme.spacing(1),
          marginBottom: theme.spacing(1),
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',

          '&:first-child': {
            marginTop: 0,
          },

          '&:last-child': {
            marginBottom: 0,
          },
        },
      },
    },
  },
})();
