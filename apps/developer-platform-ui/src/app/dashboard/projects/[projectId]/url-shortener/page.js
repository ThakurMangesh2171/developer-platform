'use client';

import { useState } from 'react';
import { API_ENDPOINTS } from '@/lib/constants';
import DatePicker from 'react-datepicker';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function UrlShortenerPage({ params }) {
  const { projectId } = params;
  
  const [apiKey, setApiKey] = useState('');
  const [longUrl, setLongUrl] = useState('');
  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  // Prepare analytics data
  const chartData = [...urls]
    .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
    .slice(0, 5)
    .map(url => ({
      name: url.title || url.shortCode,
      clicks: url.clickCount || 0
    }));

  // We can only fetch URLs if they provide an API key
  const handleFetchUrls = async (e) => {
    e?.preventDefault();
    if (!apiKey) {
      setError('Please enter your API Key to view URLs');
      return;
    }
    
    setIsFetching(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_ENDPOINTS.URL_SHORTENER.BASE}?projectId=${projectId}`, {
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUrls(data);
      } else {
        setError(data.message || 'Invalid API Key or failed to fetch URLs');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsFetching(false);
    }
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!apiKey) {
      setError('Please enter your API Key to shorten URLs');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_ENDPOINTS.URL_SHORTENER.BASE}?projectId=${projectId}`, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          originalUrl: longUrl, 
          title: title || undefined,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setLongUrl('');
        setTitle('');
        setExpiresAt('');
        handleFetchUrls(); // Refresh the list
      } else {
        setError(data.message || 'Failed to shorten URL');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>URL Shortener API</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px' }}>
          Test your microservice directly from the dashboard. You must provide a valid API Key from the <strong>API Keys</strong> tab to authenticate these requests.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--accent-primary)', fontWeight: '600' }}>Authenticate with API Key</label>
            <input 
              type="password" 
              className="premium-input" 
              placeholder="Paste your active API Key here..."
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setError(null); }}
              style={{ borderColor: error ? 'var(--error)' : 'rgba(139, 92, 246, 0.3)' }}
            />
          </div>
          <button 
            className="glow-button" 
            onClick={handleFetchUrls}
            disabled={isFetching || !apiKey}
            style={{ width: 'auto', padding: '12px 24px' }}
          >
            {isFetching ? 'Connecting...' : 'Connect & Fetch'}
          </button>
        </div>
        
        {error && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '6px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>&#x26A0;</span> {error}
          </div>
        )}
      </div>

      <form onSubmit={handleShorten} className="glass-card" style={{ padding: '24px', marginBottom: '32px', position: 'relative', zIndex: 50 }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Create Short Link</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Destination URL</label>
            <input 
              type="url" 
              className="premium-input" 
              placeholder="https://example.com/very/long/path"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Title (Optional)</label>
            <input 
              type="text" 
              className="premium-input" 
              placeholder="Summer Campaign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Expires At (Optional)</label>
            <DatePicker
              selected={expiresAt ? new Date(expiresAt) : null}
              onChange={(date) => setExpiresAt(date ? date.toISOString() : '')}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
              className="premium-input"
              placeholderText="Select expiration date"
              isClearable
              wrapperClassName="datepicker-wrapper"
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginTop: '29px' }}>
            <button 
              type="submit" 
              className="glow-button" 
              disabled={isLoading || !apiKey}
              style={{ padding: '12px 24px', width: 'auto', opacity: (!apiKey || isLoading) ? 0.5 : 1 }}
            >
              {isLoading ? 'Shortening...' : 'Shorten'}
            </button>
          </div>
        </div>
      </form>

      {urls.length > 0 && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Top Performing Links</h3>
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                />
                <Bar dataKey="clicks" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Title</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Short Link</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Original URL</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Expires</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>Clicks</th>
            </tr>
          </thead>
          <tbody>
            {urls.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {apiKey ? "No short links found. Create one above!" : "Connect your API key to view short links."}
                </td>
              </tr>
            ) : (
              urls.map(url => (
                <tr key={url.shortCode} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>{url.title || '-'}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                      {url.shortUrl}
                    </a>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {url.originalUrl}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {url.expiresAt ? new Date(url.expiresAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '600' }}>
                    {url.clickCount || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
