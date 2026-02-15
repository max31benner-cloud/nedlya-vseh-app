function App() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
        НеДляВсех
      </h1>
      <p style={{ fontSize: '1.8rem', maxWidth: '600px' }}>
        Приложение запущено!  
        Если ты видишь это сообщение — значит всё работает.
      </p>
      <p style={{ marginTop: '2rem', opacity: 0.7 }}>
        Перезагрузи страницу в боте после обновления Vercel
      </p>
    </div>
  );
}

export default App;