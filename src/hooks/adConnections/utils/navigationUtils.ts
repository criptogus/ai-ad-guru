
import { NavigateFunction } from 'react-router-dom';

// Store navigate function for later use
let navigateFunction: NavigateFunction | null = null;

export function setNavigate(navigate: NavigateFunction) {
  navigateFunction = navigate;
}

export function navigate(path: string, options?: { replace?: boolean }) {
  if (navigateFunction) {
    navigateFunction(path, options);
  } else {
    console.error('Navigate function not set');
    // Fallback
    window.location.href = path;
  }
}
