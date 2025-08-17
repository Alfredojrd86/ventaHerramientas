import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: 'blue', fontSize: '32px' }}>
        🛠️ Venta de Herramientas
      </h1>
      <p style={{ color: 'gray', marginTop: '16px' }}>
        La aplicación está funcionando correctamente
      </p>
      <div style={{ marginTop: '32px' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Estado del Sistema</h2>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>React:</span>
              <span style={{ color: 'green' }}>✅ Funcionando</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Vite:</span>
              <span style={{ color: 'green' }}>✅ Funcionando</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;