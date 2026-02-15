import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from '@vkontakte/vk-mini-apps-router';
import { AdaptivityProvider, ConfigProvider } from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';
import { App } from './App';
import { routes } from './routes';
import '@vkontakte/vkui/dist/vkui.css';

bridge.send('VKWebAppInit');

const router = createHashRouter(routes.getRoutes());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}>
    <ConfigProvider>
      <AdaptivityProvider>
        <App />
      </AdaptivityProvider>
    </ConfigProvider>
  </RouterProvider>
);