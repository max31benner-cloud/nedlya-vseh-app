import { useEffect } from 'react';
import { init, useInitData } from '@telegram-apps/sdk-react';

function App() {
  const initData = useInitData();

  useEffect(() => {
    init(); // Инициализация Telegram Mini App
  }, []);

  const user = initData?.user;
  const userName = user?.firstName || 'Друг';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {/* Универсальная иллюстрация перегрузки — можно заменить на свою обложку */}
      <div
        style={{
          width: '100%',
          maxWidth: '340px',
          marginBottom: '2.5rem',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 15px 40px rgba(0,0,0,0.7)',
          border: '1px solid rgba(255, 105, 180, 0.15)',
        }}
      >
        <img
          src="https://i.ibb.co/0RR9w3Gq/image.jpg" // ← мой код страницы
          alt="Перегрузка от чужих ожиданий"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      <h1
        style={{
          fontSize: '3.8rem',
          fontWeight: '900',
          margin: '0 0 1rem',
          color: '#ff69b4', // мягкий розово-красный, более нейтральный акцент
          textShadow: '0 4px 15px rgba(255,105,180,0.4)',
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
        Привет, {userName}!
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
        Может хватит брать на себя чужие ожидания, проблемы и желания?  
        Постоянно отдавать, чтобы понравиться, а в итоге внутренняя пустота?  
        Пора перестать быть для всех и наконец стать для себя.
      </p>

      <button
        style={{
          background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
          color: '#fff',
          border: 'none',
          padding: '1.4rem 3.2rem',
          fontSize: '1.6rem',
          fontWeight: 'bold',
          borderRadius: '999px',
          cursor: 'pointer',
          boxShadow: '0 12px 35px rgba(255,105,180,0.35)',
          transition: 'all 0.25s ease',
        }}
        onClick={() => alert('Тест на "синдром угождения" начнётся в следующей версии! 🚀')}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.06)';
          e.currentTarget.style.boxShadow = '0 18px 45px rgba(255,105,180,0.45)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(255,105,180,0.35)';
        }}
      >
        Начать тест
      </button>

      <p style={{ marginTop: 'auto', fontSize: '0.95rem', opacity: 0.55, paddingTop: '3rem' }}>
        Инструмент для тех, кто хочет вернуть себе свою жизнь
      </p>
    </div>
  );
}

export default App;