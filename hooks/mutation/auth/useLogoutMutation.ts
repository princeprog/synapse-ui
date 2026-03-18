import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../../services/auth.service';

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all queries on logout to remove cached user data
      queryClient.clear();
    },
  });
};
