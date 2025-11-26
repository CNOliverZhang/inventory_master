import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  StepIconProps,
  Container,
  Typography,
  Fab,
  MenuList,
  MenuItem,
  ListItemIcon,
  useTheme,
} from '@mui/material';
import {
  FiberNew as NewIcon,
  Add as AddIcon,
  GetApp as DownloadIcon,
  BarChart as AnalysticsIcon,
} from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faWindows } from '@fortawesome/free-brands-svg-icons';
import { useForm } from 'react-hook-form';
import moment from 'moment';

import Loading from '@/ImperativeComponents/Loading';
import Message from '@/ImperativeComponents/Message';
import Dialog from '@/ImperativeComponents/Dialog';
import HeadBar from '@/Components/HeadBar';
import DropdownPanel from '@/Components/DropdownPanel';
import request from '@/Utils/Request';
import api from '@/Apis';
import useUser from '@/Contexts/User';

import Logo from '@/Assets/Images/ImageToolkit/Logo.png';

import VersionFormComponent from './Components/VersionForm';
import styles from './styles';
import { Version, VersionForm } from '../types';

interface ClientCountItem {
  count: number;
  version: string;
}

const index: React.FC = () => {
  const [versionList, setVersionList] = useState<Version[]>([]);
  const [clientCountList, setClientCountList] = useState<ClientCountItem[]>([]);
  const [totalClientCount, setTotalClientCount] = useState(0);
  const versionForm = useForm<VersionForm>();
  const { user } = useUser();
  const theme = useTheme();
  const classes = styles(theme);

  useEffect(() => {
    const loading = new Loading();
    request.get(api.imageToolkit.version.list).then((versionListRes) => {
      if (versionListRes.status === 200) {
        setVersionList(versionListRes.data.list);
        if (user?.isAdmin) {
          request.get(api.imageToolkit.client.count).then((versionClientCountRes) => {
            loading.close();
            if (versionClientCountRes.status === 200) {
              setClientCountList(versionClientCountRes.data.versions);
              setTotalClientCount(versionClientCountRes.data.total);
            } else {
              new Message({
                type: 'error',
                content: '获取各版本用户统计数据失败',
              });
            }
          }).catch(() => {
            loading.close();
            new Message({
              type: 'error',
              content: '获取各版本用户统计数据失败',
            });
          });
        } else {
          loading.close();
        }
      } else {
        loading.close();
        new Message({
          type: 'error',
          content: '获取历史版本列表失败',
        });
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: '获取历史版本列表失败',
      });
    });
  }, []);

  const addVersion = (values: VersionForm) => {
    const loading = new Loading();
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });
    request.post(api.imageToolkit.version.add, formData, {
      timeout: 10 * 60 * 1000,
    }).then((updateRes) => {
      loading.close();
      if (updateRes.status === 200) {
        new Message({
          type: 'success',
          content: '添加版本成功',
        });
        request.get(api.imageToolkit.version.list).then((getListRes) => {
          if (getListRes.status === 200) {
            setVersionList(getListRes.data.list);
          }
        });
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: '添加版本失败',
      });
    });
  };

  const showAddVersionDialog = () => {
    versionForm.reset();
    const dialog: Dialog = new Dialog({
      title: '添加版本',
      content: (
        <VersionFormComponent
          versionForm={versionForm}
        />
      ),
      onConfirm: async () => {
        const valid = await versionForm.trigger();
        if (valid) {
          dialog.close();
          versionForm.handleSubmit((values) => addVersion(values))();
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
        title="更新历史"
        changeTransparencyOnScroll={false}
      />
      <Container maxWidth="sm">
        <Stepper activeStep={0} orientation="vertical" className="stepper">
          {versionList.map((version) => (
            <Step expanded key={version.code}>
              <StepLabel StepIconComponent={renderStepIcon}>
                <Chip
                  label={(
                    <Typography variant="body1">{moment(version.pubDate).format('YYYY 年 MM 月 DD 日')}</Typography>
                  )}
                  color="primary"
                />
              </StepLabel>
              <StepContent>
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar src={Logo} />
                    }
                    title={`版本号 ${version.code}`}
                    titleTypographyProps={{ variant: 'h6' }}
                    action={(
                      <DropdownPanel dropdownElement={(
                        <IconButton size="large">
                          <DownloadIcon />
                        </IconButton>
                      )}
                      >
                        <MenuList>
                          <MenuItem onClick={() => window.open(version.winPackage, '_blank')}>
                            <ListItemIcon>
                              <FontAwesomeIcon icon={faWindows} />
                            </ListItemIcon>
                            <Typography variant="inherit">
                              下载 Windows 版本
                            </Typography>
                          </MenuItem>
                          {version.macPackage && (
                            <MenuItem onClick={() => window.open(version.macPackage, '_blank')}>
                              <ListItemIcon>
                                <FontAwesomeIcon icon={faApple} />
                              </ListItemIcon>
                              <Typography variant="inherit">
                                下载 Mac 版本
                              </Typography>
                            </MenuItem>
                          )}
                        </MenuList>
                      </DropdownPanel>
                    )}
                  />
                  <Divider />
                  <CardContent>
                    {version.features.split('\n').map((feature, featureIndex) => (
                      <Typography
                        key={feature}
                        align="justify"
                        variant="body1"
                        color="textSecondary"
                        paragraph={featureIndex < version.features.split('\n').length - 1}
                      >
                        {feature}
                      </Typography>
                    ))}
                  </CardContent>
                  {user?.isAdmin && (
                    <CardContent>
                      <Chip
                        avatar={(
                          <Avatar className="chip-icon">
                            <DownloadIcon fontSize="small" />
                          </Avatar>
                        )}
                        label={(
                          <Typography variant="body1">
                            {clientCountList.find(
                              (item) => item.version === version.code,
                            )?.count || 0}
                          </Typography>
                        )}
                        color="primary"
                        className="client-count"
                      />
                      <Chip
                        avatar={(
                          <Avatar className="chip-icon">
                            <AnalysticsIcon fontSize="small" />
                          </Avatar>
                        )}
                        label={(
                          <Typography variant="body1">
                            {`${(
                              (
                                (
                                  clientCountList.find(
                                    (item) => item.version === version.code,
                                  )?.count
                                || 0
                                ) * 100
                              ) / totalClientCount).toFixed(2)} %`}
                          </Typography>
                        )}
                        color="primary"
                        className="client-count"
                      />
                    </CardContent>
                  )}
                </Card>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Container>
      <Fab
        color="primary"
        className="add-version"
        onClick={showAddVersionDialog}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default index;
