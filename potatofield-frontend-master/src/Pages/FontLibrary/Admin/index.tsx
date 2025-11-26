import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  Avatar,
  Button,
  CardActions,
  IconButton,
  Container,
  Fab,
  useTheme,
} from '@mui/material';
import { MoreVert as MenuIcon, Add as AddIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import Loading from '@/ImperativeComponents/Loading';
import Message from '@/ImperativeComponents/Message';
import Dialog from '@/ImperativeComponents/Dialog';
import HeadBar from '@/Components/HeadBar';
import Empty from '@/Components/Empty';
import request from '@/Utils/Request';
import api from '@/Apis';

import FontFamilyFormComponent from './Components/FontFamilyForm';
import FontFormComponent from './Components/FontForm';
import styles from './styles';
import {
  FontStyle,
  Font,
  FontFamily,
  FontForm,
  FontFamilyForm,
  EditOptions,
} from '../types';

const index: React.FC = () => {
  const [fontFamilyList, setFontFamilyList] = useState<FontFamily[]>([]);
  const [fontStyleList, setFontStyleList] = useState<FontStyle[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const fontFamilyForm = useForm<FontFamilyForm>();
  const fontForm = useForm<FontForm>();
  const theme = useTheme();
  const classes = styles(theme);

  useEffect(() => {
    const loading = new Loading();
    request.get(api.fontLibrary.fontFamily.list, {
      params: searchKeyword ? {
        name: searchKeyword,
      } : undefined,
    }).then((res) => {
      loading.close();
      if (res.status === 200) {
        setFontFamilyList(res.data.list);
      } else {
        new Message({
          type: 'error',
          content: '获取字体失败',
        });
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: '获取字体失败',
      });
    });
  }, [searchKeyword]);

  useEffect(() => {
    request.get(api.fontLibrary.fontStyle.list).then((res) => {
      if (res.status === 200) {
        setFontStyleList(res.data.list);
      }
    });
  }, []);

  const refreshFontFamilyList = () => {
    request.get(api.fontLibrary.fontFamily.list, {
      params: searchKeyword ? {
        name: searchKeyword,
      } : undefined,
    }).then((getListRes) => {
      if (getListRes.status === 200) {
        setFontFamilyList(getListRes.data.list);
      }
    });
  };

  const editFontFamily = (values: FontFamilyForm, options: EditOptions = { create: false }) => {
    const loading = new Loading();
    request.post(api.fontLibrary.fontFamily[options.create ? 'add' : 'update'], values, {
      timeout: 10 * 60 * 1000,
    }).then((updateRes) => {
      loading.close();
      if (updateRes.status === 200) {
        new Message({
          type: 'success',
          content: `${options.create ? '添加' : '编辑'}字体族成功`,
        });
        refreshFontFamilyList();
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: `${options.create ? '添加' : '编辑'}字体族失败`,
      });
    });
  };

  const editFont = (values: FontForm, options: EditOptions = { create: false }) => {
    const loading = new Loading();
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });
    request.post(api.fontLibrary.font[options.create ? 'add' : 'update'], formData, {
      timeout: 10 * 60 * 1000,
    }).then((updateRes) => {
      loading.close();
      if (updateRes.status === 200) {
        new Message({
          type: 'success',
          content: `${options.create ? '添加' : '编辑'}字体成功`,
        });
        refreshFontFamilyList();
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: `${options.create ? '添加' : '编辑'}字体失败`,
      });
    });
  };

  const removeFontFamily = (fontFamily: FontFamily) => {
    new Dialog({
      title: '操作确认',
      content: `是否确认删除字体族“${fontFamily.name}”？`,
      onConfirm: () => {
        const loading = new Loading();
        request.post(api.fontLibrary.fontFamily.remove, {
          id: fontFamily.id,
        }).then((removeRes) => {
          loading.close();
          if (removeRes.status === 200) {
            new Message({
              type: 'success',
              content: '删除字体族成功',
            });
            refreshFontFamilyList();
          } else {
            new Message({
              type: 'error',
              content: '删除字体族失败',
            });
          }
        }).catch(() => {
          loading.close();
          new Message({
            type: 'error',
            content: '删除字体族失败',
          });
        });
      },
    });
  };

  const removeFont = (fontFamiy: FontFamily, font: Font) => {
    new Dialog({
      title: '操作确认',
      content: `是否确认删除字体“${fontFamiy.name}（${font.fontStyle.name}）”？`,
      onConfirm: () => {
        const loading = new Loading();
        request.post(api.fontLibrary.font.remove, {
          id: font.id,
        }).then((removeRes) => {
          loading.close();
          if (removeRes.status === 200) {
            new Message({
              type: 'success',
              content: '删除字体成功',
            });
            refreshFontFamilyList();
          } else {
            new Message({
              type: 'error',
              content: '删除字体失败',
            });
          }
        }).catch(() => {
          loading.close();
          new Message({
            type: 'error',
            content: '删除字体失败',
          });
        });
      },
    });
  };

  const showEditFontFamilyDialog = (fontFamily?: FontFamily) => {
    fontFamilyForm.reset(fontFamily || { name: undefined, language: undefined });
    const dialog: Dialog = new Dialog({
      title: `${fontFamily ? '编辑' : '添加'}字体族`,
      content: (
        <FontFamilyFormComponent fontFamilyForm={fontFamilyForm} />
      ),
      onConfirm: async () => {
        const valid = await fontFamilyForm.trigger();
        if (valid) {
          dialog.close();
          fontFamilyForm.handleSubmit((values) => editFontFamily(
            values,
            fontFamily ? undefined : { create: true },
          ))();
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
  };

  const showEditFontDialog = (fontFamily: FontFamily, font?: Font) => {
    fontForm.reset(
      font
        ? { id: font.id, fontStyleId: font.fontStyleId }
        : { fontFamilyId: fontFamily?.id, fontStyleId: fontStyleList.find((fontStyle) => fontStyle.name === '常规')?.id },
    );
    const dialog: Dialog = new Dialog({
      title: `${font ? `编辑“${fontFamily.name}（${font.fontStyle.name}）”` : `为“${fontFamily.name}”添加字体`}`,
      content: (
        <FontFormComponent fontForm={fontForm} fontStyleList={fontStyleList} />
      ),
      onConfirm: async () => {
        const valid = await fontForm.trigger();
        if (valid) {
          dialog.close();
          fontForm.handleSubmit((values) => editFont(
            values,
            font ? undefined : { create: true },
          ))();
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
  };

  const showEditFontsDialog = (fontFamily: FontFamily) => {
    const dialog: Dialog = new Dialog({
      title: fontFamily.name,
      content: (
        <div className={classes.fonts}>
          {fontFamily.fonts.map((font) => (
            <Card key={font.id} className="font">
              <img className="font-image" src={font.previewImage} />
              <CardActions className="font-actions">
                <div className="font-style">
                  字体样式：
                  {font.fontStyle.name}
                </div>
                <div className="buttons-wrapper">
                  <Button
                    color="primary"
                    className="button"
                    onClick={() => {
                      dialog.close();
                      showEditFontDialog(fontFamily, font);
                    }}
                  >
                    编辑
                  </Button>
                  <Button
                    color="primary"
                    className="button"
                    onClick={() => {
                      dialog.close();
                      removeFont(fontFamily, font);
                    }}
                  >
                    删除
                  </Button>
                </div>
              </CardActions>
            </Card>
          ))}
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => {
              dialog.close();
              showEditFontDialog(fontFamily);
            }}
          >
            添加字体
          </Button>
        </div>
      ),
      confirmText: '关闭',
      showCancel: false,
    });
  };

  return (
    <div className={classes.root}>
      <HeadBar
        title="字体库管理"
        searchText="搜索字体名称"
        onSearch={(keyword) => {
          setSearchKeyword(keyword);
        }}
        searchThrottle={500}
        changeTransparencyOnScroll={false}
      />
      <Container fixed maxWidth="xl" className="container">
        {fontFamilyList.length ? fontFamilyList.map((fontFamily) => (
          <div key={fontFamily.id} className="card-wrapper">
            <Card className={fontFamily.fonts.length === 0 ? 'empty-font' : undefined}>
              <CardHeader
                avatar={
                  <Avatar className="card-avatar">{fontFamily.language === 1 ? '中' : '英'}</Avatar>
                }
                title={fontFamily.name}
                titleTypographyProps={{ noWrap: true, variant: 'subtitle1' }}
                subheader={`共 ${fontFamily.fonts.length} 种样式可供下载`}
                classes={{ content: 'card-title' }}
                action={(
                  <IconButton onClick={() => showEditFontsDialog(fontFamily)} size="large">
                    <MenuIcon />
                  </IconButton>
                )}
              />
              {fontFamily.fonts.length !== 0 ? (
                <img className="card-media" src={fontFamily.fonts[0].previewImage} />
              ) : (
                <div className="add-font">
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    onClick={() => showEditFontDialog(fontFamily, undefined)}
                  >
                    添加字体
                  </Button>
                </div>
              )}
              <CardActions>
                <Button
                  color="primary"
                  onClick={() => showEditFontFamilyDialog(fontFamily)}
                >
                  编辑字体族
                </Button>
                <Button
                  color="primary"
                  onClick={() => removeFontFamily(fontFamily)}
                >
                  删除字体族
                </Button>
              </CardActions>
            </Card>
          </div>
        )) : (
          <Empty description="没有符合条件的字体" />
        )}
      </Container>
      <Fab
        color="primary"
        className="add-font-family"
        onClick={() => showEditFontFamilyDialog()}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default index;
