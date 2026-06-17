import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Dress } from '../types'
import { getDressList, addDress, updateDress, deleteDress } from '../api/dress'

export const useDressStore = defineStore('dress', () => {
  const dressList = ref<Dress[]>([])
  const loading = ref(false)

  async function fetchDressList(params?: { keyword?: string; status?: string }) {
    loading.value = true
    try {
      const data = await getDressList(params)
      dressList.value = data
    } finally {
      loading.value = false
    }
  }

  async function addNewDress(data: Omit<Dress, 'id' | 'createdAt'>) {
    const result = await addDress(data)
    await fetchDressList()
    return result
  }

  async function updateDressItem(id: string, data: Partial<Dress>) {
    const result = await updateDress(id, data)
    await fetchDressList()
    return result
  }

  async function deleteDressItem(id: string) {
    await deleteDress(id)
    await fetchDressList()
  }

  return {
    dressList,
    loading,
    fetchDressList,
    addNewDress,
    updateDressItem,
    deleteDressItem
  }
})
