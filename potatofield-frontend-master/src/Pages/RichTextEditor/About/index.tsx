import React from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Container,
  Typography,
  Link,
  useTheme,
} from '@mui/material';
import {
  Copyright as CopyrightIcon,
  Feedback as FeedbackIcon,
} from '@mui/icons-material';

import HeadBar from '@/Components/HeadBar';

import projects from './Constants/projects';
import styles from './styles';

const index: React.FC = () => {
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <div className={classes.root}>
      <HeadBar
        title="关于"
        changeTransparencyOnScroll={false}
      />
      <Container maxWidth="md" className="cards-wrapper">
        <Card className="card">
          <CardHeader
            avatar={(
              <Avatar className="card-icon">
                <CopyrightIcon />
              </Avatar>
            )}
            title="开源信息"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <Divider />
          <CardContent>
            <Typography
              variant="body1"
              color="textSecondary"
              align="justify"
              paragraph
            >
              洋芋田富文本编辑器遵循 MIT 协议发布。您可以自由地下载、使用或再分发本软件及其源代码，也可以基于本软件的源代码修改衍生以及开发新的软件。
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              align="justify"
              paragraph
            >
              本软件源代码托管在
              <Link underline="none" target="_blank" href="https://github.com/CNOliverZhang/potatofield-richtext-editor">&nbsp;Github&nbsp;</Link>
              和
              <Link underline="none" target="_blank" href="https://gitee.com/cnoliverzhang/potatofield-richtext-editor">&nbsp;码云&nbsp;</Link>
              ，您从这两种途径都能够获取完整的源代码，请点击前面的链接查看。
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              align="justify"
              paragraph
            >
              本软件开发过程中使用了下列开源软件或组件：
            </Typography>
            <div className="chips-wrapper">
              {projects.map((project) => (
                <Chip
                  key={project.title}
                  label={(
                    <Typography variant="body1">{project.title}</Typography>
                  )}
                  onClick={() => window.open(project.url)}
                  color="primary"
                  className="chip"
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="card">
          <CardHeader
            avatar={(
              <Avatar className="card-icon">
                <FeedbackIcon />
              </Avatar>
            )}
            title="反馈交流"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <Divider />
          <CardContent>
            <Typography
              variant="body1"
              color="textSecondary"
              align="justify"
            >
              开源软件的发展离不开开发者的贡献，同样离不开用户的反馈和建议，真诚希望并欢迎您针对本软件的问题提出问题和建议。
              您可以发送邮件到
              <Link underline="none" target="_blank" href="mailto://admin@potatofield.cn">&nbsp;admin@potatofield.cn&nbsp;</Link>
              向我们反馈；也可以
              <Link underline="none" target="_blank" href="https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=3fPEC&businessType=9&from=246610&biz=ka">&nbsp;点击这里&nbsp;</Link>
              加入洋芋田 QQ 频道更直接地与我们交流。
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default index;
