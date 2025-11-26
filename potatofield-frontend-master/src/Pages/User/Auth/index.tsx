import {
  Container,
  Paper,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import React from 'react';

import Logo from '@/Assets/Images/Global/Logo.png';

import styles from './styles';

const index: React.FC = ({ children }) => {
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <div className={classes.root}>
      <Container maxWidth="xs" className="auth-wrapper">
        <Card className="auth">
          <Paper className="icon-wrapper">
            <img className="icon" src={Logo} alt="" />
          </Paper>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default index;
