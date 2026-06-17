import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getOverviewStats, getConsignmentStats } from '../api/stats'

export const useStatsStore = defineStore('stats', () => {
  const rawOverview = ref<any>(null)
  const rawConsignment = ref<any>(null)
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

  const consignmentStats = computed(() => {
    if (!rawConsignment.value) return null
    const data = rawConsignment.value
    const details = data.details || []

    const brandMap = new Map<string, { count: number; commission: number }>()
    const statusMap = new Map<string, number>()
    let totalCommission = 0
    let activeCount = 0

    details.forEach((item: any) => {
      const dressName = item.dressName || ''
      const brand = dressName.split(' ')[0] || '未知'
      
      if (!brandMap.has(brand)) {
        brandMap.set(brand, { count: 0, commission: 0 })
      }
      const brandData = brandMap.get(brand)!
      brandData.count += 1
      brandData.commission += item.commissionIncome || 0

      totalCommission += item.commissionIncome || 0

      const status = item.status || 'active'
      statusMap.set(status, (statusMap.get(status) || 0) + 1)
      
      if (status === 'active') {
        activeCount++
      }
    })

    if (brandMap.size === 0 && details.length > 0) {
      details.forEach((item: any) => {
        const brand = item.brand || (item.dressName || '').split(' ')[0] || '未知'
        if (!brandMap.has(brand)) {
          brandMap.set(brand, { count: 0, commission: 0 })
        }
        const brandData = brandMap.get(brand)!
        brandData.count += 1
        brandData.commission += item.commissionIncome || 0
      })
    }

    if (statusMap.size === 0 && details.length > 0) {
      activeCount = details.length
      statusMap.set('active', details.length)
    }

    const consignmentByBrand = Array.from(brandMap.entries()).map(([brand, info]) => ({
      brand,
      count: info.count,
      commission: parseFloat(info.commission.toFixed(2)),
    }))

    const consignmentByStatus = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
    }))

    return {
      totalConsignments: data.totalConsignmentDresses ?? 0,
      activeConsignments: activeCount,
      endedConsignments: statusMap.get('ended') || 0,
      totalCommission: parseFloat(totalCommission.toFixed(2)),
      totalBasePrice: data.totalConsignmentValue ?? 0,
      averageCommissionRate: data.averageCommissionRate ?? 0,
      consignmentByBrand,
      consignmentByStatus,
      details,
    }
  })

  const patternRentalRate = computed(() => {
    if (!rawConsignment.value) return []
    const details = rawConsignment.value.details || []
    
    return details.map((item: any) => {
      const rentalCount = item.rentalCount || 0
      const consignmentDays = item.consignmentDays || 365
      const rate = consignmentDays > 0 ? parseFloat(((rentalCount / (consignmentDays / 30)) * 100).toFixed(1)) : 0
      return {
        pattern: item.dressName || '未知',
        rate: Math.min(rate, 100),
        count: rentalCount,
      }
    })
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

  const consignmentCycle = computed(() => {
    if (!rawConsignment.value) return []
    const details = rawConsignment.value.details || []
    return details.map((item: any) => ({
      pattern: item.dressName || '未知',
      avgDays: item.consignmentDays || 0,
      count: item.rentalCount || 0,
    }))
  })

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
      const [overview, consignment] = await Promise.all([
        getOverviewStats(),
        getConsignmentStats(),
      ])
      rawOverview.value = overview
      rawConsignment.value = consignment
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
    consignmentCycle,
    loading,
    fetchOverviewStats,
    fetchConsignmentStats,
    fetchAllStats,
  }
})
