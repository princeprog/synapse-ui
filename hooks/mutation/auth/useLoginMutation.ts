import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../../services/auth.service';
import { PROFILE_QUERY_KEY } from '../../queries/auth/useProfileQuery';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      void queryClient.prefetchQuery({
        queryKey: PROFILE_QUERY_KEY,
        queryFn: () => authService.getProfile(),
      });
    },
  });
};
