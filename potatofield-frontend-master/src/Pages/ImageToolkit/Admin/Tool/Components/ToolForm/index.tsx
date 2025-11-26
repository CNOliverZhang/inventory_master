import React from 'react';
import { TextField, Button, useTheme } from '@mui/material';
import { Controller, UseFormMethods } from 'react-hook-form';

import Upload from '@/Components/Upload';

import styles from './styles';
import { ToolForm } from '../../../../types';

interface ToolFormProps {
  toolForm: UseFormMethods<ToolForm>;
}

const toolFormComponent: React.FC<ToolFormProps> = (props: ToolFormProps) => {
  const { toolForm } = props;
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <form className={classes.root}>
      {toolForm.watch('id') && (
        <Controller
          name="id"
          disabled
          control={toolForm.control}
          rules={{ required: true }}
          className="form-controller"
          as={(
            <TextField
              label="工具 ID"
              required
              fullWidth
            />
          )}
        />
      )}
      <Controller
        name="name"
        control={toolForm.control}
        rules={{ required: Boolean(toolForm.watch('id')) }}
        className="form-controller"
        as={(
          <TextField
            label="名称"
            required
            fullWidth
          />
        )}
      />
      <Controller
        name="introduction"
        control={toolForm.control}
        rules={{ required: Boolean(toolForm.watch('id')) }}
        className="form-controller"
        as={(
          <TextField
            label="介绍"
            multiline
            rows={5}
            fullWidth
            variant="outlined"
          />
        )}
      />
      <Controller
        name="image"
        control={toolForm.control}
        rules={{ required: Boolean(toolForm.watch('id')) }}
        className="form-controller"
        as={(
          <Upload
            accept="image/png"
            render={({ value }) => (
              <>
                <div className="file">
                  <div className="file-info">{value?.name ? `文件名：${value.name}` : '尚未选择图片'}</div>
                  {value?.size && (
                  <div className="file-info">
                    文件大小：
                    {`${Math.round(value.size / 1024)} KB`}
                  </div>
                  )}
                </div>
                <Button
                  component="div"
                  color="primary"
                  variant="contained"
                  fullWidth
                >
                  {value ? '修改文件' : '上传文件'}
                </Button>
              </>
            )}
          />
        )}
      />
    </form>
  );
};

export default toolFormComponent;
