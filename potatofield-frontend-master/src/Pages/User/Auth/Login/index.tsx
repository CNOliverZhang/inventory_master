import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  TextField,
  Switch,
  Typography,
  CircularProgress,
  MenuList,
  MenuItem,
  FormLabel,
  useTheme,
} from '@mui/material';

import Message from '@/ImperativeComponents/Message';
import Dialog from '@/ImperativeComponents/Dialog';
import DropdownPanel from '@/Components/DropdownPanel';
import useUser from '@/Contexts/User';
import request from '@/Utils/Request';
import config from '@/Configs';
import api from '@/Apis';
import { websiteUrl } from '@/Apis/baseUrl';

import styles from './styles';

interface LoginForm {
  identifier: string,
  password: string,
  keepAuthenticated: boolean,
}

const index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const form = useForm<LoginForm>();
  const { login } = useUser();
  const { path } = useRouteMatch();
  const code = (new URLSearchParams(useLocation().search)).get('code');
  const state = (new URLSearchParams(useLocation().search)).get('state');
  const theme = useTheme();
  const classes = styles(theme);

  const switchToRegister = () => {
    history.push('/user/auth/register');
  };

  const onSubmit = (data: LoginForm) => {
    const params = { identifier: data.identifier, password: data.password };
    setLoading(true);
    request.post(api.auth.user.login, params).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        login({
          user: res.data.user,
          keepAuthenticated: data.keepAuthenticated,
          token: res.data.token,
        });
        new Message({
          type: 'success',
          content: '登录成功',
        });
      } else {
        new Message({
          type: 'error',
          content: '登录失败',
        });
      }
    }).catch(() => {
      setLoading(false);
      new Message({
        type: 'error',
        content: '登录失败',
      });
    });
  };

  useEffect(() => {
    if (code) {
      request.post(state === 'wechat' ? api.auth.wechat.login : api.auth.qq.login, {
        code,
        redirectUri: encodeURIComponent(`${websiteUrl}${path}`),
      }).then((res) => {
        if (res.status === 200) {
          if (res.data.success) {
            new Dialog({
              title: '登录成功',
              content: '您已成功使用第三方登录。是否需要记住密码？',
              confirmText: '是',
              cancelText: '否',
              onConfirm: () => {
                login({
                  user: res.data.user,
                  keepAuthenticated: true,
                  token: res.data.token,
                });
              },
              onCancel: () => {
                login({
                  user: res.data.user,
                  keepAuthenticated: false,
                  token: res.data.token,
                });
              },
            });
          } else {
            const { accessToken, openId, unionId } = res.data;
            const dialog = new Dialog({
              title: '提示',
              content: `该第三方账号尚未绑定本站账号，您可以选择绑定已有账号或使用该${state === 'wechat' ? '微信' : 'QQ'}注册新账号。`,
              confirmText: '绑定已有账号',
              cancelText: '注册新账号',
              closeOnClick: false,
              onConfirm: () => {
                dialog.change({
                  title: '使用已有的账号密码登录',
                  content: (
                    <form className={classes.login}>
                      <Controller
                        name="identifier"
                        control={form.control}
                        defaultValue=""
                        className="form-controller"
                        as={(
                          <TextField
                            label="用户名或手机号码或邮箱"
                            required
                            fullWidth
                          />
                          )}
                      />
                      <Controller
                        name="password"
                        control={form.control}
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
                        name="keepAuthenticated"
                        control={form.control}
                        render={({ value, onChange }) => (
                          <div>
                            <FormLabel>记住密码</FormLabel>
                            <Switch
                              defaultChecked={false}
                              onChange={(e) => onChange(e.target.checked)}
                              checked={value}
                              color="primary"
                            />
                          </div>
                        )}
                      />
                    </form>
                  ),
                  onConfirm: async () => {
                    const valid = await form.trigger();
                    if (valid) {
                      dialog.close();
                      form.handleSubmit((values) => {
                        const params = {
                          unionId,
                          accessToken,
                          identifier: values.identifier,
                          password: values.password,
                        };
                        request.post(
                          state === 'wechat' ? api.auth.wechat.loginAndConnect : api.auth.qq.loginAndConnect,
                          params,
                        ).then((loginRes) => {
                          if (loginRes.status === 200) {
                            login({
                              user: loginRes.data.user,
                              keepAuthenticated: values.keepAuthenticated,
                              token: loginRes.data.token,
                            });
                            new Message({
                              type: 'success',
                              content: '登录成功',
                            });
                          } else {
                            new Message({
                              type: 'error',
                              content: '登录失败',
                            });
                          }
                        }).catch(() => {
                          new Message({
                            type: 'error',
                            content: '登录失败',
                          });
                        });
                      })();
                    } else {
                      new Message({
                        type: 'error',
                        content: '校验失败',
                      });
                    }
                  },
                  onCancel: () => dialog.close(),
                  closeOnClick: false,
                });
              },
              onCancel: () => {
                request.post(state === 'wechat' ? api.auth.wechat.register : api.auth.qq.register, {
                  openId,
                  unionId,
                  accessToken,
                }).then((registerRes) => {
                  dialog.change({
                    title: '注册成功',
                    content: '您已成功使用第三方注册并登录。是否需要记住密码？',
                    confirmText: '是',
                    cancelText: '否',
                    onConfirm: () => {
                      dialog.close();
                      login({
                        user: registerRes.data.user,
                        keepAuthenticated: true,
                        token: registerRes.data.token,
                      });
                    },
                    onCancel: () => {
                      dialog.close();
                      login({
                        user: registerRes.data.user,
                        keepAuthenticated: false,
                        token: registerRes.data.token,
                      });
                    },
                  });
                }).catch(() => {
                  new Message({
                    type: 'error',
                    content: '注册失败',
                  });
                });
              },
            });
          }
        } else {
          new Message({
            type: 'error',
            content: '登录失败',
          });
        }
      }).catch(() => {
        new Message({
          type: 'error',
          content: '登录失败',
        });
        setTimeout(() => {
          history.replace('/user/auth/login');
        }, 1000);
      });
    }
  }, [code]);

  if (code) {
    return (
      <div className={classes.loading}>
        <CircularProgress color="primary" />
        <Typography className="info" variant="h6">
          第三方登录中
        </Typography>
      </div>
    );
  }
  return (
    <form className={classes.login} onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="identifier"
        control={form.control}
        defaultValue=""
        className="form-controller"
        as={(
          <TextField
            label="用户名或手机号码或邮箱"
            required
            fullWidth
          />
          )}
      />
      <Controller
        name="password"
        control={form.control}
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
        name="keepAuthenticated"
        control={form.control}
        render={({ value, onChange }) => (
          <div>
            <FormLabel>记住密码</FormLabel>
            <Switch
              defaultChecked={false}
              onChange={(e) => onChange(e.target.checked)}
              checked={value}
              color="primary"
            />
          </div>
        )}
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={loading}
        className="form-controller"
        fullWidth
      >
        {loading ? '登录中' : '登录'}
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
                  encodeURIComponent(`${websiteUrl}${path}`)
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
                  encodeURIComponent(`${websiteUrl}${path}`)
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
          onClick={switchToRegister}
        >
          切换到注册
        </Button>
      </div>
    </form>
  );
};

export default index;
