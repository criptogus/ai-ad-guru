
import { NavigateFunction } from "react-router-dom";

let navigateFunc: NavigateFunction | null = null;

export const setNavigate = (navigate: NavigateFunction) => {
  navigateFunc = navigate;
};

export const navigate = (to: string, options?: { replace?: boolean; state?: any }) => {
  if (navigateFunc) {
    navigateFunc(to, options);
  } else {
    console.error("Navigation attempted before router was initialized");
    // Fall back to window location for critical navigations
    if (options?.replace) {
      window.location.replace(to);
    } else {
      window.location.href = to;
    }
  }
};
