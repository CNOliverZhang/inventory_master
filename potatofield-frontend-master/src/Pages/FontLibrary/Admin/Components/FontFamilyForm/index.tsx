import React from 'react';
import { TextField, MenuItem, useTheme } from '@mui/material';
import { Controller, UseFormMethods } from 'react-hook-form';

import styles from './styles';
import { FontFamilyForm } from '../../../types';

interface FontFamiltFormProps {
  fontFamilyForm: UseFormMethods<FontFamilyForm>;
}

const fontFamilyFormComponent: React.FC<FontFamiltFormProps> = (props: FontFamiltFormProps) => {
  const { fontFamilyForm } = props;
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <form className={classes.root}>
      {fontFamilyForm.watch('id') && (
        <Controller
          name="id"
          control={fontFamilyForm.control}
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
        name="name"
        control={fontFamilyForm.control}
        rules={{ required: true }}
        className="form-controller"
        as={(
          <TextField
            label="字体族名称"
            required
            fullWidth
          />
        )}
      />
      <Controller
        name="language"
        control={fontFamilyForm.control}
        rules={{ required: true }}
        className="form-controller"
        as={(
          <TextField
            select
            label="选择语言"
            required
            fullWidth
          >
            <MenuItem value={1}>中文</MenuItem>
            <MenuItem value={2}>英文</MenuItem>
          </TextField>
        )}
      />
    </form>
  );
};

export default fontFamilyFormComponent;
