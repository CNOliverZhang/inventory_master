import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },

    '& .side-bar': {
      height: '100vh',
      width: '100%',
      flexShrink: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',

      [theme.breakpoints.up('md')]: {
        width: '30%',
      },

      '& .cover': {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 0.5,
        backgroundColor: theme.palette.background.default,
      },

      '& .logo': {
        borderRadius: '50%',
        position: 'relative',
        width: 160,
        boxShadow: theme.shadows[4],
        marginBottom: theme.spacing(8),
      },

      '& .content': {
        position: 'relative',
      },

      '& .icons-wrapper': {
        marginTop: theme.spacing(2),
      },

      '& .introduction': {
        marginTop: theme.spacing(2),
        paddingLeft: '20%',
        paddingRight: '20%',
        position: 'relative',
      },
    },

    '& .content-wrapper': {
      width: '100%',
      paddingBottom: theme.spacing(2),

      [theme.breakpoints.up('md')]: {
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        paddingRight: '20%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      },

      '& .article-list': {
        padding: theme.spacing(2),
        boxSizing: 'border-box',
        width: '100%',

        [theme.breakpoints.up('md')]: {
          minWidth: 540,
        },

        '& .article': {
          display: 'flex',
          overflow: 'hidden',
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(2),

          '&:first-child': {
            marginTop: 0,
          },

          '&:last-child': {
            marginBottom: 0,
          },

          '& .article-cover-image': {
            width: 200,
            height: 200,
            flexShrink: 0,
            objectFit: 'cover',

            [theme.breakpoints.down('sm')]: {
              display: 'none',
            },
          },

          '& .article-info': {
            display: 'flex',
            height: 200,
            padding: theme.spacing(2),
            flexDirection: 'column',
            width: 0,
            flexGrow: 1,

            '& .article-title': {
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            },

            '& .article-intro': {
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            },

            '& .article-actions': {
              flexGrow: 1,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',

              '& .article-action-button-wrapper': {
                display: 'flex',

                '& .article-action-button': {
                  marginLeft: theme.spacing(1),
                },
              },
            },
          },
        },
      },

      '& .pagination': {
        display: 'flex',
        justifyContent: 'center',
      },
    },

    '& .speed-dial': {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  },

  popover: {
    width: 300,

    '& img': {
      width: '100%',
    },
  },
})();
