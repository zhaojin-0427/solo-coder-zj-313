<template>
  <div class="statistics-page">
    <div class="page-header">
      <h2>数据统计</h2>
    </div>

    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon dress-icon">
              <el-icon><Collection /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.overviewStats?.totalDresses || 0 }}</div>
              <div class="stat-label">服饰总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon rent-icon">
              <el-icon><ShoppingCart /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.overviewStats?.totalRentals || 0 }}</div>
              <div class="stat-label">预约总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon money-icon">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ statsStore.overviewStats?.totalRevenue || 0 }}</div>
              <div class="stat-label">总营收</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon feedback-icon">
              <el-icon><Star /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.overviewStats?.averageFitScore?.toFixed(1) || '0.0' }}</div>
              <div class="stat-label">平均合身评分</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>各柄图出租率</span>
            </div>
          </template>
          <v-chart class="chart" :option="patternRentalRateOption" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>尺码退换率</span>
            </div>
          </template>
          <v-chart class="chart" :option="sizeReturnRateOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>月度洗护成本</span>
            </div>
          </template>
          <v-chart class="chart" :option="washCostOption" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>配件遗失频次</span>
            </div>
          </template>
          <v-chart class="chart" :option="accessoryLossOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-divider content-position="left">寄售统计</el-divider>

    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon consign-icon">
              <el-icon><Goods /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.consignmentStats?.totalConsignments || 0 }}</div>
              <div class="stat-label">寄售总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon active-icon">
              <el-icon><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.consignmentStats?.activeConsignments || 0 }}</div>
              <div class="stat-label">进行中</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon commission-icon">
              <el-icon><Wallet /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ statsStore.consignmentStats?.totalCommission || 0 }}</div>
              <div class="stat-label">总佣金</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon rate-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.consignmentStats?.averageCommissionRate?.toFixed?.(1) || '0' }}%</div>
              <div class="stat-label">平均佣金率</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>寄售成交周期</span>
            </div>
          </template>
          <v-chart class="chart chart-tall" :option="consignmentCycleOption" autoresize />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart,
  PieChart,
  LineChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { useStatsStore } from '../stores/stats'
import {
  Collection,
  ShoppingCart,
  Star,
  Money,
  Goods,
  CircleCheck,
  Wallet,
  TrendCharts
} from '@element-plus/icons-vue'

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const statsStore = useStatsStore()

const patternRentalRateOption = computed(() => {
  const data = statsStore.patternRentalRate || []
  return {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>出租率: {c}%'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.pattern),
      axisLabel: {
        rotate: 15,
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      name: '出租率(%)',
      max: 100
    },
    series: [
      {
        name: '出租率',
        type: 'bar',
        data: data.map(item => item.rate),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#e74c8c' },
              { offset: 1, color: '#ff9ec4' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          fontSize: 11
        }
      }
    ]
  }
})

const sizeReturnRateOption = computed(() => {
  const data = statsStore.sizeReturnRate || []
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['退换率', '总租赁数'],
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.size),
      axisLabel: {
        fontSize: 12
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '退换率(%)',
        position: 'left',
        max: 30
      },
      {
        type: 'value',
        name: '租赁数',
        position: 'right'
      }
    ],
    series: [
      {
        name: '退换率',
        type: 'bar',
        yAxisIndex: 0,
        data: data.map(item => item.returnRate),
        itemStyle: {
          color: '#f56c6c',
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          fontSize: 11
        }
      },
      {
        name: '总租赁数',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(item => item.total),
        smooth: true,
        itemStyle: {
          color: '#409eff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
            ]
          }
        }
      }
    ]
  }
})

const washCostOption = computed(() => {
  const data = statsStore.washCost || []
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params: any) => {
        const month = params[0].name
        const cost = params[0]?.value || 0
        const count = params[1]?.value || 0
        return `${month}<br/>洗护成本: ¥${cost}<br/>洗护次数: ${count}次`
      }
    },
    legend: {
      data: ['洗护成本', '洗护次数'],
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.month)
    },
    yAxis: [
      {
        type: 'value',
        name: '成本(元)',
        position: 'left'
      },
      {
        type: 'value',
        name: '次数',
        position: 'right'
      }
    ],
    series: [
      {
        name: '洗护成本',
        type: 'bar',
        yAxisIndex: 0,
        data: data.map(item => item.cost),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#67c23a' },
              { offset: 1, color: '#95d475' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        }
      },
      {
        name: '洗护次数',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(item => item.count),
        smooth: true,
        itemStyle: {
          color: '#e6a23c'
        }
      }
    ]
  }
})

const accessoryLossOption = computed(() => {
  const data = statsStore.accessoryLoss || []
  const pieData = data.map(item => ({
    value: item.lossCount,
    name: item.accessory
  }))
  
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const item = data.find(d => d.accessory === params.name)
        const rate = item ? ((item.lossCount / item.totalCount) * 100).toFixed(1) : 0
        return `${params.name}<br/>遗失数: ${params.value}<br/>遗失率: ${rate}%`
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center'
    },
    series: [
      {
        name: '配件遗失',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['65%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%'
        },
        data: pieData,
        color: ['#f56c6c', '#e6a23c', '#409eff', '#67c23a', '#909399']
      }
    ]
  }
})

const consignmentCycleOption = computed(() => {
  const data = statsStore.consignmentCycle || []
  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const item = data.find(d => d.pattern === params[0].name)
        return `${params[0].name}<br/>寄售周期: ${item?.avgDays || 0}天<br/>出租次数: ${item?.count || 0}次`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.pattern),
      axisLabel: {
        rotate: 10,
        fontSize: 11
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '周期(天)',
        position: 'left'
      },
      {
        type: 'value',
        name: '出租次数',
        position: 'right'
      }
    ],
    series: [
      {
        name: '寄售周期',
        type: 'bar',
        yAxisIndex: 0,
        data: data.map(item => item.avgDays),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#909399' },
              { offset: 1, color: '#c0c4cc' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}天',
          fontSize: 11
        }
      },
      {
        name: '出租次数',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(item => item.count),
        smooth: true,
        itemStyle: {
          color: '#e74c8c'
        },
        symbol: 'circle',
        symbolSize: 8
      }
    ]
  }
})

onMounted(() => {
  statsStore.fetchAllStats()
})
</script>

<style scoped>
.statistics-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header h2 {
  font-size: 20px;
  color: #303133;
  margin: 0;
}

.stats-cards {
  margin-bottom: 0;
}

.stat-card {
  border-radius: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
}

.dress-icon {
  background: linear-gradient(135deg, #e74c8c, #ff9ec4);
}

.rent-icon {
  background: linear-gradient(135deg, #409eff, #79bbff);
}

.feedback-icon {
  background: linear-gradient(135deg, #e6a23c, #f3d19e);
}

.money-icon {
  background: linear-gradient(135deg, #67c23a, #95d475);
}

.consign-icon {
  background: linear-gradient(135deg, #909399, #c0c4cc);
}

.active-icon {
  background: linear-gradient(135deg, #67c23a, #95d475);
}

.commission-icon {
  background: linear-gradient(135deg, #e6a23c, #f3d19e);
}

.rate-icon {
  background: linear-gradient(135deg, #409eff, #79bbff);
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.chart-row {
  margin-top: 0;
}

.chart-card {
  border-radius: 8px;
}

.card-header {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.chart {
  height: 320px;
  width: 100%;
}

.chart-tall {
  height: 380px;
}
</style>
