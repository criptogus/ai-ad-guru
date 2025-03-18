
import { CustomUser } from '@/types/auth';
import { 
  useLoginActions,
  useLogoutAction,
  useRegisterAction,
  useTestAccountAction,
  usePaymentAction
} from './auth';

export const useAuthActions = (
  user: CustomUser | null, 
  setUser: (user: CustomUser | null) => void
) => {
  const { login, loginWithGoogle, isLoading: loginLoading } = useLoginActions();
  const { logout, isLoading: logoutLoading } = useLogoutAction();
  const { register, isLoading: registerLoading } = useRegisterAction();
  const { createTestAccount, isLoading: testAccountLoading } = useTestAccountAction();
  const { updateUserPaymentStatus, simulateSuccessfulPayment, isLoading: paymentLoading } = usePaymentAction(user, setUser);

  // Combine all loading states
  const isLoading = loginLoading || logoutLoading || registerLoading || testAccountLoading || paymentLoading;

  return {
    login,
    loginWithGoogle,
    logout,
    register,
    createTestAccount,
    updateUserPaymentStatus,
    simulateSuccessfulPayment,
    isLoading
  };
};
