import React from 'react';
import { TextField, useTheme } from '@mui/material';
import { Controller, UseFormMethods } from 'react-hook-form';

import styles from './styles';
import { MediaFileNameForm } from '../../types';

interface MediaFileNameFormProps {
  mediaFileNameForm: UseFormMethods<MediaFileNameForm>;
}

const mediaFileNameFormComponent: React.FC<
  MediaFileNameFormProps
> = (props: MediaFileNameFormProps) => {
  const { mediaFileNameForm } = props;
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <form className={classes.root}>
      <Controller
        name="id"
        control={mediaFileNameForm.control}
        rules={{ required: false }}
        className="form-controller"
        as={(
          <TextField
            label="媒体文件 ID"
            disabled
            fullWidth
          />
        )}
      />
      <Controller
        name="name"
        control={mediaFileNameForm.control}
        rules={{ required: false }}
        className="form-controller"
        as={(
          <TextField
            label="媒体文件名称"
            fullWidth
          />
        )}
      />
    </form>
  );
};

export default mediaFileNameFormComponent;
