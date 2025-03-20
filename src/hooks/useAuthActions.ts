
import { useLoginActions } from './auth/useLoginActions';
import { useLogoutAction } from './auth/useLogoutAction';
import { useRegisterAction } from './auth/useRegisterAction';
import { useTestAccountAction } from './auth/useTestAccountAction';

export const useAuthActions = () => {
  const loginActions = useLoginActions();
  const logoutAction = useLogoutAction();
  const registerAction = useRegisterAction();
  const testAccountAction = useTestAccountAction();

  return {
    ...loginActions,
    ...logoutAction,
    ...registerAction,
    ...testAccountAction
  };
};

export default useAuthActions;
