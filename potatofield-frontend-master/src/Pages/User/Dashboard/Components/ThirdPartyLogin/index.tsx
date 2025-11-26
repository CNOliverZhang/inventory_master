import React from 'react';
import {
  Grid,
  Button,
  Typography,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AUTH_TYPE } from '@/Constants/authType';

import styles from './styles';
import { Credential } from '../../types';

interface ThirdPartyLoginProps {
  authType: AUTH_TYPE;
  authName: string;
  icon: IconDefinition;
  authUrl: string,
  color: string,
  credentialList: Credential[],
  removeCredential: (aythType: AUTH_TYPE) => void;
}

const thirdPartyLoginComponent: React.FC<ThirdPartyLoginProps> = ({
  authType,
  authName,
  icon,
  authUrl,
  color,
  credentialList,
  removeCredential,
}) => {
  const theme = useTheme();
  const classes = styles(theme);
  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12} sm={4} className="auth-info-column">
        <div
          className="auth-logo"
          style={{
            backgroundColor: color,
          }}
        >
          <FontAwesomeIcon icon={icon} />
        </div>
        <Typography variant="body1">{`${authName}登录`}</Typography>
      </Grid>
      {credentialList.find((item) => item.authType === authType) ? (
        <>
          <Grid item xs={12} sm={4} className="auth-info-column">
            <Typography variant="body1" color="textSecondary">
              已绑定
            </Typography>
            <CheckIcon className="third-party-bound" />
          </Grid>
          <Grid item xs={12} sm={4} className="auth-info-column">
            <Button
              variant="contained"
              color="error"
              className="button"
              onClick={() => {
                removeCredential(authType);
              }}
              fullWidth
            >
              {`解绑${authName}`}
            </Button>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12} sm={4} className="auth-info-column">
            <Typography variant="body1" color="textSecondary">
              未绑定
            </Typography>
            <InfoIcon className="third-party-unbound" />
          </Grid>
          <Grid item xs={12} sm={4} className="auth-info-column">
            <Button
              variant="contained"
              color="primary"
              className="button"
              onClick={() => {
                window.location.href = authUrl;
              }}
              fullWidth
            >
              {`绑定${authName}`}
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default thirdPartyLoginComponent;
