import React, { useState, useEffect } from 'react';
import {
  Card,
  Container,
  TextField,
  Button,
  Avatar,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
} from '@mui/material';
import {
  EmojiPeople as BasicInfoIcon,
  LanguageSharp as ThirdPartyIcon,
  Lock as AuthIcon,
} from '@mui/icons-material';
import {
  faWeixin,
  faQq,
} from '@fortawesome/free-brands-svg-icons';
import {
  faFont,
  faPhone,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useRouteMatch } from 'react-router-dom';

import Logo from '@/Assets/Images/Global/Logo.png';
import request from '@/Utils/Request';
import Loading from '@/ImperativeComponents/Loading';
import Message from '@/ImperativeComponents/Message';
import Dialog from '@/ImperativeComponents/Dialog';
import Upload from '@/Components/Upload';
import useUser, { UserProfile } from '@/Contexts/User';
import config from '@/Configs';
import api from '@/Apis';
import { websiteUrl } from '@/Apis/baseUrl';
import { AUTH_TYPE, AUTH_TYPE_NAME } from '@/Constants/authType';

import CredentialFormComponent from './Components/CredentialForm';
import CredentialComponent from './Components/Credential';
import ThirdPartyLoginComponent from './Components/ThirdPartyLogin';
import styles from './styles';
import { Credential, CredentialForm } from './types';

const index: React.FC = () => {
  const [profileLoading, setProfileLoading] = useState(false);
  const [credentialList, setCredentialList] = useState<Credential[]>([]);
  const profileForm = useForm<UserProfile>();
  const credentialForm = useForm<CredentialForm>();
  const { user, updateProfile } = useUser();
  const { path } = useRouteMatch();
  const code = (new URLSearchParams(useLocation().search)).get('code');
  const state = (new URLSearchParams(useLocation().search)).get('state');
  const theme = useTheme();
  const classes = styles(theme);

  const refreshCredentialList = () => {
    request.get(api.auth.credential.list).then((res) => {
      setCredentialList(res.data);
    });
  };

  const handleUpload = (event: UploadChangeEvent) => {
    const avatarFile = event.target.value;
    if (avatarFile) {
      const avatarLoading = new Loading();
      const form = new FormData();
      form.append('avatar', avatarFile as File);
      request.post(api.user.profile.uploadAvatar, form).then((res) => {
        avatarLoading.close();
        if (res.status === 200) {
          const { avatar } = res.data;
          const updatedProfile = {
            ...user?.profile,
            avatar,
          };
          updateProfile(updatedProfile);
          new Message({
            type: 'success',
            content: '更新头像成功',
          });
        } else {
          new Message({
            type: 'error',
            content: '更新头像失败',
          });
        }
      }).catch(() => {
        avatarLoading.close();
        new Message({
          type: 'error',
          content: '更新头像失败',
        });
      });
    }
  };

  const onProfileSubmit = (data: UserProfile) => {
    setProfileLoading(true);
    request.post(api.user.profile.update, data).then((res) => {
      setProfileLoading(false);
      if (res.status === 200) {
        const updatedProfile = {
          ...data,
          avatar: user?.profile.avatar,
        };
        updateProfile(updatedProfile);
        new Message({
          type: 'success',
          content: '修改成功',
        });
      } else {
        new Message({
          type: 'error',
          content: '修改失败',
        });
        profileForm.reset(user?.profile);
      }
    }).catch(() => {
      setProfileLoading(false);
      new Message({
        type: 'error',
        content: '修改失败',
      });
    });
  };

  const removeCredential = (authType: AUTH_TYPE) => {
    if (credentialList.length < 2) {
      new Message({
        type: 'warning',
        content: '不能移除唯一的登录凭据',
      });
      return;
    }
    new Dialog({
      title: '操作确认',
      content: `是否确认解绑${AUTH_TYPE_NAME[authType]}？`,
      onConfirm: () => {
        const loading = new Loading();
        request.post(api.auth.credential.remove, {
          authType,
        }).then((res) => {
          loading.close();
          if (res.status === 200) {
            new Message({
              type: 'success',
              content: `解绑${AUTH_TYPE_NAME[authType]}成功`,
            });
            setCredentialList(credentialList.filter((item) => item.authType !== authType));
          } else {
            new Message({
              type: 'error',
              content: `解绑${AUTH_TYPE_NAME[authType]}失败`,
            });
          }
        }).catch(() => {
          loading.close();
          new Message({
            type: 'error',
            content: `解绑${AUTH_TYPE_NAME[authType]}失败`,
          });
        });
      },
    });
  };

  const editCredential = (authType: AUTH_TYPE, originalCredential?: string) => {
    const dialog: Dialog = new Dialog({
      title: `${originalCredential ? '修改' : '添加'}${AUTH_TYPE_NAME[authType]}`,
      content: (
        <CredentialFormComponent
          form={credentialForm}
          authType={authType}
          requirePassword={
            credentialList.every((credential) => ![
              AUTH_TYPE.USERNAME,
              AUTH_TYPE.PHONE,
              AUTH_TYPE.EMAIL,
            ].includes(credential.authType))
          }
          requireVerificationCode={[AUTH_TYPE.PHONE, AUTH_TYPE.EMAIL].includes(authType)}
        />
      ),
      closeOnClick: false,
      onConfirm: async () => {
        const valid = await credentialForm.trigger();
        if (valid) {
          const formValues = credentialForm.getValues();
          if (formValues.password === formValues.confirmingPassword) {
            dialog.close();
            const loading = new Loading();
            request.post(
              api.auth.credential[originalCredential ? 'update' : 'add'],
              {
                ...credentialForm.getValues(),
                authType,
              },
            ).then((res) => {
              loading.close();
              if (res.status === 200) {
                new Message({
                  type: 'success',
                  content: `${originalCredential ? '修改' : '添加'}${AUTH_TYPE_NAME[authType]}成功`,
                });
                refreshCredentialList();
              } else {
                new Message({
                  type: 'error',
                  content: `${originalCredential ? '修改' : '添加'}${AUTH_TYPE_NAME[authType]}失败`,
                });
              }
            }).catch(() => {
              loading.close();
              new Message({
                type: 'error',
                content: `${originalCredential ? '修改' : '添加'}${AUTH_TYPE_NAME[authType]}失败`,
              });
            });
          } else {
            new Message({
              type: 'error',
              content: '两次输入的密码不一致',
            });
          }
        } else {
          new Message({
            type: 'error',
            content: '校验失败',
          });
        }
      },
      onCancel: () => dialog.close(),
    });
  };

  useEffect(() => {
    if (user) {
      profileForm.reset(user.profile);
      refreshCredentialList();
    }
  }, [user]);

  useEffect(() => {
    if (code) {
      const thirdPartyLoginLoading = new Loading();
      request.post(state === 'wechat' ? api.auth.wechat.connect : api.auth.qq.connect, {
        code,
        redirectUri: encodeURIComponent(`${websiteUrl}${path}`),
      }).then((res) => {
        thirdPartyLoginLoading.close();
        if (res.status === 200) {
          new Message({
            type: 'success',
            content: '绑定成功',
          });
          refreshCredentialList();
        } else {
          new Message({
            type: 'error',
            content: '绑定失败',
          });
        }
      }).catch(() => {
        thirdPartyLoginLoading.close();
        new Message({
          type: 'error',
          content: '绑定失败',
        });
      });
    }
  }, [code]);

  return (
    <div className={classes.root}>
      <div className="content-wrapper">
        <div className="avatar-wrapper">
          <Upload accept="image/*" className="avatar" onChange={handleUpload}>
            <img src={user?.profile?.avatar || Logo} className="avatar-image" />
            <div role="button" className="avatar-cover">上传头像</div>
          </Upload>
        </div>
        <Container maxWidth="md">
          <Card className="card">
            <CardHeader
              avatar={(
                <Avatar className="card-icon">
                  <BasicInfoIcon />
                </Avatar>
              )}
              title="基本信息"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <Divider />
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <Controller
                  name="nickname"
                  control={profileForm.control}
                  className="form-controller"
                  as={(
                    <TextField
                      label="昵称"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="intro"
                  control={profileForm.control}
                  className="form-controller"
                  as={(
                    <TextField
                      label="自我介绍"
                      rows={5}
                      multiline
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={profileLoading || !profileForm.formState.isDirty}
                  className="form-controller button"
                  fullWidth
                >
                  {profileLoading ? '提交中' : (profileForm.formState.isDirty ? '提交' : '暂无修改')}
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card className="card">
            <CardHeader
              avatar={(
                <Avatar className="card-icon">
                  <AuthIcon />
                </Avatar>
              )}
              title="凭证管理"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <Divider />
            <CardContent>
              {[
                {
                  authType: AUTH_TYPE.USERNAME,
                  authName: '用户名',
                  icon: faFont,
                },
                {
                  authType: AUTH_TYPE.PHONE,
                  authName: '手机号',
                  icon: faPhone,
                },
                {
                  authType: AUTH_TYPE.EMAIL,
                  authName: '电子邮箱',
                  icon: faEnvelope,
                },
              ].map((credential, credentialIndex) => (
                <>
                  {credentialIndex !== 0 && <Divider className="divider" />}
                  <CredentialComponent
                    authType={credential.authType}
                    authName={credential.authName}
                    icon={credential.icon}
                    credentialList={credentialList}
                    editCredential={editCredential}
                    removeCredential={removeCredential}
                  />
                </>
              ))}
            </CardContent>
          </Card>
          <Card className="card">
            <CardHeader
              avatar={(
                <Avatar className="card-icon">
                  <ThirdPartyIcon />
                </Avatar>
              )}
              title="第三方登录"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <Divider />
            <CardContent>
              {[
                {
                  authType: AUTH_TYPE.WECHAT,
                  authName: '微信',
                  authUrl:
                    `${
                      api.auth.wechatLoginGetCode
                    }&appid=${
                      config.wechatWebsite.appid
                    }&redirect_uri=${
                      encodeURIComponent(`${websiteUrl}${path}`)
                    }&state=wechat`,
                  icon: faWeixin,
                  color: '#1AAD19',
                },
                {
                  authType: AUTH_TYPE.QQ,
                  authName: 'QQ',
                  authUrl:
                    `${
                      api.auth.qqLoginGetCode
                    }&client_id=${
                      config.qqWebsite.appid
                    }&redirect_uri=${
                      encodeURIComponent(`${websiteUrl}${path}`)
                    }&state=qq${
                      navigator.userAgent.match(/(ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i)
                        ? '&display=mobile'
                        : ''
                    }`,
                  icon: faQq,
                  color: '#12B7F5',
                },
              ].map((credential, credentialIndex) => (
                <>
                  {credentialIndex !== 0 && <Divider className="divider" />}
                  <ThirdPartyLoginComponent
                    authType={credential.authType}
                    authName={credential.authName}
                    authUrl={credential.authUrl}
                    icon={credential.icon}
                    color={credential.color}
                    credentialList={credentialList}
                    removeCredential={removeCredential}
                  />
                </>
              ))}
            </CardContent>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default index;
