import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { PROFILE_QUERY_KEY } from '@/hooks/queries/auth/useProfileQuery';
import { UpdateProfileRequest } from '@/lib/types/auth.types';

type UpdateProfileInput = {
  userId: string;
  payload: UpdateProfileRequest;
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: UpdateProfileInput) =>
      authService.updateProfile(userId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
};
