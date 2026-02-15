import { useState, useEffect } from 'react';
import { AppRoot, SplitLayout, SplitCol, View } from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { PANEL_DESCRIPTION, PANEL_TEST, PANEL_RESULTS } from './routes';
import { fetchConfig } from './api';
import { AppConfig, UserAnswer, TestResult } from './types';
import DescriptionPanel from './panels/DescriptionPanel';
import TestPanel from './panels/TestPanel';
import ResultsPanel from './panels/ResultsPanel';

function computeResult(answers: UserAnswer[], config: AppConfig): TestResult {
  let totalScore = 0;
  answers.forEach(userAns => {
    const question = config.quiz.questions.find(q => q.id === userAns.questionId);
    if (question) {
      question.answers.forEach(ans => {
        if (userAns.selectedAnswerIds.includes(ans.id)) {
          totalScore += ans.score;
        }
      });
    }
  });

  const range = config.quiz.scoring.ranges.find(r => totalScore >= r.min && totalScore <= r.max);
  if (!range) throw new Error('No matching score range');

  return {
    totalScore,
    level: range.level,
    color: range.color,
    interpretation: range.interpretation,
    recommendations: range.recommendations,
  };
}

export const App = () => {
  const { panel } = useActiveVkuiLocation();
  const navigator = useRouteNavigator();

  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setAnswers] = useState<UserAnswer[]>([]);
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    fetchConfig()
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load config', err);
        setLoading(false);
      });
  }, []);

  const handleTestComplete = (completedAnswers: UserAnswer[]) => {
    setAnswers(completedAnswers);
    if (config) {
      const res = computeResult(completedAnswers, config);
      setResult(res);
    }
  };

  const handleRestart = () => {
    setAnswers([]);
    setResult(null);
    navigator.push('/');
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!config) {
    return <div>Ошибка загрузки конфигурации</div>;
  }

  return (
    <AppRoot>
      <SplitLayout>
        <SplitCol>
          <View id="main" activePanel={panel || PANEL_DESCRIPTION}>
            <DescriptionPanel id={PANEL_DESCRIPTION} disease={config.disease} />
            <TestPanel
              id={PANEL_TEST}
              questions={config.quiz.questions}
              onComplete={handleTestComplete}
            />
            <ResultsPanel
              id={PANEL_RESULTS}
              result={result}
              onRestart={handleRestart}
              doctorLink="https://max.ru/appointment" // ссылка на мессенджер Макс
            />
          </View>
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  );
};