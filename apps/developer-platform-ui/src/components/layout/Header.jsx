'use client';

import { useAppContext } from '@/context/AppContext';
import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

export default function Header() {
  const { user, activeWorkspace } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Optional: Poll every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    // Click outside to close dropdown
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const fetchNotifications = async () => {
    try {
      const response = await apiFetch('/api/v1/notifications');
      if (response.success) {
        setNotifications(response.data);
        setUnreadCount(response.data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiFetch(`/api/v1/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiFetch('/api/v1/notifications/read-all', { method: 'PUT' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'INVITE': return '#3B82F6'; // Blue
      case 'SECURITY': return '#EF4444'; // Red
      case 'INFO': return '#10B981'; // Green
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <header style={{
      height: '72px',
      background: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
        <span>{activeWorkspace?.name || 'Workspace'}</span>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Projects</span>
      </div>

      {/* Profile & Notifications */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        
        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              cursor: 'pointer', 
              fontSize: '20px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
          >
            &#x1F514;
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: 'var(--error)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-primary)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="glass-card" style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              width: '350px',
              maxHeight: '400px',
              overflowY: 'auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    You're all caught up!
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => !notif.read && markAsRead(notif.id)}
                      style={{ 
                        padding: '16px', 
                        borderBottom: '1px solid var(--border-color)', 
                        background: notif.read ? 'transparent' : 'rgba(255,255,255,0.03)',
                        cursor: notif.read ? 'default' : 'pointer',
                        transition: 'background 0.2s',
                        display: 'flex',
                        gap: '12px'
                      }}
                      onMouseOver={(e) => { if(!notif.read) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                      onMouseOut={(e) => { if(!notif.read) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getTypeColor(notif.type), marginTop: '6px', flexShrink: 0, opacity: notif.read ? 0.3 : 1 }} />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: notif.read ? '500' : '600', marginBottom: '4px', color: notif.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                          {notif.title}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '8px' }}>
                          {notif.message}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.7 }}>
                          {new Date(notif.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #4F46E5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            textTransform: 'uppercase'
          }}>
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            {user ? `${user.firstName} ${user.lastName?.charAt(0) || ''}.` : 'Loading...'}
          </span>
        </div>
      </div>
    </header>
  );
}
