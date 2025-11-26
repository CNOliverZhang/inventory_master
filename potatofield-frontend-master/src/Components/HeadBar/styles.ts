import { alpha, Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    width: '100%',
    color: theme.palette.text.primary,
    transition: 'box-shadow 0s',
    zIndex: theme.zIndex.appBar,

    '& .header': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: -1,
    },

    '& .title': {
      marginLeft: theme.spacing(2),
      flexGrow: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',

      '&.with-search': {
        display: 'none',
        marginRight: theme.spacing(2),

        [theme.breakpoints.up('sm')]: {
          display: 'block',
        },
      },
    },

    '& .search': {
      width: 0,
      flexGrow: 1,
      flexShrink: 0,
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.grey[500], 0.15),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),

      '&:hover': {
        backgroundColor: alpha(theme.palette.grey[500], 0.25),
      },

      '&:focus-within': {
        backgroundColor: alpha(theme.palette.grey[500], 0.25),
      },

      [theme.breakpoints.up('sm')]: {
        flexGrow: 'unset',
        width: 200,

        '&:hover': {
          width: 250,
        },

        '&:focus-within': {
          width: 250,
        },
      },

      '& .search-icon': {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },

      '& .input-root': {
        color: 'inherit',

        '& .input-content': {
          padding: theme.spacing(1, 1, 1, 0),
          paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        },
      },
    },

    '& .animate': {
      transition: '0.3s',
    },
  },

  userInfo: {
    width: 256,
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',

    '& .user-avatar': {
      width: 64,
      height: 64,
      borderRadius: 32,
    },

    '& .user-info-text': {
      marginLeft: theme.spacing(2),
      width: 0,
      flexGrow: 1,

      '& .user-nickname': {
        fontSize: '1rem',
        marginBottom: theme.spacing(1),
      },

      '& .user-intro': {
        fontSize: '0.75rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
      },
    },
  },
})();
