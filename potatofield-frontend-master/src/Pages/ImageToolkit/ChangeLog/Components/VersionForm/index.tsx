import React from 'react';
import { TextField, Button, useTheme } from '@mui/material';
import { Controller, UseFormMethods } from 'react-hook-form';

import Upload from '@/Components/Upload';

import styles from './styles';
import { VersionForm } from '../../../types';

interface VersionFormProps {
  versionForm: UseFormMethods<VersionForm>;
}

const versionFormComponent: React.FC<VersionFormProps> = (props: VersionFormProps) => {
  const { versionForm } = props;
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <form className={classes.root}>
      <Controller
        name="code"
        control={versionForm.control}
        rules={{ required: true }}
        className="form-controller"
        as={(
          <TextField
            label="版本号"
            required
            fullWidth
          />
        )}
      />
      <Controller
        name="features"
        control={versionForm.control}
        rules={{ required: true }}
        className="form-controller"
        as={(
          <TextField
            label="新版本特性"
            multiline
            rows={5}
            fullWidth
            variant="outlined"
          />
        )}
      />
      <Controller
        name="winPackage"
        control={versionForm.control}
        rules={{ required: true }}
        className="form-controller"
        as={(
          <Upload
            accept=".exe"
            render={({ value }) => (
              <>
                <div className="file">
                  <div className="file-info">{value?.name ? `文件名：${value.name}` : '尚未选择 Windows 安装包'}</div>
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
      <Controller
        name="macPackage"
        control={versionForm.control}
        rules={{ required: true }}
        className="form-controller"
        as={(
          <Upload
            accept=".dmg"
            render={({ value }) => (
              <>
                <div className="file">
                  <div className="file-info">{value?.name ? `文件名：${value.name}` : '尚未选择 Mac 安装包'}</div>
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
      <Controller
        name="winBlockmap"
        control={versionForm.control}
        rules={{ required: true }}
        className="form-controller"
        as={(
          <Upload
            accept=".blockmap"
            render={({ value }) => (
              <>
                <div className="file">
                  <div className="file-info">{value?.name ? `文件名：${value.name}` : '尚未选择 Windows Blockmap 文件'}</div>
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
      <Controller
        name="macBlockmap"
        control={versionForm.control}
        rules={{ required: true }}
        className="form-controller"
        as={(
          <Upload
            accept=".blockmap"
            render={({ value }) => (
              <>
                <div className="file">
                  <div className="file-info">{value?.name ? `文件名：${value.name}` : '尚未选择 Mac Blockmap 文件'}</div>
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
      <Controller
        name="winYml"
        control={versionForm.control}
        rules={{ required: true }}
        className="form-controller"
        as={(
          <Upload
            accept=".yml"
            render={({ value }) => (
              <>
                <div className="file">
                  <div className="file-info">{value?.name ? `文件名：${value.name}` : '尚未选择 Windows 更新描述文件'}</div>
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
      <Controller
        name="macYml"
        control={versionForm.control}
        rules={{ required: true }}
        className="form-controller"
        as={(
          <Upload
            accept=".yml"
            render={({ value }) => (
              <>
                <div className="file">
                  <div className="file-info">{value?.name ? `文件名：${value.name}` : '尚未选择 Mac 更新描述文件'}</div>
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

export default versionFormComponent;
