import React from 'react';
import {
  TextField,
  Button,
  Switch,
  FormLabel,
  useTheme,
} from '@mui/material';
import { Controller, UseFormMethods } from 'react-hook-form';

import Upload from '@/Components/Upload';

import styles from './styles';
import { MediaFileForm } from '../../types';

interface MediaFileFormProps {
  mediaFileForm: UseFormMethods<MediaFileForm>;
}

const mediaFileFormComponent: React.FC<MediaFileFormProps> = (props: MediaFileFormProps) => {
  const { mediaFileForm } = props;
  const theme = useTheme();
  const classes = styles(theme);

  const handleFileDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const { files } = event.dataTransfer;
    setTimeout(() => {
      if (files?.length) {
        mediaFileForm.setValue('file', files[0]);
      }
    });
  };

  return (
    <form className={classes.root} onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop}>
      <Controller
        name="name"
        defaultValue=""
        control={mediaFileForm.control}
        rules={{ required: false }}
        className="form-controller"
        as={(
          <TextField
            label="媒体文件名称"
            fullWidth
          />
        )}
      />
      <Controller
        name="file"
        defaultValue={[]}
        control={mediaFileForm.control}
        rules={{ required: true }}
        className="form-controller"
        as={(
          <Upload
            accept="image/*,video/*"
            render={({ value }) => (
              <>
                <div className="media-file">
                  <div className="media-file-info">{value?.name ? `文件名：${value.name}` : '尚未选择媒体文件'}</div>
                  {value?.size && (
                  <div className="media-file-info">
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
                  {value ? '修改媒体文件' : '上传媒体文件'}
                </Button>
              </>
            )}
          />
        )}
      />
      <Controller
        name="keepOriginalSize"
        defaultValue={false}
        control={mediaFileForm.control}
        render={({ value, onChange }) => (
          <div className="form-controller">
            <FormLabel>保持原始尺寸</FormLabel>
            <Switch
              onChange={(e) => onChange(e.target.checked)}
              checked={value}
              color="primary"
            />
          </div>
        )}
      />
    </form>
  );
};

export default mediaFileFormComponent;
