import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/auth/session-context';
import type { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type ServiceRecord =
  Database['public']['Tables']['service_records']['Row'];

/** What the record form produces — ownership and ids come from context. */
export type ServiceRecordInput = Omit<
  Database['public']['Tables']['service_records']['Insert'],
  'id' | 'user_id' | 'car_id' | 'created_at'
>;

export function useServiceRecords(carId: string) {
  return useQuery({
    queryKey: ['service-records', carId],
    queryFn: async (): Promise<ServiceRecord[]> => {
      const { data, error } = await supabase
        .from('service_records')
        .select('*')
        .eq('car_id', carId)
        .order('serviced_on', { ascending: false })
        .order('odometer_km', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useServiceRecord(id: string) {
  return useQuery({
    queryKey: ['service-record', id],
    queryFn: async (): Promise<ServiceRecord> => {
      const { data, error } = await supabase
        .from('service_records')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

/** The odometer-sync trigger may change the car row too, so every mutation
 *  invalidates both the record list and the cars cache. */
function useInvalidateServiceData(carId: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['service-records', carId] });
    queryClient.invalidateQueries({ queryKey: ['service-record'] });
    queryClient.invalidateQueries({ queryKey: ['cars'] });
  };
}

export function useCreateServiceRecord(carId: string) {
  const session = useSession();
  const invalidate = useInvalidateServiceData(carId);

  return useMutation({
    mutationFn: async (input: ServiceRecordInput): Promise<ServiceRecord> => {
      const { data, error } = await supabase
        .from('service_records')
        .insert({ ...input, car_id: carId, user_id: session.user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: invalidate,
  });
}

export function useUpdateServiceRecord(carId: string, id: string) {
  const invalidate = useInvalidateServiceData(carId);

  return useMutation({
    mutationFn: async (input: ServiceRecordInput): Promise<ServiceRecord> => {
      const { data, error } = await supabase
        .from('service_records')
        .update(input)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: invalidate,
  });
}

export function useDeleteServiceRecord(carId: string) {
  const invalidate = useInvalidateServiceData(carId);

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_records')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}
