import React from 'react';
import {
  TextField, MenuItem, Button, useTheme,
} from '@mui/material';
import { Controller, UseFormMethods } from 'react-hook-form';

import Upload from '@/Components/Upload';

import styles from './styles';
import { FontForm, FontStyle } from '../../../types';

interface FontFormProps {
  fontForm: UseFormMethods<FontForm>;
  fontStyleList: FontStyle[];
}

const fontFormComponent: React.FC<FontFormProps> = (props: FontFormProps) => {
  const { fontForm, fontStyleList } = props;
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <form className={classes.root}>
      {fontForm.watch('id') ? (
        <Controller
          name="id"
          control={fontForm.control}
          rules={{ required: true }}
          className="form-controller"
          as={(
            <TextField
              label="字体 ID"
              disabled
              required
              fullWidth
            />
          )}
        />
      ) : (
        <Controller
          name="fontFamilyId"
          control={fontForm.control}
          rules={{ required: true }}
          className="form-controller"
          as={(
            <TextField
              label="字体族 ID"
              disabled
              required
              fullWidth
            />
          )}
        />
      )}
      <Controller
        name="fontStyleId"
        control={fontForm.control}
        rules={{ required: true }}
        className="form-controller"
        as={(
          <TextField
            select
            label="选择字体样式"
            fullWidth
          >
            {fontStyleList.map((fontStyle) => (
              <MenuItem key={fontStyle.id} value={fontStyle.id}>
                {fontStyle.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="font"
        control={fontForm.control}
        rules={{ required: Boolean(fontForm.watch('id')) }}
        className="form-controller"
        as={(
          <Upload
            accept=".ttf,.otf*"
            render={({ value }) => (
              <>
                <div className="font-file">
                  <div className="font-file-info">{value?.name ? `文件名：${value.name}` : '尚未选择字体文件'}</div>
                  {value?.size && (
                  <div className="font-file-info">
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
                  {value ? '修改字体文件' : '上传字体文件'}
                </Button>
              </>
            )}
          />
        )}
      />
    </form>
  );
};

export default fontFormComponent;
