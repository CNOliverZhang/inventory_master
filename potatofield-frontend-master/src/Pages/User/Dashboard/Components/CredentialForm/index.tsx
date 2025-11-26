import React, { useEffect, useState } from 'react';
import { Controller, UseFormMethods } from 'react-hook-form';
import {
  Button,
  TextField,
  useTheme,
} from '@mui/material';

import Message from '@/ImperativeComponents/Message';
import request from '@/Utils/Request';
import api from '@/Apis';
import config from '@/Configs';
import { AUTH_TYPE, AUTH_TYPE_NAME } from '@/Constants/authType';

import { CredentialForm } from '../../types';
import styles from './styles';

interface CredentialFormProps {
  form: UseFormMethods<CredentialForm>;
  authType: AUTH_TYPE;
  requirePassword?: boolean;
  requireVerificationCode?: boolean;
}

const credentialFormComponent: React.FC<CredentialFormProps> = ({
  form,
  authType,
  requirePassword = false,
  requireVerificationCode = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const theme = useTheme();
  const classes = styles(theme);

  useEffect(() => {
    window.vaptcha({
      vid: config.vaptcha.vid,
      type: 'invisible',
      scene: 0,
    }).then((vaptchaObj) => {
      window.vaptchaObject = vaptchaObj;
      vaptchaObj.listen('pass', () => {
        setLoading(true);
        const { server, token } = vaptchaObj.getServerToken();
        request.post(
          api.auth.verify[authType === AUTH_TYPE.PHONE ? 'phone' : 'email'],
          {
            identifier: form.getValues().identifier,
            token,
            server,
          },
        ).then((res) => {
          setLoading(false);
          if (res.status === 200) {
            setCountDown(60);
          } else {
            new Message({
              type: 'error',
              content: '发送验证码失败，请重试',
            });
          }
        }).catch(() => {
          setLoading(false);
          new Message({
            type: 'error',
            content: '发送验证码失败，请重试',
          });
        });
      });
    });
  }, []);

  useEffect(() => {
    if (countDown) {
      setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000);
    }
  }, [countDown]);

  return (
    <form className={classes.root}>
      <Controller
        name="identifier"
        control={form.control}
        rules={{ required: true }}
        defaultValue=""
        className="form-controller"
        as={(
          <TextField
            label={AUTH_TYPE_NAME[authType]}
            required
            fullWidth
          />
        )}
      />
      {requirePassword && (
        <>
          <Controller
            name="password"
            control={form.control}
            rules={{ required: true }}
            defaultValue=""
            className="form-controller"
            as={(
              <TextField
                label="密码"
                type="password"
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="confirmingPassword"
            control={form.control}
            rules={{ required: true }}
            defaultValue=""
            className="form-controller"
            as={(
              <TextField
                label="确认密码"
                type="password"
                required
                fullWidth
              />
            )}
          />
        </>
      )}
      {requireVerificationCode && (
        <>
          <Button
            variant="contained"
            color="primary"
            className="form-controller"
            disabled={loading || Boolean(countDown)}
            onClick={() => {
              if (!form.getValues().identifier?.match(
                authType === AUTH_TYPE.PHONE
                  ? /1[0-9]{10}/g
                  : /.+@.+\.[a-zA-Z]/g,
              )) {
                new Message({
                  type: 'warning',
                  content: `请填写正确的${AUTH_TYPE_NAME[authType]}`,
                });
              } else {
                window.vaptchaObject.validate();
              }
            }}
            fullWidth
          >
            {countDown ? `${countDown} 秒后可以重新发送` : (loading ? '发送中' : '发送验证码')}
          </Button>
          <Controller
            name="verificationCode"
            control={form.control}
            rules={{ required: true }}
            defaultValue=""
            className="form-controller"
            as={(
              <TextField
                label="验证码"
                fullWidth
              />
            )}
          />
        </>
      )}
    </form>
  );
};

export default credentialFormComponent;
