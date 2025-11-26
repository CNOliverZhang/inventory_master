import { Theme, alpha } from '@mui/material/styles';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

import links from './Constants/links';

export default (theme: Theme): Classes => createUseStyles({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '& .content-wrapper': {
      width: '100%',
      height: 0,
      flexGrow: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: `min(calc(20% / ${links.length}), ${theme.spacing(2)})`,

      '& .info-wrapper': {
        width: 800,
        maxWidth: '80%',
        flexGrow: 1,
        margin: theme.spacing(6),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        '& .info': {
          width: '100%',
          height: '100%',
          maxHeight: 'min(100vw, 600px)',
          display: 'flex',
          flexDirection: 'column',

          '& .info-background': {
            height: 0,
            flexGrow: 1,

            '& .info-cover': {
              width: '100%',
              height: '100%',
              backgroundColor: alpha(theme.palette.common.black, 0.7),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: '0.2s',

              '& .text': {
                position: 'relative',
                padding: '2em',
                borderWidth: 5,
                borderStyle: 'solid',
                transition: '0.3s',
                cursor: 'pointer',
                filter: 'brightness(1)',

                '&:hover': {
                  filter: 'brightness(10)',
                },
              },

              '&:hover': {
                backgroundColor: alpha(theme.palette.common.black, 0.5),
              },
            },
          },
        },
      },

      '& .dock-wrapper': {
        width: '100%',
        display: 'flex',

        '& .upholder': {
          height: 0,
          paddingBottom: `min(calc(120% / (${links.length - 1} * (1 + 0.1) + (0.1 + 0.1 + 1.2))), 120px)`,
        },

        '& .dock': {
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',

          '& .link': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: `min(calc(10% / ${links.length}), ${theme.spacing(1)})`,
            marginRight: `min(calc(10% / ${links.length}), ${theme.spacing(1)})`,
            borderRadius: '20%',
            transition: '0.2s',
            color: theme.palette.primary.contrastText,

            '& svg': {
              width: '60%',
              height: '60%',
              fontSize: 'inherit',
            },

            '& .upholder': {
              height: 0,
              paddingBottom: '100%',
            },

            '&:first-child': {
              marginLeft: 0,
            },

            '&:last-child': {
              marginRight: 0,
            },
          },

          '& .active': {
            width: 120,
            maxWidth: `calc(120% / (${links.length - 1} * (1 + 0.1) + (0.1 + 0.1 + 1.2)))`,
          },

          '& .inactive': {
            width: 100,
            maxWidth: `calc(100% / (${links.length - 1} * (1 + 0.1) + (0.1 + 0.1 + 1.2)))`,
          },
        },
      },
    },

    '& .code': {
      overflow: 'hidden',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      transition: '0.3s',

      '& a': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        textDecoration: 'none',
        color: 'inherit',
        transition: '0.3s',

        '&:hover': {
          color: theme.palette.primary.main,
        },

        '&:first-child': {
          marginTop: 0,
        },

        '&:last-child': {
          marginBottom: 0,
        },
      },
    },
  },
})();
