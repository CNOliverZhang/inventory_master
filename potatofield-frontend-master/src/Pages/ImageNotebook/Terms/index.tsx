/*
 * @Author: CNOliverZhang cnoliverzhang@gmail.com
 * @Date: 2024-01-22 20:18:47
 * @LastEditors: CNOliverZhang cnoliverzhang@gmail.com
 * @LastEditTime: 2024-01-22 20:21:30
 * @FilePath: /potatofield-frontend/src/Pages/ImageNotebook/Terms/index.tsx
 * @Description: 
 */
import React from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Container,
  useTheme,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock as PrivacyIcon, faFileSignature as EulaIcon } from '@fortawesome/free-solid-svg-icons';

import HeadBar from '@/Components/HeadBar';

import eula from './HtmlFiles/eula.html?raw';
import privacy from './HtmlFiles/privacy.html?raw';

import styles from './styles';

const index: React.FC = () => {
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <div className={classes.root}>
      <HeadBar
        title="法律信息"
        changeTransparencyOnScroll={false}
      />
      <Container maxWidth="md" className="cards-wrapper">
        <Card className="card" id="eula">
          <CardHeader
            avatar={(
              <Avatar className="card-icon">
                <FontAwesomeIcon icon={EulaIcon} />
              </Avatar>
            )}
            title="洋芋田图笔记本使用协议"
            subheader="最新版本生效时间：2024 年 1 月 22 日"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <Divider />
          <CardContent>
            <div className="raw-html-content" dangerouslySetInnerHTML={{ __html: eula }} />
          </CardContent>
        </Card>
        <Card className="card" id="privacy">
          <CardHeader
            avatar={(
              <Avatar className="card-icon">
                <FontAwesomeIcon icon={PrivacyIcon} />
              </Avatar>
            )}
            title="洋芋田图笔记本隐私政策"
            subheader="最新版本生效时间：2024 年 1 月 22 日"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <Divider />
          <CardContent>
            <div className="raw-html-content" dangerouslySetInnerHTML={{ __html: privacy }} />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default index;
