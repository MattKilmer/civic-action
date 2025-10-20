/**
 * Session storage utilities for persisting user data across page navigation
 */

export type SessionData = {
  address: string;
  officials: any[];
  location: {
    city?: string;
    state?: string;
    district?: string;
  } | null;
};

const SESSION_KEY = 'civic-action-session';

/**
 * Save session data to sessionStorage
 */
export function saveSession(data: SessionData): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save session data:', error);
  }
}

/**
 * Load session data from sessionStorage
 */
export function loadSession(): SessionData | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load session data:', error);
    return null;
  }
}

/**
 * Clear session data from sessionStorage
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session data:', error);
  }
}
