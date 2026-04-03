import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';

export const PROFILE_QUERY_KEY = ['auth', 'profile'];

export const useProfileQuery = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => authService.getProfile(),
  });
};
