import { useEffect, useState } from 'react';
import { init, useRawInitData } from '@telegram-apps/sdk-react';

function App() {
  const rawInitData = useRawInitData();
  const [step, setStep] = useState(0); // 0 = welcome, 1–12 = тест, 13 = результат, 14 = журнал, 15 = задания
  const [score, setScore] = useState(0);
  const [journalEntries, setJournalEntries] = useState<string[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    init();

    // Загрузка журнала
    const savedJournal = localStorage.getItem('journalEntries');
    if (savedJournal) setJournalEntries(JSON.parse(savedJournal));

    // Загрузка прогресса заданий
    const savedProgress = localStorage.getItem('completedDays');
    if (savedProgress) setCompletedDays(JSON.parse(savedProgress));
  }, []);

  // Сохранение журнала и заданий
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('completedDays', JSON.stringify(completedDays));
  }, [completedDays]);

  // Имя пользователя
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

  const dailyTasks = [
    "День 1: Запиши 3 вещи, которые ты делаешь, чтобы всем угодить",
    "День 2: Один раз скажи «нет» без объяснений",
    "День 3: Выполни одно желание только для себя",
    "День 4: Вырази своё настоящее мнение в разговоре",
    "День 5: Не извиняйся, если не виноват",
    "День 6: Попроси о помощи у кого-то",
    "День 7: Проведи 30 минут без телефона и соцсетей",
    "День 8: Запиши, что ты чувствуешь, когда кто-то не одобряет тебя",
    "День 9: Сделай что-то, что раньше считал «эгоистичным»",
    "День 10: Поблагодари себя за один поступок, который сделал для себя",
  ];

  const toggleDay = (day: number) => {
    setCompletedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const btn = {
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

  // Welcome
  if (step === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="https://i.ibb.co/0RR9w3Gq/image.jpg" alt="Обложка" style={{ maxWidth: '360px', borderRadius: '20px', marginBottom: '2rem', boxShadow: '0 15px 40px rgba(0,0,0,0.7)' }} />
        <h1 style={{ fontSize: '3.8rem', color: '#69a8ff' }}>НеДляВсех</h1>
        <p style={{ fontSize: '1.8rem' }}>{userName}</p>
        <p style={{ fontSize: '1.25rem', maxWidth: '90%' }}>
          Берешь на себя чужие ожидания, проблемы и желания норма?  
          Постоянно отдавать, чтобы понравиться, а в итоге пустота?  
          Пора перестать быть для всех и стать для себя.
        </p>
        <button style={{ ...btn, background: '#69a8ff' }} onClick={() => setStep(1)}>
          Начать тест
        </button>
        <button style={{ ...btn, background: '#444' }} onClick={() => setStep(14)}>
          Журнал записей
        </button>
        <button style={{ ...btn, background: '#555' }} onClick={() => setStep(15)}>
          Ежедневные задания
        </button>
      </div>
    );
  }

  // Тест
  if (step <= questions.length) {
    const q = questions[step - 1];
    return (
      <div style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Вопрос {step} из {questions.length}</h2>
        <p style={{ fontSize: '1.4rem', margin: '2rem 0' }}>{q.q}</p>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <button style={btn} onClick={() => handleAnswer(2)}>Да, часто</button>
          <button style={btn} onClick={() => handleAnswer(1)}>Иногда</button>
          <button style={btn} onClick={() => handleAnswer(0)}>Нет, редко</button>
        </div>
      </div>
    );
  }

  // Результат теста
  if (step === 13) {
    let result = '';
    if (score <= 8) result = 'Низкий уровень — ты уже умеешь ставить границы!';
    else if (score <= 16) result = 'Средний уровень — есть над чем поработать.';
    else result = 'Высокий уровень — пора менять подход.';

    return (
      <div style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1>Результат</h1>
        <p style={{ fontSize: '2rem' }}>{score} баллов</p>
        <p style={{ fontSize: '1.3rem' }}>{result}</p>
        <button style={{ ...btn, background: '#ff69b4' }} onClick={() => setStep(0)}>Главный экран</button>
        <button style={{ ...btn, background: '#444' }} onClick={() => setStep(14)}>Журнал</button>
        <button style={{ ...btn, background: '#555' }} onClick={() => setStep(15)}>Задания</button>
      </div>
    );
  }

  // Журнал
  if (step === 14) {
    return (
      <div style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: '2rem' }}>
        <h1>Журнал записей</h1>
        <textarea
          value={newEntry}
          onChange={e => setNewEntry(e.target.value)}
          placeholder="Что ты чувствуешь? Что хочешь изменить?"
          style={{ width: '100%', height: '120px', padding: '1rem', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '12px', marginBottom: '1rem' }}
        />
        <button
          style={{ ...btn, background: '#ff69b4' }}
          onClick={() => {
            if (newEntry.trim()) {
              const entry = `${new Date().toLocaleString('ru-RU')}: ${newEntry.trim()}`;
              setJournalEntries(prev => [...prev, entry]);
              setNewEntry('');
            }
          }}
        >
          Сохранить
        </button>

        <h2>Твои записи</h2>
        {journalEntries.length === 0 ? <p>Пока пусто...</p> : journalEntries.map((entry, i) => (
          <div key={i} style={{ background: '#222', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
            {entry}
          </div>
        ))}

        {journalEntries.length > 0 && (
          <button style={{ ...btn, background: '#444' }} onClick={() => setJournalEntries([])}>
            Очистить журнал
          </button>
        )}

        <button style={{ ...btn, background: '#555' }} onClick={() => setStep(0)}>
          На главный экран
        </button>
      </div>
    );
  }

  // Задания
  if (step === 15) {
    return (
      <div style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: '2rem' }}>
        <h1>Ежедневные задания</h1>
        <p>Пройдено: {completedDays.length} / 10</p>

        {Array.from({ length: 10 }, (_, i) => i + 1).map(day => (
          <div
            key={day}
            style={{
              background: completedDays.includes(day) ? '#2a2' : '#222',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>День {day}: {dailyTasks[day - 1]}</span>
            <button
              style={{
                background: completedDays.includes(day) ? '#0f0' : '#444',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onClick={() => toggleDay(day)}
            >
              {completedDays.includes(day) ? '✓' : 'Выполнить'}
            </button>
          </div>
        ))}

        <button style={{ ...btn, background: '#555', marginTop: '2rem' }} onClick={() => setStep(0)}>
          На главный экран
        </button>
      </div>
    );
  }

  // Результат теста
  let resultText = '';
  if (score <= 8) resultText = 'Низкий уровень — ты уже умеешь ставить границы!';
  else if (score <= 16) resultText = 'Средний уровень — есть над чем поработать.';
  else resultText = 'Высокий уровень — пора менять подход.';

  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>Результат</h1>
      <p style={{ fontSize: '2rem' }}>{score} баллов</p>
      <p style={{ fontSize: '1.3rem' }}>{resultText}</p>
      <button style={{ ...btn, background: '#ff69b4' }} onClick={() => setStep(0)}>
        Главный экран
      </button>
      <button style={{ ...btn, background: '#444' }} onClick={() => setStep(14)}>
        Журнал
      </button>
      <button style={{ ...btn, background: '#555' }} onClick={() => setStep(15)}>
        Задания
      </button>
    </div>
  );
}

export default App;