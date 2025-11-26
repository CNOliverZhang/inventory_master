import React, { useEffect, useRef, useState } from 'react';
import {
  Container,
  Button,
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
  Info as InfoIcon,
  History as HistoryIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import moment from 'moment';
import Vditor from 'vditor';
import { useHistory } from 'react-router-dom';

import Loading from '@/ImperativeComponents/Loading';
import Message from '@/ImperativeComponents/Message';
import HeadBar from '@/Components/HeadBar';
import request from '@/Utils/Request';
import api from '@/Apis';

import Logo from '@/Assets/Images/ImageToolkit/Logo.png';

import styles from './styles';
import introMd from './introduction.md?raw';
import { Version } from '../types';

const index: React.FC = () => {
  const [latestVersion, setLatestVersion] = useState<Version>();
  const [introHtml, setIntroHtml] = useState('');
  const history = useHistory();
  const theme = useTheme();
  const classes = styles(theme);

  const getLatestVersion = () => {
    const loading = new Loading();
    request.get(api.richTextEditor.version.latest).then((latestVersionRes) => {
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
  };

  useEffect(() => {
    getLatestVersion();
    Vditor.md2html(introMd).then((value) => setIntroHtml(value));
  }, []);

  const scrollToIntro = () => {
    const rootEle = document.getElementById('root') as HTMLDivElement;
    const windowHeight = window.screen.height;
    rootEle.scrollTo({ top: windowHeight, behavior: 'smooth' });
  }

  const scrollToBottom = () => {
    const rootEle = document.getElementById('root') as HTMLDivElement;
    const pageHeight = rootEle.scrollHeight;
    rootEle.scrollTo({ top: pageHeight, behavior: 'smooth' });
  };

  return (
    <div className={classes.root}>
      <HeadBar position="fixed" />
      <div className="page">
        <img className="logo" src="https://files.potatofield.cn/Static/RichTextEditor/preview-main.webp" />
        <div className="title">洋芋田富文本编辑器</div>
        <div className="intro">一款漂亮的富文本编辑器</div>
        <div className="actions">
          <Button
            className="action"
            color="primary"
            size="large"
            variant="contained"
            onClick={scrollToIntro}
          >
            了解更多
          </Button>
          <Button
            className="action"
            color="primary"
            size="large"
            variant="contained"
            onClick={scrollToBottom}
          >
            下载
          </Button>
        </div>
      </div>
      <Container maxWidth="md" fixed className="content-wrapper">
        <div className="raw-html-content" dangerouslySetInnerHTML={{ __html: introHtml }} />
      </Container>
      <div className="page">
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
            onClick={() => history.push('/richtexteditor/about')}
            className="action"
            color="primary"
            size="large"
            variant="contained"
            startIcon={<InfoIcon />}
          >
            更多信息
          </Button>
          <Button
            onClick={() => history.push('/richtexteditor/changelog')}
            className="action"
            color="primary"
            size="large"
            variant="contained"
            startIcon={<HistoryIcon />}
          >
            历史版本
          </Button>
          <Button
            onClick={() => window.open('https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=3fPEC&businessType=9&from=246610&biz=ka')}
            className="action"
            color="primary"
            size="large"
            variant="contained"
            startIcon={<GroupIcon />}
          >
            加入 QQ 频道
          </Button>
        </div>
      </div>
    </div>
  );
};

export default index;
