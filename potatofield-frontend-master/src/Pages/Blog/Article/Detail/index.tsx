import React, { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useLocation, useHistory } from 'react-router';
import moment from 'moment';
import Vditor from 'vditor';
import hljs from 'highlight.js';

import HeadBar from '@/Components/HeadBar';
import Message from '@/ImperativeComponents/Message';
import Loading from '@/ImperativeComponents/Loading';
import request from '@/Utils/Request';
import config from '@/Configs';
import api from '@/Apis';
import { websiteUrl, cosUrl } from '@/Apis/baseUrl';

import Logo from '@/Assets/Images/Global/Logo.png';

import styles from './styles';
import { BlogArticle } from '../types';

interface SignatureObject {
  timestamp: number;
  randomString: string;
  signature: string;
}

const index: React.FC = () => {
  const id = (new URLSearchParams(useLocation().search)).get('id');
  const [article, setArticle] = useState<BlogArticle>();
  const [articleContent, setArticleContent] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const history = useHistory();
  const recommendContainerElement = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('md'));
  const classes = styles(theme);

  const initWechatShare = (articleInfo: BlogArticle, signatureObject: SignatureObject) => {
    window.wx.config({
      appId: config.wechatOfficialAccount.appid,
      timestamp: Number(signatureObject.timestamp),
      nonceStr: signatureObject.randomString,
      signature: signatureObject.signature,
      jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'],
    });
    window.wx.ready(() => {
      window.wx.updateAppMessageShareData({
        title: articleInfo.title,
        desc: articleInfo.subtitle || articleInfo.introduction || articleInfo.content,
        link: `${websiteUrl}/blog/article/detail?id=${articleInfo.id}`,
        imgUrl: articleInfo.coverImage || `${cosUrl}/Static/Logo.png`,
      });
      window.wx.updateTimelineShareData({
        title: articleInfo.title,
        link: `${websiteUrl}/blog/article/detail?id=${articleInfo.id}`,
        imgUrl: articleInfo.coverImage || `${cosUrl}/Static/Logo.png`,
      });
    });
  };

  const getArticle = () => {
    const loading = new Loading();
    request.get(api.blog.article.detail, {
      params: {
        id,
      },
    }).then((res) => {
      if (res.status === 200) {
        setArticle(res.data);
        Vditor.md2html(res.data.content).then((html) => {
          const div = document.createElement('div');
          div.innerHTML = html;
          div.querySelectorAll('pre code').forEach((value) => {
            hljs.highlightElement(value as HTMLElement);
          });
          setArticleContent(div.innerHTML);
          loading.close();
        });
      } else {
        loading.close();
        new Message({
          type: 'error',
          content: '获取博客文章失败',
        });
        history.replace('/blog/article');
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: '获取博客文章失败',
      });
      history.replace('/blog/article');
    });
  };

  const recommendScrollHandler = (event: WheelEvent) => {
    recommendContainerElement.current?.scrollBy({
      left: event.deltaY / 2,
      behavior: 'smooth',
    });
    event.preventDefault();
  };

  const bindRecommendScroll = () => {
    recommendContainerElement.current?.addEventListener('wheel', recommendScrollHandler);
  };

  const unbindRecommendScroll = () => {
    recommendContainerElement.current?.removeEventListener('wheel', recommendScrollHandler);
  };

  useEffect(() => {
    if (id) {
      getArticle();
    } else {
      history.replace('/blog/article');
    }
    recommendContainerElement.current?.addEventListener('mouseenter', bindRecommendScroll);
    recommendContainerElement.current?.addEventListener('mouseleave', unbindRecommendScroll);
    return () => {
      recommendContainerElement.current?.removeEventListener('mouseenter', bindRecommendScroll);
      recommendContainerElement.current?.removeEventListener('mouseleave', unbindRecommendScroll);
    };
  }, []);

  useEffect(() => {
    const changePageTitle = () => {
      if (Number(document.getElementById('root')?.scrollTop) > 200) {
        setPageTitle(article?.title || '');
      } else {
        setPageTitle('');
      }
    };
    document.getElementById('root')?.addEventListener('scroll', changePageTitle);
    if (article) {
      request.get(api.service.wechat.getJsSdkSignature, {
        params: {
          url: window.location.href,
        },
      }).then((res) => {
        if (res.status === 200) {
          initWechatShare(article, res.data);
        }
      });
    }
    return () => {
      document.getElementById('root')?.removeEventListener('scroll', changePageTitle);
    };
  }, [article]);

  return (
    <div className={classes.root}>
      <HeadBar position="sticky" title={pageTitle || '阅读文章'} changeTransparencyScrollHeight="10vh" />
      <Container maxWidth="lg" fixed className="article-container">
        <Card className="info-card">
          {article?.coverImage && (
            <img className="cover-image" src={article.coverImage} />
          )}
          <div className="info">
            <div className="title-wrapper">
              <Tooltip title={article?.title || ''}>
                <Typography
                  variant={bigScreen ? 'h5' : 'h6'}
                  className="single-line"
                  gutterBottom={!bigScreen}
                  paragraph={bigScreen}
                >
                  {article?.title}
                </Typography>
              </Tooltip>
            </div>
            <Typography
              variant="subtitle2"
              color="GrayText"
              className="single-line"
              gutterBottom
            >
              日期：
              {moment(article?.publishTime).format('YYYY 年 MM 月 DD 日')}
            </Typography>
            <Typography
              variant="subtitle2"
              color="GrayText"
              className="single-line"
              gutterBottom={!bigScreen}
              paragraph={bigScreen}
            >
              分类：
              {article?.category?.name || '暂无分类'}
            </Typography>
            {bigScreen && (
              <>
                <Divider className="article-info-divider" />
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  className="article-intro single-line"
                >
                  {article?.subtitle || article?.introduction || article?.content}
                </Typography>
              </>
            )}
          </div>
        </Card>
        <div className="detail-info">
          <Accordion defaultExpanded={false} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">文章详细信息</Typography>
            </AccordionSummary>
            {!bigScreen && (
              <AccordionDetails>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  副标题
                </Typography>
                <Typography variant="body1">
                  {article?.subtitle || '暂无'}
                </Typography>
              </AccordionDetails>
            )}
            <AccordionDetails>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                文章标签
              </Typography>
              {article?.tags?.length ? (
                <div className="tags-container">
                  {article.tags.map((tag) => (
                    <Chip
                      color="primary"
                      className="tag"
                      key={tag.name}
                      label={(
                        <Typography variant="body1">{tag.name}</Typography>
                      )}
                    />
                  ))}
                </div>
              ) : (
                <Typography variant="body1">
                  暂无标签
                </Typography>
              )}
            </AccordionDetails>
            <AccordionDetails>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                最近修改时间
              </Typography>
              <Typography variant="body1">
                {moment(article?.updateTime).format('YYYY 年 MM 月 DD 日')}
              </Typography>
            </AccordionDetails>
            {!bigScreen && !article?.subtitle && (
              <AccordionDetails>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  摘要
                </Typography>
                <Typography variant="body1">
                  {article?.introduction || '暂无'}
                </Typography>
              </AccordionDetails>
            )}
          </Accordion>
        </div>
        <Card className="content-card">
          <div className="raw-html-content" dangerouslySetInnerHTML={{ __html: articleContent }} />
        </Card>
        <Typography variant="h6" className="recommend-article-title">
          相关文章
        </Typography>
      </Container>
      <div className="recommend-scroll-wrapper" ref={recommendContainerElement}>
        {(article?.relevantArticles || []).map((relevantArticle) => (
          <div className="recommend-card-wrapper" key={relevantArticle.id}>
            <Card className="recommend-card" onClick={() => window.open(`/blog/article/detail?id=${relevantArticle.id}`)}>
              <CardContent className="recommend-card-content">
                <Typography variant="h6" className="recommend-article-title">
                  {relevantArticle.title}
                </Typography>
                <Typography
                  align="justify"
                  variant="body1"
                  color="textSecondary"
                  className="recommend-article-intro"
                >
                  {relevantArticle.introduction || relevantArticle.content}
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <div className="footer">
        <img src={Logo} className="icon" />
        洋芋田
      </div>
    </div>
  );
};

export default index;
