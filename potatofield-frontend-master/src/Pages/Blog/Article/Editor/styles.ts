import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',

    '& .page-wrapper': {
      width: '100%',
      height: 0,
      flexGrow: 1,
      position: 'relative',

      '& .editor-container': {
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),

        '& .form': {
          width: '100%',
          height: 'fit-content',
          flexGrow: 1,

          [theme.breakpoints.up('sm')]: {
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
          },

          '& .options-card': {
            height: 'fit-content',
            flexShrink: 0,

            [theme.breakpoints.only('xs')]: {
              marginTop: theme.spacing(2),
            },

            [theme.breakpoints.up('sm')]: {
              width: 240,
              marginLeft: theme.spacing(2),
              maxHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
            },

            [theme.breakpoints.up('md')]: {
              width: 320,
            },

            '& .card-icon': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },

            '& .options-container': {
              height: 'fit-content',
              maxHeight: '100%',
              flexShrink: 1,
              overflow: 'auto',

              '& .options-wrapper': {

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

                '& .tag-buttons': {
                  marginTop: theme.spacing(2),
                },

                '& .cover-image': {
                  width: '100%',
                  borderRadius: theme.shape.borderRadius,
                  overflow: 'hidden',
                  marginTop: theme.spacing(1),
                },
              },
            },

            '& .action-buttons': {
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',

              '& .action-button': {
                width: 0,
                flexGrow: 1,
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),

                '&:first-child': {
                  marginLeft: 0,
                },

                '&:last-child': {
                  marginRight: 0,
                },
              },
            },

            '& .additional-button': {
              marginTop: theme.spacing(2),
            },
          },

          '& .editor-wrapper': {
            display: 'flex',
            flexDirection: 'column',

            [theme.breakpoints.only('xs')]: {
              height: '80vh',
              minHeight: '120vw',
            },

            [theme.breakpoints.up('sm')]: {
              width: 0,
              flexGrow: 1,
            },

            '& .editor': {
              height: 0,
              flexGrow: 1,
              marginTop: theme.spacing(1),
            },
          },

          '& .form-controller': {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),

            '&:first-child': {
              marginTop: 0,
            },

            '&:last-child': {
              marginBottom: 0,
            },
          },
        },
      },

      '& .media-center-wrapper': {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1,
        transition: '0.3s',
        display: 'flex',
        flexDirection: 'column',

        '& .title': {
          flexGrow: 1,
        },

        '& .media-center': {
          height: 0,
          flexGrow: 1,
        },
      },
    },
  },
})();
