import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleClearData = () => {
    // Clear all filmuvercle data from localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('filmuvercle_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          maxWidth: '600px',
          margin: '4rem auto',
          padding: '2rem',
          background: '#fff5f5',
          borderRadius: '12px',
          border: '1px solid #fc8181',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#c53030', marginBottom: '1rem' }}>Kažkas nutiko ne taip</h2>
          <p style={{ color: '#742a2a', marginBottom: '1rem' }}>
            Įvyko netikėta klaida. Pabandykite perkrauti puslapį arba atstatyti duomenis.
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '0.6rem 1.5rem',
                background: '#3182ce',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Grįžti į pradžią
            </button>
            <button
              onClick={this.handleClearData}
              style={{
                padding: '0.6rem 1.5rem',
                background: '#e53e3e',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Atstatyti duomenis
            </button>
          </div>
          <p style={{ color: '#a0aec0', fontSize: '0.8rem', marginTop: '1rem' }}>
            "Atstatyti duomenis" išvalys visus išsaugotus duomenis ir grąžins pradinius.
          </p>
          {this.state.error && (
            <details style={{ marginTop: '1rem', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: '#a0aec0' }}>Techninė informacija</summary>
              <pre style={{ fontSize: '0.8rem', color: '#718096', whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
