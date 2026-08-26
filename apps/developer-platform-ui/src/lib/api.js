export async function apiFetch(endpoint, options = {}) {
  // Check if we have a token in localStorage
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('devplatform_token');
  }

  // Set up default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    // Because of our Next.js rewrites, we can just call /api/v1/... directly.
    const response = await fetch(endpoint, config);
    const data = await response.json();

    if (response.status === 401 || response.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('devplatform_token');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
          window.location.href = '/login';
        }
      }
      throw new Error(data.message || 'Unauthorized. Please check your credentials.');
    }

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred while fetching data');
    }

    return data;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}
