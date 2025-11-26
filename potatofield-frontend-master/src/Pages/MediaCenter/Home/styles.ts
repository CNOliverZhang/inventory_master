import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (): Classes => createUseStyles({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',

    '& .container': {
      width: '100%',
      flexGrow: 1,
    },
  },
})();
