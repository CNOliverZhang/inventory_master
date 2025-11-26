import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    '& .card': {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),

      '& .card-image-wrapper': {
        textAlign: 'center',
        backgroundColor: theme.palette.grey[400],

        '& .card-image': {
          width: 300,
          maxWidth: '100%',
        },
      },
    },

    '& .add-tool': {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  },
})();
