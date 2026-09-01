'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ProjectAnalyticsPage({ params }) {
  const { projectId } = params;
  
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [projectId]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`/api/v1/projects/${projectId}/analytics`);
      if (response.success) {
        setAnalytics(response.data);
      } else {
        setError(response.message || 'Failed to fetch analytics data');
      }
    } catch (err) {
      setError('Network error loading analytics');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Project Analytics</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          View API usage and URL clicks over the last 7 days.
        </p>
      </div>

      {error && (
        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '8px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading analytics...
        </div>
      ) : analytics ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600' }}>
                API Requests (Last 7 Days)
              </div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--primary)' }}>
                {analytics.totalRequestsUsed.toLocaleString()}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '8px' }}>
                Out of {analytics.totalQuota.toLocaleString()} quota
              </div>
            </div>
            
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600' }}>
                URL Clicks (Last 7 Days)
              </div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10B981' }}>
                {analytics.totalUrlClicks.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Usage Over Time</h3>
            <div style={{ height: '400px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analytics.usageHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--text-secondary)" 
                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
                    tickMargin={10}
                  />
                  <YAxis 
                    stroke="var(--text-secondary)" 
                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181B', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="requests" 
                    name="API Requests" 
                    stroke="var(--primary)" 
                    strokeWidth={3}
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="urlClicks" 
                    name="URL Clicks" 
                    stroke="#10B981" 
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
