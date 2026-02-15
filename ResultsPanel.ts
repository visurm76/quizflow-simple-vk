import React, { useEffect, useState } from 'react';
import { Panel, PanelHeader, Group, Div, Title, Text, Button, Card, Spacing, Banner } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';
import { TestResult } from '../types';

interface Props {
  result: TestResult | null;
  onRestart: () => void;
  doctorLink?: string; // ссылка для записи к врачу (или QR)
}

const ResultsPanel: React.FC<Props> = ({ result, onRestart, doctorLink }) => {
  const navigator = useRouteNavigator();

  if (!result) {
    return null; // или загружаем
  }

  const handleDoctorAppointment = () => {
    if (doctorLink) {
      bridge.send('VKWebAppOpenExternalLink', { link: doctorLink });
    } else {
      // показать QR-код (можно сгенерировать через библиотеку qrcode.react)
      alert('Здесь будет QR-код для записи');
    }
  };

  const handleExport = () => {
    // сформировать PDF или отправить на email – пока просто скачать результат как JSON
    const dataStr = JSON.stringify(result, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result.json';
    a.click();
  };

  return (
    <Panel>
      <PanelHeader>Результаты</PanelHeader>
      <Group>
        <Div>
          <Title level="2" style={{ marginBottom: 8 }}>Ваш результат: {result.totalScore} баллов</Title>
          <Card mode="shadow" style={{ padding: 16, backgroundColor: result.color }}>
            <Title level="3">{result.level}</Title>
            <Text>{result.interpretation}</Text>
          </Card>
          <Spacing size={16} />
          <Text weight="2">Рекомендации:</Text>
          <List>
            {result.recommendations.map((rec, idx) => (
              <Cell key={idx}>{rec}</Cell>
            ))}
          </List>
          <Spacing size={16} />
          <Banner
            before={<Icon28DocumentOutline />}
            header="Сохранить результаты"
            subheader="Скачать в PDF или отправить на email"
            actions={[
              { title: 'Скачать', mode: 'primary', onClick: handleExport },
            ]}
          />
          <Spacing size={16} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button size="l" stretched onClick={handleDoctorAppointment}>
              Записаться к врачу
            </Button>
            <Button size="l" mode="secondary" onClick={onRestart}>
              Пройти заново
            </Button>
            <Button size="l" mode="tertiary" onClick={() => navigator.push('/')}>
              Вернуться к описанию
            </Button>
          </div>
        </Div>
      </Group>
    </Panel>
  );
};

export default ResultsPanel;