import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { PROFILE_QUERY_KEY } from '@/hooks/queries/auth/useProfileQuery';
import type { UpdateProfileInput } from '@/lib/types/auth.types';

type UpdateProfileMutationInput = {
  userId: string;
  payload: UpdateProfileInput;
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: UpdateProfileMutationInput) =>
      authService.updateProfile(userId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
};
