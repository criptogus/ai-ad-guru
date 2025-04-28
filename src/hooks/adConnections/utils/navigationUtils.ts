
import { NavigateFunction } from "react-router-dom";

let navigateFunc: NavigateFunction | null = null;

export const setNavigate = (navigate: NavigateFunction) => {
  navigateFunc = navigate;
};

/**
 * Navigation utility function that can be used anywhere in the app
 * It will use React Router's navigate function if available,
 * or fallback to window.location for critical navigations
 */
export const navigate = (to: string, options?: { replace?: boolean; state?: any }) => {
  if (navigateFunc) {
    navigateFunc(to, options);
  } else {
    console.warn("Navigation attempted before router was initialized");
    // Fall back to window location for critical navigations
    if (options?.replace) {
      window.location.replace(to);
    } else {
      window.location.href = to;
    }
  }
};
