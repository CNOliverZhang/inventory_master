import React from 'react';
import {
  Grid,
  Chip,
  Button,
  Typography,
  useTheme,
} from '@mui/material';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AUTH_TYPE } from '@/Constants/authType';

import styles from './styles';
import { Credential } from '../../types';

interface CredentialComponentProps {
  authType: AUTH_TYPE;
  authName: string;
  icon: IconDefinition;
  credentialList: Credential[],
  removeCredential: (aythType: AUTH_TYPE) => void;
  editCredential: (authType: AUTH_TYPE, originalCredential?: string) => void
}

const credentialComponent: React.FC<CredentialComponentProps> = ({
  authType,
  authName,
  icon,
  credentialList,
  removeCredential,
  editCredential,
}) => {
  const theme = useTheme();
  const classes = styles(theme);
  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12} sm={3} className="auth-info-column">
        <div className="auth-logo credential">
          <FontAwesomeIcon icon={icon} />
        </div>
        <Typography variant="body1">{authName}</Typography>
      </Grid>
      <Grid item xs={12} sm={5} className="auth-info-column">
        {credentialList.find(
          (item) => item.authType === authType,
        ) ? (
          <Chip
            label={
              credentialList.find(
                (item) => item.authType === authType,
              )?.identifier
            }
            onDelete={() => {
              removeCredential(authType);
            }}
          />
          ) : (
            <Typography variant="body1" color="textSecondary">
              {`暂未添加${authName}`}
            </Typography>
          )}
      </Grid>
      {credentialList.find((item) => item.authType === authType) ? (
        <Grid item xs={12} sm={4} className="auth-info-column">
          <Button
            variant="contained"
            color="primary"
            className="button"
            onClick={() => {
              editCredential(
                authType,
                credentialList.find((item) => item.authType === authType)?.identifier,
              );
            }}
            fullWidth
          >
            修改
          </Button>
        </Grid>
      ) : (
        <Grid item xs={12} sm={4} className="auth-info-column">
          <Button
            variant="contained"
            color="primary"
            className="button"
            onClick={() => {
              editCredential(authType);
            }}
            fullWidth
          >
            添加
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default credentialComponent;
