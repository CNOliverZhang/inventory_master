import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  MenuItem,
  MenuList,
  TextField,
  useTheme,
} from '@mui/material';

import Message from '@/ImperativeComponents/Message';
import request from '@/Utils/Request';
import api from '@/Apis';
import config from '@/Configs';
import { AUTH_TYPE, AUTH_TYPE_NAME } from '@/Constants/authType';
import DropdownPanel from '@/Components/DropdownPanel';
import { websiteUrl } from '@/Apis/baseUrl';

import styles from './styles';

interface LoginForm {
  authType: AUTH_TYPE;
  identifier: string,
  password: string,
  comfirmingPassword: string;
  verificationCode: string;
}

const index: React.FC = () => {
  const [vaptchaLoading, setVaptchaLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const form = useForm<LoginForm>();
  const history = useHistory();
  const theme = useTheme();
  const classes = styles(theme);

  const switchToLogin = () => {
    history.push('/user/auth/login');
  };

  const onSubmit = (data: LoginForm) => {
    if (data.password !== data.comfirmingPassword) {
      new Message({
        type: 'error',
        content: '两次输入的密码不一致',
      });
    } else {
      setRegisterLoading(true);
      request.post(api.auth.user.register, data).then((res) => {
        setRegisterLoading(false);
        if (res.status === 200) {
          new Message({
            type: 'success',
            content: '注册成功，请登录',
          });
          switchToLogin();
        } else {
          new Message({
            type: 'error',
            content: '注册失败',
          });
        }
      }).catch(() => {
        setRegisterLoading(false);
        new Message({
          type: 'error',
          content: '注册失败',
        });
      });
    }
  };

  useEffect(() => {
    window.vaptcha({
      vid: config.vaptcha.vid,
      type: 'invisible',
      scene: 0,
    }).then((vaptchaObj) => {
      window.vaptchaObject = vaptchaObj;
      vaptchaObj.listen('pass', () => {
        setVaptchaLoading(true);
        const { authType, identifier } = form.getValues();
        const { server, token } = vaptchaObj.getServerToken();
        request.post(
          api.auth.verify[authType === AUTH_TYPE.PHONE ? 'phone' : 'email'],
          {
            identifier,
            token,
            server,
          },
        ).then((res) => {
          setVaptchaLoading(false);
          if (res.status === 200) {
            setCountDown(60);
          } else {
            new Message({
              type: 'error',
              content: '发送验证码失败，请重试',
            });
          }
        }).catch(() => {
          setVaptchaLoading(false);
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
    <form className={classes.root} onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="authType"
        control={form.control}
        rules={{ required: true }}
        defaultValue={AUTH_TYPE.PHONE}
        className="form-controller"
        as={(
          <TextField
            select
            label="选择注册验证方式"
            required
            fullWidth
          >
            <MenuItem value={AUTH_TYPE.PHONE}>{AUTH_TYPE_NAME[AUTH_TYPE.PHONE]}</MenuItem>
            <MenuItem value={AUTH_TYPE.EMAIL}>{AUTH_TYPE_NAME[AUTH_TYPE.EMAIL]}</MenuItem>
          </TextField>
        )}
      />
      <Controller
        name="identifier"
        control={form.control}
        rules={{ required: true }}
        defaultValue=""
        className="form-controller"
        as={(
          <TextField
            label={AUTH_TYPE_NAME[form.watch('authType')]}
            required
            fullWidth
          />
        )}
      />
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
        name="comfirmingPassword"
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
      <Button
        variant="contained"
        color="primary"
        disabled={vaptchaLoading || Boolean(countDown)}
        className="form-controller"
        onClick={() => {
          const { authType, identifier } = form.getValues();
          if (!identifier?.match(
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
        {countDown ? `${countDown} 秒后可以重新发送` : (vaptchaLoading ? '发送中' : '发送验证码')}
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
            required
            fullWidth
          />
        )}
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        className="form-controller"
        disabled={registerLoading}
        fullWidth
      >
        注册
      </Button>
      <div className="form-controller extra-buttons">
        <DropdownPanel
          dropdownElement={(
            <Button color="primary">
              第三方登录
            </Button>
          )}
        >
          <MenuList>
            <MenuItem
              onClick={() => {
                window.location.href = `${
                  api.auth.wechatLoginGetCode
                }&appid=${
                  config.wechatWebsite.appid
                }&redirect_uri=${
                  encodeURIComponent(`${websiteUrl}/user/auth/login`)
                }&state=wechat`;
              }}
            >
              微信登录
            </MenuItem>
            <MenuItem
              onClick={() => {
                window.location.href = `${
                  api.auth.qqLoginGetCode
                }&client_id=${
                  config.qqWebsite.appid
                }&redirect_uri=${
                  encodeURIComponent(`${websiteUrl}/user/auth/login`)
                }&state=qq${
                  navigator.userAgent.match(/(ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i)
                    ? '&display=mobile'
                    : ''
                }`;
              }}
            >
              QQ 登录
            </MenuItem>
          </MenuList>
        </DropdownPanel>
        <Button
          color="primary"
          onClick={switchToLogin}
        >
          切换到登录
        </Button>
      </div>
    </form>
  );
};

export default index;
