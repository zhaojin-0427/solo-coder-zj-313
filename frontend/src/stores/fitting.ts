import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Fitting } from '../types'
import { getFittingList, addFitting } from '../api/fitting'

function transformFitting(item: any): Fitting {
  return {
    ...item,
    overallScore: Number(item.overallSatisfaction ?? item.overallScore ?? 0),
    fitScore: Number(item.fitScore ?? 0),
    qualityScore: Number(item.comfortScore ?? item.qualityScore ?? 0),
    comment: String(item.feedback ?? item.comment ?? ''),
  }
}

export const useFittingStore = defineStore('fitting', () => {
  const fittingList = ref<Fitting[]>([])
  const loading = ref(false)

  async function fetchFittingList(params?: { dressId?: string }) {
    loading.value = true
    try {
      const data = await getFittingList(params)
      fittingList.value = (data || []).map(transformFitting)
    } finally {
      loading.value = false
    }
  }

  async function addNewFitting(data: Omit<Fitting, 'id' | 'createdAt'>) {
    const submitData = {
      ...data,
      overallSatisfaction: data.overallScore,
      comfortScore: data.qualityScore,
      feedback: data.comment,
    }
    const result = await addFitting(submitData as any)
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
