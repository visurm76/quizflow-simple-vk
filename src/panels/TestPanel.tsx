import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Box,
  Title,
  Text,
  Button,
  Progress,
  Radio,
  Checkbox,
  FormItem,
  Spacing,
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Question, UserAnswer } from '../types';

interface Props {
  id: string;
  questions: Question[];
  onComplete: (answers: UserAnswer[]) => void;
}

const TestPanel: React.FC<Props> = ({ id, questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const navigator = useRouteNavigator();

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  useEffect(() => {
    const prevAnswer = answers.find(a => a.questionId === currentQuestion?.id);
    if (prevAnswer) {
      setSelected(prevAnswer.selectedAnswerIds);
    } else {
      setSelected([]);
    }
    setShowExplanation(false);
  }, [currentIndex, currentQuestion, answers]);

  const handleAnswer = (answerId: string, checked: boolean) => {
    if (currentQuestion.type === 'single') {
      setSelected([answerId]);
    } else {
      if (checked) {
        setSelected([...selected, answerId]);
      } else {
        setSelected(selected.filter(id => id !== answerId));
      }
    }
  };

  const handleNext = () => {
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswerIds: selected,
    };
    const updatedAnswers = [...answers.filter(a => a.questionId !== currentQuestion.id), newAnswer];
    setAnswers(updatedAnswers);

    if (currentIndex === questions.length - 1) {
      onComplete(updatedAnswers);
      navigator.push('/results');
    } else {
      setShowExplanation(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setShowExplanation(false);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      navigator.push('/');
    }
  };

  if (!currentQuestion) return null;

  return (
    <Panel id={id}>
      <PanelHeader>Тестирование</PanelHeader>
      <Group>
        <Box style={{ padding: 16 }}>
          <Progress value={progress} style={{ marginBottom: 16 }} />
          <Title level="3" style={{ marginBottom: 8 }}>
            Вопрос {currentIndex + 1} из {questions.length}
          </Title>
          <Text weight="1" style={{ marginBottom: 16 }}>
            {currentQuestion.text}
          </Text>

          <FormItem>
            {currentQuestion.type === 'single' ? (
              currentQuestion.answers.map(answer => (
                <Radio
                  key={answer.id}
                  name="answer"
                  value={answer.id}
                  checked={selected.includes(answer.id)}
                  onChange={(e) => handleAnswer(e.target.value, e.target.checked)}
                  disabled={showExplanation}
                >
                  {answer.text}
                </Radio>
              ))
            ) : (
              currentQuestion.answers.map(answer => (
                <Checkbox
                  key={answer.id}
                  value={answer.id}
                  checked={selected.includes(answer.id)}
                  onChange={(e) => handleAnswer(e.target.value, e.target.checked)}
                  disabled={showExplanation}
                >
                  {answer.text}
                </Checkbox>
              ))
            )}
          </FormItem>

          {showExplanation && (
            <Box style={{ backgroundColor: 'var(--vkui--color_background_secondary)', borderRadius: 8, padding: 12 }}>
              <Text weight="2">Объяснение:</Text>
              <Text>
                {currentQuestion.answers.find(a => a.id === selected[0])?.explanation ||
                  'Правильный ответ выделен'}
              </Text>
            </Box>
          )}

          <Spacing size={16} />
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="l" mode="secondary" onClick={handleBack}>
              {currentIndex === 0 ? 'К описанию' : 'Назад'}
            </Button>
            <Button
              size="l"
              stretched
              disabled={selected.length === 0 || showExplanation}
              onClick={handleNext}
            >
              {currentIndex === questions.length - 1 ? 'Завершить' : 'Далее'}
            </Button>
          </div>
        </Box>
      </Group>
    </Panel>
  );
};

export default TestPanel;