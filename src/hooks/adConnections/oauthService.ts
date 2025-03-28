
// This file now serves as a simplified facade to the refactored OAuth modules
import { 
  initiateOAuth, 
  handleOAuthCallback, 
  oauthHelpers 
} from './oauth';

export { 
  initiateOAuth, 
  handleOAuthCallback 
};

export const isOAuthCallback = oauthHelpers.isOAuthCallback;
export const clearOAuthState = oauthHelpers.clearOAuthState;
