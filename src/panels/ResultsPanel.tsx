import React from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Box,
  Title,
  Text,
  Button,
  Card,
  Spacing,
  Banner,
  SimpleCell,
  Headline,
} from '@vkontakte/vkui';
import { Icon28DocumentOutline } from '@vkontakte/icons';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';
import { TestResult } from '../types';

interface Props {
  id: string;
  result: TestResult | null;
  onRestart: () => void;
  doctorLink?: string;
}

const ResultsPanel: React.FC<Props> = ({ id, result, onRestart, doctorLink }) => {
  const navigator = useRouteNavigator();

  if (!result) return null;

  const handleDoctorAppointment = () => {
    if (doctorLink) {
      bridge.send('VKWebAppOpenExternalLink', { link: doctorLink });
    } else {
      alert('QR-код для записи к врачу');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result.json';
    a.click();
  };

  return (
    <Panel id={id}>
      <PanelHeader>Результаты</PanelHeader>
      <Group>
        <Box style={{ padding: 16 }}>
          <Title level="2" style={{ marginBottom: 8 }}>
            Ваш результат: {result.totalScore} баллов
          </Title>

          <Card mode="shadow" style={{ padding: 16, backgroundColor: result.color, marginBottom: 16 }}>
            <Title level="3" style={{ color: '#fff' }}>{result.level}</Title>
            <Text style={{ color: '#fff', marginTop: 8 }}>{result.interpretation}</Text>
          </Card>

          <Headline weight="1" style={{ marginBottom: 8 }}>Рекомендации:</Headline>
          {result.recommendations.map((rec, idx) => (
            <SimpleCell key={idx}>{rec}</SimpleCell>
          ))}

          <Spacing size={16} />

          <Banner
            before={<Icon28DocumentOutline />}
            header="Сохранить результаты"
            subheader="Скачать в PDF или отправить на email"
            actions={[{ title: 'Скачать', mode: 'primary', onClick: handleExport }]}
          />

          <Spacing size={16} />

          <Box style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
            <Button size="l" stretched onClick={handleDoctorAppointment}>
              Записаться к врачу
            </Button>
            <Button size="l" stretched mode="secondary" onClick={onRestart}>
              Пройти заново
            </Button>
            <Button size="l" stretched mode="tertiary" onClick={() => navigator.push('/')}>
              Вернуться к описанию
            </Button>
          </Box>
        </Box>
      </Group>
    </Panel>
  );
};

export default ResultsPanel;