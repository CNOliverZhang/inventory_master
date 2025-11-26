import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Collapse,
  Drawer,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { matchPath, useLocation, Link as RouterLink } from 'react-router-dom';

import rootRoute, { PotatofieldRouteConfig } from '@/routes';
import useUser from '@/Contexts/User';

import Logo from '@/Assets/Images/Global/Logo.png';

import styles from './styles';

export interface DrawerMethods {
  open(): void;
  close(): void;
}

const drawer = forwardRef<DrawerMethods>((props, ref) => {
  const currentPath = useLocation().pathname;
  const { user } = useUser();
  const theme = useTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCollapseStatus, setDrawerCollapseStatus] = useState(new Set());
  const classes = styles(theme);

  useImperativeHandle(ref, () => ({
    open: () => {
      setDrawerOpen(true);
    },
    close: () => {
      setDrawerOpen(false);
    },
  }));

  useEffect(() => {
    const initialDrawerCollapseStatus = new Set();

    const traverse = (routes: PotatofieldRouteConfig[]) => {
      routes.forEach((item) => {
        const matchingChild = item.routes?.find((child) => (
          matchPath(currentPath, child) && !child.hide
        ));
        if (matchPath(currentPath, item) && matchingChild) {
          initialDrawerCollapseStatus.add(item.path);
        }
        if (item.routes) {
          traverse(item.routes);
        }
      });
    };

    if (rootRoute.routes) {
      traverse(rootRoute.routes);
    }

    setDrawerCollapseStatus(initialDrawerCollapseStatus);
  }, [drawerOpen]);

  const setCollapseStatus = (path: string) => {
    const newDrawerCollapseStatus = new Set(Array.from(drawerCollapseStatus));
    if (newDrawerCollapseStatus.has(path)) {
      newDrawerCollapseStatus.delete(path);
    } else {
      newDrawerCollapseStatus.add(path);
    }
    setDrawerCollapseStatus(newDrawerCollapseStatus);
  };

  const parseRoutes = (routeConfigs: PotatofieldRouteConfig[], depth: number): JSX.Element => (
    <React.Fragment key={String(depth)}>
      {routeConfigs.map((item) => {
        if (
          (item.hide && !matchPath(currentPath, item))
          || (item.hideIfAuthenticated && user)
          || (item.showIfAuthenticated && !user)
          || (item.showIfIsAdmin && !user?.isAdmin)
        ) {
          return null;
        }
        if (item.routes) {
          if (item.expand) {
            return parseRoutes(item.routes, depth);
          }
          return (
            <React.Fragment key={String(item.path)}>
              <ListItem
                button
                className="item"
                style={{
                  paddingLeft: `${depth}em`,
                }}
                onClick={() => setCollapseStatus(String(item.path))}
              >
                {item.icon && (
                <ListItemIcon
                  className={matchPath(currentPath, item) ? 'active' : undefined}
                >
                  {item.icon}
                </ListItemIcon>
                )}
                <ListItemText
                  primary={item.label}
                  className={matchPath(currentPath, item) ? 'active' : undefined}
                />
                <ExpandLessIcon
                  className={`animate ${matchPath(currentPath, item) ? 'active' : undefined}`}
                  style={{
                    transform: drawerCollapseStatus.has(item.path) ? 'rotate(0)' : 'rotate(180deg)',
                  }}
                />
              </ListItem>
              <Collapse
                in={drawerCollapseStatus.has(item.path)}
                timeout="auto"
                unmountOnExit
              >
                <List
                  disablePadding
                  component="nav"
                  className={classes.root}
                >
                  {parseRoutes(item.routes, depth + 1)}
                </List>
              </Collapse>
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={String(item.path)}>
            <ListItem
              button
              selected={Boolean(matchPath(currentPath, item))}
              component={RouterLink}
              to={String(item.path)}
              onClick={() => {
                setDrawerOpen(false);
              }}
              className="item"
              style={{
                paddingLeft: `${depth}em`,
              }}
            >
              {item.icon && (
              <ListItemIcon
                className={matchPath(currentPath, item) ? 'active' : undefined}
              >
                {item.icon}
              </ListItemIcon>
              )}
              <ListItemText
                primary={item.label}
                className={matchPath(currentPath, item) ? 'active' : undefined}
              />
            </ListItem>
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );

  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => {
        setDrawerOpen(false);
      }}
      className={classes.root}
    >
      <Toolbar>
        <IconButton edge="start" onClick={() => setDrawerOpen(false)} size="large">
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <List
        disablePadding
        component="nav"
        className="navigation"
      >
        <div className="logo">
          <img src={Logo} />
        </div>
        {rootRoute.routes && parseRoutes(rootRoute.routes, 1)}
      </List>
    </Drawer>
  );
});

export default drawer;
