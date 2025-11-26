import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
  Fab,
  Typography,
  useTheme,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import Loading from '@/ImperativeComponents/Loading';
import Message from '@/ImperativeComponents/Message';
import HeadBar from '@/Components/HeadBar';
import request from '@/Utils/Request';
import api from '@/Apis';

import Dialog from '@/ImperativeComponents/Dialog';

import ToolFormComponent from './Components/ToolForm';
import styles from './styles';
import { Tool, ToolForm } from '../../types';

interface EditOptions {
  create: boolean;
}

const index: React.FC = () => {
  const [toolList, setToolList] = useState<Tool[]>([]);
  const toolForm = useForm<ToolForm>();
  const theme = useTheme();
  const classes = styles(theme);

  useEffect(() => {
    const loading = new Loading();
    request.get(api.imageToolkit.tool.list).then((toolListRes) => {
      loading.close();
      if (toolListRes.status === 200) {
        setToolList(toolListRes.data.list);
      } else {
        new Message({
          type: 'error',
          content: '获取功能列表失败',
        });
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: '获取功能列表失败',
      });
    });
  }, []);

  const refreshToolList = () => {
    request.get(api.imageToolkit.tool.list).then((getListRes) => {
      if (getListRes.status === 200) {
        setToolList(getListRes.data.list);
      }
    });
  };

  const removeTool = (tool: Tool) => {
    new Dialog({
      title: '操作确认',
      content: `是否确认删除功能“${tool.name}”？`,
      onConfirm: () => {
        const loading = new Loading();
        request.post(api.imageToolkit.tool.remove, {
          id: tool.id,
        }).then((removeRes) => {
          loading.close();
          if (removeRes.status === 200) {
            new Message({
              type: 'success',
              content: '删除功能成功',
            });
            refreshToolList();
          } else {
            new Message({
              type: 'error',
              content: '删除功能失败',
            });
          }
        }).catch(() => {
          loading.close();
          new Message({
            type: 'error',
            content: '删除功能失败',
          });
        });
      },
    });
  };

  const editTool = (values: ToolForm, options: EditOptions = { create: false }) => {
    const loading = new Loading();
    request.post(api.imageToolkit.tool[options.create ? 'add' : 'update'], values, {
      timeout: 10 * 60 * 1000,
    }).then((updateRes) => {
      loading.close();
      if (updateRes.status === 200) {
        new Message({
          type: 'success',
          content: `${options.create ? '添加' : '编辑'}功能成功`,
        });
        refreshToolList();
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: `${options.create ? '添加' : '编辑'}功能失败`,
      });
    });
  };

  const showEditToolDialog = (tool?: Tool) => {
    toolForm.reset(tool || { name: undefined, introduction: undefined, image: undefined });
    const dialog: Dialog = new Dialog({
      title: `${tool ? '编辑' : '添加'}功能`,
      content: (
        <ToolFormComponent toolForm={toolForm} />
      ),
      onConfirm: async () => {
        const valid = await toolForm.trigger();
        if (valid) {
          dialog.close();
          toolForm.handleSubmit((values) => editTool(
            values,
            tool ? undefined : { create: true },
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

  return (
    <div className={classes.root}>
      <HeadBar
        title="功能管理"
        changeTransparencyOnScroll={false}
      />
      <Container maxWidth="sm">
        {toolList.map((tool) => (
          <Card key={tool.id} className="card">
            <div className="card-image-wrapper">
              <img className="card-image" src={tool.image} />
            </div>
            <CardContent>
              <Typography paragraph variant="h6">
                {tool.name}
              </Typography>
              <Typography variant="body1" color="textSecondary" align="justify">
                {tool.introduction}
              </Typography>
            </CardContent>
            <CardActions>
              <Button color="primary" onClick={() => showEditToolDialog(tool)}>
                编辑功能
              </Button>
              <Button color="error" onClick={() => removeTool(tool)}>
                删除功能
              </Button>
            </CardActions>
          </Card>
        ))}
      </Container>
      <Fab
        color="primary"
        className="add-tool"
        onClick={() => showEditToolDialog()}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default index;
