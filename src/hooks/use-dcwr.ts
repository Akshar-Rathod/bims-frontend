import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface DCWRItem {
    _id?: string
    batteryType: string
    batteryModel: string
    quantity: number
    arrivedQuantity: number
}

export interface DCWR {
    _id: string
    dcwrNo: string
    date: string
    items: DCWRItem[]
    status: 'Pending' | 'Verified' | 'Partial'
    createdAt: string
    updatedAt: string
}

export const useDCWR = () => {
    const queryClient = useQueryClient()

    const { data: dcwrs = [], isLoading } = useQuery<DCWR[]>({
        queryKey: ['dcwrs'],
        queryFn: async () => {
            const response = await apiClient.get('/dcwrs')
            return response.data
        }
    })

    const addDCWRMutation = useMutation({
        mutationFn: async (newDCWR: Omit<DCWR, '_id' | 'status' | 'createdAt' | 'updatedAt'>) => {
            const response = await apiClient.post('/dcwrs', newDCWR)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dcwrs'] })
        }
    })

    const verifyDCWRMutation = useMutation({
        mutationFn: async ({ id, items }: { id: string, items: { itemId: string, arrivedQuantity: number }[] }) => {
            const response = await apiClient.patch(`/dcwrs/${id}/verify`, { items })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dcwrs'] })
        }
    })

    const updateDCWRMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: Partial<DCWR> }) => {
            const response = await apiClient.put(`/dcwrs/${id}`, data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dcwrs'] })
        }
    })

    const deleteDCWRMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await apiClient.delete(`/dcwrs/${id}`)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dcwrs'] })
        }
    })

    return {
        dcwrs,
        isLoading,
        addDCWR: addDCWRMutation.mutateAsync,
        updateDCWR: updateDCWRMutation.mutateAsync,
        verifyDCWR: verifyDCWRMutation.mutateAsync,
        deleteDCWR: deleteDCWRMutation.mutateAsync,
    }
}
