/**
 * Centralized API client for NAVORA AI
 */
import { generatePlanWithAI } from './services/aiPlannerService';

const API_BASE = (() => {
  // If a Render/production backend URL is configured via env var, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Local dev: if running on Vite port (not 5000), proxy to localhost:5000
  if (typeof window !== 'undefined' && window.location.port && window.location.port !== '5000') {
    const hostname = window.location.hostname || 'localhost';
    return `http://${hostname}:5000/api`;
  }
  return '/api';
})();

function getAuthHeader() {
  const token = localStorage.getItem('navora_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';

  // If server returns HTML (e.g. Vercel SPA rewrite when API endpoint doesn't exist)
  if (contentType.includes('text/html')) {
    throw new Error('Backend API not responding with JSON (HTML returned)');
  }

  let data = null;
  try {
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text ? { error: text } : null;
      }
    }
  } catch (err) {
    data = null;
  }

  if (!res.ok) {
    const error =
      (data && (data.error || data.message)) ||
      (res.status === 401
        ? 'Invalid email or password. If you do not have an account, please click "Create Account".'
        : `Request failed with status ${res.status}`);
    throw new Error(error);
  }
  return data || {};
}

export const api = {
  // Auth & Email Verification
  sendOtp: async (email, name = '') => {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });
    return await handleResponse(res);
  },

  verifyAndSignup: async ({ name, email, password, otp }) => {
    const res = await fetch(`${API_BASE}/auth/verify-and-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, otp })
    });
    return await handleResponse(res);
  },

  signup: async ({ name, email, password, otp }) => {
    if (otp) {
      return await api.verifyAndSignup({ name, email, password, otp });
    }
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return await handleResponse(res);
  },

  register: async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return await handleResponse(res);
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await handleResponse(res);
  },

  demoLogin: async () => {
    throw new Error('Demo login has been disabled.');
  },

  getMe: async () => {
    const token = localStorage.getItem('navora_token');
    if (!token || token.startsWith('mock_jwt_')) {
      localStorage.removeItem('navora_token');
      localStorage.removeItem('navora_user');
      return { user: null };
    }
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { ...getAuthHeader() }
      });
      const data = await handleResponse(res);
      if (data && data.user) {
        localStorage.setItem('navora_user', JSON.stringify(data.user));
        return data;
      }
      localStorage.removeItem('navora_token');
      localStorage.removeItem('navora_user');
      return { user: null };
    } catch (err) {
      localStorage.removeItem('navora_token');
      localStorage.removeItem('navora_user');
      return { user: null };
    }
  },

  // Planner — calls server if available, otherwise generates dynamic AI plan directly
  generatePlan: async (preferences) => {
    try {
      const res = await fetch(`${API_BASE}/planner/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(preferences)
      });
      const data = await handleResponse(res);
      if (data && data.items && Array.isArray(data.items)) {
        return data;
      }
      throw new Error('Invalid plan structure from server');
    } catch (err) {
      console.info('Using local AI Planner engine for Tumkur itinerary generation:', err.message);
      return await generatePlanWithAI(preferences);
    }
  },

  // Plans Management with LocalStorage persistence fallback
  savePlan: async (planData) => {
    try {
      const res = await fetch(`${API_BASE}/plans/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(planData)
      });
      return await handleResponse(res);
    } catch (err) {
      console.warn('Backend save plan offline, storing locally');
      const saved = JSON.parse(localStorage.getItem('navora_saved_plans') || '[]');
      const newPlan = {
        ...planData,
        plan_id: planData.plan_id || Date.now(),
        created_at: new Date().toISOString(),
        is_favourite: 0,
        is_completed: 0
      };
      saved.unshift(newPlan);
      localStorage.setItem('navora_saved_plans', JSON.stringify(saved));
      return { message: 'Plan saved successfully', plan_id: newPlan.plan_id };
    }
  },

  getPlans: async () => {
    try {
      const res = await fetch(`${API_BASE}/plans`, {
        headers: { ...getAuthHeader() }
      });
      const data = await handleResponse(res);
      if (data && Array.isArray(data.plans)) return data;
      throw new Error('Invalid plans response');
    } catch (err) {
      const saved = JSON.parse(localStorage.getItem('navora_saved_plans') || '[]');
      return { plans: saved };
    }
  },

  getPlanById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/plans/${id}`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch (err) {
      const saved = JSON.parse(localStorage.getItem('navora_saved_plans') || '[]');
      const found = saved.find(p => String(p.plan_id) === String(id));
      return { plan: found || null };
    }
  },

  deletePlan: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/plans/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch (err) {
      const saved = JSON.parse(localStorage.getItem('navora_saved_plans') || '[]');
      const filtered = saved.filter(p => String(p.plan_id) !== String(id));
      localStorage.setItem('navora_saved_plans', JSON.stringify(filtered));
      return { message: 'Plan deleted' };
    }
  },

  toggleFavourite: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/plans/${id}/favourite`, {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch (err) {
      const saved = JSON.parse(localStorage.getItem('navora_saved_plans') || '[]');
      let newFav = 0;
      const updated = saved.map(p => {
        if (String(p.plan_id) === String(id)) {
          newFav = p.is_favourite ? 0 : 1;
          return { ...p, is_favourite: newFav };
        }
        return p;
      });
      localStorage.setItem('navora_saved_plans', JSON.stringify(updated));
      return { message: 'Updated', is_favourite: newFav };
    }
  },

  toggleComplete: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/plans/${id}/complete`, {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch (err) {
      const saved = JSON.parse(localStorage.getItem('navora_saved_plans') || '[]');
      let newComp = 0;
      const updated = saved.map(p => {
        if (String(p.plan_id) === String(id)) {
          newComp = p.is_completed ? 0 : 1;
          return { ...p, is_completed: newComp };
        }
        return p;
      });
      localStorage.setItem('navora_saved_plans', JSON.stringify(updated));
      return { message: 'Updated', is_completed: newComp };
    }
  },

  // Profile
  getProfile: async () => {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch (err) {
      const user = JSON.parse(localStorage.getItem('navora_user') || 'null');
      const saved = JSON.parse(localStorage.getItem('navora_saved_plans') || '[]');
      return {
        user,
        preferences: { mood: 'Relaxed', location: 'Tumkur, Karnataka' },
        stats: {
          total_plans: saved.length,
          completed_plans: saved.filter(p => p.is_completed).length,
          favourite_plans: saved.filter(p => p.is_favourite).length
        }
      };
    }
  },

  updateProfile: async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(payload)
      });
      return await handleResponse(res);
    } catch (err) {
      const user = JSON.parse(localStorage.getItem('navora_user') || '{}');
      const updatedUser = { ...user, ...payload };
      localStorage.setItem('navora_user', JSON.stringify(updatedUser));
      return { message: 'Profile updated', user: updatedUser };
    }
  }
};
