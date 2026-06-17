import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ReturnRecord, CreateReturnRequest } from '../types'
import { getReturnList, addReturn } from '../api/return'

const cleaningStatusMap: Record<string, string> = {
  clean: '干净',
  need_wash: '需洗护',
  needs_cleaning: '需洗护',
  needs_professional_cleaning: '需专业洗护',
  damaged: '损坏',
  sent_out: '已送洗'
}

function transformReturn(item: any): ReturnRecord {
  return {
    ...item,
    cleaningStatus: cleaningStatusMap[item.cleaningStatus] || item.cleaningStatus,
    totalDamageDeduction: Number(item.totalDamageDeduction ?? item.damageDeduction ?? 0),
    damageDeduction: Number(item.damageDeduction ?? item.totalDamageDeduction ?? 0),
    totalAccessoriesDeduction: Number(item.totalAccessoriesDeduction ?? 0),
    totalDeduction: Number(item.totalDeduction ?? 0),
    cleaningCost: Number(item.cleaningCost ?? 0),
    refundAmount: Number(item.refundAmount ?? 0),
  }
}

export const useReturnStore = defineStore('return', () => {
  const returnList = ref<ReturnRecord[]>([])
  const loading = ref(false)

  async function fetchReturnList() {
    loading.value = true
    try {
      const data = await getReturnList()
      returnList.value = (data || []).map(transformReturn)
    } finally {
      loading.value = false
    }
  }

  async function addNewReturn(data: CreateReturnRequest) {
    const result = await addReturn(data)
    await fetchReturnList()
    return result
  }

  return {
    returnList,
    loading,
    fetchReturnList,
    addNewReturn
  }
})
