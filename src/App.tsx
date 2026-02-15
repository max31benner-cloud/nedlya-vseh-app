function App() {
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
      {/* Твоя обложка */}
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          marginBottom: '2.5rem',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 15px 40px rgba(0,0,0,0.7)',
          border: '1px solid rgba(255,105,180,0.2)',
        }}
      >
        <img
          src="https://i.ibb.co/0RR9w3Gq/image.jpg"
          alt="НеДляВсех — перестань нести всех на себе"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      <h1
        style={{
          fontSize: '3.8rem',
          fontWeight: '900',
          margin: '0 0 1rem',
          color: '#69a8ff',
          textShadow: '0 4px 15px rgba(85, 120, 247, 0.4)',
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
        Привет!
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
        Брать на себя чужие ожидания, проблемы и желания норма?  
        Постоянно отдавать, чтобы понравиться, а в итоге пустота?  
        Пора перестать быть для всех и наконец стать для себя.
      </p>

      <button
        style={{
          background: 'linear-gradient(135deg, #69a8ff, #69a8ff)',
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
        onClick={() => alert('Тест начнётся в следующей версии! 🚀')}
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