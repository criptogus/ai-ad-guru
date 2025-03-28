
// This file now serves as a simplified facade to the refactored OAuth modules
import { 
  initiateOAuth, 
  handleOAuthCallback, 
  isOAuthCallback,
  clearOAuthState
} from './oauth';

export { 
  initiateOAuth, 
  handleOAuthCallback,
  isOAuthCallback,
  clearOAuthState
};
