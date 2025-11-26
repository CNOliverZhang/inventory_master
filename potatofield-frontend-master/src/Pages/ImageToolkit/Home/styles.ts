import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',

    '& .pages-wrapper': {
      width: '100%',
      height: '100%',
      position: 'absolute',
      transition: '0.3s',
      backgroundColor: theme.palette.background.default,

      '& .page': {
        width: '100%',
        height: '100%',
      },

      '& .header': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        '& .logo': {
          width: 200,

          [theme.breakpoints.up('md')]: {
            width: 300,
          },
        },

        '& .title': {
          fontSize: '2rem',
          margin: theme.spacing(4),

          [theme.breakpoints.up('md')]: {
            fontSize: '3rem',
          },
        },

        '& .intro': {
          fontSize: '1rem',

          [theme.breakpoints.up('md')]: {
            fontSize: '1.5rem',
          },
        },

        '& .actions': {
          display: 'flex',
          flexDirection: 'column',
          marginTop: theme.spacing(4),

          [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
          },

          '& .action': {
            width: 200,
            borderRadius: 21,

            [theme.breakpoints.down('md')]: {
              marginTop: theme.spacing(2),
              marginBottom: theme.spacing(2),

              '&:first-child': {
                marginTop: 0,
              },

              '&:last-child': {
                marginBottom: 0,
              },
            },

            [theme.breakpoints.up('md')]: {
              marginLeft: theme.spacing(2),
              marginRight: theme.spacing(2),

              '&:first-child': {
                marginLeft: 0,
              },

              '&:last-child': {
                marginRight: 0,
              },
            },
          },
        },
      },

      '& .content-wrapper': {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',

        '& .content': {
          height: 0,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',

          '& .title': {
            width: '100%',
            fontSize: '2rem',

            [theme.breakpoints.up('md')]: {
              fontSize: '3rem',
              textAlign: 'center',
            },
          },

          '& .tool-info': {
            display: 'flex',
            flexDirection: 'column',
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4),
            height: 0,
            flexGrow: 1,

            [theme.breakpoints.up('md')]: {
              flexDirection: 'row',
              alignItems: 'center',
            },

            '& .tool-intro': {
              fontSize: '1rem',
              textAlign: 'justify',
              textIndent: '2em',

              [theme.breakpoints.down('md')]: {
                marginBottom: theme.spacing(4),
              },

              [theme.breakpoints.up('md')]: {
                fontSize: '1.5rem',
              },
            },

            '& .tool-image-wrapper': {
              maxWidth: 'min(500px, 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',

              [theme.breakpoints.down('md')]: {
                height: 0,
                flexGrow: 1,
                marginLeft: 'auto',
                marginRight: 'auto',
              },

              [theme.breakpoints.up('md')]: {
                alignSelf: 'stretch',
                marginLeft: theme.spacing(4),
              },

              '& .tool-image': {
                maxHeight: '100%',

                [theme.breakpoints.down('md')]: {
                  maxWidth: '100%',
                },
              },
            },
          },

          '& .latest-version-card-wrapper': {
            display: 'flex',
            flexDirection: 'column',
            height: 0,
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',

            '& .latest-version-card': {
              width: 320,

              '& .card-image': {
                width: '100%',
              },
            },
          },

          '& .actions': {
            display: 'flex',
            flexDirection: 'row',

            [theme.breakpoints.down('md')]: {
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: 320,
            },

            '& .action': {
              borderRadius: 21,

              '&:not(.download)': {
                [theme.breakpoints.down('md')]: {
                  width: `calc(50% - ${theme.spacing(1)})`,
                },
              },

              [theme.breakpoints.up('md')]: {
                width: 150,
                marginLeft: theme.spacing(2),
                marginRight: theme.spacing(2),

                '&:first-child': {
                  marginLeft: 0,
                },

                '&:last-child': {
                  marginRight: 0,
                },
              },
            },

            '& .download': {
              [theme.breakpoints.down('md')]: {
                marginTop: theme.spacing(2),
                width: '100%',
              },
            },
          },
        },
      },
    },
  },

  popover: {
    width: 300,
    padding: theme.spacing(1),
    paddingBottom: 0,

    '& img': {
      width: '100%',
    },
  },
})();
