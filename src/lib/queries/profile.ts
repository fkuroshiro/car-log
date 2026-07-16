import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/auth/session-context';
import type { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export function useProfile() {
  const session = useSession();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<Profile> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateProfile() {
  const session = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (displayName: string): Promise<Profile> => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ display_name: displayName.trim() || null })
        .eq('id', session.user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}
