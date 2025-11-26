import React from 'react';
import { TextField, useTheme } from '@mui/material';
import { Controller, UseFormMethods } from 'react-hook-form';

import styles from './styles';
import { ImageToolkitMessage } from '../../../../types';

interface messageFormProps {
  messageForm: UseFormMethods<ImageToolkitMessage>;
}

const messageFormComponent: React.FC<messageFormProps> = (props: messageFormProps) => {
  const { messageForm } = props;
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <form className={classes.root}>
      {messageForm.watch('id') && (
        <Controller
          name="id"
          disabled
          control={messageForm.control}
          rules={{ required: true }}
          className="form-controller"
          as={(
            <TextField
              label="消息 ID"
              required
              fullWidth
            />
          )}
        />
      )}
      <Controller
        name="title"
        control={messageForm.control}
        rules={{ required: Boolean(messageForm.watch('id')) }}
        className="form-controller"
        as={(
          <TextField
            label="标题"
            required
            fullWidth
          />
        )}
      />
      <Controller
        name="text"
        control={messageForm.control}
        rules={{ required: Boolean(messageForm.watch('id')) }}
        className="form-controller"
        as={(
          <TextField
            label="内容"
            multiline
            rows={5}
            fullWidth
            variant="outlined"
          />
        )}
      />
    </form>
  );
};

export default messageFormComponent;
