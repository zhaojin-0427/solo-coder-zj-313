import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Rental, CreateRentalRequest } from '../types'
import { getRentalList, addRental, updateRental } from '../api/rental'

export const useRentalStore = defineStore('rental', () => {
  const rentalList = ref<Rental[]>([])
  const loading = ref(false)

  async function fetchRentalList(params?: { status?: string }) {
    loading.value = true
    try {
      const data = await getRentalList(params)
      rentalList.value = data
    } finally {
      loading.value = false
    }
  }

  async function addNewRental(data: CreateRentalRequest) {
    const result = await addRental(data)
    await fetchRentalList()
    return result
  }

  async function updateRentalItem(id: string, data: Partial<Rental>) {
    const result = await updateRental(id, data)
    await fetchRentalList()
    return result
  }

  return {
    rentalList,
    loading,
    fetchRentalList,
    addNewRental,
    updateRentalItem
  }
})
