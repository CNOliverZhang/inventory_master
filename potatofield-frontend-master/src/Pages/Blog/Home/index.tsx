import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Paper,
  Typography,
  Pagination,
  useMediaQuery,
  IconButton,
  useTheme,
} from '@mui/material';
import { useLocation, useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faWeixin, faGithub } from '@fortawesome/free-brands-svg-icons';
import moment from 'moment';

import HeadBar from '@/Components/HeadBar';
import Empty from '@/Components/Empty';
import DropdownPanel from '@/Components/DropdownPanel';
import Message from '@/ImperativeComponents/Message';
import Loading from '@/ImperativeComponents/Loading';
import request from '@/Utils/Request';
import api from '@/Apis';
import useUser from '@/Contexts/User';

import Background from '@/Assets/Images/Blog/Home/Background.webp';
import Logo from '@/Assets/Images/Global/Logo.png';
import QRcode from '@/Assets/Images/Blog/Home/QRcode.jpeg';

import styles from './styles';
import { BlogArticleBasicInfo } from '../Article/types';

const index: React.FC = () => {
  const [page, setPage] = useState(Number((new URLSearchParams(useLocation().search)).get('page')) || 1);
  const [articleCount, setArticleCount] = useState(0);
  const [articleList, setArticleList] = useState<BlogArticleBasicInfo[]>([]);
  const history = useHistory();
  const { user } = useUser();
  const headerEle = useRef<HTMLDivElement>(null);
  const listWrapperEle = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('md'));
  const classes = styles(theme);

  const getArticleList = () => {
    const loading = new Loading();
    request.get(api.blog.article.list, {
      params: {
        page,
        includeDraft: false,
        size: 10,
      },
    }).then((res) => {
      loading.close();
      if (res.status === 200) {
        if (res.data.list.length === 0 && res.data.count !== 0) {
          setPage(1);
        } else {
          setArticleCount(res.data.count);
          setArticleList(res.data.list);
        }
      } else {
        new Message({
          type: 'error',
          content: '获取博客文章列表失败',
        });
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: '获取博客文章列表失败',
      });
    });
  };

  const changePage = (pageIndex: number) => {
    setPage(pageIndex);
    if (bigScreen) {
      listWrapperEle.current?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      document.getElementById('root')?.scrollTo({
        top: headerEle.current?.clientHeight || 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    getArticleList();
  }, [page]);

  return (
    <div className={classes.root}>
      <HeadBar position="fixed" changeTransparencyOnScroll={!bigScreen} transparency={bigScreen ? 0 : 1} />
      <Paper
        ref={headerEle}
        square
        className="side-bar"
        style={{
          backgroundImage: `url(${Background})`,
        }}
      >
        <div className="cover" />
        <img src={Logo} className="logo" />
        <Typography variant="h5" className="content" paragraph>马铃薯田地</Typography>
        <Typography variant="subtitle1" className="content">一个非典型程序员的博客</Typography>
        <div className="icons-wrapper">
          <IconButton onClick={() => history.push('/')}>
            <FontAwesomeIcon icon={faHome} />
          </IconButton>
          <DropdownPanel
            dropdownElement={(
              <IconButton>
                <FontAwesomeIcon icon={faWeixin} />
              </IconButton>
            )}
          >
            <div className={classes.popover}>
              <img src={QRcode} />
            </div>
          </DropdownPanel>
          <IconButton href="https://github.com/CNOliverZhang" target="_blank">
            <FontAwesomeIcon icon={faGithub} />
          </IconButton>
        </div>
        <Typography variant="body1" color="textSecondary" className="introduction">一只 95 后程序员，靠写前端混饭吃，也确实喜欢前端和全栈技术。热爱摄影，热爱写东西。日常很沙雕，偶尔也会文艺。</Typography>
      </Paper>
      <div className="content-wrapper" ref={listWrapperEle}>
        <div className="article-list">
          {!articleList.length && (
            <Paper className="article">
              <Empty description="暂无符合条件的文章" />
            </Paper>
          )}
          {articleList.map((article: BlogArticleBasicInfo) => (
            <Paper key={article.id} className="article">
              {article.coverImage && (
                <img className="article-cover-image" src={article.coverImage} />
              )}
              <div className="article-info">
                <Typography className="article-title" variant="h6">{article.title}</Typography>
                <Typography variant="body2" color="GrayText" paragraph>
                  {moment(article.publishTime).format('YYYY 年 MM 月 DD 日')}
                </Typography>
                <Typography
                  align="justify"
                  variant="body1"
                  color="textSecondary"
                  className="article-intro"
                >
                  {article.introduction || article.subtitle || article.content}
                </Typography>
                <div className="article-actions">
                  <div className="article-action-button-wrapper">
                    {user?.isAdmin && (
                    <Button
                      variant="text"
                      color="primary"
                      className="article-action-button"
                      onClick={() => window.open(`/blog/article/editor?id=${article.id}`, '_blank')}
                    >
                      编辑
                    </Button>
                    )}
                    <Button
                      variant="text"
                      color="primary"
                      className="article-action-button"
                      onClick={() => window.open(`/blog/article/detail?id=${article.id}`, '_blank')}
                    >
                      阅读
                    </Button>
                  </div>
                </div>
              </div>
            </Paper>
          ))}
        </div>
        <Pagination
          className="pagination"
          count={Math.ceil(articleCount / 10) || 1}
          page={page}
          onChange={(event, newPage) => changePage(newPage)}
        />
      </div>
    </div>
  );
};

export default index;
