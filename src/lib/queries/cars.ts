import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/auth/session-context';
import type { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type Car = Database['public']['Tables']['cars']['Row'];

/** What the car form produces — everything else the database fills in. */
export type CarInput = Omit<
  Database['public']['Tables']['cars']['Insert'],
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;

export function useCars() {
  return useQuery({
    queryKey: ['cars'],
    queryFn: async (): Promise<Car[]> => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useCar(id: string) {
  return useQuery({
    queryKey: ['cars', id],
    queryFn: async (): Promise<Car> => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateCar() {
  const queryClient = useQueryClient();
  const session = useSession();

  return useMutation({
    mutationFn: async (input: CarInput): Promise<Car> => {
      const { data, error } = await supabase
        .from('cars')
        .insert({ ...input, user_id: session.user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cars'] }),
  });
}

export function useUpdateCar(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CarInput): Promise<Car> => {
      const { data, error } = await supabase
        .from('cars')
        .update(input)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cars'] }),
  });
}

export function useDeleteCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cars').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cars'] }),
  });
}
