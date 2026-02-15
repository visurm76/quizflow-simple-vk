import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const PANEL_DESCRIPTION = 'description';
export const PANEL_TEST = 'test';
export const PANEL_RESULTS = 'results';

export const routes = RoutesConfig.create([
  createRoot('root', [
    createView('main', [
      createPanel(PANEL_DESCRIPTION, '/', []),
      createPanel(PANEL_TEST, '/test', []),
      createPanel(PANEL_RESULTS, '/results', []),
    ]),
  ]),
]);