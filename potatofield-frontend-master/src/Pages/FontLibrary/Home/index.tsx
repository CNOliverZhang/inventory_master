import React, { useEffect, useState } from 'react';
import {
  Paper,
  Card,
  CardHeader,
  Avatar,
  Button,
  CardActions,
  Divider,
  IconButton,
  Container,
  useTheme,
} from '@mui/material';
import { GetApp as DownloadIcon } from '@mui/icons-material';

import Loading from '@/ImperativeComponents/Loading';
import Message from '@/ImperativeComponents/Message';
import HeadBar from '@/Components/HeadBar';
import DropdownPanel from '@/Components/DropdownPanel';
import Empty from '@/Components/Empty';
import api from '@/Apis';
import request from '@/Utils/Request';

import Logo from '@/Assets/Images/Global/Logo.png';

import styles from './styles';
import { FontFamily } from '../types';

const index: React.FC = () => {
  const [total, setTotal] = useState(0);
  const [fontFamilyList, setFontFamilyList] = useState<FontFamily[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const theme = useTheme();
  const classes = styles(theme);

  useEffect(() => {
    const loading = new Loading();
    request.get(api.fontLibrary.fontFamily.list, {
      params: searchKeyword ? {
        name: searchKeyword,
      } : undefined,
    }).then((res) => {
      loading.close();
      if (res.status === 200) {
        setFontFamilyList(res.data.list);
      } else {
        new Message({
          type: 'error',
          content: '获取字体失败',
        });
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: '获取字体失败',
      });
    });
  }, [searchKeyword]);

  useEffect(() => {
    request.get(api.fontLibrary.fontFamily.list).then((res) => {
      if (res.status === 200) {
        setTotal(res.data.count);
      } else {
        new Message({
          type: 'error',
          content: '获取字体数量失败',
        });
      }
    }).catch(() => {
      new Message({
        type: 'error',
        content: '获取字体数量失败',
      });
    });
  }, []);

  return (
    <div className={classes.root}>
      <HeadBar
        position="fixed"
        searchText="搜索字体名称"
        onSearch={(keyword) => {
          setSearchKeyword(keyword);
        }}
        searchThrottle={500}
        changeTransparencyScrollHeight="100vh"
      />
      <Paper square className="header">
        <img className="logo" src={Logo} />
        <div className="title">洋芋田字体库</div>
        <div className="intro">
          {`现已收录 ${total} 种不同字体`}
        </div>
      </Paper>
      <Container fixed maxWidth="xl" className="container">
        {fontFamilyList.length ? fontFamilyList.map((fontFamily) => (
          <div key={fontFamily.id} className="card-wrapper">
            <Card>
              <CardHeader
                avatar={
                  <Avatar className="card-icon">{fontFamily.language === 1 ? '中' : '英'}</Avatar>
                }
                title={fontFamily.name}
                titleTypographyProps={{ noWrap: true, variant: 'subtitle1' }}
                subheader={`共 ${fontFamily.fonts.length} 种样式可供下载`}
                classes={{ content: 'card-title' }}
                action={(
                  <DropdownPanel dropdownElement={(
                    <IconButton size="large">
                      <DownloadIcon />
                    </IconButton>
                  )}
                  >
                    {fontFamily.fonts.map((font, fontIndex) => (
                      <React.Fragment key={font.id}>
                        {fontIndex !== 0 && <Divider />}
                        <div className={classes.cardActionPanel}>
                          <img className="font-image" src={font.previewImage} />
                          <CardActions className="font-actions">
                            <div className="font-style">
                              字体样式：
                              {font.fontStyle.name}
                            </div>
                            <Button color="primary" href={font.fontFile} target="_blank">
                              下载
                            </Button>
                          </CardActions>
                        </div>
                      </React.Fragment>
                    ))}
                  </DropdownPanel>
                )}
              />
              {Boolean(fontFamily.fonts.length) && (
                <img className="card-media" src={fontFamily.fonts[0].previewImage} />
              )}
            </Card>
          </div>
        )) : (
          <Empty description="没有符合条件的字体" />
        )}
      </Container>
    </div>
  );
};

export default index;
