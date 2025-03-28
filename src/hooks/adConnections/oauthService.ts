
// This file now serves as a simplified facade to the refactored OAuth modules
import { 
  initiateOAuth, 
  handleOAuthCallback, 
  oauthHelpers 
} from './oauth';

export { 
  initiateOAuth, 
  handleOAuthCallback,
  isOAuthCallback: oauthHelpers.isOAuthCallback,
  clearOAuthState: oauthHelpers.clearOAuthState
};
