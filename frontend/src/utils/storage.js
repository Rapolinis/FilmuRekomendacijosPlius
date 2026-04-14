const PREFIX = 'filmuvercle_';

export function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(PREFIX + key);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn(`Failed to load ${key} from storage:`, e);
  }
  return fallback;
}

export function saveToStorage(key, data) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to save ${key} to storage:`, e);
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (e) {
    console.warn(`Failed to remove ${key} from storage:`, e);
  }
}
