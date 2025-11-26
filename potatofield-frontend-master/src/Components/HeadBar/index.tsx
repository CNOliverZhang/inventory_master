import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  InputBase,
  MenuList,
  MenuItem,
  Divider,
  ListItemIcon,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness5 as DarkModeOffIcon,
  Brightness4 as DarkModeOnIcon,
  BrightnessAuto as DarkModeAutoIcon,
  AccountCircle as UserIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

import DropdownPanel from '@/Components/DropdownPanel';
import Dialog from '@/ImperativeComponents/Dialog';
import useUser from '@/Contexts/User';
import useDrawer from '@/Contexts/Drawer';
import useThemeContext from '@/Contexts/Theme';
import useDebounce from '@/Utils/Debounce';
import Logo from '@/Assets/Images/Global/Logo.png';

import styles from './styles';

type ChangeTransparencyScrollHeight = `${number}vh` | number;

interface HeadBarProps {
  title?: string;
  position?: 'relative' | 'sticky' | 'fixed';
  searchText?: string;
  onSearch?: (keyword: string) => unknown;
  searchThrottle?: number;
  transparency?: number;
  changeTransparencyOnScroll?: boolean;
  changeTransparencyScrollHeight?: ChangeTransparencyScrollHeight;
}

const headBar: React.FC<HeadBarProps> = (props: HeadBarProps) => {
  const {
    title,
    position = 'sticky',
    searchText = '请输入关键词',
    onSearch,
    searchThrottle,
    transparency: maxTransparency = 1,
    changeTransparencyOnScroll = true,
    changeTransparencyScrollHeight: rawChangeTransparencyScrollHeight = '100vh',
  } = props;

  const { user, logout } = useUser();
  const { darkMode, setDarkMode } = useThemeContext();
  const [originalTop, setOriginalTop] = useState(0);
  const [relativeTransparency, setRelativeTransparency] = useState(1);
  const [changeTransparencyScrollHeight, setChangeTransparencyScrollHeigh] = useState(0);
  const ref = useRef<Element>();
  const theme = useTheme();
  const classes = styles(theme);
  const drawer = useDrawer();
  const history = useHistory();

  const debouncedSearch = onSearch
    ? useDebounce(onSearch, searchThrottle || 0, { trailing: true })
    : () => undefined;

  const changeDarkMode = (newDarkMode: boolean | 'auto') => {
    setDarkMode(newDarkMode);
    new Dialog({
      title: '是否刷新页面',
      content: '您已切换页面主题，是否需要立即刷新页面以使更改生效？',
      onConfirm: () => window.location.reload(),
    });
  };

  // 随滚动高度改变透明度
  const changeRelativeTransparency = () => {
    setRelativeTransparency(
      Math.min(
        Math.max((document.getElementById('root')?.scrollTop || 0) - originalTop, 0) / changeTransparencyScrollHeight,
        1,
      ),
    );
  };

  // 页面初始化时计算初始滚动高度
  useEffect(() => {
    if (position === 'sticky') {
      const headBarHeight = ref.current?.getBoundingClientRect?.()?.height;
      const nextElement = (ref.current?.nextElementSibling as HTMLElement);
      const currentOriginalTop = nextElement
        ? nextElement.offsetTop
          - Number(headBarHeight)
          - Number(getComputedStyle(nextElement).marginBottom?.replace('px', ''))
        : 0;
      setOriginalTop(currentOriginalTop);
    }
  }, []);

  // 如果设置了滚动高度阈值则采用设置的阈值
  useEffect(() => {
    if (typeof rawChangeTransparencyScrollHeight === 'string') {
      setChangeTransparencyScrollHeigh(
        (
          Number(rawChangeTransparencyScrollHeight.replace('vh', '')) / 100
        ) * window.innerHeight,
      );
    } else if (typeof rawChangeTransparencyScrollHeight === 'number') {
      setChangeTransparencyScrollHeigh(rawChangeTransparencyScrollHeight);
    }
  }, [rawChangeTransparencyScrollHeight]);

  // 在初始滚动高度或滚动高度阈值改变时重设滚动监听器
  useEffect(() => {
    document.getElementById('root')?.removeEventListener('scroll', changeRelativeTransparency);
    if (position !== 'relative' && changeTransparencyOnScroll) {
      document.getElementById('root')?.addEventListener('scroll', changeRelativeTransparency);
      changeRelativeTransparency();
    }
    return () => document.getElementById('root')?.removeEventListener('scroll', changeRelativeTransparency);
  }, [
    position,
    originalTop,
    changeTransparencyOnScroll,
    changeTransparencyScrollHeight,
    maxTransparency,
  ]);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={classes.root}
      style={{
        position,
        top: position === 'sticky' ? 0 : undefined,
      }}
    >
      <AppBar
        color="inherit"
        className="header"
        style={{
          opacity: (
            Number.isNaN(relativeTransparency)
              ? 1
              : relativeTransparency
          ) * Math.min(maxTransparency, 1),
        }}
      />
      <Toolbar>
        <IconButton edge="start" onClick={() => drawer.open()} size="large">
          <MenuIcon />
        </IconButton>
        <Typography
          className={`title ${onSearch ? 'with-search' : ''}`}
          variant="h5"
        >
          {title}
        </Typography>
        {onSearch && (
        <div className="search animate">
          <div className="search-icon">
            <SearchIcon />
          </div>
          <InputBase
            onChange={(event) => debouncedSearch(event.target.value)}
            placeholder={searchText}
            classes={{
              root: 'input-root animate',
              input: 'input-content',
            }}
          />
        </div>
        )}
        <DropdownPanel
          dropdownElement={(
            <IconButton size="large">
              {darkMode === 'auto' ? <DarkModeAutoIcon /> : (
                darkMode ? <DarkModeOnIcon /> : <DarkModeOffIcon />
              )}
            </IconButton>
          )}
        >
          <MenuList>
            <MenuItem disabled={darkMode === true} onClick={() => changeDarkMode(true)}>
              <ListItemIcon>
                <DarkModeOnIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">
                {darkMode === true && '已'}
                开启夜间模式
              </Typography>
            </MenuItem>
            <MenuItem disabled={darkMode === false} onClick={() => changeDarkMode(false)}>
              <ListItemIcon>
                <DarkModeOffIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">
                {darkMode === false && '已'}
                关闭夜间模式
              </Typography>
            </MenuItem>
            <MenuItem disabled={darkMode === 'auto'} onClick={() => changeDarkMode('auto')}>
              <ListItemIcon>
                <DarkModeAutoIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">
                {darkMode === 'auto' && '已设为'}
                自动夜间模式
              </Typography>
            </MenuItem>
          </MenuList>
        </DropdownPanel>
        <DropdownPanel
          dropdownElement={(
            <IconButton edge="end" size="large">
              <UserIcon />
            </IconButton>
          )}
        >
          {user ? (
            <>
              <div className={classes.userInfo}>
                <img src={user?.profile?.avatar || Logo} className="user-avatar" />
                <div className="user-info-text">
                  <div className="user-nickname">{user.profile.nickname || '访客'}</div>
                  <div className="user-intro">
                    {user.profile.intro || '这个人很懒，自我介绍啥也没写。'}
                  </div>
                </div>
              </div>
              <Divider />
              <MenuList>
                <MenuItem onClick={() => history.push('/user/dashboard')}>用户中心</MenuItem>
                <MenuItem onClick={() => logout()}>退出登录</MenuItem>
              </MenuList>
            </>
          ) : (
            <MenuList>
              <MenuItem onClick={() => history.push('/user/auth/login')}>前往登录</MenuItem>
            </MenuList>
          )}
        </DropdownPanel>
      </Toolbar>
    </div>
  );
};

export default headBar;
