import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  StepIconProps,
  Container,
  Fab,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import {
  FiberNew as NewIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import moment from 'moment';

import Loading from '@/ImperativeComponents/Loading';
import Message from '@/ImperativeComponents/Message';
import HeadBar from '@/Components/HeadBar';
import request from '@/Utils/Request';
import api from '@/Apis';

import Dialog from '@/ImperativeComponents/Dialog';

import MessageFormComponent from './Components/MessageForm';
import styles from './styles';
import { ImageToolkitMessage } from '../../types';

interface EditOptions {
  create: boolean;
}

const index: React.FC = () => {
  const [messageList, setMessageList] = useState<ImageToolkitMessage[]>([]);
  const messageForm = useForm<ImageToolkitMessage>();
  const theme = useTheme();
  const classes = styles(theme);

  useEffect(() => {
    const loading = new Loading();
    request.get(api.imageToolkit.message.list).then((messageListRes) => {
      if (messageListRes.status === 200) {
        setMessageList(messageListRes.data.list);
        loading.close();
      } else {
        loading.close();
        new Message({
          type: 'error',
          content: '获取消息列表失败',
        });
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: '获取消息列表失败',
      });
    });
  }, []);

  const editMessage = (values: ImageToolkitMessage, options: EditOptions = { create: false }) => {
    const loading = new Loading();
    request.post(api.imageToolkit.message[options.create ? 'add' : 'update'], values, {
      timeout: 10 * 60 * 1000,
    }).then((updateRes) => {
      loading.close();
      if (updateRes.status === 200) {
        new Message({
          type: 'success',
          content: `${options.create ? '添加' : '编辑'}消息成功`,
        });
        request.get(api.imageToolkit.message.list).then((getListRes) => {
          if (getListRes.status === 200) {
            setMessageList(getListRes.data.list);
          }
        });
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: `${options.create ? '添加' : '编辑'}消息失败`,
      });
    });
  };

  const showEditMessageDialog = (message?: ImageToolkitMessage) => {
    messageForm.reset(message || { title: undefined, text: undefined });
    const dialog: Dialog = new Dialog({
      title: `${message ? '编辑' : '添加'}消息`,
      content: (
        <MessageFormComponent messageForm={messageForm} />
      ),
      onConfirm: async () => {
        const valid = await messageForm.trigger();
        if (valid) {
          dialog.close();
          messageForm.handleSubmit((values) => editMessage(
            values,
            message ? undefined : { create: true },
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

  const renderStepIcon = (props: StepIconProps) => (
    <div className="step-icon-wrapper">
      {props.active ? <NewIcon className="active" /> : <div className="inactive" />}
    </div>
  );

  return (
    <div className={classes.root}>
      <HeadBar
        title="消息管理"
        changeTransparencyOnScroll={false}
      />
      <Container maxWidth="sm">
        <Stepper activeStep={0} orientation="vertical" className="stepper">
          {messageList.map((message) => (
            <Step expanded key={message.id}>
              <StepLabel StepIconComponent={renderStepIcon}>
                <Chip
                  label={(
                    <Typography variant="body1">{moment(message.pubDate).format('YYYY 年 MM 月 DD 日')}</Typography>
                  )}
                  color="primary"
                />
              </StepLabel>
              <StepContent>
                <Card>
                  <CardHeader
                    avatar={(
                      <Avatar className="card-icon">
                        <MessageIcon />
                      </Avatar>
                    )}
                    title={message.title}
                    titleTypographyProps={{ noWrap: true, variant: 'h6' }}
                    classes={{ content: 'card-title' }}
                    action={(
                      <IconButton onClick={() => showEditMessageDialog(message)} size="large">
                        <EditIcon />
                      </IconButton>
                    )}
                  />
                  <Divider />
                  <CardContent>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align="justify"
                    >
                      {message.text}
                    </Typography>
                  </CardContent>
                </Card>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Container>
      <Fab
        color="primary"
        className="add-message"
        onClick={() => showEditMessageDialog()}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default index;
