import { useEffect, useState } from 'react';
import { init, useRawInitData } from '@telegram-apps/sdk-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface JournalEntry {
  id: string;
  date: string;
  text: string;
  dayTask?: number;
}

interface UserState {
  testDone: boolean;
  testScore: number;
  currentDay: number;
  completedDays: number[];
  journalEntries: JournalEntry[];
  lastCompletedDate: string | null; // "YYYY-MM-DD" — дата последнего НОВОГО выполненного задания
}

const DEFAULT_STATE: UserState = {
  testDone: false,
  testScore: 0,
  currentDay: 1,
  completedDays: [],
  journalEntries: [],
  lastCompletedDate: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function loadState(userId: string): UserState {
  try {
    const raw = localStorage.getItem(`userState_${userId}`);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_STATE };
}

function saveState(userId: string, state: UserState) {
  localStorage.setItem(`userState_${userId}`, JSON.stringify(state));
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const questions = [
  { q: 'Ты часто избегаешь конфликтов, чтобы никого не обидеть?', points: 2 },
  { q: 'Бывает, что ты делаешь что-то против своей воли, лишь бы тебя одобрили?', points: 2 },
  { q: 'Ты скрываешь свои настоящие чувства и желания от близких?', points: 2 },
  { q: 'Чувствуешь вину, если отказываешь кому-то в помощи?', points: 2 },
  { q: 'Ты часто ставишь чужие нужды выше своих?', points: 2 },
  { q: 'Боишься, что если будешь «плохим», тебя перестанут ценить?', points: 2 },
  { q: 'У тебя есть привычка извиняться даже когда не виноват?', points: 1 },
  { q: 'Ты редко просишь о помощи, чтобы не быть обузой?', points: 1 },
  { q: 'Чувствуешь раздражение, когда другие не ценят твои усилия?', points: 1 },
  { q: 'Тебе сложно сказать «нет» даже когда это вредит тебе?', points: 2 },
  { q: 'Ты стараешься всем нравиться, даже если это выматывает?', points: 2 },
  { q: 'Бывает, что ты злишься на себя за то, что опять всем уступил?', points: 1 },
];

const dailyTasks = [
  'Запиши 3 вещи, которые ты делаешь, чтобы всем угодить',
  'Один раз скажи «нет» без объяснений',
  'Выполни одно желание только для себя',
  'Вырази своё настоящее мнение в разговоре',
  'Не извиняйся, если не виноват',
  'Попроси о помощи у кого-то',
  'Проведи 30 минут без телефона и соцсетей',
  'Запиши, что ты чувствуешь, когда кто-то не одобряет тебя',
  'Сделай что-то, что раньше считал «эгоистичным»',
  'Поблагодари себя за один поступок, который сделал для себя',
  'Откажись от одной роли «спасателя» в течение дня',
  'Запиши свои настоящие желания на ближайшие 3 дня',
  'Сделай что-то приятное для себя без оправданий',
  'Выскажи своё недовольство, если что-то не устраивает',
  'Проведи день без попыток «угадать», что от тебя хотят',
  'Не бери на себя чужую ответственность',
  'Сделай паузу перед тем, как ответить на просьбу',
  'Запиши, что ты теряешь, когда всегда всем угождаешь',
  'Один раз поставь свои потребности выше чужих',
  'Побудь один час в тишине без отвлечений',
  'Скажи «я не хочу» вслух хотя бы один раз',
  'Не оправдывайся за свой выбор',
  'Запиши 5 качеств, которые ты в себе ценишь',
  'Сделай что-то, что раньше откладывал из-за страха осуждения',
  'Попроси о том, чего действительно хочешь',
  'Не спасай человека, который может справиться сам',
  'Проведи день, фокусируясь только на своих чувствах',
  'Скажи «это для меня важно» вслух',
  'Не бери на себя чужие эмоции',
  'Подведи итоги первого месяца — что изменилось',
  'Начни день с вопроса «чего я хочу сегодня?»',
  'Вырази гнев или раздражение конструктивно',
  'Сделай что-то, что раньше считал недостойным',
  'Не соглашайся с тем, с чем не согласен',
  'Запиши, какие границы ты уже начал ставить',
  'Один день проживи без оправданий',
  'Попроси о том, в чём раньше стеснялся',
  'Не бери ответственность за чужое настроение',
  'Сделай паузу перед автоматическим «да»',
  'Похвали себя за один поступок, который сделал для себя',
  'Выскажи своё желание открыто',
  'Не спасай того, кто не просил о помощи',
  'Проведи день, слушая только себя',
  'Скажи «это мои границы»',
  'Подведи итоги 1.5 месяцев',
  'Сделай что-то, чего раньше боялся',
  'Не извиняйся за свои эмоции',
  'Поставь свои потребности на первое место хотя бы раз',
  'Запиши, как изменилась твоя жизнь',
  'Проживи день без «маски» удобного человека',
  'Скажи «нет» большой просьбе',
  'Попроси о поддержке открыто',
  'Не бери на себя чужие проблемы',
  'Сделай что-то только для своего удовольствия',
  'Вырази благодарность себе',
  'Подведи итоги 2 месяцев',
  'Живи без попыток всем угодить',
  'Скажи правду, даже если она неудобная',
  'Не оправдывайся за свой отдых',
  'Похвали себя за прогресс',
  'Сделай то, чего раньше боялся',
  'Не бери ответственность за чужое счастье',
  'Проживи день по своим правилам',
  'Выскажи свои границы спокойно',
  'Запиши, кем ты становишься',
  'Сделай паузу перед автоматическим соглашением',
  'Попроси о том, чего действительно хочешь',
  'Не спасай того, кто может справиться сам',
  'Проживи день без оправданий',
  'Подведи итоги 70 дней',
  'Живи без маски «удобного человека»',
  'Скажи «это мои границы»',
  'Сделай что-то, что раньше казалось эгоистичным',
  'Поблагодари себя за изменения',
  'Не бери на себя чужие эмоции',
  'Вырази своё желание открыто',
  'Проживи день, фокусируясь только на себе',
  'Скажи «нет» без чувства вины',
  'Запиши, как ты теперь относишься к себе',
  'Подведи итоги 80 дней',
  'Живи по своим правилам',
  'Не оправдывайся за свои чувства',
  'Сделай что-то, что приносит тебе радость',
  'Попроси о поддержке',
  'Не бери ответственность за чужое настроение',
  'Выскажи свои границы спокойно',
  'Поблагодари себя за пройденный путь',
  'Проживи день без попыток всем угодить',
  'Запиши 3 главных изменения в себе',
  'Подведи итоги 90 дней. Кем ты стал?',
];

// ─── Мотивационные сообщения ──────────────────────────────────────────────────
const motivationMessages = [
  { emoji: '🔥', title: 'Ты сделал это!', text: 'Каждый маленький шаг — это победа. Ты на пути к себе настоящему.' },
  { emoji: '💪', title: 'Отличная работа!', text: 'Большинство людей никогда не делают то, что сделал ты сегодня. Ты уже другой.' },
  { emoji: '⭐', title: 'Так держать!', text: 'Границы — это не стены. Это уважение к себе. Ты учишься этому.' },
  { emoji: '🌱', title: 'Ты растёшь!', text: 'Изменения незаметны изнутри, но они происходят. Доверяй процессу.' },
  { emoji: '🦁', title: 'Смело!', text: 'Сказать «нет» или поставить себя на первое место — это сила, а не эгоизм.' },
  { emoji: '✨', title: 'Ещё один день!', text: 'Ты не угождаешь — ты живёшь. Это твоя жизнь, и ты её выбираешь.' },
  { emoji: '🏆', title: 'Победа!', text: 'Гловер писал: «Нет» — это полное предложение. Ты это понял на практике.' },
  { emoji: '🎯', title: 'В точку!', text: 'Твоя ценность не зависит от того, насколько ты удобен другим. Помни это.' },
  { emoji: '💎', title: 'Ты ценен!', text: 'Человек, который знает себе цену, не нуждается в постоянном одобрении.' },
  { emoji: '🚀', title: 'Вперёд!', text: 'Каждый выполненный день — кирпичик твоего нового «я». Строй смело.' },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    background: '#0f0f0f',
    color: '#fff',
    padding: '1.5rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  } as React.CSSProperties,
  centered: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: (color = '#333') => ({
    background: color,
    color: '#fff',
    border: 'none',
    padding: '0.9rem 1.2rem',
    fontSize: '1.05rem',
    borderRadius: '14px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.01em',
  } as React.CSSProperties),
  card: (bg = '#1a1a1a') => ({
    background: bg,
    padding: '1rem 1.2rem',
    borderRadius: '14px',
    marginBottom: '0.8rem',
  } as React.CSSProperties),
  tag: (color: string) => ({
    display: 'inline-block',
    background: color,
    color: '#fff',
    fontSize: '0.75rem',
    padding: '2px 8px',
    borderRadius: '8px',
    marginBottom: '6px',
    fontWeight: 700,
  } as React.CSSProperties),
};

// ─── Screens ──────────────────────────────────────────────────────────────────
type Screen = 'home' | 'test' | 'result' | 'plan' | 'journal' | 'task-journal' | 'motivation';

// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  const rawInitData = useRawInitData();
  const [screen, setScreen] = useState<Screen>('home');
  const [userId, setUserId] = useState('guest');
  const [userName, setUserName] = useState('');
  const [userState, setUserState] = useState<UserState>(DEFAULT_STATE);

  // тест
  const [testStep, setTestStep] = useState(0);
  const [testScore, setTestScore] = useState(0);

  // task-journal
  const [activeTaskDay, setActiveTaskDay] = useState<number | null>(null);
  const [taskDraft, setTaskDraft] = useState('');

  // motivation screen state
  const [motivationMsg, setMotivationMsg] = useState(motivationMessages[0]);
  const [completedDayNum, setCompletedDayNum] = useState<number>(1);

  // journal
  const [journalDraft, setJournalDraft] = useState('');

  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    let uid = 'guest';
    let uname = '';
    if (rawInitData) {
      try {
        const params = new URLSearchParams(rawInitData);
        const userJson = params.get('user');
        if (userJson) {
          const user = JSON.parse(decodeURIComponent(userJson));
          uid = String(user.id || 'guest');
          uname = user.first_name || '';
        }
      } catch (e) {
        console.error(e);
      }
    }
    setUserId(uid);
    setUserName(uname);
    const saved = loadState(uid);
    setUserState(saved);
  }, [rawInitData]);

  // ── Persist ─────────────────────────────────────────────────────────────────
  function updateState(patch: Partial<UserState>) {
    setUserState(prev => {
      const next = { ...prev, ...patch };
      saveState(userId, next);
      return next;
    });
  }

  // ── Проверка: выполнял ли пользователь НОВОЕ задание сегодня ───────────────
  function hasCompletedTaskToday(): boolean {
    if (!userState.lastCompletedDate) return false;
    return userState.lastCompletedDate === getTodayString();
  }

  // ── Test logic ──────────────────────────────────────────────────────────────
  function handleTestAnswer(points: number) {
    const newScore = testScore + points;
    setTestScore(newScore);
    if (testStep + 1 >= questions.length) {
      updateState({ testDone: true, testScore: newScore });
      setScreen('result');
    } else {
      setTestStep(s => s + 1);
    }
  }

  function startTest() {
    setTestStep(0);
    setTestScore(0);
    setScreen('test');
  }

  // ── Task → Journal ──────────────────────────────────────────────────────────
  function openTaskJournal(day: number) {
    setActiveTaskDay(day);
    setTaskDraft('');
    setScreen('task-journal');
  }

  function saveTaskEntry() {
    if (!taskDraft.trim() || activeTaskDay === null) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ru-RU'),
      text: taskDraft.trim(),
      dayTask: activeTaskDay,
    };

    const newEntries = [...userState.journalEntries, entry];
    const wasAlreadyDone = userState.completedDays.includes(activeTaskDay);
    const newCompleted = wasAlreadyDone
      ? userState.completedDays
      : [...userState.completedDays, activeTaskDay];
    const nextDay = activeTaskDay >= userState.currentDay
      ? Math.min(90, activeTaskDay + 1)
      : userState.currentDay;

    updateState({
      journalEntries: newEntries,
      completedDays: newCompleted,
      currentDay: nextDay,
      // Обновляем дату только если задание выполнено впервые
      lastCompletedDate: wasAlreadyDone ? userState.lastCompletedDate : getTodayString(),
    });

    setTaskDraft('');

    // Мотивационный экран только при первом выполнении задания
    if (!wasAlreadyDone) {
      const randMsg = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
      setMotivationMsg(randMsg);
      setCompletedDayNum(activeTaskDay);
      setScreen('motivation');
    } else {
      setScreen('plan');
    }
  }

  // ── Free journal ────────────────────────────────────────────────────────────
  function saveFreeEntry() {
    if (!journalDraft.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ru-RU'),
      text: journalDraft.trim(),
    };
    updateState({ journalEntries: [...userState.journalEntries, entry] });
    setJournalDraft('');
  }

  function deleteEntry(id: string) {
    updateState({ journalEntries: userState.journalEntries.filter(e => e.id !== id) });
  }

  // ── Result label ────────────────────────────────────────────────────────────
  function resultLabel(s: number) {
    if (s <= 8) return { text: 'Низкий уровень — круто, ты уже умеешь ставить границы! Задания помогут укрепить этот навык!', color: '#4caf50' };
    if (s <= 16) return { text: 'Средний уровень — есть над чем поработать. Давай перейдем к практике!', color: '#ff9800' };
    return { text: 'Высокий уровень — пора менять подход. Давай перейдем к практике!', color: '#ff4444' };
  }

  // ════════════════════════════════════════════════════════════════════════════
  // HOME
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === 'home') {
    const greeting = userName ? `Привет, ${userName}!` : 'Привет!';
    const res = userState.testDone ? resultLabel(userState.testScore) : null;

    return (
      <div style={{ ...S.page, ...S.centered }}>
        <img
          src="https://i.ibb.co/0RR9w3Gq/image.jpg"
          alt="Обложка"
          style={{ maxWidth: '280px', borderRadius: '20px', marginBottom: '1.5rem', boxShadow: '0 15px 40px rgba(0,0,0,0.7)' }}
        />
        <h1 style={{ fontSize: '2.8rem', color: '#69a8ff', margin: '0 0 0.3rem' }}>НеДляВсех</h1>
        <p style={{ fontSize: '1.4rem', margin: '0 0 0.5rem' }}>{greeting}</p>

        {userState.testDone && res ? (
          <div style={{ ...S.card('#1c2a1c'), width: '100%', maxWidth: 400, marginBottom: '1.2rem', textAlign: 'center' }}>
            <div style={S.tag(res.color)}>Твой результат</div>
            <p style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.3rem 0' }}>{userState.testScore} баллов</p>
            <p style={{ fontSize: '1rem', color: '#ccc', margin: 0 }}>{res.text}</p>
          </div>
        ) : (
          <p style={{ fontSize: '1.1rem', maxWidth: '90%', textAlign: 'center', color: '#aaa', marginBottom: '1rem' }}>
            Берёшь на себя чужие ожидания и проблемы?<br />
            Постоянно отдаёшь, чтобы понравиться?<br />
            Пора стать для себя.<br />
            Пройди тест честно, не обманый СЕБЯ!
          </p>
        )}

        <div style={{ width: '100%', maxWidth: 400 }}>
          {!userState.testDone ? (
            <button style={S.btn('#69a8ff')} onClick={startTest}>
              Пройти тест
            </button>
          ) : (
            <button style={S.btn('#555')} onClick={startTest}>
              Пройти тест заново
            </button>
          )}

          <button style={S.btn('#2d5a9e')} onClick={() => setScreen('plan')}>
            📅 90-дневный план
            {userState.completedDays.length > 0 && (
              <span style={{ marginLeft: 8, opacity: 0.8, fontWeight: 400 }}>
                ({userState.completedDays.length}/90)
              </span>
            )}
          </button>

          <button style={S.btn('#3a2a4a')} onClick={() => setScreen('journal')}>
            📓 Журнал записей
            {userState.journalEntries.length > 0 && (
              <span style={{ marginLeft: 8, opacity: 0.8, fontWeight: 400 }}>
                ({userState.journalEntries.length})
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TEST
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === 'test') {
    const q = questions[testStep];
    const progress = Math.round(((testStep) / questions.length) * 100);
    return (
      <div style={{ ...S.page, ...S.centered }}>
        <div style={{ width: '100%', maxWidth: 400, marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888', marginBottom: 6 }}>
            <span>Вопрос {testStep + 1} из {questions.length}</span>
            <span>{progress}%</span>
          </div>
          <div style={{ background: '#222', borderRadius: 8, height: 6 }}>
            <div style={{ background: '#69a8ff', width: `${progress}%`, height: 6, borderRadius: 8, transition: 'width 0.3s' }} />
          </div>
        </div>

        <p style={{ fontSize: '1.35rem', maxWidth: 400, textAlign: 'center', margin: '0 0 2rem', lineHeight: 1.5 }}>{q.q}</p>

        <div style={{ width: '100%', maxWidth: 400 }}>
          <button style={S.btn('#1e3a5f')} onClick={() => handleTestAnswer(2)}>Да, часто</button>
          <button style={S.btn('#333')} onClick={() => handleTestAnswer(1)}>Иногда</button>
          <button style={S.btn('#222')} onClick={() => handleTestAnswer(0)}>Нет, редко</button>
        </div>

        <button style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginTop: '1rem' }} onClick={() => setScreen('home')}>
          ← Назад
        </button>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // RESULT
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === 'result') {
    const res = resultLabel(userState.testScore);
    return (
      <div style={{ ...S.page, ...S.centered }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Результат теста</h1>
        <div style={{ fontSize: '4rem', fontWeight: 700, color: res.color, margin: '0.5rem 0' }}>{userState.testScore}</div>
        <p style={{ fontSize: '1rem', color: '#888', marginBottom: '0.2rem' }}>баллов из 24</p>
        <p style={{ fontSize: '1.25rem', textAlign: 'center', maxWidth: 340, margin: '1rem 0 2rem', color: res.color }}>{res.text}</p>

        <div style={{ width: '100%', maxWidth: 400 }}>
          <button style={S.btn('#2d5a9e')} onClick={() => setScreen('plan')}>
            📅 Начать 90-дневный план
          </button>
          <button style={S.btn('#3a2a4a')} onClick={() => setScreen('journal')}>
            📓 Открыть журнал
          </button>
          <button style={S.btn('#333')} onClick={() => setScreen('home')}>
            На главную
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // MOTIVATION — новый экран после выполнения задания
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === 'motivation') {
    const totalDone = userState.completedDays.length;

    return (
      <div style={{ ...S.page, ...S.centered, textAlign: 'center' }}>
        {/* Большой эмодзи */}
        <div style={{
          fontSize: '5rem',
          marginBottom: '1rem',
          filter: 'drop-shadow(0 0 20px rgba(105, 168, 255, 0.4))',
        }}>
          {motivationMsg.emoji}
        </div>

        {/* Карточка с поздравлением */}
        <div style={{
          background: 'linear-gradient(135deg, #1a2a40 0%, #1a3520 100%)',
          border: '1px solid #69a8ff33',
          borderRadius: '20px',
          padding: '2rem 1.5rem',
          maxWidth: 360,
          width: '100%',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            display: 'inline-block',
            background: '#69a8ff22',
            border: '1px solid #69a8ff55',
            borderRadius: '10px',
            padding: '4px 12px',
            fontSize: '0.8rem',
            color: '#69a8ff',
            fontWeight: 700,
            marginBottom: '0.8rem',
            letterSpacing: '0.05em',
          }}>
            ДЕНЬ {completedDayNum} ВЫПОЛНЕН ✓
          </div>

          <h2 style={{
            fontSize: '2rem',
            fontWeight: 800,
            margin: '0 0 0.8rem',
            color: '#fff',
          }}>
            {motivationMsg.title}
          </h2>

          <p style={{
            fontSize: '1.1rem',
            color: '#bbb',
            lineHeight: 1.6,
            margin: 0,
          }}>
            {motivationMsg.text}
          </p>
        </div>

        {/* Прогресс */}
        <div style={{
          ...S.card('#1a1a2a'),
          width: '100%',
          maxWidth: 360,
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.9rem', color: '#888' }}>Общий прогресс</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4caf50' }}>{totalDone} / 90</span>
          </div>
          <div style={{ background: '#111', borderRadius: 8, height: 8 }}>
            <div style={{
              background: 'linear-gradient(90deg, #4caf50, #69a8ff)',
              width: `${Math.round((totalDone / 90) * 100)}%`,
              height: 8,
              borderRadius: 8,
              transition: 'width 0.5s ease',
              minWidth: totalDone > 0 ? 8 : 0,
            }} />
          </div>
          <p style={{ margin: '0.6rem 0 0', fontSize: '0.82rem', color: '#555', textAlign: 'center' }}>
            🗓 Возвращайся завтра за следующим заданием
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: 360 }}>
          <button style={S.btn('#2d5a9e')} onClick={() => setScreen('plan')}>
            📅 К плану
          </button>
          <button style={S.btn('#333')} onClick={() => setScreen('home')}>
            На главную
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PLAN
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === 'plan') {
    const completed = userState.completedDays.length;
    const progressPct = Math.round((completed / 90) * 100);
    const taskBlockedToday = hasCompletedTaskToday();

    return (
      <div style={S.page}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem', marginRight: 8 }} onClick={() => setScreen('home')}>←</button>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>90-дневный план</h1>
        </div>

        <div style={{ ...S.card('#1a2a1a'), marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontWeight: 700 }}>Прогресс</span>
            <span style={{ color: '#4caf50', fontWeight: 700 }}>{completed} / 90</span>
          </div>
          <div style={{ background: '#111', borderRadius: 8, height: 8 }}>
            <div style={{ background: '#4caf50', width: `${progressPct}%`, height: 8, borderRadius: 8, transition: 'width 0.4s' }} />
          </div>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#888' }}>
            Текущий день: {userState.currentDay}
          </p>
        </div>

        {/* Баннер "уже выполнено сегодня" */}
        {taskBlockedToday && (
          <div style={{
            ...S.card('#2a1e10'),
            border: '1px solid #ff990044',
            marginBottom: '1rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>🌙</div>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#ffb347', fontWeight: 600 }}>
              Задание на сегодня выполнено!
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#888' }}>
              Возвращайся завтра за следующим заданием
            </p>
          </div>
        )}

        {/* Task list */}
        {Array.from({ length: 90 }, (_, i) => i + 1).map(day => {
          const isDone = userState.completedDays.includes(day);
          const isCurrent = day === userState.currentDay;
          const isLocked = day > userState.currentDay;
          // Новое задание заблокировано если уже выполнили сегодня
          const isNewBlocked = taskBlockedToday && !isDone;
          const taskText = dailyTasks[day - 1];

          return (
            <div
              key={day}
              style={{
                ...S.card(isDone ? '#1a2e1a' : isCurrent ? '#1a2040' : '#1a1a1a'),
                border: isCurrent ? '1px solid #69a8ff44' : '1px solid transparent',
                opacity: isLocked ? 0.45 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  {isCurrent && <div style={S.tag('#69a8ff')}>Сегодня</div>}
                  {isDone && <div style={S.tag('#4caf50')}>✓ Выполнено</div>}
                  <p style={{ margin: '4px 0 0', fontSize: '0.95rem', lineHeight: 1.4 }}>
                    <span style={{ color: '#69a8ff', fontWeight: 700, marginRight: 6 }}>День {day}.</span>
                    {taskText}
                  </p>
                </div>
                {!isLocked && (
                  <button
                    style={{
                      background: isDone ? '#2e5c2e' : isNewBlocked ? '#222' : '#2d5a9e',
                      color: isNewBlocked && !isDone ? '#555' : '#fff',
                      border: 'none',
                      padding: '0.5rem 0.9rem',
                      borderRadius: '10px',
                      cursor: isNewBlocked && !isDone ? 'not-allowed' : 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                    disabled={isNewBlocked && !isDone}
                    onClick={() => {
                      if (isNewBlocked && !isDone) return;
                      openTaskJournal(day);
                    }}
                    title={isNewBlocked && !isDone ? 'Возвращайся завтра' : undefined}
                  >
                    {isDone ? '📝 Дописать' : isNewBlocked ? '🔒 Завтра' : '✍️ Выполнить'}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <button style={{ ...S.btn('#333'), marginTop: '1rem' }} onClick={() => setScreen('home')}>
          На главную
        </button>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TASK JOURNAL
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === 'task-journal' && activeTaskDay !== null) {
    const taskText = dailyTasks[activeTaskDay - 1];
    const isDone = userState.completedDays.includes(activeTaskDay);
    const dayEntries = userState.journalEntries.filter(e => e.dayTask === activeTaskDay);
    const canComplete = taskDraft.trim().length > 0;

    return (
      <div style={S.page}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem', marginRight: 8 }} onClick={() => setScreen('plan')}>←</button>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>День {activeTaskDay}</h2>
        </div>

        <div style={{ ...S.card('#1a2040'), marginBottom: '1.2rem', borderLeft: '3px solid #69a8ff' }}>
          <div style={S.tag('#69a8ff')}>Задание дня</div>
          <p style={{ margin: '6px 0 0', fontSize: '1.05rem', lineHeight: 1.5 }}>{taskText}</p>
        </div>

        {dayEntries.length > 0 && (
          <div style={{ marginBottom: '1.2rem' }}>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: '0 0 8px' }}>Твои записи по этому заданию:</p>
            {dayEntries.map(e => (
              <div key={e.id} style={{ ...S.card('#1e1e1e'), fontSize: '0.95rem', lineHeight: 1.5 }}>
                <div style={{ color: '#555', fontSize: '0.75rem', marginBottom: 4 }}>{e.date}</div>
                {e.text}
              </div>
            ))}
          </div>
        )}

        <p style={{ color: '#aaa', fontSize: '0.95rem', margin: '0 0 8px' }}>
          {isDone ? 'Добавить ещё одну запись:' : 'Опиши, как это было. Что почувствовал? Что произошло?'}
        </p>
        <textarea
          value={taskDraft}
          onChange={e => setTaskDraft(e.target.value)}
          placeholder="Пиши честно — это только для тебя..."
          style={{
            width: '100%',
            minHeight: '140px',
            padding: '1rem',
            background: '#1a1a1a',
            color: '#fff',
            border: `1px solid ${canComplete ? '#69a8ff55' : '#333'}`,
            borderRadius: '14px',
            marginBottom: '1rem',
            fontSize: '1rem',
            lineHeight: 1.5,
            resize: 'vertical',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
        />

        <button
          style={{
            ...S.btn(canComplete ? '#4caf50' : '#333'),
            opacity: canComplete ? 1 : 0.5,
            cursor: canComplete ? 'pointer' : 'not-allowed',
          }}
          disabled={!canComplete}
          onClick={saveTaskEntry}
        >
          {isDone ? '💾 Сохранить запись' : '✅ Сохранить и отметить выполненным'}
        </button>

        {isDone && (
          <button style={S.btn('#333')} onClick={() => setScreen('plan')}>
            Назад к плану
          </button>
        )}

        <p style={{ fontSize: '0.8rem', color: '#555', textAlign: 'center', marginTop: 8 }}>
          {!isDone && 'Задание отметится выполненным после сохранения записи'}
        </p>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // JOURNAL
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === 'journal') {
    const freeEntries = userState.journalEntries.filter(e => !e.dayTask);
    const taskEntries = userState.journalEntries.filter(e => e.dayTask);

    return (
      <div style={S.page}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem', marginRight: 8 }} onClick={() => setScreen('home')}>←</button>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Журнал записей</h1>
        </div>

        <textarea
          value={journalDraft}
          onChange={e => setJournalDraft(e.target.value)}
          placeholder="Что ты чувствуешь сегодня? Что хочешь изменить?"
          style={{
            width: '100%',
            minHeight: '110px',
            padding: '1rem',
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '14px',
            marginBottom: '0.8rem',
            fontSize: '1rem',
            lineHeight: 1.5,
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
        <button
          style={{ ...S.btn(journalDraft.trim() ? '#69a8ff' : '#333'), opacity: journalDraft.trim() ? 1 : 0.5 }}
          disabled={!journalDraft.trim()}
          onClick={saveFreeEntry}
        >
          💾 Сохранить запись
        </button>

        {freeEntries.length > 0 && (
          <>
            <h2 style={{ fontSize: '1.1rem', color: '#888', margin: '1.5rem 0 0.5rem' }}>Свободные записи</h2>
            {[...freeEntries].reverse().map(e => (
              <div key={e.id} style={{ ...S.card('#1e1e1e'), position: 'relative' }}>
                <div style={{ color: '#555', fontSize: '0.75rem', marginBottom: 4 }}>{e.date}</div>
                <p style={{ margin: 0, lineHeight: 1.5 }}>{e.text}</p>
                <button
                  style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '1rem' }}
                  onClick={() => deleteEntry(e.id)}
                >✕</button>
              </div>
            ))}
          </>
        )}

        {taskEntries.length > 0 && (
          <>
            <h2 style={{ fontSize: '1.1rem', color: '#888', margin: '1.5rem 0 0.5rem' }}>Записи по заданиям</h2>
            {[...taskEntries].reverse().map(e => (
              <div key={e.id} style={{ ...S.card('#1a2040'), position: 'relative' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 4, alignItems: 'center' }}>
                  <span style={S.tag('#69a8ff')}>День {e.dayTask}</span>
                  <span style={{ color: '#555', fontSize: '0.75rem' }}>{e.date}</span>
                </div>
                <p style={{ margin: 0, lineHeight: 1.5 }}>{e.text}</p>
                <button
                  style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '1rem' }}
                  onClick={() => deleteEntry(e.id)}
                >✕</button>
              </div>
            ))}
          </>
        )}

        {userState.journalEntries.length === 0 && (
          <p style={{ color: '#444', textAlign: 'center', marginTop: '2rem' }}>Пока пусто — начни писать!</p>
        )}

        <button style={{ ...S.btn('#222'), marginTop: '1rem' }} onClick={() => setScreen('home')}>
          На главную
        </button>
      </div>
    );
  }

  return null;
}