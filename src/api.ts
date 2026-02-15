import { AppConfig } from './types';

const CONFIG_URL = import.meta.env.VITE_CONFIG_URL || '/config.json'; // для разработки используем локальный файл

// Загрузка конфигурации (публичная)
export async function fetchConfig(): Promise<AppConfig> {
  const response = await fetch(CONFIG_URL);
  if (!response.ok) {
    throw new Error('Failed to load configuration');
  }
  return response.json();
}

// Сохранение конфигурации (админка) – требует авторизации
export async function saveConfig(config: AppConfig, token: string): Promise<void> {
  const response = await fetch('/api/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(config),
  });
  if (!response.ok) {
    throw new Error('Failed to save configuration');
  }
}