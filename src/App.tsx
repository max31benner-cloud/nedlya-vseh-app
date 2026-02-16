import { useEffect, useState } from 'react';
import { init, useRawInitData } from '@telegram-apps/sdk-react';

function App() {
  const rawInitData = useRawInitData();
  const [step, setStep] = useState(0); // 0=welcome, 1–12=тест, 13=результат, 14=журнал, 15=задания
  const [score, setScore] = useState(0);
  const [journalEntries, setJournalEntries] = useState<string[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    init();

    const savedJournal = localStorage.getItem('journalEntries');
    if (savedJournal) setJournalEntries(JSON.parse(savedJournal));

    const savedProgress = localStorage.getItem('completedDays');
    if (savedProgress) setCompletedDays(JSON.parse(savedProgress));
  }, []);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('completedDays', JSON.stringify(completedDays));
  }, [completedDays]);

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
    "День 11: Откажись от одной роли «спасателя» в течение дня",
    "День 12: Запиши свои настоящие желания на ближайшие 3 дня",
    "День 13: Сделай что-то приятное для себя без оправданий",
    "День 14: Выскажи своё недовольство, если что-то не устраивает",
    "День 15: Проведи день без попыток «угадать», что от тебя хотят",
    "День 16: Не бери на себя чужую ответственность",
    "День 17: Сделай паузу перед тем, как ответить на просьбу",
    "День 18: Запиши, что ты теряешь, когда всегда всем угождаешь",
    "День 19: Один раз поставь свои потребности выше чужих",
    "День 20: Побудь один час в тишине без отвлечений",
    "День 21: Скажи «я не хочу» вслух хотя бы один раз",
    "День 22: Не оправдывайся за свой выбор",
    "День 23: Запиши 5 качеств, которые ты в себе ценишь",
    "День 24: Сделай что-то, что раньше откладывал из-за страха осуждения",
    "День 25: Попроси о том, чего действительно хочешь",
    "День 26: Не спасай человека, который может справиться сам",
    "День 27: Проведи день, фокусируясь только на своих чувствах",
    "День 28: Скажи «это для меня важно» вслух",
    "День 29: Не бери на себя чужие эмоции",
    "День 30: Подведи итоги первого месяца — что изменилось",
    "День 31: Начни день с вопроса «чего я хочу сегодня?»",
    "День 32: Вырази гнев или раздражение конструктивно",
    "День 33: Сделай что-то, что раньше считал недостойным",
    "День 34: Не соглашайся с тем, с чем не согласен",
    "День 35: Запиши, какие границы ты уже начал ставить",
    "День 36: Один день проживи без оправданий",
    "День 37: Попроси о том, в чём раньше стеснялся",
    "День 38: Не бери ответственность за чужое настроение",
    "День 39: Сделай паузу перед автоматическим «да»",
    "День 40: Похвали себя за один поступок, который сделал для себя",
    "День 41: Выскажи своё желание открыто",
    "День 42: Не спасай того, кто не просил о помощи",
    "День 43: Проведи день, слушая только себя",
    "День 44: Скажи «это мои границы»",
    "День 45: Подведи итоги 1.5 месяцев",
    "День 46: Сделай что-то, чего раньше боялся",
    "День 47: Не извиняйся за свои эмоции",
    "День 48: Поставь свои потребности на первое место хотя бы раз",
    "День 49: Запиши, как изменилась твоя жизнь",
    "День 50: Проживи день без «маски» удобного человека",
    "День 51: Скажи «нет» большой просьбе",
    "День 52: Попроси о поддержке открыто",
    "День 53: Не бери на себя чужие проблемы",
    "День 54: Сделай что-то только для своего удовольствия",
    "День 55: Вырази благодарность себе",
    "День 56: Подведи итоги 2 месяцев",
    "День 57: Живи без попыток всем угодить",
    "День 58: Скажи правду, даже если она неудобная",
    "День 59: Не оправдывайся за свой отдых",
    "День 60: Похвали себя за прогресс",
    "День 61: Сделай то, чего раньше боялся",
    "День 62: Не бери ответственность за чужое счастье",
    "День 63: Проживи день по своим правилам",
    "День 64: Выскажи свои границы спокойно",
    "День 65: Запиши, кем ты становишься",
    "День 66: Сделай паузу перед автоматическим соглашением",
    "День 67: Попроси о том, чего действительно хочешь",
    "День 68: Не спасай того, кто может справиться сам",
    "День 69: Проживи день без оправданий",
    "День 70: Подведи итоги 70 дней",
    "День 71: Живи без маски «удобного человека»",
    "День 72: Скажи «это мои границы»",
    "День 73: Сделай что-то, что раньше казалось эгоистичным",
    "День 74: Поблагодари себя за изменения",
    "День 75: Не бери на себя чужие эмоции",
    "День 76: Вырази своё желание открыто",
    "День 77: Проживи день, фокусируясь только на себе",
    "День 78: Скажи «нет» без чувства вины",
    "День 79: Запиши, как ты теперь относишься к себе",
    "День 80: Подведи итоги 80 дней",
    "День 81: Живи по своим правилам",
    "День 82: Не оправдывайся за свои чувства",
    "День 83: Сделай что-то, что приносит тебе радость",
    "День 84: Попроси о поддержке",
    "День 85: Не бери ответственность за чужое настроение",
    "День 86: Выскажи свои границы спокойно",
    "День 87: Поблагодари себя за пройденный путь",
    "День 88: Проживи день без попыток всем угодить",
    "День 89: Запиши 3 главных изменения в себе",
    "День 90: Подведи итоги 90 дней. Кем ты стал?"
  ];

  const handleAnswer = (points: number) => {
    setScore(prev => prev + points);
    setStep(prev => prev + 1);
  };

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
          90-дневный план
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
        <button style={{ ...btn, background: '#ff69b4' }} onClick={() => setStep(0)}>
          Вернуться на главный экран
        </button>
        <button style={{ ...btn, background: '#444' }} onClick={() => setStep(14)}>
          Журнал
        </button>
        <button style={{ ...btn, background: '#555' }} onClick={() => setStep(15)}>
          90-дневный план
        </button>
      </div>
    );
  }

  // Журнал записей
  if (step === 14) {
    return (
      <div style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: '2rem' }}>
        <h1>Журнал записей</h1>

        <textarea
          value={newEntry}
          onChange={e => setNewEntry(e.target.value)}
          placeholder="Что ты чувствуешь сегодня? Что хочешь изменить?"
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
          Сохранить запись
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

  // 90-дневный план
  if (step === 15) {
    return (
      <div style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: '2rem' }}>
        <h1>90-дневный план</h1>
        <p>Пройдено: {completedDays.length} / 90</p>

        {Array.from({ length: 90 }, (_, i) => i + 1).map(day => (
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
        Вернуться на главный экран
      </button>
      <button style={{ ...btn, background: '#444' }} onClick={() => setStep(14)}>
        Журнал
      </button>
      <button style={{ ...btn, background: '#555' }} onClick={() => setStep(15)}>
        90-дневный план
      </button>
    </div>
  );
}

export default App;