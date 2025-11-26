import React from 'react';
import { TextField, useTheme } from '@mui/material';
import { Controller, UseFormMethods } from 'react-hook-form';

import TreeSelect from '@/Components/TreeSelect';

import styles from './styles';
import { Category, CategoryForm } from '@/Pages/Blog/types';

interface CategoryFormProps {
  categoryTree: Category[];
  categoryForm: UseFormMethods<CategoryForm>;
}

const categoryFormComponent: React.FC<CategoryFormProps> = (props: CategoryFormProps) => {
  const {
    categoryTree,
    categoryForm,
  } = props;

  const theme = useTheme();
  const classes = styles(theme);

  return (
    <form className={classes.root}>
      {categoryForm.watch('id') && (
        <Controller
          name="id"
          control={categoryForm.control}
          rules={{ required: true }}
          className="form-controller"
          as={(
            <TextField
              label="分类 ID"
              disabled
              required
              fullWidth
            />
          )}
        />
      )}
      <Controller
        name="name"
        control={categoryForm.control}
        rules={{ required: true }}
        className="form-controller"
        as={(
          <TextField
            label="分类名称"
            required
            fullWidth
          />
        )}
      />
      <Controller
        name="parentId"
        control={categoryForm.control}
        rules={{ required: false }}
        className="form-controller"
        as={(
          <TreeSelect
            tree={categoryTree}
            label="父级分类"
            fullWidth
            allowClear
          />
        )}
      />
    </form>
  );
};

export default categoryFormComponent;
