import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general'
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  const fetchHealthStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/health/status');
      if (response.ok) {
        const data = await response.json();
        setHealthStatus(data);
      } else {
        setError('Failed to fetch health status');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSubmitStatus(null);
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitStatus('Success! Submission created.');
        setFormData({ title: '', description: '', category: 'general' });
      } else {
        setSubmitStatus('Failed to submit. Please try again.');
      }
    } catch (err) {
      setSubmitStatus('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Acme Biotech - System Status</h1>
      </header>
      
      <main>
        <section className="health-status">
          <h2>System Health</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {healthStatus && (
            <div className="status-grid">
              <p>Status: <span className={healthStatus.status === 'healthy' ? 'healthy' : 'unhealthy'}>
                {healthStatus.status}
              </span></p>
              <p>Uptime: {healthStatus.uptime || 'N/A'}</p>
            </div>
          )}
        </section>

        <section className="submission-form">
          <h2>Test Submission</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
          {submitStatus && <p className="submit-status">{submitStatus}</p>}
        </section>
      </main>
    </div>
  );
};

export default App;