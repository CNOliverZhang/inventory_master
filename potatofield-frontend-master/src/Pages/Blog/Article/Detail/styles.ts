import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',

    '& .article-container': {
      paddingTop: theme.spacing(2),
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',

      '& .info-card': {
        height: 120,
        display: 'flex',

        [theme.breakpoints.up('md')]: {
          height: 180,
        },

        '& .cover-image': {
          width: 120,
          height: '100%',
          objectFit: 'cover',

          [theme.breakpoints.up('md')]: {
            width: 180,
            height: '100%',
          },
        },

        '& .info': {
          width: 0,
          flexGrow: 1,
          padding: theme.spacing(2),

          '& .title-wrapper': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',

            '& .edit-icon': {
              height: 'fit-content',
            },
          },

          '& .single-line': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },

          '& .article-info-divider': {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
          },
        },
      },

      '& .detail-info': {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),

        '& .tags-container': {
          display: 'flex',
          flexWrap: 'wrap',
          margin: theme.spacing(-0.5),

          '& .tag': {
            margin: theme.spacing(0.5),
          },
        },
      },

      '& .content-card': {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        flexGrow: 1,

        [theme.breakpoints.up('md')]: {
          padding: theme.spacing(4),
        },
      },
    },

    '& .recommend-scroll-wrapper': {
      overflowX: 'auto',
      marginBottom: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      width: '100%',
      whiteSpace: 'nowrap',
      fontSize: 0,

      [theme.breakpoints.up('sm')]: {
        paddingLeft: `calc(50% - ${theme.breakpoints.values.sm / 2}px + ${theme.spacing(2)})`,
        paddingRight: `calc(50% - ${theme.breakpoints.values.sm / 2}px + ${theme.spacing(2)})`,
      },

      [theme.breakpoints.up('md')]: {
        paddingLeft: `calc(50% - ${theme.breakpoints.values.md / 2}px + ${theme.spacing(2)})`,
        paddingRight: `calc(50% - ${theme.breakpoints.values.md / 2}px + ${theme.spacing(2)})`,
      },

      [theme.breakpoints.up('lg')]: {
        paddingLeft: `calc(50% - ${theme.breakpoints.values.lg / 2}px + ${theme.spacing(2)})`,
        paddingRight: `calc(50% - ${theme.breakpoints.values.lg / 2}px + ${theme.spacing(2)})`,
      },

      '&::-webkit-scrollbar': {
        display: 'none',
      },

      '& .recommend-card-wrapper': {
        display: 'inline-block',
        padding: theme.spacing(1),
        width: 250,
        cursor: 'pointer',

        [theme.breakpoints.up('lg')]: {
          width: '20%',
        },

        '& .recommend-card': {
          height: 150,

          '& .recommend-card-content': {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',

            '& .recommend-article-title': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },

            '& .recommend-article-intro': {
              display: '-webkit-box',
              overflow: 'hidden',
              whiteSpace: 'break-spaces',
              textOverflow: 'ellipsis',
              '-webkit-box-orient': 'vertical',
              '-webkit-line-clamp': 3,
            },
          },
        },
      },
    },

    '& .footer': {
      backgroundColor: theme.palette.background.paper,
      height: 100,
      boxShadow: theme.shadows[4],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',

      '& .icon': {
        width: 20,
        height: 20,
        marginRight: theme.spacing(1),
      },
    },
  },
})();
