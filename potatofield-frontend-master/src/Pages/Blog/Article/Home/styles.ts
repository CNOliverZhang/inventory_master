import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',

    '& .container': {
      width: '100%',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),

      '& .content-wrapper': {
        width: '100%',
        marginBottom: theme.spacing(2),

        [theme.breakpoints.up('sm')]: {
          display: 'flex',
          flexDirection: 'row-reverse',
        },

        '& .article-list': {
          height: 'fit-content',
          flexGrow: 1,

          [theme.breakpoints.up('sm')]: {
            width: 0,
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

              [theme.breakpoints.down('md')]: {
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',

                '& .article-title-text': {
                  width: 0,
                  flexGrow: 1,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                },

                '& .tags-container': {
                  display: 'flex',

                  '& .article-title-tag': {
                    marginLeft: theme.spacing(1),
                  },
                },
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

        '& .filters': {
          height: 'fit-content',
          flexShrink: 0,

          [theme.breakpoints.only('xs')]: {
            marginBottom: theme.spacing(2),
          },

          [theme.breakpoints.up('sm')]: {
            width: 240,
            marginLeft: theme.spacing(2),
          },

          [theme.breakpoints.up('md')]: {
            width: 320,
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

          '& .tags-container': {
            display: 'flex',
            flexWrap: 'wrap',
            margin: theme.spacing(-0.5),

            '& .tag': {
              margin: theme.spacing(0.5),
            },
          },

          '& .tag-select': {
            marginTop: theme.spacing(2),
            display: 'flex',
          },
        },
      },
    },
  },
})();
