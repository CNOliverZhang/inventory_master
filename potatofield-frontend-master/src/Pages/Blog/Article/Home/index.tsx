import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  FormLabel,
  Paper,
  TextField,
  Typography,
  Autocomplete,
  Pagination,
  Switch,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as FilterIcon,
} from '@mui/icons-material';
import moment from 'moment';

import HeadBar from '@/Components/HeadBar';
import TreeSelect from '@/Components/TreeSelect';
import Empty from '@/Components/Empty';
import Message from '@/ImperativeComponents/Message';
import Loading from '@/ImperativeComponents/Loading';
import Dialog from '@/ImperativeComponents/Dialog';
import request from '@/Utils/Request';
import api from '@/Apis';
import useUser from '@/Contexts/User';

import styles from './styles';
import { BlogArticleBasicInfo } from '../types';
import { BlogArticleTag, Category } from '../../types';
import useDebounce from '@/Utils/Debounce';

const index: React.FC = () => {
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const [includeDraft, setIncludeDraft] = useState(Boolean(user?.isAdmin));
  const [tagList, setTagList] = useState<BlogArticleTag[]>([]);
  const [selectedTagList, setSelectedTagList] = useState<BlogArticleTag[]>([]);
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [keyword, setKeyword] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [articleCount, setArticleCount] = useState(0);
  const [articleList, setArticleList] = useState<BlogArticleBasicInfo[]>([]);
  const searchPanelEle = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const classes = styles(theme);

  const getTagList = () => {
    request.get(api.blog.tag.list).then((res) => {
      if (res.status === 200) {
        setTagList(res.data.list);
      } else {
        new Message({
          type: 'error',
          content: '获取博客文章标签列表失败',
        });
      }
    }).catch(() => {
      new Message({
        type: 'error',
        content: '获取博客文章标签列表失败',
      });
    });
  };

  const getCategoryTree = () => {
    request.get(api.blog.category.getTree).then((res) => {
      if (res.status === 200) {
        setCategoryTree(res.data);
      } else {
        new Message({
          type: 'error',
          content: '获取分类树失败',
        });
      }
    }).catch(() => {
      new Message({
        type: 'error',
        content: '获取分类树失败',
      });
    });
  };

  const getCategoryList = () => {
    request.get(api.blog.category.list).then((res) => {
      if (res.status === 200) {
        setCategoryList(res.data.list);
      } else {
        new Message({
          type: 'error',
          content: '获取分类列表失败',
        });
      }
    }).catch(() => {
      new Message({
        type: 'error',
        content: '获取分类列表失败',
      });
    });
  };

  const getArticleList = () => {
    const loading = new Loading();
    request.get(api.blog.article.list, {
      params: {
        page,
        tagIdList: selectedTagList.map((tag) => tag.id),
        categoryId: selectedCategory?.id,
        title: searchTitle || undefined,
        includeDraft,
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

  const removeArticle = (article: BlogArticleBasicInfo) => {
    new Dialog({
      title: '操作确认',
      content: `是否确认删除文章《${article.title}》？`,
      onConfirm: () => {
        const loading = new Loading();
        request.post(api.blog.article.remove, {
          id: article.id,
        }).then((res) => {
          loading.close();
          if (res.status === 200) {
            new Message({
              type: 'success',
              content: '删除文章成功',
            });
            getArticleList();
          } else {
            new Message({
              type: 'error',
              content: '删除文章失败',
            });
          }
        }).catch(() => {
          loading.close();
          new Message({
            type: 'error',
            content: '删除文章失败',
          });
        });
      },
    });
  };

  const changeSelectedCategoey = (categoryId?: number) => {
    setSelectedCategory(categoryList.find((category) => category.id === categoryId));
  };

  const addTagToList = (tag: BlogArticleTag) => {
    if (!selectedTagList.find((selectedTag) => selectedTag.name === tag.name)) {
      setSelectedTagList([...selectedTagList, tag]);
    }
  };

  const removeTagFromList = (tagIndex: number) => {
    const newSelectedTagList = [...selectedTagList];
    newSelectedTagList.splice(tagIndex, 1);
    setSelectedTagList(newSelectedTagList);
  };

  const changePage = (pageIndex: number) => {
    setPage(pageIndex);
    document.getElementById('root')?.scrollTo({
      top: bigScreen ? 0 : searchPanelEle.current?.clientHeight || 0,
      behavior: 'smooth',
    });
  };

  const debouncedSearch = useRef(useDebounce(setSearchTitle, 500, { trailing: true }));

  useEffect(() => {
    debouncedSearch.current?.(keyword);
  }, [keyword]);

  useEffect(() => {
    getArticleList();
  }, [page, searchTitle, selectedTagList, selectedCategory, includeDraft]);

  useEffect(() => {
    getTagList();
    getCategoryTree();
    getCategoryList();
  }, []);

  return (
    <div className={classes.root}>
      <HeadBar title="文章列表" changeTransparencyOnScroll={false} />
      <Container maxWidth="lg" className="container">
        <div className="content-wrapper">
          <Card className="filters" ref={searchPanelEle}>
            <CardHeader
              avatar={(
                <Avatar className="card-icon">
                  <FilterIcon />
                </Avatar>
              )}
              title="筛选条件"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <Divider />
            <CardContent>
              <Typography variant="subtitle1" paragraph>
                根据标签筛选
              </Typography>
              {selectedTagList.length ? (
                <div className="tags-container">
                  {selectedTagList.map((tag, tagIndex) => (
                    <Chip
                      color="primary"
                      className="tag"
                      key={tag.name}
                      label={(
                        <Typography variant="body1">{tag.name}</Typography>
                      )}
                      onDelete={() => removeTagFromList(tagIndex)}
                    />
                  ))}
                </div>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  暂无标签
                </Typography>
              )}
              <Autocomplete
                className="tag-select"
                options={tagList}
                getOptionLabel={(tag: BlogArticleTag) => tag.name}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" label="添加标签" />
                )}
                onChange={(event, value) => value && addTagToList(value)}
              />
            </CardContent>
            <Divider />
            <CardContent>
              <Typography variant="subtitle1" paragraph>
                根据分类筛选
              </Typography>
              <TreeSelect
                tree={categoryTree}
                label="文章分类"
                value={selectedCategory?.id}
                onChange={changeSelectedCategoey}
                fullWidth
                allowClear
              />
            </CardContent>
            <Divider />
            <CardContent>
              <Typography variant="subtitle1" paragraph>
                标题模糊搜索
              </Typography>
              <TextField
                fullWidth
                label="输入标题关键字"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </CardContent>
            {user?.isAdmin && (
            <>
              <Divider />
              <CardContent>
                <Typography variant="subtitle1" paragraph>
                  根据状态筛选
                </Typography>
                <FormLabel>包含未发布文章</FormLabel>
                <Switch
                  onChange={(e) => setIncludeDraft(e.target.checked)}
                  checked={includeDraft}
                  color="primary"
                />
              </CardContent>
            </>
            )}
          </Card>
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
                  <div className="article-title">
                    <Typography className="article-title-text" variant="h6">{article.title}</Typography>
                    <div className="tags-container">
                      {article.isPublished && new Date(article.publishTime) > new Date() && (
                        <Chip
                          size="small"
                          className="article-title-tag"
                          label="定时发布"
                        />
                      )}
                      {!article.isPublished && (
                        <Chip
                          size="small"
                          className="article-title-tag"
                          label="草稿"
                        />
                      )}
                    </div>
                  </div>
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
                      <Button
                        variant="text"
                        color="primary"
                        className="article-action-button"
                        onClick={() => window.open(`/blog/article/detail?id=${article.id}`, '_blank')}
                      >
                        阅读
                      </Button>
                      {user?.isAdmin && (
                      <>
                        <Button
                          variant="text"
                          color="primary"
                          className="article-action-button"
                          onClick={() => window.open(`/blog/article/editor?id=${article.id}`, '_blank')}
                        >
                          编辑
                        </Button>
                        <Button
                          variant="text"
                          color="error"
                          className="article-action-button"
                          onClick={() => removeArticle(article)}
                        >
                          删除
                        </Button>
                      </>
                      )}
                    </div>
                  </div>
                </div>
              </Paper>
            ))}
          </div>
        </div>
        <Pagination
          count={Math.ceil(articleCount / 10) || 1}
          page={page}
          onChange={(event, newPage) => changePage(newPage)}
        />
      </Container>
    </div>
  );
};

export default index;
