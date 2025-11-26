import React, { useEffect, useRef, useState } from 'react';
import {
  Container,
  Button,
  MenuList,
  MenuItem,
  Avatar,
  Card,
  CardHeader,
  Divider,
  Typography,
  CardContent,
  CardActions,
  useTheme,
} from '@mui/material';
import {
  Home as BackToTopIcon,
  GetApp as DownloadIcon,
  ExpandMore as NextIcon,
  Info as InfoIcon,
  History as HistoryIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

import Loading from '@/ImperativeComponents/Loading';
import Message from '@/ImperativeComponents/Message';
import HeadBar from '@/Components/HeadBar';
import DropdownPanel from '@/Components/DropdownPanel';
import request from '@/Utils/Request';
import useScroll from '@/Utils/Scroll';
import api from '@/Apis';

import Logo from '@/Assets/Images/ImageToolkit/Logo.png';
import QRcode from '@/Assets/Images/About/QRcode.png';

import styles from './styles';
import { Tool, Version } from '../types';

const index: React.FC = () => {
  const [toolList, setToolList] = useState<Tool[]>([]);
  const [latestVersion, setLatestVersion] = useState<Version>();
  const [pageIndex, setPageIndex] = useState(0);
  const pageIndexRef = useRef(pageIndex);
  const toolCountRef = useRef(toolList.length);
  const elementRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const theme = useTheme();
  const classes = styles(theme);

  const flipToPage = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  useEffect(() => {
    const loading = new Loading();
    request.get(api.imageToolkit.tool.list).then((toolListRes) => {
      if (toolListRes.status === 200) {
        setToolList(toolListRes.data.list);
        request.get(api.imageToolkit.version.latest).then((latestVersionRes) => {
          loading.close();
          if (latestVersionRes.status === 200) {
            setLatestVersion(latestVersionRes.data);
          } else {
            new Message({
              type: 'error',
              content: '获取最新版本信息失败',
            });
          }
        }).catch(() => {
          loading.close();
          new Message({
            type: 'error',
            content: '获取最新版本信息失败',
          });
        });
      } else {
        loading.close();
        new Message({
          type: 'error',
          content: '获取介绍失败',
        });
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: '获取介绍失败',
      });
    });
  }, []);

  useEffect(() => {
    pageIndexRef.current = pageIndex;
  }, [pageIndex]);

  useEffect(() => {
    toolCountRef.current = toolList.length;
  }, [toolList]);

  useScroll({
    target: elementRef?.current ? elementRef.current : undefined,
    callback: (delta) => {
      if (pageIndexRef.current <= toolCountRef.current && delta > 0) {
        setPageIndex(pageIndexRef.current + 1);
      }
      if (pageIndexRef.current > 0 && delta < 0) {
        setPageIndex(pageIndexRef.current - 1);
      }
    },
    debounce: 500,
    debounceOptions: { leading: true, trailing: false },
  });

  return (
    <div className={classes.root} ref={elementRef}>
      <HeadBar
        position="fixed"
        transparency={0}
        changeTransparencyOnScroll={false}
      />
      <div className="pages-wrapper" style={{ top: `calc(100% * -${pageIndex})` }}>
        <div className="page header">
          <img className="logo" src={Logo} />
          <div className="title">洋芋田图像工具箱</div>
          <div className="intro">一个适用于创意行业从业者的图像工具箱</div>
          <div className="actions">
            <Button
              className="action"
              color="primary"
              size="large"
              variant="contained"
              onClick={() => flipToPage(1)}
            >
              了解更多
            </Button>
            <Button
              className="action"
              color="primary"
              size="large"
              variant="contained"
              onClick={() => flipToPage(toolList.length + 1)}
            >
              下载
            </Button>
          </div>
        </div>
        {toolList.map((tool, toolIndex) => (
          <Container fixed key={tool.id} className="page content-wrapper">
            <div className="content">
              <div className="title">{tool.name}</div>
              <div className="tool-info">
                <div className="tool-intro">{tool.introduction}</div>
                <div className="tool-image-wrapper">
                  <img src={tool.image} className="tool-image" />
                </div>
              </div>
              <div className="actions">
                <Button
                  className="action"
                  color="primary"
                  size="large"
                  variant="outlined"
                  onClick={() => flipToPage(0)}
                  startIcon={<BackToTopIcon />}
                >
                  返回顶部
                </Button>
                <Button
                  className="action"
                  color="primary"
                  size="large"
                  variant="outlined"
                  onClick={() => flipToPage(toolIndex + 2)}
                  startIcon={<NextIcon />}
                >
                  继续了解
                </Button>
                <Button
                  className="action download"
                  color="primary"
                  size="large"
                  variant="outlined"
                  onClick={() => flipToPage(toolList.length + 1)}
                  startIcon={<DownloadIcon />}
                >
                  前往下载
                </Button>
              </div>
            </div>
          </Container>
        ))}
        <Container fixed className="page content-wrapper">
          <div className="content">
            <div className="title">下载安装包</div>
            <div className="latest-version-card-wrapper">
              <Card className="latest-version-card">
                <CardHeader
                  avatar={
                    <Avatar src={Logo} />
                  }
                  title={`最新版本号 ${latestVersion?.code}`}
                  titleTypographyProps={{ variant: 'subtitle1' }}
                  subheader={`发布于 ${moment(latestVersion?.pubDate).format('YYYY 年 MM 月 DD 日')}`}
                />
                <Divider />
                <CardContent>
                  {latestVersion?.features.split('\n').map((feature, featureIndex) => (
                    <Typography
                      key={feature}
                      align="justify"
                      variant="body1"
                      color="textSecondary"
                      paragraph={featureIndex < latestVersion?.features.split('\n').length - 1}
                    >
                      {feature}
                    </Typography>
                  ))}
                </CardContent>
                <CardActions>
                  <Button
                    color="primary"
                    onClick={() => window.open(latestVersion?.winPackage, '_blank')}
                  >
                    下载 Windows 版
                  </Button>
                  {latestVersion?.macPackage && (
                  <Button
                    color="primary"
                    onClick={() => window.open(latestVersion?.macPackage, '_blank')}
                  >
                    下载 Mac 版
                  </Button>
                  )}
                </CardActions>
              </Card>
            </div>
            <div className="actions">
              <Button
                onClick={() => history.push('/imagetoolkit/about')}
                className="action"
                color="primary"
                size="large"
                variant="contained"
                startIcon={<InfoIcon />}
              >
                更多信息
              </Button>
              <Button
                onClick={() => history.push('/imagetoolkit/changelog')}
                className="action"
                color="primary"
                size="large"
                variant="contained"
                startIcon={<HistoryIcon />}
              >
                历史版本
              </Button>
              <DropdownPanel
                dropdownElement={(
                  <Button
                    fullWidth
                    className="action download"
                    color="primary"
                    size="large"
                    variant="contained"
                    startIcon={<GroupIcon />}
                  >
                    加入用户群
                  </Button>
                )}
              >
                <div className={classes.popover}>
                  <MenuList>
                    <Typography variant="body1" align="center">QQ 群号：769574565</Typography>
                  </MenuList>
                  <img src={QRcode} />
                </div>
                <MenuList>
                  <MenuItem component="a" target="_blank" href="https://jq.qq.com/?_wv=1027&k=58umP3m">
                    点击链接加入 QQ 群
                  </MenuItem>
                </MenuList>
              </DropdownPanel>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default index;
