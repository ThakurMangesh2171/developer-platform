'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap } from 'lucide-react';

export default function ProjectOverviewPage({ params }) {
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
      if (response) {
        setAnalytics(response);
      } else {
        setError('Failed to load analytics data.');
      }
    } catch (err) {
      setError('Network error while loading analytics.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading analytics dashboard...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '8px' }}>
        {error}
      </div>
    );
  }

  // Format data for Recharts (reverse to show chronological order)
  const chartData = analytics?.usageHistory ? [...analytics.usageHistory].reverse() : [];
  
  // Calculate percentage for progress bar
  const quotaPercentage = analytics ? Math.min(100, Math.round((analytics.totalRequestsUsed / analytics.totalQuota) * 100)) : 0;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Total Requests Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '8px', color: 'var(--success)' }}>
              <Activity size={24} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-secondary)' }}>Requests This Month</h3>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            {analytics?.totalRequestsUsed.toLocaleString()}
          </div>
        </div>

        {/* Quota Usage Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '8px', color: '#3b82f6' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-secondary)' }}>Quota Usage</h3>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              {quotaPercentage}%
            </div>
          </div>
          <div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${quotaPercentage}%`, 
                height: '100%', 
                background: quotaPercentage > 90 ? 'var(--error)' : 'linear-gradient(90deg, #3b82f6, #10b981)',
                borderRadius: '4px',
                transition: 'width 1s ease-in-out'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span>{analytics?.totalRequestsUsed.toLocaleString()} used</span>
              <span>{analytics?.totalQuota.toLocaleString()} limit</span>
            </div>
          </div>
        </div>

      </div>

      {/* Chart Section */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>API Usage (Last 7 Days)</h3>
        <div style={{ height: '350px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="var(--text-secondary)" 
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                tickFormatter={(val) => {
                  const d = new Date(val);
                  return `${d.getMonth()+1}/${d.getDate()}`;
                }}
              />
              <YAxis 
                stroke="var(--text-secondary)" 
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ background: '#09090B', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: 'var(--accent-primary)' }}
                labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="requests" 
                stroke="var(--accent-primary)" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#09090B', stroke: 'var(--accent-primary)', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'var(--accent-primary)', stroke: '#fff' }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
}
