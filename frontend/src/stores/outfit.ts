import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Outfit, OutfitAvailabilityCheckResult, OutfitStats, CreateOutfitRequest, UpdateOutfitRequest, OutfitFitRiskAssessment } from '../types'
import {
  getOutfitList, getAvailableOutfits, getOutfitDetail, checkOutfitAvailability, addOutfit, updateOutfit, deleteOutfit, getOutfitStats, getScenarioStats, getOutfitFitRisk } from '../api/outfit'

export const useOutfitStore = defineStore('outfit', () => {
  const outfitList = ref<Outfit[]>([])
  const currentOutfit = ref<Outfit | null>(null)
  const availabilityCheck = ref<OutfitAvailabilityCheckResult | null>(null)
  const outfitStats = ref<OutfitStats | null>(null)
  const scenarioStats = ref<{ scenario: string; count: number }[]>([])
  const fitRiskAssessment = ref<OutfitFitRiskAssessment | null>(null)
  const loading = ref(false)

  const activeOutfits = computed(() => outfitList.value.filter(o => o.status === 'active'))

  async function fetchOutfitList(params?: { keyword?: string; status?: string }) {
    loading.value = true
    try {
      const data = await getOutfitList(params)
      outfitList.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchAvailableOutfits(params: { startDate: string; endDate: string }) {
    loading.value = true
    try {
      const data = await getAvailableOutfits(params)
      outfitList.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchOutfitDetail(id: string) {
    loading.value = true
    try {
      const data = await getOutfitDetail(id)
      currentOutfit.value = data
    } finally {
      loading.value = false
    }
  }

  async function checkAvailability(outfitId: string, params: { startDate: string; endDate: string }) {
    loading.value = true
    try {
      const data = await checkOutfitAvailability(outfitId, params)
      availabilityCheck.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  async function addNewOutfit(data: CreateOutfitRequest) {
    const result = await addOutfit(data)
    await fetchOutfitList()
    return result
  }

  async function updateOutfitItem(id: string, data: UpdateOutfitRequest) {
    const result = await updateOutfit(id, data)
    await fetchOutfitList()
    return result
  }

  async function deleteOutfitItem(id: string) {
    await deleteOutfit(id)
    await fetchOutfitList()
  }

  async function fetchOutfitStats() {
    loading.value = true
    try {
      const data = await getOutfitStats()
      outfitStats.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchScenarioStats() {
    const data = await getScenarioStats()
    scenarioStats.value = data
  }

  async function fetchFitRisk(outfitId: string, data: { height: number; bust: number; waist: number; hip: number }) {
    const result = await getOutfitFitRisk(outfitId, data)
    fitRiskAssessment.value = result
    return result
  }

  function clearCurrent() {
    currentOutfit.value = null
    availabilityCheck.value = null
    fitRiskAssessment.value = null
  }

  return {
    outfitList,
    currentOutfit,
    availabilityCheck,
    outfitStats,
    scenarioStats,
    fitRiskAssessment,
    loading,
    activeOutfits,
    fetchOutfitList,
    fetchAvailableOutfits,
    fetchOutfitDetail,
    checkAvailability,
    addNewOutfit,
    updateOutfitItem,
    deleteOutfitItem,
    fetchOutfitStats,
    fetchScenarioStats,
    fetchFitRisk,
    clearCurrent
  }
})
