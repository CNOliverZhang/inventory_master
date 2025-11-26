import { alpha, Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,

    '& .media-list-wrapper': {
      width: '100%',
      height: 0,
      flexGrow: 1,
      position: 'relative',

      '& .media-list-container': {
        width: '100%',
        maxHeight: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        padding: theme.spacing(1),
        overflowY: 'auto',
        position: 'relative',

        '& .filter-panel-wrapper': {
          width: '100%',
          padding: theme.spacing(1),
          position: 'sticky',
          top: 0,
          zIndex: 1,

          '& .filter-panel': {
            width: '100%',

            '& .filter-panel-content': {
              display: 'block',

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

              '& .type-toggle-button': {
                marginRight: theme.spacing(1),
              },
            },
          },
        },

        '& .card-wrapper': {
          width: '100%',
          padding: theme.spacing(1),

          '& .card': {
            cursor: 'pointer',
            position: 'relative',

            '& .card-header-content': {
              width: 0,
            },

            '& .card-cover': {
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              transition: '0.3s',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',

              '& .selected-icon': {
                fontSize: theme.typography.h1.fontSize,
                color: theme.palette.primary.main,
                opacity: 0,
                transition: '0.3s',

                '&.active': {
                  opacity: 1,
                },
              },

              '&:hover': {
                backgroundColor: alpha(theme.palette.common.black, 0.5),
              },

              '&.active': {
                backgroundColor: alpha(theme.palette.common.black, 0.5),
              },
            },

            '& .media-thumbnail': {
              height: 0,
              paddingTop: '100%',
            },
          },
        },
      },

      '& .media-detail-mask': {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: alpha(theme.palette.common.black, 0.5),
        opacity: 0,
        transition: '0.3s',
        pointerEvents: 'none',
        zIndex: 2,

        '&.active': {
          opacity: 1,
          pointerEvents: 'all',
        },

        '& .media-detail': {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '100%',
          backgroundColor: theme.palette.background.default,
          overflowY: 'auto',

          '& .media-detail-header': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.spacing(2),
          },
        },
      },
    },

    '& .tool-bar': {
      width: '100%',
      position: 'sticky',
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',

      [theme.breakpoints.up('md')]: {
        flexDirection: 'row-reverse',
      },

      '& .action-buttons': {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(2),

        [theme.breakpoints.up('md')]: {
          width: 0,
          flexGrow: 1,
          maxWidth: 360,
          marginBottom: 0,
        },

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
    },
  },
})();
