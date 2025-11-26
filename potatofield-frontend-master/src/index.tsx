import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import RouterView from './Utils/RouterView';
import { ThemeProvider } from './Contexts/Theme';
import { UserProvider } from './Contexts/User';
import rootRoute from './routes';
import '@/Assets/StaticFiles/html.css';
import './index.css';
import './vditor.css';

ReactDOM.render(
  <ThemeProvider>
    <UserProvider>
      <BrowserRouter>
        <RouterView route={rootRoute} />
      </BrowserRouter>
    </UserProvider>
  </ThemeProvider>,
  document.getElementById('root'),
);
