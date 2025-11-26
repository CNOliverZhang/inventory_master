import { Theme, alpha } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    '& .content-wrapper': {
      width: '100%',
      paddingTop: 100,
      paddingBottom: theme.spacing(2),
      position: 'relative',

      '& .avatar-wrapper': {
        display: 'flex',
        justifyContent: 'center',

        '& .avatar': {
          width: 150,
          height: 150,
          borderRadius: 75,
          overflow: 'hidden',
          position: 'relative',
          marginBottom: theme.spacing(4),

          [theme.breakpoints.up('md')]: {
            width: 200,
            height: 200,
            borderRadius: 100,
            marginBottom: theme.spacing(8),
          },

          '& .avatar-image': {
            width: '100%',
            height: '100%',
          },

          '& .avatar-cover': {
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: alpha(theme.palette.common.black, 0.5),
            color: theme.palette.primary.contrastText,
            opacity: 0,
            transition: '0.3s',

            '&:hover': {
              opacity: 1,
            },
          },
        },
      },

      '& .card': {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),

        '& .card-icon': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },

        '&:first-child': {
          marginTop: 0,
        },

        '&:last-child': {
          marginBottom: 0,
        },

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

          '&.button': {
            [theme.breakpoints.up('sm')]: {
              maxWidth: 120,
              marginRight: 0,
              marginLeft: 'auto',
            },
          },
        },

        '& .divider': {
          marginBlock: theme.spacing(2),
          marginBottom: theme.spacing(2),
        },
      },
    },
  },
})();
