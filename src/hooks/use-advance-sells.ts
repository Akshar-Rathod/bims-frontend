import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export type AdvanceSell = {
  _id: string
  name: string
  location: string
  date: string
  time: string
  items: Array<{
    barcode: string
    batteryType: string
    batteryModel: string
  }>
  billNo?: string
  createdAt: string
}

export const useAdvanceSells = () => {
  const queryClient = useQueryClient()

  const advanceSellsQuery = useQuery({
    queryKey: ['advance-sells'],
    queryFn: async () => {
      const { data } = await apiClient.get<AdvanceSell[]>('/advance-sells')
      return data
    },
  })

  const addAdvanceSellMutation = useMutation({
    mutationFn: async (newSell: Omit<AdvanceSell, '_id' | 'createdAt'>) => {
      const { data } = await apiClient.post('/advance-sells', newSell)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advance-sells'] })
    },
  })

  const addBulkAdvanceSellsMutation = useMutation({
    mutationFn: async (sells: any[]) => {
      const { data } = await apiClient.post('/advance-sells/bulk', sells)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advance-sells'] })
    },
  })

  const updateBillNoMutation = useMutation({
    mutationFn: async ({ id, billNo }: { id: string; billNo: string }) => {
      const { data } = await apiClient.patch(`/advance-sells/${id}/bill-no`, { billNo })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advance-sells'] })
    },
  })

  return {
    advanceSells: advanceSellsQuery.data ?? [],
    isLoading: advanceSellsQuery.isLoading,
    addAdvanceSell: addAdvanceSellMutation.mutateAsync,
    addBulkAdvanceSells: addBulkAdvanceSellsMutation.mutateAsync,
    updateBillNo: updateBillNoMutation.mutateAsync,
  }
}
