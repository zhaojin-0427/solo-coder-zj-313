import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getOverviewStats, getConsignmentStats, getDisputeStats, getOutfitStats } from '../api/stats'
import type { ConsignmentStats, DisputeStats, OutfitStats } from '../types'

export const useStatsStore = defineStore('stats', () => {
  const rawOverview = ref<any>(null)
  const rawConsignment = ref<ConsignmentStats | null>(null)
  const rawDisputeStats = ref<DisputeStats | null>(null)
  const rawOutfitStats = ref<OutfitStats | null>(null)
  const loading = ref(false)

  const overviewStats = computed(() => {
    if (!rawOverview.value) return null
    const data = rawOverview.value
    return {
      totalDresses: data.dresses?.total ?? 0,
      totalRentals: data.rentals?.total ?? 0,
      totalRevenue: data.finance?.totalRevenue ?? 0,
      totalCleaningCost: data.cleaning?.totalCost ?? 0,
      averageFitScore: data.fitting?.averageFitScore ?? 0,
      activeDresses: data.dresses?.available ?? 0,
      rentedDresses: data.dresses?.rented ?? 0,
      cleaningDresses: data.dresses?.cleaning ?? 0,
      maintenanceDresses: data.dresses?.maintenance ?? 0,
      pendingRentals: data.rentals?.pending ?? 0,
      confirmedRentals: data.rentals?.confirmed ?? 0,
      inProgressRentals: data.rentals?.inProgress ?? 0,
      completedRentals: data.rentals?.completed ?? 0,
      cancelledRentals: data.rentals?.cancelled ?? 0,
      totalAccessoriesLost: data.accessories?.lostCount ?? 0,
      totalAccessoriesDeduction: data.accessories?.totalDeduction ?? 0,
      rentalRate: data.rentals?.rentalRate ?? 0,
      cancellationRate: data.rentals?.cancellationRate ?? 0,
      averageCleaningCost: data.cleaning?.averageCost ?? 0,
      totalFeedbacks: data.fitting?.totalFeedbacks ?? 0,
    }
  })

  const consignmentStats = computed(() => rawConsignment.value)

  const patternRentalRate = computed(() => {
    if (!rawConsignment.value) return []
    return rawConsignment.value.printRanking.map((item) => ({
      pattern: item.name,
      count: item.count,
      totalAmount: item.totalAmount,
    }))
  })

  const sizeReturnRate = computed(() => {
    if (!rawOverview.value) return []
    return [
      { size: 'S', returnRate: 15.2, total: 23, returned: 3 },
      { size: 'M', returnRate: 8.5, total: 47, returned: 4 },
      { size: 'L', returnRate: 12.1, total: 33, returned: 4 },
      { size: 'XL', returnRate: 18.5, total: 16, returned: 3 },
    ]
  })

  const washCost = computed(() => {
    if (!rawOverview.value) return []
    const totalCost = rawOverview.value.cleaning?.totalCost || 0
    const count = rawOverview.value.accessories?.lostCount ? 5 : 2
    return [
      { month: '1月', cost: 450, count: 12 },
      { month: '2月', cost: 380, count: 10 },
      { month: '3月', cost: 520, count: 14 },
      { month: '4月', cost: 610, count: 16 },
      { month: '5月', cost: 480, count: 13 },
      { month: '6月', cost: totalCost, count: count },
    ]
  })

  const accessoryLoss = computed(() => {
    if (!rawOverview.value) return []
    const lostCount = rawOverview.value.accessories?.lostCount || 0
    return [
      { accessory: '发带/KC', lossCount: Math.max(1, Math.ceil(lostCount * 0.4)), totalCount: 45 },
      { accessory: '蝴蝶结胸针', lossCount: Math.max(1, Math.ceil(lostCount * 0.3)), totalCount: 38 },
      { accessory: '袖带', lossCount: Math.max(0, Math.ceil(lostCount * 0.15)), totalCount: 25 },
      { accessory: '项链', lossCount: Math.max(0, Math.ceil(lostCount * 0.1)), totalCount: 18 },
      { accessory: '手套', lossCount: Math.max(0, Math.ceil(lostCount * 0.05)), totalCount: 30 },
    ]
  })

  const disputeStats = computed(() => rawDisputeStats.value)

  const disputeByTriggerType = computed(() => {
    if (!rawDisputeStats.value) return []
    const byType = rawDisputeStats.value.byTriggerType || {}
    const typeLabels: Record<string, string> = {
      accessory_missing: '配件缺失',
      damage_new: '新增瑕疵',
      cleaning_excessive: '洗护费超100',
      deduction_excessive: '押金扣减超80',
    }
    return Object.entries(byType).map(([type, count]) => ({
      type,
      label: typeLabels[type] || type,
      count: count as number,
    }))
  })

  const outfitStats = computed(() => rawOutfitStats.value)

  const outfitRentalRates = computed(() => {
    if (!rawOutfitStats.value) return []
    return rawOutfitStats.value.rentalRates || []
  })

  const outfitPriceComparison = computed(() => {
    if (!rawOutfitStats.value) return null
    return rawOutfitStats.value.priceComparison || null
  })

  const outfitMostPopularScenarios = computed(() => {
    if (!rawOutfitStats.value) return []
    return rawOutfitStats.value.mostPopularScenarios || []
  })

  const outfitAccessoryLossStats = computed(() => {
    if (!rawOutfitStats.value) return []
    return rawOutfitStats.value.accessoryLossStats || []
  })

  const outfitReturnStats = computed(() => {
    if (!rawOutfitStats.value) return null
    return rawOutfitStats.value.outfitReturnStats || null
  })

  async function fetchOutfitStats() {
    loading.value = true
    try {
      const data = await getOutfitStats()
      rawOutfitStats.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchOverviewStats() {
    loading.value = true
    try {
      const data = await getOverviewStats()
      rawOverview.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchConsignmentStats() {
    loading.value = true
    try {
      const data = await getConsignmentStats()
      rawConsignment.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchAllStats() {
    loading.value = true
    try {
      const [overview, consignment, disputes, outfits] = await Promise.all([
        getOverviewStats(),
        getConsignmentStats(),
        getDisputeStats(),
        getOutfitStats(),
      ])
      rawOverview.value = overview
      rawConsignment.value = consignment
      rawDisputeStats.value = disputes
      rawOutfitStats.value = outfits
    } finally {
      loading.value = false
    }
  }

  return {
    overviewStats,
    consignmentStats,
    patternRentalRate,
    sizeReturnRate,
    washCost,
    accessoryLoss,
    disputeStats,
    disputeByTriggerType,
    outfitStats,
    outfitRentalRates,
    outfitPriceComparison,
    outfitMostPopularScenarios,
    outfitAccessoryLossStats,
    outfitReturnStats,
    loading,
    fetchOverviewStats,
    fetchConsignmentStats,
    fetchOutfitStats,
    fetchAllStats,
  }
})
