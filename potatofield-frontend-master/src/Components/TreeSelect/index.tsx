import React, { useEffect, useState } from 'react';
import {
  Collapse,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Popover,
  TextField,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import findNode from '@/Utils/FindNode';

interface TreeNode {
  id: number;
  name: string;
  children?: TreeNode[];
}

interface TreeSelectProps {
  tree: TreeNode[];
  label?: string;
  fullWidth?: boolean;
  allowClear?: boolean;
  className?: string;
  value?: number;
  onChange?: (newValue?: number) => void;
}

const treeSelect: React.FC<TreeSelectProps> = (props: TreeSelectProps) => {
  const {
    tree,
    label,
    fullWidth,
    allowClear,
    className,
    value,
    onChange,
  } = props;

  const [treeNode, setTreeNode] = useState<TreeNode>();
  const [anchorEl, setAnchorEl] = useState<HTMLInputElement>();
  const [width, setWidth] = useState(0);

  const openMenu = (event: React.MouseEvent<HTMLInputElement>) => {
    if ((event.target as any).nodeName.toLowerCase() === 'input') {
      setAnchorEl(event.currentTarget);
      setWidth(event.currentTarget.clientWidth);
    }
  };

  const closeMenu = () => {
    setAnchorEl(undefined);
  };

  const handleChange = (node: TreeNode) => {
    setTreeNode(node);
    onChange?.(node.id);
    closeMenu();
  };

  const clearValue = () => {
    setTreeNode(undefined);
    onChange?.(undefined);
  };

  const renderTree = (nodes: TreeNode[], depth: number): JSX.Element => (
    <React.Fragment key={String(depth)}>
      {nodes.map((item) => {
        if (item.children) {
          return (
            <React.Fragment key={String(item.id)}>
              <ListItem
                button
                onClick={() => handleChange(item)}
                style={{
                  paddingLeft: `${depth}em`,
                }}
              >
                <ListItemText
                  primary={item.name}
                />
              </ListItem>
              <Collapse
                in
                timeout="auto"
                unmountOnExit
              >
                <List disablePadding>
                  {renderTree(item.children, depth + 2)}
                </List>
              </Collapse>
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={String(item.id)}>
            <ListItem
              button
              onClick={() => handleChange(item)}
              style={{
                paddingLeft: `${depth}em`,
              }}
            >
              <ListItemText
                primary={item.name}
              />
            </ListItem>
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );

  useEffect(() => {
    if (value) {
      setTreeNode(findNode(tree, value));
    }
  }, [value, tree]);

  return (
    <>
      <TextField
        label={label}
        value={treeNode?.name || ''}
        onClick={openMenu}
        fullWidth={fullWidth}
        className={className}
        focused={Boolean(anchorEl)}
        InputProps={{
          endAdornment: allowClear && value ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={clearValue}
              >
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
      />
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <List style={{ minWidth: width }}>
          {renderTree(tree, 1)}
        </List>
      </Popover>
    </>
  );
};

export default treeSelect;
