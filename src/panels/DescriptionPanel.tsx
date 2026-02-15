import React from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Box,
  Title,
  Text,
  SimpleCell,
  Button,
  Card,
  Spacing,
  Headline,
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { DiseaseInfo } from '../types';

interface Props {
  id: string;
  disease: DiseaseInfo;
}

const DescriptionPanel: React.FC<Props> = ({ id, disease }) => {
  const navigator = useRouteNavigator();

  return (
    <Panel id={id}>
      <PanelHeader>{disease.name}</PanelHeader>
      <Group>
        <Box style={{ padding: 16 }}>
          <Title level="2" style={{ marginBottom: 8 }}>
            Понимание — первый шаг к здоровью
          </Title>
          <Text weight="1" style={{ marginBottom: 16 }}>
            {disease.description}
          </Text>
        </Box>
      </Group>

      <Card mode="shadow" style={{ margin: 12, padding: 12 }}>
        <Headline weight="1" style={{ marginBottom: 8 }}>Причины</Headline>
        {disease.causes.map((cause, idx) => (
          <SimpleCell key={idx}>{cause}</SimpleCell>
        ))}
      </Card>

      <Card mode="shadow" style={{ margin: 12, padding: 12 }}>
        <Headline weight="1" style={{ marginBottom: 8 }}>Симптомы</Headline>
        {disease.symptoms.map((symptom, idx) => (
          <SimpleCell key={idx}>{symptom}</SimpleCell>
        ))}
      </Card>

      <Card mode="shadow" style={{ margin: 12, padding: 12 }}>
        <Headline weight="1" style={{ marginBottom: 8 }}>Диагностика</Headline>
        {disease.diagnosis.map((item, idx) => (
          <SimpleCell key={idx}>{item}</SimpleCell>
        ))}
      </Card>

      <Card mode="shadow" style={{ margin: 12, padding: 12 }}>
        <Headline weight="1" style={{ marginBottom: 8 }}>Лечение и профилактика</Headline>
        {disease.treatment.map((item, idx) => (
          <SimpleCell key={idx}>{item}</SimpleCell>
        ))}
      </Card>

      <Spacing size={16} />

      <Group>
        <Box style={{ padding: 16 }}>
          <Button size="l" stretched onClick={() => navigator.push('/test')}>
            Перейти к тесту
          </Button>
        </Box>
      </Group>
    </Panel>
  );
};

export default DescriptionPanel;