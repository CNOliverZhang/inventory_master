import React, { useEffect, useState } from 'react';
import {
  Typography,
  Chip,
  TextField,
  Button,
  Autocomplete,
  useTheme,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';

import request from '@/Utils/Request';
import Message from '@/ImperativeComponents/Message';
import Dialog from '@/ImperativeComponents/Dialog';
import Loading from '@/ImperativeComponents/Loading';
import api from '@/Apis';
import { MIME_TYPE } from '@/Constants/mimeType';

import { MediaFile, MediaFileTag, MediaFileNameForm } from '../../types';
import styles from './styles';

interface DetailProps {
  mediaFile?: MediaFile;
  tagList: MediaFileTag[];
  getTagList: () => void;
  getMediaFileList: () => void;
}

const detail: React.FC<DetailProps> = (props: DetailProps) => {
  const {
    mediaFile,
    tagList,
    getTagList,
    getMediaFileList,
  } = props;
  const [mediaFileDetail, setMediaFileDetail] = useState(mediaFile);
  const [nameUpdating, setNameUpdating] = useState(false);
  const [selectedTag, setSelectedTag] = useState<MediaFileTag>();
  const [tagText, setTagText] = useState('');
  const mediaFileNameForm = useForm<MediaFileNameForm>();
  const theme = useTheme();
  const classes = styles(theme);

  const getMediaFileDetail = () => {
    request.get(api.mediaCenter.file.get, {
      params: { id: mediaFile?.id },
    }).then((res) => {
      if (res.status === 200) {
        setMediaFileDetail(res.data);
      }
    });
  };

  const renameMediaFile = (data: MediaFileNameForm) => {
    setNameUpdating(true);
    request.post(api.mediaCenter.file.update, data.name ? {
      id: mediaFile?.id,
      name: data.name,
    } : {
      id: mediaFile?.id,
    }).then((res) => {
      setNameUpdating(false);
      if (res.status === 200) {
        new Message({
          type: 'success',
          content: '修改成功',
        });
        getMediaFileDetail();
        getMediaFileList();
      } else {
        new Message({
          type: 'error',
          content: '修改失败',
        });
        mediaFileNameForm.reset({ name: mediaFile?.name });
      }
    }).catch(() => {
      setNameUpdating(false);
      new Message({
        type: 'error',
        content: '修改失败',
      });
    });
  };

  const clearMediaFileName = () => {
    setNameUpdating(true);
    request.post(api.mediaCenter.file.update, {
      id: mediaFile?.id,
    }).then((res) => {
      setNameUpdating(false);
      if (res.status === 200) {
        new Message({
          type: 'success',
          content: '清除成功',
        });
        getMediaFileDetail();
        getMediaFileList();
      } else {
        new Message({
          type: 'error',
          content: '清除失败',
        });
        mediaFileNameForm.reset({ name: mediaFile?.name });
      }
    }).catch(() => {
      setNameUpdating(false);
      new Message({
        type: 'error',
        content: '清除失败',
      });
    });
  };

  const removeTagFromFile = (file: MediaFile, tag: MediaFileTag) => {
    new Dialog({
      title: '操作确认',
      content: `是否确认删除标签“${tag.name}”？`,
      onConfirm: () => {
        const loading = new Loading();
        request.post(api.mediaCenter.file.removeTag, {
          id: file.id,
          tagId: tag.id,
        }).then((res) => {
          loading.close();
          if (res.status === 200) {
            new Message({
              type: 'success',
              content: '删除标签成功',
            });
            getMediaFileDetail();
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

  const addTagToFile = () => {
    if (mediaFileDetail?.tags.find((tag) => tag.name === (tagText || selectedTag?.name))) {
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
      request.post(api.mediaCenter.file.addTag, {
        id: mediaFile?.id,
        tagId: targetTag.id,
      }).then((res) => {
        loading.close();
        if (res.status === 200) {
          new Message({
            type: 'success',
            content: '添加标签成功',
          });
          getMediaFileDetail();
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
      request.post(api.mediaCenter.tag.add, {
        name: tagText,
      }).then((createTagRes) => {
        if (createTagRes.status === 200) {
          const newTag = createTagRes.data.tag;
          request.post(api.mediaCenter.file.addTag, {
            id: mediaFile?.id,
            tagId: newTag.id,
          }).then((res) => {
            loading.close();
            if (res.status === 200) {
              new Message({
                type: 'success',
                content: '添加标签成功',
              });
              getMediaFileDetail();
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
        addTagToFile();
      }
    }
  };

  const clearTags = () => {
    new Dialog({
      title: '操作确认',
      content: '是否确认清空标签？',
      onConfirm: () => {
        const loading = new Loading();
        request.post(api.mediaCenter.file.clearTags, {
          id: mediaFile?.id,
        }).then((res) => {
          loading.close();
          if (res.status === 200) {
            new Message({
              type: 'success',
              content: '清空标签成功',
            });
            getMediaFileDetail();
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

  useEffect(() => {
    if (mediaFile) {
      getMediaFileDetail();
    } else {
      setMediaFileDetail(undefined);
      setSelectedTag(undefined);
      setTagText('');
    }
  }, [mediaFile]);

  useEffect(() => {
    mediaFileNameForm.reset();
  }, [mediaFileDetail]);

  return (
    <div className={classes.root}>
      {mediaFileDetail?.mimeType === MIME_TYPE.AUDIO
        ? <audio controls src={mediaFileDetail.url} className="preview" />
        : (
          mediaFileDetail?.mimeType === MIME_TYPE.VIDEO
            ? <video controls src={mediaFileDetail.url} className="preview" />
            : <img src={mediaFileDetail?.url} className="preview" />
        )}
      <div className="media-info">
        <Typography variant="subtitle1" paragraph>
          文件命名
        </Typography>
        <form className="line-wrapper" onSubmit={mediaFileNameForm.handleSubmit(renameMediaFile)}>
          <Controller
            name="name"
            control={mediaFileNameForm.control}
            className="input"
            defaultValue={mediaFileDetail?.name || ''}
            as={(
              <TextField
                label="请输入媒体文件名称"
                placeholder="未命名"
                variant="standard"
              />
            )}
          />
          <div className="action-buttons">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!mediaFileNameForm.formState.isDirty}
              className="action-button"
            >
              {nameUpdating ? '正在提交' : '保存'}
            </Button>
            <Button
              variant="contained"
              color="error"
              className="action-button"
              onClick={clearMediaFileName}
            >
              清除名称
            </Button>
          </div>
        </form>
        <Typography variant="subtitle1" paragraph>
          上传时间
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          {moment(mediaFileDetail?.uploadTime).format('YYYY 年 MM 月 DD 日 HH:mm:ss')}
        </Typography>
        <Typography variant="subtitle1" paragraph>
          标签
        </Typography>
        {mediaFileDetail?.tags?.length ? (
          <div className="tags-container">
            {mediaFileDetail.tags.map((tag) => (
              <Chip
                color="primary"
                className="tag"
                key={tag.name}
                label={(
                  <Typography variant="body1">{tag.name}</Typography>
                )}
                onDelete={() => removeTagFromFile(mediaFileDetail, tag)}
              />
            ))}
          </div>
        ) : (
          <Typography variant="body1" color="textSecondary">
            暂无标签
          </Typography>
        )}
        <div className="line-wrapper">
          <Autocomplete
            freeSolo
            className="input"
            options={tagList}
            getOptionLabel={tag => (tag as MediaFileTag).name}
            renderInput={(params) => (
              <TextField {...params} variant="standard" label="添加标签" />
            )}
            onChange={(event, value) => setSelectedTag(value as MediaFileTag)}
            onInputChange={(event, value) => setTagText(value)}
            onKeyDown={onKeyDown}
          />
          <div className="action-buttons">
            <Button
              variant="contained"
              color="primary"
              className="action-button"
              disabled={!mediaFile || (!selectedTag && !tagText)}
              onClick={addTagToFile}
            >
              添加标签
            </Button>
            <Button
              variant="contained"
              color="error"
              className="action-button"
              disabled={!mediaFile}
              onClick={clearTags}
            >
              清空标签
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default detail;
