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
        }}
      >
        <img
          src="https://i.ibb.co/0RR9w3Gq/image.jpg"
          alt="НеДляВсех"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      <h1 style={{ fontSize: '3.8rem', fontWeight: '900', color: '#69a8ff' }}>
        НеДляВсех
      </h1>

      <p style={{ fontSize: '1.8rem', margin: '1rem 0' }}>
        Привет!
      </p>

      <p style={{ fontSize: '1.25rem', maxWidth: '90%' }}>
        Ты устал отдавать все силы другим и оставаться пустым?  
        Пора перестать быть для всех и начать быть для себя.
      </p>

      <button
        style={{
          marginTop: '2rem',
          background: 'linear-gradient(135deg, #69a8ff, #459cfe)',
          color: '#fff',
          border: 'none',
          padding: '1.2rem 3rem',
          fontSize: '1.4rem',
          borderRadius: '999px',
          cursor: 'pointer',
        }}
        onClick={() => alert('Тест работает!')}
      >
        Начать тест
      </button>
    </div>
  );
}

export default App;