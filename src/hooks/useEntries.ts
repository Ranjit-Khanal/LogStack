import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { entriesApi } from '../api';

interface EntriesParams {
  page?: number;
  limit?: number;
  tags?: string;
  search?: string;
}

export const useEntries = (params: EntriesParams = {}) =>
  useQuery({
    queryKey: ['entries', params],
    queryFn: () => entriesApi.getAll(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 3,
  });

export const useEntry = (id: string) =>
  useQuery({
    queryKey: ['entry', id],
    queryFn: () => entriesApi.getById(id),
    enabled: !!id,
  });

export const useTags = () =>
  useQuery({
    queryKey: ['tags'],
    queryFn: entriesApi.getTags,
    staleTime: 1000 * 60 * 10,
  });

export const useCreateEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: entriesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entries'] });
      qc.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useUpdateEntry = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => entriesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entries'] });
      qc.invalidateQueries({ queryKey: ['entry', id] });
    },
  });
};

export const useDeleteEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: entriesApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entries'] });
    },
  });
};
