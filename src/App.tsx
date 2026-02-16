import { useEffect, useState } from 'react';
import { init, useRawInitData } from '@telegram-apps/sdk-react';

function App() {
  const rawInitData = useRawInitData();
  const [step, setStep] = useState(0); // 0 = welcome, 1–12 = вопросы, 13 = результат
  const [score, setScore] = useState(0);

  useEffect(() => {
    init(); // Инициализация Telegram Mini App
  }, []);

  // Получаем имя пользователя из Telegram
  let userName = 'Привет!';
  if (rawInitData) {
    try {
      const params = new URLSearchParams(rawInitData);
      const userJson = params.get('user');
      if (userJson) {
        const user = JSON.parse(decodeURIComponent(userJson));
        userName = user.first_name ? `Привет, ${user.first_name}!` : 'Привет!';
      }
    } catch (e) {
      console.error('Ошибка парсинга initData:', e);
    }
  }

  const questions = [
    { q: "Ты часто избегаешь конфликтов, чтобы никого не обидеть?", points: 2 },
    { q: "Бывает, что ты делаешь что-то против своей воли, лишь бы тебя одобрили?", points: 2 },
    { q: "Ты скрываешь свои настоящие чувства и желания от близких?", points: 2 },
    { q: "Чувствуешь вину, если отказываешь кому-то в помощи?", points: 2 },
    { q: "Ты часто ставишь чужие нужды выше своих?", points: 2 },
    { q: "Боишься, что если будешь «плохим», тебя перестанут ценить?", points: 2 },
    { q: "У тебя есть привычка извиняться даже когда не виноват?", points: 1 },
    { q: "Ты редко просишь о помощи, чтобы не быть обузой?", points: 1 },
    { q: "Чувствуешь раздражение, когда другие не ценят твои усилия?", points: 1 },
    { q: "Тебе сложно сказать «нет» даже когда это вредит тебе?", points: 2 },
    { q: "Ты стараешься всем нравиться, даже если это выматывает?", points: 2 },
    { q: "Бывает, что ты злишься на себя за то, что опять всем уступил?", points: 1 },
  ];

  const handleAnswer = (points: number) => {
    setScore(prev => prev + points);
    setStep(prev => prev + 1);
  };

  // Стили для кнопок (теперь используется!)
  const btnStyle = {
    background: '#333',
    color: '#fff',
    border: 'none',
    padding: '1rem',
    fontSize: '1.2rem',
    borderRadius: '12px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '0.8rem',
  };

  // Welcome-экран
  if (step === 0) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Обложка */}
        <div
          style={{
            width: '100%',
            maxWidth: '360px',
            marginBottom: '2.5rem',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 15px 40px rgba(0,0,0,0.7)',
            border: '1px solid rgba(105, 168, 255, 0.2)',
          }}
        >
          <img
            src="https://i.ibb.co/0RR9w3Gq/image.jpg"
            alt="НеДляВсех"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        <h1
          style={{
            fontSize: '3.8rem',
            fontWeight: '900',
            margin: '0 0 1rem',
            color: '#69a8ff',
            textShadow: '0 4px 15px rgba(105, 168, 255, 0.4)',
            letterSpacing: '-1px',
          }}
        >
          НеДляВсех
        </h1>

        <p
          style={{
            fontSize: '1.8rem',
            margin: '0 0 1.5rem',
            opacity: 0.95,
          }}
        >
          {userName}
        </p>

        <p
          style={{
            fontSize: '1.25rem',
            maxWidth: '90%',
            margin: '0 auto 3rem',
            lineHeight: 1.6,
            opacity: 0.85,
          }}
        >
          Берешь на себя чужие ожидания, проблемы и желания норма?  
          Постоянно отдавать, чтобы понравиться, а в итоге пустота?  
          Пора перестать быть для всех и наконец стать для себя.
        </p>

        <button
          style={{
            background: 'linear-gradient(135deg, #69a8ff, #459cfe)',
            color: '#fff',
            border: 'none',
            padding: '1.4rem 3.2rem',
            fontSize: '1.6rem',
            fontWeight: 'bold',
            borderRadius: '999px',
            cursor: 'pointer',
            boxShadow: '0 12px 35px #69a8ff',
            transition: 'all 0.25s ease',
          }}
          onClick={() => setStep(1)}
        >
          Начать тест
        </button>

        <p style={{ marginTop: 'auto', fontSize: '0.95rem', opacity: 0.55, paddingTop: '3rem' }}>
          Инструмент для тех, кто хочет вернуть себе свою жизнь
        </p>
      </div>
    );
  }

  // Вопросы теста
  if (step <= questions.length) {
    const q = questions[step - 1];
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#111',
          color: '#fff',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>
          Вопрос {step} из {questions.length}
        </h2>
        <p style={{ fontSize: '1.4rem', marginBottom: '2.5rem', maxWidth: '90%' }}>
          {q.q}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <button style={btnStyle} onClick={() => handleAnswer(2)}>
            Да, часто
          </button>
          <button style={btnStyle} onClick={() => handleAnswer(1)}>
            Иногда
          </button>
          <button style={btnStyle} onClick={() => handleAnswer(0)}>
            Нет, редко
          </button>
        </div>
      </div>
    );
  }

  // Результат теста
  let resultText = '';
  if (score <= 8) resultText = 'Низкий уровень — ты уже умеешь ставить границы и заботиться о себе!';
  else if (score <= 16) resultText = 'Средний уровень — есть над чем поработать, но ты на правильном пути.';
  else resultText = 'Высокий уровень — пора срочно менять подход. Ты слишком много отдаёшь другим!';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#111',
        color: '#fff',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Твой результат</h1>
      <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        {score} баллов из {questions.length * 2}
      </p>
      <p style={{ fontSize: '1.3rem', maxWidth: '90%', lineHeight: 1.5 }}>
        {resultText}
      </p>
      <button
        style={{
          marginTop: '2rem',
          background: '#459cfe',
          color: '#fff',
          border: 'none',
          padding: '1rem 2.5rem',
          fontSize: '1.3rem',
          borderRadius: '999px',
          cursor: 'pointer',
        }}
        onClick={() => {
          setStep(0);
          setScore(0);
        }}
      >
        Вернуться на главный экран
      </button>
    </div>
  );
}

export default App;