import React from 'react';
import { RouteConfig } from 'react-router-config';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBalanceScale as TermsIcon,
  faFileCircleQuestion as DocsIcon,
  faHome as HomeIcon,
  faBook as BlogIcon,
  faFileAlt as BlogArticleIcon,
  faPenToSquare as BlogArticleEditorIcon,
  faBookOpen as BlogArticleDetailIcon,
  faBoxArchive as CategoryIcon,
  faTags as TagIcon,
  faPalette as ImageToolkitIcon,
  faWrench as ImageToolkitToolIcon,
  faFilePen as RichTextEditorIcon,
  faHistory as ChangeLogIcon,
  faCircleInfo as AboutIcon,
  faEnvelope as MessageIcon,
  faChartPie as AnalysticsIcon,
  faTags as ImageNotebookIcon,
  faFont as FontLibraryIcon,
  faUser as UserIcon,
  faAddressBook as UserDashboardIcon,
  faLockOpen as UserLoginIcon,
  faAddressCard as UserRegisterIcon,
  faSliders as SettingsIcon,
  faPhotoFilm as MediaCenterIcon,
} from '@fortawesome/free-solid-svg-icons';

import Website from '@/Pages';
import WebsiteHome from '@/Pages/Home';
import Blog from '@/Pages/Blog';
import BlogHome from '@/Pages/Blog/Home';
import BlogArticle from '@/Pages/Blog/Article';
import BlogArticleList from '@/Pages/Blog/Article/Home';
import BlogArticleDetail from '@/Pages/Blog/Article/Detail';
import BlogArticleEditor from '@/Pages/Blog/Article/Editor';
import BlogAdmin from '@/Pages/Blog/Admin';
import BlogCategoryAdmin from '@/Pages/Blog/Admin/Category';
import BlogTagAdmin from '@/Pages/Blog/Admin/Tag';
import ImageToolkit from '@/Pages/ImageToolkit';
import ImageToolkitHome from '@/Pages/ImageToolkit/Home';
import ImageToolkitAbout from '@/Pages/ImageToolkit/About';
import ImageToolkitAdmin from '@/Pages/ImageToolkit/Admin';
import ImageToolkitChangeLog from '@/Pages/ImageToolkit/ChangeLog';
import ImageToolkitToolAdmin from '@/Pages/ImageToolkit/Admin/Tool';
import ImageToolkitMessageAdmin from '@/Pages/ImageToolkit/Admin/Message';
import ImageToolkitAnalysisAdmin from '@/Pages/ImageToolkit/Admin/Analysis';
import RichTextEditor from '@/Pages/RichTextEditor';
import RichTextEditorHome from '@/Pages/RichTextEditor/Home';
import RichTextEditorAbout from '@/Pages/RichTextEditor/About';
import RichTextEditorTerms from '@/Pages/RichTextEditor/Terms';
import RichTextEditorDocs from '@/Pages/RichTextEditor/Docs';
import RichTextEditorAdmin from '@/Pages/RichTextEditor/Admin';
import RichTextEditorChangeLog from '@/Pages/RichTextEditor/ChangeLog';
import RichTextEditorAnalysisAdmin from '@/Pages/RichTextEditor/Admin/Analysis';
import ImageNotebook from '@/Pages/ImageNotebook';
import ImageNotebookHome from '@/Pages/ImageNotebook/Home';
import ImageNotebookAbout from '@/Pages/ImageNotebook/About';
import ImageNotebookTerms from '@/Pages/ImageNotebook/Terms';
import ImageNotebookDocs from '@/Pages/ImageNotebook/Docs';
import ImageNotebookAdmin from '@/Pages/ImageNotebook/Admin';
import ImageNotebookChangeLog from '@/Pages/ImageNotebook/ChangeLog';
import ImageNotebookAnalysisAdmin from '@/Pages/ImageNotebook/Admin/Analysis';
import FontLibrary from '@/Pages/FontLibrary';
import FontLibraryHome from '@/Pages/FontLibrary/Home';
import FontLibraryAdmin from '@/Pages/FontLibrary/Admin';
import User from '@/Pages/User';
import UserDashboard from '@/Pages/User/Dashboard';
import UserAuth from '@/Pages/User/Auth';
import UserLogin from '@/Pages/User/Auth/Login';
import UserRegister from '@/Pages/User/Auth/Register';
import MediaCenterAdmin from '@/Pages/MediaCenter';
import MediaCenterMediaFileAdmin from '@/Pages/MediaCenter/Home';
import MediaCenterTagAdmin from '@/Pages/MediaCenter/Tag';

export interface PotatofieldRouteConfig extends RouteConfig {
  expand?: boolean;
  showIfIsAdmin?: boolean;
  showIfAuthenticated?: boolean;
  hideIfAuthenticated?: boolean;
  hide?: boolean;
}

const rootRoute: PotatofieldRouteConfig = {
  path: '/',
  label: '洋芋田',
  component: Website,
  routes: [
    {
      path: '/',
      label: '首页',
      component: WebsiteHome,
      icon: <FontAwesomeIcon width={16} icon={HomeIcon} />,
      exact: true,
    },
    {
      path: '/blog',
      label: '博客',
      component: Blog,
      icon: <FontAwesomeIcon width={16} icon={BlogIcon} />,
      routes: [
        {
          path: '/blog',
          label: '首页',
          component: BlogHome,
          icon: <FontAwesomeIcon width={16} icon={HomeIcon} />,
          exact: true,
        },
        {
          path: '/blog/article',
          label: '文章',
          component: BlogArticle,
          expand: true,
          routes: [
            {
              path: '/blog/article',
              label: '文章列表',
              component: BlogArticleList,
              icon: <FontAwesomeIcon width={16} icon={BlogArticleIcon} />,
              exact: true,
            },
            {
              path: '/blog/article/detail',
              label: '文章详情',
              component: BlogArticleDetail,
              icon: <FontAwesomeIcon width={16} icon={BlogArticleDetailIcon} />,
              hide: true,
            },
            {
              path: '/blog/article/editor',
              label: '文章编辑器',
              component: BlogArticleEditor,
              icon: <FontAwesomeIcon width={16} icon={BlogArticleEditorIcon} />,
              showIfIsAdmin: true,
            },
          ],
        },
        {
          path: '/blog/admin',
          label: '管理',
          component: BlogAdmin,
          icon: <FontAwesomeIcon width={16} icon={SettingsIcon} />,
          showIfIsAdmin: true,
          routes: [
            {
              path: '/blog/admin/category',
              label: '分类管理',
              component: BlogCategoryAdmin,
              icon: <FontAwesomeIcon width={16} icon={CategoryIcon} />,
            },
            {
              path: '/blog/admin/tag',
              label: '标签管理',
              component: BlogTagAdmin,
              icon: <FontAwesomeIcon width={16} icon={TagIcon} />,
            },
          ],
        },
      ],
    },
    {
      path: '/imagetoolkit',
      label: '图像工具箱',
      component: ImageToolkit,
      icon: <FontAwesomeIcon width={16} icon={ImageToolkitIcon} />,
      routes: [
        {
          path: '/imagetoolkit',
          label: '介绍',
          component: ImageToolkitHome,
          icon: <FontAwesomeIcon width={16} icon={HomeIcon} />,
          exact: true,
        },
        {
          path: '/imagetoolkit/changelog',
          label: '更新历史',
          component: ImageToolkitChangeLog,
          icon: <FontAwesomeIcon width={16} icon={ChangeLogIcon} />,
        },
        {
          path: '/imagetoolkit/about',
          label: '关于',
          component: ImageToolkitAbout,
          icon: <FontAwesomeIcon width={16} icon={AboutIcon} />,
        },
        {
          path: '/imagetoolkit/admin',
          label: '管理',
          component: ImageToolkitAdmin,
          icon: <FontAwesomeIcon width={16} icon={SettingsIcon} />,
          showIfIsAdmin: true,
          routes: [
            {
              path: '/imagetoolkit/admin/tool',
              label: '功能管理',
              component: ImageToolkitToolAdmin,
              icon: <FontAwesomeIcon width={16} icon={ImageToolkitToolIcon} />,
            },
            {
              path: '/imagetoolkit/admin/message',
              label: '消息管理',
              component: ImageToolkitMessageAdmin,
              icon: <FontAwesomeIcon width={16} icon={MessageIcon} />,
            },
            {
              path: '/imagetoolkit/admin/analysis',
              label: '数据统计',
              component: ImageToolkitAnalysisAdmin,
              icon: <FontAwesomeIcon width={16} icon={AnalysticsIcon} />,
            },
          ],
        },
      ],
    },
    {
      path: '/richtexteditor',
      label: '富文本编辑器',
      component: RichTextEditor,
      icon: <FontAwesomeIcon width={16} icon={RichTextEditorIcon} />,
      routes: [
        {
          path: '/richtexteditor',
          label: '介绍',
          component: RichTextEditorHome,
          icon: <FontAwesomeIcon width={16} icon={HomeIcon} />,
          exact: true,
        },
        {
          path: '/richtexteditor/changelog',
          label: '更新历史',
          component: RichTextEditorChangeLog,
          icon: <FontAwesomeIcon width={16} icon={ChangeLogIcon} />,
        },
        {
          path: '/richtexteditor/docs',
          label: '使用文档',
          component: RichTextEditorDocs,
          icon: <FontAwesomeIcon width={16} icon={DocsIcon} />,
        },
        {
          path: '/richtexteditor/about',
          label: '关于',
          component: RichTextEditorAbout,
          icon: <FontAwesomeIcon width={16} icon={AboutIcon} />,
        },
        {
          path: '/richtexteditor/terms',
          label: '法律信息',
          component: RichTextEditorTerms,
          icon: <FontAwesomeIcon width={16} icon={TermsIcon} />,
        },
        {
          path: '/richtexteditor/admin',
          label: '管理',
          component: RichTextEditorAdmin,
          icon: <FontAwesomeIcon width={16} icon={SettingsIcon} />,
          showIfIsAdmin: true,
          routes: [
            {
              path: '/richtexteditor/admin/analysis',
              label: '数据统计',
              component: RichTextEditorAnalysisAdmin,
              icon: <FontAwesomeIcon width={16} icon={AnalysticsIcon} />,
            },
          ],
        },
      ],
    },
    {
      path: '/imagenotebook',
      label: '图笔记本',
      component: ImageNotebook,
      icon: <FontAwesomeIcon width={16} icon={ImageNotebookIcon} />,
      routes: [
        {
          path: '/imagenotebook',
          label: '介绍',
          component: ImageNotebookHome,
          icon: <FontAwesomeIcon width={16} icon={HomeIcon} />,
          exact: true,
        },
        {
          path: '/imagenotebook/changelog',
          label: '更新历史',
          component: ImageNotebookChangeLog,
          icon: <FontAwesomeIcon width={16} icon={ChangeLogIcon} />,
        },
        {
          path: '/imagenotebook/docs',
          label: '使用文档',
          component: ImageNotebookDocs,
          icon: <FontAwesomeIcon width={16} icon={DocsIcon} />,
        },
        {
          path: '/imagenotebook/about',
          label: '关于',
          component: ImageNotebookAbout,
          icon: <FontAwesomeIcon width={16} icon={AboutIcon} />,
        },
        {
          path: '/imagenotebook/terms',
          label: '法律信息',
          component: ImageNotebookTerms,
          icon: <FontAwesomeIcon width={16} icon={TermsIcon} />,
        },
        {
          path: '/imagenotebook/admin',
          label: '管理',
          component: ImageNotebookAdmin,
          icon: <FontAwesomeIcon width={16} icon={SettingsIcon} />,
          showIfIsAdmin: true,
          routes: [
            {
              path: '/imagenotebook/admin/analysis',
              label: '数据统计',
              component: ImageNotebookAnalysisAdmin,
              icon: <FontAwesomeIcon width={16} icon={AnalysticsIcon} />,
            },
          ],
        },
      ],
    },
    {
      path: '/fontlibrary',
      label: '字体库',
      component: FontLibrary,
      icon: <FontAwesomeIcon width={16} icon={FontLibraryIcon} />,
      routes: [
        {
          path: '/fontlibrary',
          label: '字体列表',
          component: FontLibraryHome,
          icon: <FontAwesomeIcon width={16} icon={HomeIcon} />,
          exact: true,
        },
        {
          path: '/fontlibrary/admin',
          label: '管理',
          component: FontLibraryAdmin,
          icon: <FontAwesomeIcon width={16} icon={SettingsIcon} />,
          showIfIsAdmin: true,
        },
      ],
    },
    {
      path: '/admin/mediacenter',
      label: '媒体库',
      component: MediaCenterAdmin,
      icon: <FontAwesomeIcon width={16} icon={MediaCenterIcon} />,
      showIfIsAdmin: true,
      routes: [
        {
          path: '/admin/mediacenter',
          label: '媒体文件列表',
          component: MediaCenterMediaFileAdmin,
          icon: <FontAwesomeIcon width={16} icon={HomeIcon} />,
          exact: true,
        },
        {
          path: '/admin/mediacenter/tag',
          label: '标签管理',
          component: MediaCenterTagAdmin,
          icon: <FontAwesomeIcon width={16} icon={TagIcon} />,
        },
      ],
    },
    {
      path: '/user',
      label: '用户中心',
      component: User,
      icon: <FontAwesomeIcon width={16} icon={UserIcon} />,
      routes: [
        {
          path: '/user/dashboard',
          label: '我的信息',
          component: UserDashboard,
          icon: <FontAwesomeIcon width={16} icon={UserDashboardIcon} />,
          showIfAuthenticated: true,
        },
        {
          path: '/user/auth',
          label: '身份认证',
          component: UserAuth,
          expand: true,
          hideIfAuthenticated: true,
          routes: [
            {
              path: '/user/auth/login',
              label: '登录',
              component: UserLogin,
              icon: <FontAwesomeIcon width={16} icon={UserLoginIcon} />,
            },
            {
              path: '/user/auth/register',
              label: '注册',
              component: UserRegister,
              icon: <FontAwesomeIcon width={16} icon={UserRegisterIcon} />,
            },
          ],
        },
      ],
    },
  ],
};

export default rootRoute;
