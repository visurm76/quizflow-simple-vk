import { useState } from 'react';
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
  SimpleCell,
  Headline,
  ModalCard,
} from '@vkontakte/vkui';
import { Icon28DocumentOutline, Icon28QrCodeOutline } from '@vkontakte/icons';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';
import { QRCodeCanvas } from 'qrcode.react';
import { TestResult } from '../types';

interface Props {
  id: string;
  result: TestResult | null;
  onRestart: () => void;
  doctorLink?: string;
}

const ResultsPanel: React.FC<Props> = ({ id, result, onRestart, doctorLink = 'https://max.ru/appointment' }) => {
  const navigator = useRouteNavigator();
  const [modalOpened, setModalOpened] = useState(false);

  if (!result) return null;

  const handleDoctorAppointment = () => {
    setModalOpened(true);
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

          <Button
            size="l"
            stretched
            mode="primary"
            before={<Icon28DocumentOutline />}
            onClick={handleExport}
            style={{ marginBottom: 16 }}
          >
            Скачать результаты
          </Button>

          <Box style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
            <Button size="l" stretched before={<Icon28QrCodeOutline />} onClick={handleDoctorAppointment}>
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

      <ModalCard
        open={modalOpened}
        onClose={() => setModalOpened(false)}
        header="Запись к врачу"
        subheader="Отсканируйте QR-код для перехода в мессенджер Макс"
      >
        <Box style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
          <QRCodeCanvas value={doctorLink} size={200} />
        </Box>
        <Box style={{ display: 'flex', justifyContent: 'center', padding: '0 16px 16px' }}>
          <Button size="l" mode="secondary" onClick={() => setModalOpened(false)}>
            Закрыть
          </Button>
        </Box>
      </ModalCard>
    </Panel>
  );
};

export default ResultsPanel;