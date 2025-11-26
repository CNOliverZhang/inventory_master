/*
 * @Author: CNOliverZhang cnoliverzhang@gmail.com
 * @Date: 2024-01-07 15:51:14
 * @LastEditors: CNOliverZhang cnoliverzhang@gmail.com
 * @LastEditTime: 2024-01-22 21:55:11
 * @FilePath: /potatofield-frontend/src/Pages/Home/Constants/links.tsx
 * @Description: 
 */
import React from 'react';
import {
  faBook as BlogIcon,
  faPalette as ImageToolkitIcon,
  faFilePen as RichTextEditorIcon,
  faFont as FontLibraryIcon,
  faUser as UserIcon,
  faPhotoFilm as MediaCenterIcon,
  faTags as ImageNotebookIcon,
} from '@fortawesome/free-solid-svg-icons';

import BlogImage from '@/Assets/Images/Home/Blog.jpg';
import FontLibraryImage from '@/Assets/Images/Home/FontLibrary.jpg';
import GalleryImage from '@/Assets/Images/Home/Gallery.jpg';
import ImageToolkitImage from '@/Assets/Images/Home/ImageToolkit.jpg';
import RichTextEditorImage from '@/Assets/Images/Home/RichTextEditor.jpg';
import UserCenterImage from '@/Assets/Images/Home/UserCenter.jpg';
import ImageNotebookImage from '@/Assets/Images/Home/ImageNotebook.jpg';

export default [
  {
    path: '/blog',
    title: '博客',
    subtitle: '一个想起来啥就写啥的地方',
    icon: BlogIcon,
    color: '#277DA1',
    image: BlogImage,
  },
  {
    path: null,
    title: '照片墙',
    subtitle: '自认为拍得还凑合的照片',
    icon: MediaCenterIcon,
    color: '#F9C74F',
    image: GalleryImage,
  },
  {
    path: '/imagetoolkit',
    title: '图像工具箱',
    subtitle: '批处理图像还挺方便的工具',
    icon: ImageToolkitIcon,
    color: '#F3722C',
    image: ImageToolkitImage,
  },
  {
    path: '/richtexteditor',
    title: '富文本编辑器',
    subtitle: '编辑和渲染富文本内容的工具',
    icon: RichTextEditorIcon,
    color: '#34BF49',
    image: RichTextEditorImage,
  },
  {
    path: '/imagenotebook',
    title: '图笔记本',
    subtitle: '以图片标记为核心的笔记本',
    icon: ImageNotebookIcon,
    color: '#003b64',
    image: ImageNotebookImage,
  },
  {
    path: '/fontlibrary',
    title: '字体库',
    subtitle: '收集了一堆商用免费字体',
    icon: FontLibraryIcon,
    color: '#F94144',
    image: FontLibraryImage,
  },
  {
    path: '/user/dashboard',
    title: '用户中心',
    subtitle: '管理你的信息和收藏夹',
    icon: UserIcon,
    color: '#54478C',
    image: UserCenterImage,
  },
];
