import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Container,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  MenuList,
  MenuItem,
  ListItemSecondaryAction,
  useTheme,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Archive as CategoryIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import Loading from '@/ImperativeComponents/Loading';
import Message from '@/ImperativeComponents/Message';
import Dialog from '@/ImperativeComponents/Dialog';
import DropdownPanel from '@/Components/DropdownPanel';
import Empty from '@/Components/Empty';
import HeadBar from '@/Components/HeadBar';
import request from '@/Utils/Request';
import findNode from '@/Utils/FindNode';
import api from '@/Apis';

import styles from './styles';
import CategoryFormComponent from './Components/CategoryForm';
import { Category, CategoryForm } from '../../types';

interface EditOptions {
  create: boolean;
}

const index: React.FC = () => {
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const categoryForm = useForm<CategoryForm>();
  const theme = useTheme();
  const classes = styles(theme);

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

  const editCategory = (values: CategoryForm, options: EditOptions = { create: false }) => {
    const loading = new Loading();
    request.post(api.blog.category[options.create ? 'add' : 'update'], values, {
      timeout: 10 * 60 * 1000,
    }).then((updateRes) => {
      loading.close();
      if (updateRes.status === 200) {
        new Message({
          type: 'success',
          content: `${options.create ? '添加' : '编辑'}分类成功`,
        });
        getCategoryTree();
        getCategoryList();
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: `${options.create ? '添加' : '编辑'}消息失败`,
      });
    });
  };

  const showEditCategoryDialog = (props?: { category?: Category, parentId?: number }) => {
    const { category, parentId } = props || {};
    categoryForm.reset(category || { name: undefined, parentId });
    const dialog: Dialog = new Dialog({
      title: `${category ? '编辑' : '添加'}分类`,
      content: (
        <CategoryFormComponent categoryTree={categoryTree} categoryForm={categoryForm} />
      ),
      onConfirm: async () => {
        const valid = await categoryForm.trigger();
        if (valid) {
          categoryForm.handleSubmit((values) => {
            if (
              (
                values.parentId
                && category?.children
                && findNode(category.children, values.parentId)
              ) || (
                category
                && values.parentId === category.id
              )
            ) {
              new Message({
                type: 'warning',
                content: '分类的父分类不能是其后代分类或其自身',
              });
            } else if (
              (
                category
                  ? categoryList.filter((item) => item.id !== category.id)
                  : categoryList
              ).find((item) => item.name === values.name)
            ) {
              new Message({
                type: 'warning',
                content: '分类名称不能重复',
              });
            } else {
              dialog.close();
              editCategory(values, category ? undefined : { create: true });
            }
          })();
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

  const removeCategory = (category: Category) => {
    new Dialog({
      title: '操作确认',
      content: `是否确认删除分类“${category.name}”？`,
      onConfirm: () => {
        const loading = new Loading();
        request.post(api.blog.category.remove, {
          id: category.id,
        }).then((res) => {
          loading.close();
          if (res.status === 200) {
            new Message({
              type: 'success',
              content: '删除分类成功',
            });
            getCategoryTree();
            getCategoryList();
          } else {
            new Message({
              type: 'error',
              content: '删除分类失败',
            });
          }
        }).catch(() => {
          loading.close();
          new Message({
            type: 'error',
            content: '删除分类失败',
          });
        });
      },
    });
  };

  const renderCategoryTree = (nodes: Category[], depth: number): JSX.Element => (
    <React.Fragment key={String(depth)}>
      {nodes.map((item) => {
        if (item.children) {
          return (
            <React.Fragment key={String(item.id)}>
              <ListItem
                button
                ContainerComponent="div"
                classes={{ container: 'item-wrapper' }}
                style={{
                  paddingLeft: `${depth}em`,
                }}
              >
                <ListItemText
                  primary={item.name}
                />
                <ListItemSecondaryAction>
                  <DropdownPanel
                    dropdownElement={(
                      <IconButton size="large">
                        <MoreIcon />
                      </IconButton>
                    )}
                  >
                    <MenuList>
                      <MenuItem
                        onClick={() => showEditCategoryDialog({ parentId: item.id })}
                      >
                        添加子分类
                      </MenuItem>
                      <MenuItem
                        onClick={() => showEditCategoryDialog({ category: item })}
                      >
                        编辑
                      </MenuItem>
                      <MenuItem onClick={() => removeCategory(item)}>删除</MenuItem>
                    </MenuList>
                  </DropdownPanel>
                </ListItemSecondaryAction>
              </ListItem>
              <Collapse
                in
                timeout="auto"
                unmountOnExit
              >
                <List disablePadding>
                  {renderCategoryTree(item.children, depth + 2)}
                </List>
              </Collapse>
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={String(item.id)}>
            <ListItem
              button
              ContainerComponent="div"
              classes={{ container: 'item-wrapper' }}
              style={{
                paddingLeft: `${depth}em`,
              }}
            >
              <ListItemText
                primary={item.name}
              />
              <ListItemSecondaryAction>
                <DropdownPanel
                  dropdownElement={(
                    <IconButton size="large">
                      <MoreIcon />
                    </IconButton>
                  )}
                >
                  <MenuList>
                    <MenuItem
                      onClick={() => showEditCategoryDialog({ parentId: item.id })}
                    >
                      添加子分类
                    </MenuItem>
                    <MenuItem
                      onClick={() => showEditCategoryDialog({ category: item })}
                    >
                      编辑
                    </MenuItem>
                    <MenuItem onClick={() => removeCategory(item)}>删除</MenuItem>
                  </MenuList>
                </DropdownPanel>
              </ListItemSecondaryAction>
            </ListItem>
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );

  useEffect(() => {
    getCategoryTree();
    getCategoryList();
  }, []);

  return (
    <div className={classes.root}>
      <HeadBar
        title="分类管理"
        changeTransparencyOnScroll={false}
      />
      <Container maxWidth="md" className="card-wrapper">
        <Card className="card">
          <CardHeader
            avatar={(
              <Avatar className="card-icon">
                <CategoryIcon />
              </Avatar>
            )}
            action={(
              <IconButton onClick={() => showEditCategoryDialog()} size="large">
                <AddIcon />
              </IconButton>
            )}
            title="分类树"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <Divider />
          <CardContent>
            {categoryTree.length ? (
              <List disablePadding>
                {renderCategoryTree(categoryTree, 1)}
              </List>
            ) : (
              <Empty description="暂无分类" />
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default index;
