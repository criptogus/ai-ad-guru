
import { CustomUser } from '@/types/auth';
import { 
  useLoginActions,
  useLogoutAction,
  useRegisterAction,
  useTestAccountAction,
  usePaymentAction
} from './auth';

export const useAuthActions = (
  user?: CustomUser | null, 
  setUser?: (user: CustomUser | null) => void
) => {
  // If no arguments are provided, just return what's needed for read-only operations
  if (user === undefined && setUser === undefined) {
    return {
      user: null,
      isLoading: false,
      login: async () => null,
      loginWithGoogle: async () => null,
      logout: async () => {},
      register: async () => null,
      createTestAccount: async () => null,
      updateUserPaymentStatus: async () => null,
      simulateSuccessfulPayment: async () => null
    };
  }

  const { login, loginWithGoogle, isLoading: loginLoading } = useLoginActions(setUser!);
  const { logout, isLoading: logoutLoading } = useLogoutAction(setUser!);
  const { register, isLoading: registerLoading } = useRegisterAction(setUser!);
  const { createTestAccount, isLoading: testAccountLoading } = useTestAccountAction(setUser!);
  const { updateUserPaymentStatus, simulateSuccessfulPayment, isLoading: paymentLoading } = usePaymentAction(user, setUser!);

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
    isLoading,
    user
  };
};
