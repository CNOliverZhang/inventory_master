import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
  Card,
  CardHeader,
  Avatar,
  Button,
  Chip,
  CardMedia,
  IconButton,
  TextField,
  Paper,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Divider,
  Pagination,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
} from '@mui/material';
import {
  Image as ImageIcon,
  Movie as VideoIcon,
  Audiotrack as AudioIcon,
  CheckCircle as SelectedIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import Loading from '@/ImperativeComponents/Loading';
import Message from '@/ImperativeComponents/Message';
import Dialog from '@/ImperativeComponents/Dialog';
import Empty from '@/Components/Empty';
import request from '@/Utils/Request';
import api from '@/Apis';
import { MIME_TYPE, MIME_TYPE_NAME } from '@/Constants/mimeType';

import MusicImage from '@/Assets/Images/Admin/MediaCenter/Phonorecord.jpg';

import Detail from './Components/Detail';
import MediaFileFormComponent from './Components/MediaFileForm';
import styles from './styles';
import { MediaFile, MediaFileTag, MediaFileForm } from './types';

interface MediaCenterProps {
  initialSelectedTag?: MediaFileTag;
  onSelect?: (mediaFile: MediaFile) => void;
  selectButtonText?: string;
  allowedMimeTypes?: MIME_TYPE[],
  className?: string;
}

const mediaCenter: React.FC<MediaCenterProps> = (props: MediaCenterProps) => {
  const {
    onSelect,
    selectButtonText = '选择',
    allowedMimeTypes: allowedMimeTypeProps,
    initialSelectedTag,
    className,
  } = props;

  // 翻页
  const [page, setPage] = useState(1);
  // 排版相关
  const [columnCount, setColumnCount] = useState(1);
  const [pageItemCount, setPageItemCount] = useState(20);
  // 显示详情面板
  const [showDetail, setShowDetail] = useState(false);
  // 标签相关
  const [tagList, setTagList] = useState<MediaFileTag[]>([]);
  const [selectedTagList, setSelectedTagList] = useState<MediaFileTag[]>(
    initialSelectedTag ? [initialSelectedTag] : [],
  );
  // 允许的类型
  const [allowedMimeTypes, setAllowedMimeTypes] = useState<
    MIME_TYPE[] | undefined
  >(allowedMimeTypeProps || [MIME_TYPE.AUDIO, MIME_TYPE.IMAGE, MIME_TYPE.VIDEO]);
  // 媒体文件列表和数量
  const [mediaFileCount, setMediaFileCount] = useState(0);
  const [mediaFileList, setMediaFileList] = useState<MediaFile[]>([]);
  // 已选中的文件
  const [selectedMediaFile, setSelectedMediaFile] = useState<MediaFile>();

  const mediaFileForm = useForm<MediaFileForm>();
  const theme = useTheme();
  const classes = styles(theme);

  const initColumnCount = () => {
    const mediaCenterElement = document.getElementById('media-container');
    const fullWidth = mediaCenterElement?.getBoundingClientRect().width;
    const newColumnCount = Math.ceil((fullWidth || document.body.offsetWidth) / 360);
    setColumnCount(newColumnCount);
    setPageItemCount(Math.ceil(20 / newColumnCount) * newColumnCount);
  };

  const getMediaFileList = () => {
    const loading = new Loading();
    request.get(api.mediaCenter.file.list, {
      params: {
        page,
        tagIdList: selectedTagList.map((tag) => tag.id),
        mimeTypes: allowedMimeTypes,
        size: pageItemCount,
      },
    }).then((res) => {
      loading.close();
      if (res.status === 200) {
        setMediaFileCount(res.data.count);
        setMediaFileList(res.data.list);
      } else {
        new Message({
          type: 'error',
          content: '获取媒体文件列表失败',
        });
      }
    }).catch(() => {
      loading.close();
      new Message({
        type: 'error',
        content: '获取媒体文件列表失败',
      });
    });
  };

  const getTagList = () => {
    request.get(api.mediaCenter.tag.list).then((res) => {
      if (res.status === 200) {
        setTagList(res.data.list);
      } else {
        new Message({
          type: 'error',
          content: '获取媒体文件标签列表失败',
        });
      }
    }).catch(() => {
      new Message({
        type: 'error',
        content: '获取媒体文件标签列表失败',
      });
    });
  };

  const selectMediaFile = (mediaFile: MediaFile) => {
    if (selectedMediaFile?.id === mediaFile.id) {
      setSelectedMediaFile(undefined);
    } else {
      setSelectedMediaFile(mediaFile);
    }
  };

  const closeMediaFileDetail = () => {
    setSelectedMediaFile(undefined);
    setShowDetail(false);
  };

  const changePage = (event: React.ChangeEvent<unknown>, index: number) => {
    setPage(index);
    setSelectedMediaFile(undefined);
  };

  const addMediaFile = () => {
    mediaFileForm.reset();
    const dialog: Dialog = new Dialog({
      title: '添加媒体文件',
      content: (
        <MediaFileFormComponent mediaFileForm={mediaFileForm} />
      ),
      onConfirm: async () => {
        const valid = await mediaFileForm.trigger();
        if (valid) {
          dialog.close();
          mediaFileForm.handleSubmit((values) => {
            const loading = new Loading();
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
              if (value) {
                formData.append(key, value);
              }
            });
            request.post(api.mediaCenter.file.add, formData, {
              timeout: 10 * 60 * 1000,
            }).then((res) => {
              loading.close();
              if (res.status === 200) {
                new Message({
                  type: 'success',
                  content: '添加媒体文件成功',
                });
                if (page === 1) {
                  getMediaFileList();
                } else {
                  setPage(1);
                }
                setSelectedMediaFile(res.data.file);
              } else {
                new Message({
                  type: 'error',
                  content: '添加媒体文件失败',
                });
              }
            }).catch(() => {
              loading.close();
              new Message({
                type: 'error',
                content: '添加媒体文件失败',
              });
            });
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

  const removeMediaFile = (mediaFile: MediaFile) => {
    new Dialog({
      title: '操作确认',
      content: '是否确认删除媒体文件？',
      onConfirm: () => {
        setShowDetail(false);
        setSelectedMediaFile(undefined);
        const loading = new Loading();
        request.post(api.mediaCenter.file.remove, {
          id: mediaFile.id,
        }).then((res) => {
          loading.close();
          if (res.status === 200) {
            new Message({
              type: 'success',
              content: '删除媒体文件成功',
            });
            if (page === 1) {
              getMediaFileList();
            } else {
              setPage(1);
            }
          } else {
            new Message({
              type: 'error',
              content: '删除媒体文件失败',
            });
          }
        }).catch(() => {
          loading.close();
          new Message({
            type: 'error',
            content: '删除媒体文件失败',
          });
        });
      },
    });
  };

  const addTagToList = (tag: MediaFileTag) => {
    if (!selectedTagList.find((selectedTag) => selectedTag.name === tag.name)) {
      setSelectedTagList([...selectedTagList, tag]);
    }
  };

  const removeTagFromList = (index: number) => {
    const newSelectedTagList = [...selectedTagList];
    newSelectedTagList.splice(index, 1);
    setSelectedTagList(newSelectedTagList);
  };

  const changeAllowedMimeTypes = (
    event: React.MouseEvent<HTMLElement>, newAllowedMimeTypes: MIME_TYPE[],
  ) => {
    setAllowedMimeTypes(newAllowedMimeTypes);
  };

  const handleFileDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const { files } = event.dataTransfer;
    setTimeout(() => {
      if (files?.length) {
        addMediaFile();
        mediaFileForm.setValue('file', files[0]);
      }
    });
  };

  useEffect(() => {
    getMediaFileList();
  }, [page, selectedTagList, allowedMimeTypes, pageItemCount]);

  useEffect(() => {
    setAllowedMimeTypes(allowedMimeTypeProps);
  }, [allowedMimeTypeProps]);

  useEffect(() => {
    initColumnCount();
    getTagList();
    window.addEventListener('resize', initColumnCount);
    return () => {
      window.removeEventListener('resize', initColumnCount);
    };
  }, []);

  return (
    <div className={`${classes.root} ${className || ''}`}>
      <div className="media-list-wrapper">
        <div id="media-container" className="media-list-container" onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop}>
          <div className="filter-panel-wrapper" onDragOver={(e) => e.preventDefault()} onDrop={(e) => e.preventDefault()}>
            <Accordion className="filter-panel" defaultExpanded={Boolean(initialSelectedTag)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">筛选</Typography>
              </AccordionSummary>
              <AccordionDetails classes={{ root: 'filter-panel-content' }}>
                <Typography variant="subtitle1" paragraph>
                  根据媒体类型筛选
                </Typography>
                <ToggleButtonGroup
                  size="small"
                  value={allowedMimeTypes}
                  onChange={changeAllowedMimeTypes}
                  disabled={Boolean(allowedMimeTypeProps)}
                >
                  <ToggleButton value={MIME_TYPE.AUDIO}>
                    <AudioIcon className="type-toggle-button" />
                    {MIME_TYPE_NAME[MIME_TYPE.AUDIO]}
                  </ToggleButton>
                  <ToggleButton value={MIME_TYPE.IMAGE}>
                    <ImageIcon className="type-toggle-button" />
                    {MIME_TYPE_NAME[MIME_TYPE.IMAGE]}
                  </ToggleButton>
                  <ToggleButton value={MIME_TYPE.VIDEO}>
                    <VideoIcon className="type-toggle-button" />
                    {MIME_TYPE_NAME[MIME_TYPE.VIDEO]}
                  </ToggleButton>
                </ToggleButtonGroup>
              </AccordionDetails>
              <AccordionDetails classes={{ root: 'filter-panel-content' }}>
                <Typography variant="subtitle1" paragraph>
                  根据标签筛选
                </Typography>
                {selectedTagList.length ? (
                  <div className="tags-container">
                    {selectedTagList.map((tag, index) => (
                      <Chip
                        color="primary"
                        className="tag"
                        key={tag.name}
                        label={(
                          <Typography variant="body1">{tag.name}</Typography>
                        )}
                        onDelete={() => removeTagFromList(index)}
                      />
                    ))}
                  </div>
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    暂无标签
                  </Typography>
                )}
                <Autocomplete
                  className="tag-select"
                  options={tagList}
                  getOptionLabel={(tag: MediaFileTag) => tag.name}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" label="添加标签" />
                  )}
                  onChange={(event, value) => value && addTagToList(value as MediaFileTag)}
                />
              </AccordionDetails>
            </Accordion>
          </div>
          {mediaFileList.length ? mediaFileList.map((mediaFile) => {
            let icon = <ImageIcon />;
            let color = '#009688';
            if (mediaFile.mimeType === MIME_TYPE.VIDEO) {
              icon = <VideoIcon />;
              color = '#FF5722';
            } else if (mediaFile.mimeType === MIME_TYPE.AUDIO) {
              icon = <AudioIcon />;
              color = '#673AB7';
            }
            return (
              <div
                className="card-wrapper"
                key={mediaFile.id}
                style={{
                  width: `${100 / columnCount}%`,
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
              >
                <Card
                  className="card"
                  onClick={() => selectMediaFile(mediaFile)}
                >
                  <CardHeader
                    avatar={(
                      <Avatar
                        style={{
                          backgroundColor: color,
                        }}
                      >
                        {icon}
                      </Avatar>
                    )}
                    title={mediaFile.name || MIME_TYPE_NAME[mediaFile.mimeType]}
                    titleTypographyProps={{ noWrap: true, variant: 'subtitle1' }}
                    subheader={moment(mediaFile.uploadTime).format('YYYY 年 MM 月 DD 日')}
                    classes={{ content: 'card-header-content' }}
                  />
                  <CardMedia
                    className="media-thumbnail"
                    image={mediaFile.thumbnail || MusicImage}
                  />
                  <div
                    className={`card-cover ${mediaFile.id === selectedMediaFile?.id ? 'active' : ''}`}
                  >
                    <SelectedIcon
                      className={`selected-icon ${mediaFile.id === selectedMediaFile?.id ? 'active' : ''}`}
                    />
                  </div>
                </Card>
              </div>
            );
          }) : <Empty description="没有符合条件的媒体文件" />}
        </div>
        <div className={`media-detail-mask ${selectedMediaFile && showDetail ? 'active' : ''}`}>
          <div className="media-detail">
            <div className="media-detail-header">
              <div className="title-wrapper">
                <Typography variant="h6">
                  {selectedMediaFile && MIME_TYPE_NAME[selectedMediaFile.mimeType]}
                  文件详情
                </Typography>
              </div>
              <IconButton size="small" onClick={closeMediaFileDetail}>
                <CloseIcon />
              </IconButton>
            </div>
            <Divider />
            <Detail
              mediaFile={selectedMediaFile}
              tagList={tagList}
              getTagList={getTagList}
              getMediaFileList={getMediaFileList}
            />
          </div>
        </div>
      </div>
      <Paper square className="tool-bar">
        <div className="action-buttons">
          <Button
            variant="contained"
            color="primary"
            className="action-button"
            disabled={showDetail}
            onClick={addMediaFile}
          >
            添加
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="action-button"
            disabled={!selectedMediaFile || showDetail}
            onClick={() => setShowDetail(true)}
          >
            详情
          </Button>
          {onSelect && (
            <Button
              variant="contained"
              color="primary"
              className="action-button"
              disabled={!selectedMediaFile}
              onClick={selectedMediaFile ? () => onSelect(selectedMediaFile) : undefined}
            >
              {selectButtonText}
            </Button>
          )}
          <Button
            variant="contained"
            color="error"
            className="action-button"
            disabled={!selectedMediaFile}
            onClick={() => selectedMediaFile && removeMediaFile(selectedMediaFile)}
          >
            删除
          </Button>
        </div>
        <Pagination
          disabled={showDetail}
          count={Math.ceil(mediaFileCount / pageItemCount) || 1}
          page={page}
          onChange={changePage}
        />
      </Paper>
    </div>
  );
};

export default mediaCenter;
