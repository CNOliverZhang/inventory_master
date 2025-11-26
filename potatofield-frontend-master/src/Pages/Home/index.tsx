import React, { useState } from 'react';
import {
  Button,
  Paper,
  Avatar,
  Card,
  CardHeader,
  CardMedia,
  Typography,
  useTheme,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Dialog from '@/ImperativeComponents/Dialog';
import useScroll from '@/Utils/Scroll';

import links from './Constants/links';
import styles from './styles';
import HeadBar from '@/Components/HeadBar';

const home: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIcp, setShowIcp] = useState(false);
  const history = useHistory();
  const theme = useTheme();
  const classes = styles(theme);

  const navigateTo = (path: string | null) => {
    if (!path) {
      new Dialog({
        title: '暂未完成',
        content: '该模块暂未开发完毕，敬请期待。',
        showCancel: false,
      });
    } else {
      history.push(path);
    }
  };

  useScroll({
    callback: (delta) => {
      setShowIcp(delta > 0);
    },
  });

  return (
    <div className={classes.root}>
      <HeadBar position="fixed" changeTransparencyOnScroll={false} transparency={0} />
      <div className="content-wrapper">
        <div className="info-wrapper">
          <Card className="info">
            <CardHeader
              avatar={(
                <Avatar
                  style={{
                    backgroundColor: links[currentIndex].color,
                  }}
                >
                  <FontAwesomeIcon width={16} icon={links[currentIndex].icon} />
                </Avatar>
            )}
              title={links[currentIndex].title}
              titleTypographyProps={{ variant: 'h5' }}
            />
            <CardMedia
              className="info-background"
              image={links[currentIndex].image}
            >
              <div className="info-cover">
                <Button
                  className="text"
                  onClick={() => {
                    navigateTo(links[currentIndex].path);
                  }}
                  style={{
                    color: links[currentIndex].color,
                    borderColor: links[currentIndex].color,
                  }}
                >
                  <Typography variant="h5">立即前往</Typography>
                </Button>
              </div>
            </CardMedia>
          </Card>
        </div>
        <div className="dock-wrapper">
          <div className="upholder" />
          <div className="dock">
            {links.map((link, index) => (
              <Paper
                key={link.title}
                className={`link ${currentIndex === index ? 'active' : 'inactive'}`}
                onMouseEnter={() => {
                  setCurrentIndex(index);
                }}
                style={{
                  fontSize: currentIndex === index ? 72 : 60,
                  backgroundColor: link.color,
                }}
              >
                <div className="upholder" />
                <FontAwesomeIcon width={16} icon={link.icon} />
              </Paper>
            ))}
          </div>
        </div>
      </div>
      <Paper
        square
        className="code"
        style={{
          height: showIcp ? 100 : 0,
          opacity: showIcp ? 1 : 0,
        }}
      >
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noreferrer"
        >
          粤 ICP 备 2021110713 号 - 1
        </a>
        <a
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030502007850"
          target="_blank"
          rel="noreferrer"
        >
          粤公网安备 44030502007850 号
        </a>
      </Paper>
    </div>
  );
};

export default home;
