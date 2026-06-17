import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Fitting } from '../types'
import { getFittingList, addFitting } from '../api/fitting'

export const useFittingStore = defineStore('fitting', () => {
  const fittingList = ref<Fitting[]>([])
  const loading = ref(false)

  async function fetchFittingList(params?: { dressId?: string }) {
    loading.value = true
    try {
      const data = await getFittingList(params)
      fittingList.value = data
    } finally {
      loading.value = false
    }
  }

  async function addNewFitting(data: Omit<Fitting, 'id' | 'createdAt'>) {
    const result = await addFitting(data)
    await fetchFittingList()
    return result
  }

  return {
    fittingList,
    loading,
    fetchFittingList,
    addNewFitting
  }
})
