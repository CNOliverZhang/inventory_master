import React, { useEffect, useState } from 'react';
import {
  Card,
  Container,
  useTheme,
  Tabs,
  Tab,
} from '@mui/material';
import Vditor from 'vditor';

import HeadBar from '@/Components/HeadBar';

import styles from './styles';

const docs = import.meta.glob(`./MdFiles/*.md`, { eager: true, as: 'raw' });
const defaultDoc = 'introduction';

const index: React.FC = () => {
  const theme = useTheme();
  const classes = styles(theme);
  const [currentDoc, setCurrentDoc] = useState(window.location.hash?.slice(1) || defaultDoc);
  const [currentDocHtml, setCurrentDocHtml] = useState('');

  const changeCurrentDoc = (value: string) => {
    setCurrentDoc(value);
    window.location.hash = value;
  };

  useEffect(() => {
    setCurrentDoc(window.location.hash?.slice(1) || defaultDoc);
  }, [window.location.hash]);

  useEffect(() => {
    Vditor.md2html(docs[`./MdFiles/${currentDoc}.md`] || docs[`./MdFiles/empty.md`]).then((value) => setCurrentDocHtml(value));
  }, [currentDoc]);

  return (
    <div className={classes.root}>
      <HeadBar
        title="使用文档"
        changeTransparencyOnScroll={false}
      />
      <Container maxWidth="md" className="content-wrapper">
        <Card className="navigator-wrapper">
          <Tabs className="navigator" value={currentDoc} onChange={(event, value) => changeCurrentDoc(value)} orientation="vertical" variant="scrollable">
            <Tab className="navigator-item" value="introduction" label="简介" />
            <Tab className="navigator-item" value="upload" label="图片上传" />
            <Tab className="navigator-item child" value="upload-tcloud" label="腾讯云 COS" />
            <Tab className="navigator-item child" value="upload-tucang" label="图仓" />
            {/* <Tab className="navigator-item" value="style" label="富文本样式" />
            <Tab className="navigator-item child" value="style-custom" label="自定义" />
            <Tab className="navigator-item child" value="style-preset" label="从库中选取" />
            <Tab className="navigator-item child" value="style-code" label="代码样式" />
            <Tab className="navigator-item" value="output" label="内容输出" />
            <Tab className="navigator-item child" value="output-image" label="保存为图片" />
            <Tab className="navigator-item child" value="output-copy" label="复制富文本" /> */}
          </Tabs>
        </Card>
        <div className="content">
          <div className="raw-html-content" dangerouslySetInnerHTML={{ __html: currentDocHtml }} />
        </div>
      </Container>
    </div>
  );
};

export default index;
