import React, { useEffect, useState } from 'react';
import Vditor from 'vditor';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Switch,
  TextField,
  Typography,
  Autocomplete,
  IconButton,
  Toolbar,
  Paper,
  FormLabel,
  useTheme,
} from '@mui/material';
import {
  Description as BlogArticleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { DateTimePicker, LocalizationProvider, zhCN } from '@mui/x-date-pickers';
import { useLocation, useHistory } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';
import hljs from 'highlight.js';
import momentAdapter from '@date-io/moment';

import HeadBar from '@/Components/HeadBar';
import TreeSelect from '@/Components/TreeSelect';
import MediaCenter from '@/Components/MediaCenter';
import Message from '@/ImperativeComponents/Message';
import Loading from '@/ImperativeComponents/Loading';
import Dialog from '@/ImperativeComponents/Dialog';
import request from '@/Utils/Request';
import useThemeContext from '@/Contexts/Theme';
import api from '@/Apis';
import { cosUrl } from '@/Apis/baseUrl';
import { MediaFile } from '@/Components/MediaCenter/types';
import { MIME_TYPE } from '@/Constants/mimeType';

import styles from './styles';
import { BlogArticle, BlogArticleForm } from '../types';
import { BlogArticleTag, Category } from '../../types';
import SvgStrings from './Constants/SvgStrings';

const index: React.FC = () => {
  const [id, setId] = useState((new URLSearchParams(useLocation().search)).get('id'));
  const [editor, setEditor] = useState<Vditor>();
  // 标签相关
  const [tagList, setTagList] = useState<BlogArticleTag[]>([]);
  const [articleTagList, setArticleTagList] = useState<BlogArticleTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<BlogArticleTag>();
  const [tagText, setTagText] = useState('');
  // 分类树
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  // 文章初始状态
  const [article, setArticle] = useState<BlogArticle>();
  // 媒体库相关
  const [onSelect, setOnSelect] = useState<(file: MediaFile) => void>();
  const [selectButtonText, setSelectButtonText] = useState<string>();
  const [allowedMimeTypes, setAllowedMimeTypes] = useState<MIME_TYPE[]>();

  const articleForm = useForm<BlogArticleForm>();
  const history = useHistory();
  const { getDarkMode } = useThemeContext();
  const theme = useTheme();
  const classes = styles(theme);

  const getTagList = () => {
    request.get(api.blog.tag.list).then((res) => {
      if (res.status === 200) {
        setTagList(res.data.list);
      } else {
        new Message({
          type: 'error',
          content: '获取博客文章标签列表失败',
        });
      }
    }).catch(() => {
      new Message({
        type: 'error',
        content: '获取博客文章标签列表失败',
      });
    });
  };

  const getArticleTagList = () => {
    request.get(api.blog.article.getTags, {
      params: { id },
    }).then((res) => {
      if (res.status === 200) {
        setArticleTagList(res.data.tags);
      } else {
        new Message({
          type: 'error',
          content: '获取博客文章标签列表失败',
        });
      }
    }).catch(() => {
      new Message({
        type: 'error',
        content: '获取博客文章标签列表失败',
      });
    });
  };

  const getCategoryTree = () => {
    request.get(api.blog.category.getTree).then((res) => {
      if (res.status === 200) {
        setCategoryTree(res.data);
      } else {
        new Message({
          type: 'error',
          content: '获取分类树失败',
        });
      }
    }).catch(() => {
      new Message({
        type: 'error',
        content: '获取分类树失败',
      });
    });
  };

  const getArticle = () => {
    const loading = new Loading();
    request.get(api.blog.article.detail, {
      params: {
        id,
      },
    }).then((res) => {
      loading.close();
      if (res.status === 200) {
        setArticle(res.data);
      } else {
        new Message({
          type: 'error',
          content: '获取博客文章失败',
        });
        history.replace('/blog/article/editor');
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: '获取博客文章失败',
      });
      history.replace('/blog/article/editor');
    });
  };

  const removeArticle = () => {
    new Dialog({
      title: '操作确认',
      content: `是否确认删除文章《${article?.title}》？`,
      onConfirm: () => {
        const loading = new Loading();
        request.post(api.blog.article.remove, {
          id,
        }).then((res) => {
          loading.close();
          if (res.status === 200) {
            new Message({
              type: 'success',
              content: '删除文章成功',
            });
            history.push('/blog/article');
          } else {
            new Message({
              type: 'error',
              content: '删除文章失败',
            });
          }
        }).catch(() => {
          loading.close();
          new Message({
            type: 'error',
            content: '删除文章失败',
          });
        });
      },
    });
  };

  const removeTagFromArticle = (tag: BlogArticleTag) => {
    new Dialog({
      title: '操作确认',
      content: `是否确认删除标签“${tag.name}”？`,
      onConfirm: () => {
        const loading = new Loading();
        request.post(api.blog.article.removeTag, {
          id,
          tagId: tag.id,
        }).then((res) => {
          loading.close();
          if (res.status === 200) {
            new Message({
              type: 'success',
              content: '删除标签成功',
            });
            getArticleTagList();
          } else {
            new Message({
              type: 'error',
              content: '删除标签失败',
            });
          }
        }).catch(() => {
          loading.close();
          new Message({
            type: 'error',
            content: '删除标签失败',
          });
        });
      },
    });
  };

  const addTagToArticle = () => {
    if (articleTagList.find((tag) => tag.name === (tagText || selectedTag?.name))) {
      new Message({
        type: 'warning',
        content: '已存在这个标签',
      });
      return;
    }
    const loading = new Loading();
    const inputTag = tagList.find((tag) => tag.name === tagText);
    const targetTag = selectedTag || inputTag;
    if (targetTag) {
      request.post(api.blog.article.addTag, {
        id,
        tagId: targetTag.id,
      }).then((res) => {
        loading.close();
        if (res.status === 200) {
          new Message({
            type: 'success',
            content: '添加标签成功',
          });
          getArticleTagList();
        } else {
          new Message({
            type: 'error',
            content: '添加标签失败',
          });
        }
      }).catch(() => {
        loading.close();
        new Message({
          type: 'error',
          content: '添加标签失败',
        });
      });
    } else {
      request.post(api.blog.tag.add, {
        name: tagText,
      }).then((createTagRes) => {
        if (createTagRes.status === 200) {
          const newTag = createTagRes.data.tag;
          request.post(api.blog.article.addTag, {
            id,
            tagId: newTag.id,
          }).then((res) => {
            loading.close();
            if (res.status === 200) {
              new Message({
                type: 'success',
                content: '添加标签成功',
              });
              getArticleTagList();
              getTagList();
            } else {
              new Message({
                type: 'error',
                content: '添加标签失败',
              });
            }
          }).catch(() => {
            loading.close();
            new Message({
              type: 'error',
              content: '添加标签失败',
            });
          });
        } else {
          new Message({
            type: 'error',
            content: '创建标签失败',
          });
        }
      }).catch(() => {
        new Message({
          type: 'error',
          content: '创建标签失败',
        });
      });
    }
  };

  const onKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.defaultMuiPrevented = true;
      if (tagText) {
        addTagToArticle();
      }
    }
  };

  const clearTags = () => {
    new Dialog({
      title: '操作确认',
      content: '是否确认清空标签？',
      onConfirm: () => {
        const loading = new Loading();
        request.post(api.blog.article.clearTags, {
          id,
        }).then((res) => {
          loading.close();
          if (res.status === 200) {
            new Message({
              type: 'success',
              content: '清空标签成功',
            });
            getArticleTagList();
          } else {
            new Message({
              type: 'error',
              content: '清空标签失败',
            });
          }
        }).catch(() => {
          loading.close();
          new Message({
            type: 'error',
            content: '清空标签失败',
          });
        });
      },
    });
  };

  const openMediaCenter = (vditor: Vditor) => {
    const newOnSelect = (mediaFile: MediaFile) => {
      if (mediaFile?.mimeType === MIME_TYPE.IMAGE) {
        vditor.insertValue(`![${mediaFile.name || '图片'}](${mediaFile.url})`);
      } else if (mediaFile?.mimeType === MIME_TYPE.VIDEO) {
        vditor.insertValue(`<video alt="${mediaFile.name || '视频'}" src="${mediaFile.url}" />"`);
      } else if (mediaFile?.mimeType === MIME_TYPE.AUDIO) {
        vditor.insertValue(`<audio alt="${mediaFile.name || '音频'}" src="${mediaFile.url}" />"`);
      }
      closeMediaCenter();
    };
    setOnSelect(() => newOnSelect);
    setSelectButtonText('插入');
  };

  const openCoverImagePicker = () => {
    const newOnSelect = (mediaFile: MediaFile) => {
      articleForm.setValue('coverImage', mediaFile.thumbnail || mediaFile.url, { shouldDirty: true });
      closeMediaCenter();
    };
    setOnSelect(() => newOnSelect);
    setAllowedMimeTypes([MIME_TYPE.IMAGE]);
  };

  const closeMediaCenter = () => {
    setOnSelect(undefined);
    setSelectButtonText(undefined);
    setAllowedMimeTypes(undefined);
  };

  const onSubmit = (data: BlogArticleForm) => {
    const postData = {
      id,
      ...data,
      publishTime: data.publishTime ? moment(data.publishTime).format('YYYY-MM-DD HH:mm:SS') : undefined,
    };
    const loading = new Loading();
    request.post(api.blog.article[id ? 'update' : 'add'], postData).then((res) => {
      loading.close();
      if (res.status === 200) {
        new Message({
          type: 'success',
          content: `保存${data.isPublished ? '文章' : '草稿'}成功`,
        });
        if (!id) {
          history.replace(`/blog/article/editor?id=${res.data.article.id}`);
          setId(res.data.article.id);
        } else {
          getArticle();
        }
      } else {
        new Message({
          type: 'error',
          content: `保存${data.isPublished ? '文章' : '草稿'}失败`,
        });
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: `保存${data.isPublished ? '文章' : '草稿'}失败`,
      });
    });
  };

  const exportToWechat = () => {
    Vditor.md2html(article?.content as string).then((rawHtml) => {
      const loading = new Loading();
      const div = document.createElement('div');
      div.innerHTML = `${rawHtml}<img src="${cosUrl}/Static/QRCode.png" />`;
      div.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el as HTMLElement);
        el.innerHTML = el.innerHTML.replaceAll('\n', 'line-break-tag');
      });
      request.post(api.blog.article.exportToWechat, {
        id,
        content: div.innerHTML.replaceAll('\n', '').replaceAll('line-break-tag', '\n'),
      }).then((res) => {
        loading.close();
        if (res.status === 200) {
          new Message({
            type: 'success',
            content: '已添加到后台任务',
          });
        } else {
          new Message({
            type: 'error',
            content: '同步到微信公众号后台失败',
          });
        }
      }).catch(() => {
        loading.close();
        new Message({
          type: 'error',
          content: '同步到微信公众号后台失败',
        });
      });
    });
  };

  useEffect(() => {
    if (article) {
      setArticleTagList(article.tags);
      articleForm.reset(article);
      if (editor?.vditor) {
        editor.setValue(article.content);
      }
    }
  }, [article, editor]);

  useEffect(() => {
    if (id) {
      getArticle();
    }
  }, [id]);

  useEffect(() => {
    getTagList();
    getCategoryTree();
    const darkMode = getDarkMode();
    const vditor: Vditor = new Vditor('vditor', {
      height: 0,
      theme: darkMode ? 'dark' : 'classic',
      preview: {
        theme: {
          current: darkMode ? 'dark' : 'light',
          list: { dark: 'Dark', light: 'Light', wechat: 'WeChat' },
        },
      },
      toolbar: [
        'preview',
        'edit-mode',
        'content-theme',
        'code-theme',
        'undo',
        'redo',
        '|',
        'emoji',
        'headings',
        'bold',
        'italic',
        'strike',
        'inline-code',
        'link',
        {
          name: 'media-center',
          tip: '媒体库',
          tipPosition: 'n',
          icon: SvgStrings.mediaCenterIcon,
          click: () => openMediaCenter(vditor),
        },
        '|',
        'list',
        'ordered-list',
        'check',
        'quote',
        'code',
        'table',
        'line',
        {
          name: 'qr-code',
          tip: '二维码',
          tipPosition: 'n',
          icon: SvgStrings.qrCode,
          click: () => vditor.insertValue(`![公众号二维码](${cosUrl}/Static/QRCode.png)`),
        },
        '|',
        'outdent',
        'indent',
        'insert-before',
        'insert-after',
      ],
      input: (value) => articleForm.setValue('content', value, { shouldDirty: true }),
      toolbarConfig: {
        pin: false,
      },
      cache: {
        enable: false,
      },
      counter: {
        enable: true,
        type: 'text',
      },
      icon: 'material',
    });
    setEditor(vditor);
    return () => {
      vditor.destroy();
    };
  }, []);

  return (
    <div className={classes.root}>
      <HeadBar title="编辑文章" changeTransparencyOnScroll={false} />
      <div className="page-wrapper">
        <Container maxWidth="lg" className="editor-container">
          <form className="form" onSubmit={articleForm.handleSubmit(onSubmit)}>
            <div className="editor-wrapper">
              <Controller
                name="title"
                defaultValue=""
                control={articleForm.control}
                className="form-controller"
                as={(
                  <TextField
                    label="标题"
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />
              <Controller
                name="subtitle"
                defaultValue=""
                control={articleForm.control}
                className="form-controller"
                as={(
                  <TextField
                    label="副标题"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
              <div id="vditor" className="editor" />
            </div>
            <Card className="options-card">
              <CardHeader
                avatar={(
                  <Avatar className="card-icon">
                    <BlogArticleIcon />
                  </Avatar>
                )}
                title="信息设置"
                titleTypographyProps={{ variant: 'h6' }}
              />
              <Divider />
              <div className="options-container">
                <div className="options-wrapper">
                  <CardContent>
                    <Typography variant="subtitle1" paragraph>
                      文章信息
                    </Typography>
                    <Controller
                      name="categoryId"
                      control={articleForm.control}
                      rules={{ required: false }}
                      className="form-controller"
                      as={(
                        <TreeSelect
                          tree={categoryTree}
                          label="文章分类"
                          fullWidth
                          allowClear
                        />
                      )}
                    />
                    <Controller
                      name="introduction"
                      defaultValue=""
                      control={articleForm.control}
                      className="form-controller"
                      as={(
                        <TextField
                          label="摘要"
                          variant="outlined"
                          rows={5}
                          multiline
                          fullWidth
                        />
                      )}
                    />
                    {articleForm.watch('coverImage') ? (
                      <>
                        <div className="action-buttons form-controller">
                          <Button
                            variant="contained"
                            color="primary"
                            className="action-button"
                            onClick={openCoverImagePicker}
                          >
                            更改封面
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            className="action-button"
                            onClick={() => articleForm.setValue('coverImage', null, { shouldDirty: true })}
                          >
                            删除封面
                          </Button>
                        </div>
                        <img src={articleForm.watch('coverImage')} className="cover-image" />
                      </>
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="action-button form-controller"
                        onClick={openCoverImagePicker}
                      >
                        添加封面图片
                      </Button>
                    )}
                  </CardContent>
                  <Divider />
                  <CardContent>
                    <Typography variant="subtitle1" paragraph>
                      文章标签
                    </Typography>
                    {articleTagList.length ? (
                      <div className="tags-container">
                        {articleTagList.map((tag) => (
                          <Chip
                            color="primary"
                            className="tag"
                            key={tag.name}
                            label={(
                              <Typography variant="body1">{tag.name}</Typography>
                            )}
                            onDelete={() => removeTagFromArticle(tag)}
                          />
                        ))}
                      </div>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        暂无标签
                      </Typography>
                    )}
                    <Autocomplete
                      freeSolo
                      className="tag-select"
                      disabled={!article}
                      options={tagList}
                      getOptionLabel={tag => (tag as BlogArticleTag).name}
                      renderInput={(params) => (
                        <TextField {...params} variant="standard" label={id ? '添加标签' : '仅支持已保存的文章'} />
                      )}
                      onChange={(event, value) => setSelectedTag(value as BlogArticleTag)}
                      onInputChange={(event, value) => setTagText(value)}
                      onKeyDown={onKeyDown}
                    />
                    <div className="action-buttons tag-buttons">
                      <Button
                        variant="contained"
                        color="primary"
                        className="action-button"
                        disabled={!article || (!selectedTag && !tagText)}
                        onClick={addTagToArticle}
                      >
                        添加标签
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        className="action-button"
                        disabled={!article || articleTagList.length === 0}
                        onClick={clearTags}
                      >
                        清空标签
                      </Button>
                    </div>
                  </CardContent>
                  <Divider />
                  <CardContent>
                    <Typography variant="subtitle1" paragraph>
                      发布选项
                    </Typography>
                    <Controller
                      name="publishTime"
                      defaultValue={null}
                      control={articleForm.control}
                      className="form-controller"
                      render={({ onChange, value }) => (
                        <LocalizationProvider dateAdapter={momentAdapter} localeText={zhCN.components.MuiLocalizationProvider.defaultProps.localeText}>
                          <DateTimePicker
                            renderInput={(props) => <TextField fullWidth {...props} />}
                            label="发布时间"
                            value={value}
                            onChange={onChange}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <Controller
                      name="isPublished"
                      control={articleForm.control}
                      render={({ value, onChange }) => (
                        <div className="form-controller">
                          <FormLabel>正式发布</FormLabel>
                          <Switch
                            defaultChecked={false}
                            onChange={(e) => onChange(e.target.checked)}
                            checked={value}
                            color="primary"
                          />
                        </div>
                      )}
                    />
                  </CardContent>
                  <div />
                </div>
              </div>
              <Divider />
              <CardContent>
                <div className="action-buttons">
                  <Button
                    variant="contained"
                    color="primary"
                    className="action-button"
                    disabled={!articleForm.formState.isDirty}
                    type="submit"
                  >
                    {articleForm.watch('isPublished')
                      ? `${
                        (new Date(articleForm.watch('publishTime') || 0)) <= new Date()
                          ? '发布'
                          : '定时发布'
                      }文章`
                      : '保存草稿'}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    className="action-button"
                    disabled={!article}
                    onClick={removeArticle}
                  >
                    删除文章
                  </Button>
                </div>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="additional-button"
                  disabled={!article?.id}
                  onClick={() => history.push(`/blog/article/detail?id=${article?.id}`)}
                >
                  {!article?.id ? '请保存后查看' : '查看文章'}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="additional-button"
                  disabled={articleForm.formState.isDirty || !article?.id}
                  onClick={exportToWechat}
                >
                  {(articleForm.formState.isDirty || !article?.id) ? '请保存后同步到微信公众平台' : '同步到微信公众平台'}
                </Button>
              </CardContent>
            </Card>
            <Controller
              control={articleForm.control}
              name="coverImage"
              render={() => null as any}
            />
            <Controller
              control={articleForm.control}
              name="content"
              render={() => null as any}
            />
          </form>
        </Container>
        {onSelect && (
          <div className="media-center-wrapper">
            <Paper square>
              <Toolbar>
                <Typography
                  className="title"
                  variant="h6"
                >
                  媒体库
                </Typography>
                <IconButton edge="end" size="large" onClick={closeMediaCenter}>
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </Paper>
            <MediaCenter
              className="media-center"
              onSelect={onSelect}
              selectButtonText={selectButtonText}
              allowedMimeTypes={allowedMimeTypes}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default index;
