import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export type BatteryModel = {
  _id: string
  id?: number
  batteryType: {
    _id: string
    id?: number
    name: string
  }
  model: string
  price: number
  createdAt: string
}

export const useBatteryModels = () => {
  const queryClient = useQueryClient()

  const batteryModelsQuery = useQuery({
    queryKey: ['battery-models'],
    queryFn: async () => {
      const { data } = await apiClient.get<BatteryModel[]>('/battery-models')
      return data
    },
  })

  const addBatteryModelMutation = useMutation({
    mutationFn: async (newModel: { batteryType: string; model: string; price: number }) => {
      const { data } = await apiClient.post('/battery-models', newModel)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['battery-models'] })
    },
  })

  const addBulkBatteryModelsMutation = useMutation({
    mutationFn: async (models: any[]) => {
      const { data } = await apiClient.post('/battery-models/bulk', models)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['battery-models'] })
    },
  })

  const deleteBatteryModelMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/battery-models/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['battery-models'] })
    },
  })

  const updateBatteryModelMutation = useMutation({
    mutationFn: async ({
      id,
      model,
      price,
    }: {
      id: string
      model: string
      price: number
    }) => {
      const { data } = await apiClient.put(`/battery-models/${id}`, {
        model,
        price,
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['battery-models'] })
    },
  })

  return {
    batteryModels: batteryModelsQuery.data ?? [],
    isLoading: batteryModelsQuery.isLoading,
    addBatteryModel: addBatteryModelMutation.mutateAsync,
    addBulkBatteryModels: addBulkBatteryModelsMutation.mutateAsync,
    deleteBatteryModel: deleteBatteryModelMutation.mutateAsync,
    updateBatteryModel: updateBatteryModelMutation.mutateAsync,
  }
}
