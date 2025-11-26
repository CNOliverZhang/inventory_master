import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Container,
  TextField,
  Button,
  Typography,
  useTheme,
} from '@mui/material';
import { LocalOffer as TagIcon } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';

import Loading from '@/ImperativeComponents/Loading';
import Message from '@/ImperativeComponents/Message';
import Dialog from '@/ImperativeComponents/Dialog';
import HeadBar from '@/Components/HeadBar';
import { MediaFileTag, MediaFileTagForm } from '@/Components/MediaCenter/types';
import request from '@/Utils/Request';
import api from '@/Apis';

import styles from './styles';

const index: React.FC = () => {
  const [tagList, setTagList] = useState<MediaFileTag[]>([]);
  const [labelSubmitting, setLabelSubmitting] = useState(false);
  const mediaFileTagForm = useForm<MediaFileTagForm>();
  const history = useHistory();
  const theme = useTheme();
  const classes = styles(theme);

  const getTagList = () => {
    request.get(api.mediaCenter.tag.list).then((res) => {
      if (res.status === 200) {
        setTagList(res.data.list);
      } else {
        new Message({
          type: 'error',
          content: '获取标签列表失败',
        });
      }
    }).catch(() => {
      new Message({
        type: 'error',
        content: '获取标签列表失败',
      });
    });
  };

  const addTag = (tagForm: MediaFileTagForm) => {
    if (tagList.find((tag) => tag.name === tagForm.name)) {
      new Message({
        type: 'warning',
        content: '已存在同名标签。',
      });
      return;
    }
    setLabelSubmitting(true);
    request.post(api.mediaCenter.tag.add, tagForm).then((res) => {
      setLabelSubmitting(false);
      if (res.status === 200) {
        new Message({
          type: 'success',
          content: '添加标签成功',
        });
        getTagList();
        mediaFileTagForm.reset();
      } else {
        new Message({
          type: 'error',
          content: '添加标签失败',
        });
      }
    }).catch(() => {
      setLabelSubmitting(false);
      new Message({
        type: 'error',
        content: '添加标签失败',
      });
    });
  };

  const removeTag = (tag: MediaFileTag) => {
    new Dialog({
      title: '操作确认',
      content: `是否确认删除标签“${tag.name}”？`,
      onConfirm: () => {
        const loading = new Loading();
        request.post(api.mediaCenter.tag.remove, {
          id: tag.id,
        }).then((res) => {
          loading.close();
          if (res.status === 200) {
            new Message({
              type: 'success',
              content: '删除标签成功',
            });
            getTagList();
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

  useEffect(getTagList, []);

  return (
    <div className={classes.root}>
      <HeadBar
        title="标签管理"
        changeTransparencyOnScroll={false}
      />
      <Container maxWidth="md" className="card-wrapper">
        <Card className="card">
          <CardHeader
            avatar={(
              <Avatar className="card-icon">
                <TagIcon />
              </Avatar>
            )}
            title="标签列表"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <Divider />
          <CardContent>
            {tagList.length ? (
              <div className="chips-wrapper">
                {tagList.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={(
                      <Typography variant="body1">{tag.name}</Typography>
                    )}
                    onDelete={() => removeTag(tag)}
                    onClick={() => history.push({ pathname: '/admin/mediacenter', state: { tag } })}
                    color="primary"
                    className="chip"
                  />
                ))}
              </div>
            ) : (
              <Typography variant="body1" color="textSecondary" paragraph>
                暂无标签
              </Typography>
            )}
            <form className="input-wrapper" onSubmit={mediaFileTagForm.handleSubmit(addTag)}>
              <Controller
                name="name"
                control={mediaFileTagForm.control}
                className="input"
                defaultValue=""
                as={(
                  <TextField variant="standard" label="添加标签" />
                )}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!mediaFileTagForm.watch('name')}
                className="button"
              >
                {labelSubmitting ? '正在提交' : '添加'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default index;
