import { useMutation } from '@tanstack/react-query';
import { authService } from '../../../services/auth.service';

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authService.register,
  });
};
