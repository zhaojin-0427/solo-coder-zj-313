import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ReturnRecord, CreateReturnRequest } from '../types'
import { getReturnList, addReturn } from '../api/return'

export const useReturnStore = defineStore('return', () => {
  const returnList = ref<ReturnRecord[]>([])
  const loading = ref(false)

  async function fetchReturnList() {
    loading.value = true
    try {
      const data = await getReturnList()
      returnList.value = data
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
