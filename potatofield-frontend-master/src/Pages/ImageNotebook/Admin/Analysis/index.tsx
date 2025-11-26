import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Typography,
  CardHeader,
  Avatar,
  MenuItem,
  useTheme,
} from '@mui/material';
import { BarChart as AnalysticsIcon } from '@mui/icons-material';
import * as echarts from 'echarts';

import Message from '@/ImperativeComponents/Message';
import HeadBar from '@/Components/HeadBar';
import request from '@/Utils/Request';
import api from '@/Apis';

import styles from './styles';

interface DataItem {
  count: number;
  date?: string;
  week?: string;
  month?: string;
  version?: string;
  platform?: string;
}

const index: React.FC = () => {
  const [duration, setDuration] = useState(10);
  const [unit, setUnit] = useState('date');
  const [userCount, setUserCount] = useState(0);
  const theme = useTheme();
  const classes = styles(theme);

  useEffect(() => {
    const versionChartContainer = document.getElementById('count-by-version') as HTMLCanvasElement;
    const platformChartContainer = document.getElementById('count-by-platform') as HTMLCanvasElement;
    const versionChart = echarts.init(versionChartContainer);
    const platformChart = echarts.init(platformChartContainer);
    const resizeCharts = () => {
      versionChart.resize();
      platformChart.resize();
    };
    request.get(api.imageNotebook.client.count).then((res) => {
      if (res.status === 200) {
        setUserCount(res.data.total);
        versionChart.setOption({
          tooltip: {
            trigger: 'item',
          },
          series: [
            {
              name: '版本号',
              type: 'pie',
              radius: '50%',
              data: res.data.versions.map((item: DataItem) => ({
                value: item.count,
                name: item.version,
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        });
        platformChart.setOption({
          tooltip: {
            trigger: 'item',
          },
          series: [
            {
              name: '系统平台',
              type: 'pie',
              radius: '50%',
              data: res.data.platforms.map((item: DataItem) => ({
                value: item.count,
                name: item.platform,
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        });
        window.addEventListener('resize', resizeCharts);
      } else {
        new Message({
          type: 'error',
          content: '获取分类统计数据失败',
        });
      }
    }).catch(() => {
      new Message({
        type: 'error',
        content: '获取分类统计数据失败',
      });
    });
    return () => {
      window.removeEventListener('resize', resizeCharts);
    };
  }, []);

  useEffect(() => {
    let paramName = 'days';
    if (unit === 'week') {
      paramName = 'weeks';
    } else if (unit === 'month') {
      paramName = 'months';
    }
    const newUsersChartContainer = document.getElementById('count-new') as HTMLCanvasElement;
    const activeUsersChartcontainer = document.getElementById('count-active') as HTMLCanvasElement;
    const newUserChart = echarts.init(newUsersChartContainer);
    const activeUsersChart = echarts.init(activeUsersChartcontainer);
    const resizeCharts = () => {
      newUserChart.resize();
      activeUsersChart.resize();
    };
    window.addEventListener('resize', resizeCharts);
    request.get(api.imageNotebook.client.countNew, {
      params: {
        [paramName]: duration,
      },
    }).then((res) => {
      if (res.status === 200) {
        newUserChart.setOption({
          tooltip: {},
          xAxis: {
            type: 'category',
            data: res.data.map((item: DataItem) => {
              if (unit === 'week') {
                return item.week;
              }
              if (unit === 'month') {
                return item.month;
              }
              return item.date;
            }),
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: res.data.map((item: DataItem) => item.count),
              type: 'line',
            },
          ],
        });
      } else {
        new Message({
          type: 'error',
          content: '获取新用户统计数据失败',
        });
      }
    }).catch(() => {
      new Message({
        type: 'error',
        content: '获取新用户统计数据失败',
      });
    });
    request.get(api.imageNotebook.client.countActive, {
      params: {
        [paramName]: duration,
      },
    }).then((res) => {
      if (res.status === 200) {
        activeUsersChart.setOption({
          tooltip: {},
          xAxis: {
            type: 'category',
            data: res.data.map((item: DataItem) => {
              if (unit === 'week') {
                return item.week;
              }
              if (unit === 'month') {
                return item.month;
              }
              return item.date;
            }),
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: res.data.map((item: DataItem) => item.count),
              type: 'line',
            },
          ],
        });
      } else {
        new Message({
          type: 'error',
          content: '获取活跃用户统计数据失败',
        });
      }
    }).catch(() => {
      new Message({
        type: 'error',
        content: '获取活跃用户统计数据失败',
      });
    });
    return () => {
      window.removeEventListener('resize', resizeCharts);
    };
  }, [duration, unit]);

  return (
    <div className={classes.root}>
      <HeadBar
        title="数据统计"
        changeTransparencyOnScroll={false}
      />
      <div className="control-panel-wrapper">
        <Card className="control-panel">
          <Typography variant="h6">{`用户总数 ${userCount}`}</Typography>
          <div className="control-wrapper">
            <TextField
              value={duration}
              variant="outlined"
              label="时长"
              className="control"
              onChange={(event) => setDuration(Number(event.target.value))}
            />
            <TextField
              select
              value={unit}
              variant="outlined"
              label="粒度"
              className="control"
              onChange={(event) => setUnit(event.target.value)}
            >
              <MenuItem value="date">天</MenuItem>
              <MenuItem value="week">周</MenuItem>
              <MenuItem value="month">月</MenuItem>
            </TextField>
          </div>
        </Card>
      </div>
      <div className="content-wrapper">
        <div className="card-wrapper">
          <Card className="card">
            <CardHeader
              avatar={(
                <Avatar className="card-icon">
                  <AnalysticsIcon />
                </Avatar>
              )}
              title="新用户统计"
              titleTypographyProps={{ variant: 'subtitle1' }}
            />
            <CardContent id="count-new" className="chart-wrapper" />
          </Card>
        </div>
        <div className="card-wrapper">
          <Card className="card">
            <CardHeader
              avatar={(
                <Avatar className="card-icon">
                  <AnalysticsIcon />
                </Avatar>
              )}
              title="活跃用户统计"
              titleTypographyProps={{ variant: 'subtitle1' }}
            />
            <CardContent id="count-active" className="chart-wrapper" />
          </Card>
        </div>
        <div className="card-wrapper">
          <Card className="card">
            <CardHeader
              avatar={(
                <Avatar className="card-icon">
                  <AnalysticsIcon />
                </Avatar>
              )}
              title="用户版本分布"
              titleTypographyProps={{ variant: 'subtitle1' }}
            />
            <CardContent id="count-by-version" className="chart-wrapper" />
          </Card>
        </div>
        <div className="card-wrapper">
          <Card className="card">
            <CardHeader
              avatar={(
                <Avatar className="card-icon">
                  <AnalysticsIcon />
                </Avatar>
              )}
              title="用户平台分布"
              titleTypographyProps={{ variant: 'subtitle1' }}
            />
            <CardContent id="count-by-platform" className="chart-wrapper" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default index;
