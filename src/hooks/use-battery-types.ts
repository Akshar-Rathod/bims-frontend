import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export type BatteryType = {
  _id: string
  id?: number
  name: string
  createdAt: string
}

export const useBatteryTypes = () => {
  const queryClient = useQueryClient()

  const batteryTypesQuery = useQuery({
    queryKey: ['battery-types'],
    queryFn: async () => {
      const { data } = await apiClient.get<BatteryType[]>('/battery-types')
      return data
    },
  })

  const addBatteryTypeMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data } = await apiClient.post('/battery-types', { name })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['battery-types'] })
    },
  })

  const deleteBatteryTypeMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/battery-types/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['battery-types'] })
    },
  })

  const updateBatteryTypeMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data } = await apiClient.put(`/battery-types/${id}`, { name })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['battery-types'] })
    },
  })

  return {
    batteryTypes: batteryTypesQuery.data ?? [],
    isLoading: batteryTypesQuery.isLoading,
    addBatteryType: addBatteryTypeMutation.mutateAsync,
    deleteBatteryType: deleteBatteryTypeMutation.mutateAsync,
    updateBatteryType: updateBatteryTypeMutation.mutateAsync,
  }
}
