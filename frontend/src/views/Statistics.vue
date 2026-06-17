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
              <span>成交排行（按柄图）</span>
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

    <el-divider content-position="left">争议统计</el-divider>

    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon dispute-icon">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.disputeStats?.totalDisputes || 0 }}</div>
              <div class="stat-label">争议订单数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon approve-icon">
              <el-icon><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.disputeStats?.approvalRate || 0 }}%</div>
              <div class="stat-label">争议通过率</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon deduct-icon">
              <el-icon><Wallet /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ statsStore.disputeStats?.totalDeductionAmount || 0 }}</div>
              <div class="stat-label">争议扣减金额</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon pending-icon">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.disputeStats?.pendingDisputes || 0 }}</div>
              <div class="stat-label">待复核争议</div>
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
              <span>争议触发原因分布</span>
            </div>
          </template>
          <v-chart class="chart" :option="disputeTriggerOption" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>争议复核状态分布</span>
            </div>
          </template>
          <v-chart class="chart" :option="disputeStatusOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-divider content-position="left">寄售统计</el-divider>

    <el-row :gutter="20" class="stats-cards">
      <el-col :span="4">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon onshelf-icon">
              <el-icon><Goods /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.consignmentStats?.onShelfCount || 0 }}</div>
              <div class="stat-label">寄售在架数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon sold-icon">
              <el-icon><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.consignmentStats?.soldCount || 0 }}</div>
              <div class="stat-label">已成交数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon transaction-icon">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ statsStore.consignmentStats?.totalTransactionAmount || 0 }}</div>
              <div class="stat-label">成交金额</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon platform-commission-icon">
              <el-icon><Wallet /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ statsStore.consignmentStats?.totalPlatformCommission || 0 }}</div>
              <div class="stat-label">平台佣金</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon avg-cycle-icon">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.consignmentStats?.avgTransactionCycle || 0 }}天</div>
              <div class="stat-label">平均成交周期</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon expired-icon">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.consignmentStats?.expiredWithoutSaleCount || 0 }}</div>
              <div class="stat-label">到期未成交数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="stats-cards">
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon pending-settlement-icon">
              <el-icon><Wallet /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ statsStore.consignmentStats?.pendingSettlementAmount || 0 }}</div>
              <div class="stat-label">委托人待结算金额</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon settled-icon">
              <el-icon><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.consignmentStats?.settledCount || 0 }}</div>
              <div class="stat-label">已结算数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon cancelled-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.consignmentStats?.cancelledCount || 0 }}</div>
              <div class="stat-label">已取消数</div>
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
              <span>成交排行（按品牌）</span>
            </div>
          </template>
          <v-chart class="chart" :option="brandRankingOption" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>成交排行（按委托人）</span>
            </div>
          </template>
          <v-chart class="chart" :option="consignorRankingOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-divider content-position="left">主题搭配统计</el-divider>

    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon outfit-icon">
              <el-icon><Suitcase /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.outfitStats?.overview?.totalOutfits || 0 }}</div>
              <div class="stat-label">主题方案总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon outfit-rent-icon">
              <el-icon><ShoppingCart /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statsStore.outfitStats?.overview?.totalOutfitRentals || 0 }}</div>
              <div class="stat-label">套装预约总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon outfit-money-icon">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ statsStore.outfitStats?.overview?.totalOutfitRevenue || 0 }}</div>
              <div class="stat-label">套装总营收</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon outfit-price-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ statsStore.outfitStats?.overview?.avgSetOrderPrice || 0 }}</div>
              <div class="stat-label">套装客单价</div>
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
              <span>主题方案出租率</span>
            </div>
          </template>
          <v-chart class="chart" :option="outfitRentalRateOption" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>套装客单价对比</span>
            </div>
          </template>
          <v-chart class="chart" :option="outfitPriceComparisonOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>套装配件遗失频次</span>
            </div>
          </template>
          <v-chart class="chart" :option="outfitAccessoryLossOption" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>最受欢迎使用场景</span>
            </div>
          </template>
          <v-chart class="chart" :option="outfitScenarioOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-divider content-position="left">会员信用统计</el-divider>

    <el-row :gutter="20" class="stats-cards">
      <el-col :span="4">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon member-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ memberStore.memberStats?.totalMembers || 0 }}</div>
              <div class="stat-label">会员总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon high-risk-icon">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ memberStore.memberStats?.highRiskMembers || 0 }}</div>
              <div class="stat-label">高风险会员数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon avg-credit-icon">
              <el-icon><Star /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ memberStore.memberStats?.avgCreditScore?.toFixed(1) || '0.0' }}</div>
              <div class="stat-label">平均信用分</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon reduction-icon">
              <el-icon><Wallet /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ memberStore.memberStats?.totalDepositReduction || 0 }}</div>
              <div class="stat-label">押金减免总额</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon overdue-icon">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ memberStore.memberStats?.overdueRateAfterReduction?.toFixed(1) || '0.0' }}%</div>
              <div class="stat-label">减免后逾期率</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon deduction-icon">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ memberStore.memberStats?.recentDeductionMembers || 0 }}</div>
              <div class="stat-label">近期扣减会员</div>
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
              <span>信用等级分布</span>
            </div>
          </template>
          <v-chart class="chart" :option="creditLevelDistributionOption" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>信用分变动趋势</span>
            </div>
          </template>
          <v-chart class="chart" :option="creditScoreTrendOption" autoresize />
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
import { useMemberStore } from '../stores/member'
import {
  Collection,
  ShoppingCart,
  Star,
  Money,
  Goods,
  CircleCheck,
  Wallet,
  TrendCharts,
  Warning,
  Clock,
  Suitcase,
  User,
  UserFilled
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
const memberStore = useMemberStore()

const patternRentalRateOption = computed(() => {
  const data = statsStore.patternRentalRate || []
  if (data.length === 0) {
    return {
      title: { text: '暂无数据', left: 'center', top: 'center', textStyle: { color: '#c0c4cc', fontSize: 14 } }
    }
  }
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params: any) => {
        const item = data.find((d: any) => d.pattern === params[0].name)
        return `${params[0].name}<br/>成交数: ${item?.count || 0}<br/>成交金额: ¥${item?.totalAmount || 0}`
      }
    },
    legend: {
      data: ['成交数', '成交金额'],
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
      data: data.map((item: any) => item.pattern),
      axisLabel: {
        rotate: 15,
        fontSize: 11
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '成交数',
        position: 'left'
      },
      {
        type: 'value',
        name: '金额(元)',
        position: 'right'
      }
    ],
    series: [
      {
        name: '成交数',
        type: 'bar',
        yAxisIndex: 0,
        data: data.map((item: any) => item.count),
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
          formatter: '{c}',
          fontSize: 11
        }
      },
      {
        name: '成交金额',
        type: 'line',
        yAxisIndex: 1,
        data: data.map((item: any) => item.totalAmount),
        smooth: true,
        itemStyle: {
          color: '#e6a23c'
        },
        symbol: 'circle',
        symbolSize: 8
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

const disputeTriggerOption = computed(() => {
  const data = statsStore.disputeByTriggerType || []
  if (data.length === 0) {
    return {
      title: { text: '暂无数据', left: 'center', top: 'center', textStyle: { color: '#c0c4cc', fontSize: 14 } }
    }
  }
  const pieData = data.map(item => ({
    value: item.count,
    name: item.label
  }))
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>触发次数: {c}'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center'
    },
    series: [
      {
        name: '争议触发原因',
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
          formatter: '{b}\n{c}次'
        },
        data: pieData,
        color: ['#e6a23c', '#f56c6c', '#409eff', '#e74c8c']
      }
    ]
  }
})

const disputeStatusOption = computed(() => {
  const stats = statsStore.disputeStats
  if (!stats || stats.totalDisputes === 0) {
    return {
      title: { text: '暂无数据', left: 'center', top: 'center', textStyle: { color: '#c0c4cc', fontSize: 14 } }
    }
  }
  const pieData = [
    { value: stats.pendingDisputes, name: '待复核' },
    { value: stats.approvedDisputes, name: '已通过' },
    { value: stats.rejectedDisputes, name: '已驳回' },
  ]
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>数量: {c}'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center'
    },
    series: [
      {
        name: '复核状态',
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
          formatter: '{b}\n{c}件\n{d}%'
        },
        data: pieData,
        color: ['#e6a23c', '#67c23a', '#f56c6c']
      }
    ]
  }
})

const brandRankingOption = computed(() => {
  const data = statsStore.consignmentStats?.brandRanking || []
  if (data.length === 0) {
    return {
      title: { text: '暂无数据', left: 'center', top: 'center', textStyle: { color: '#c0c4cc', fontSize: 14 } }
    }
  }
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const item = data.find(d => d.name === params[0].name)
        return `${params[0].name}<br/>成交数: ${item?.count || 0}<br/>成交金额: ¥${item?.totalAmount || 0}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map((item: any) => item.name),
      axisLabel: {
        rotate: 15,
        fontSize: 11
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '成交数',
        position: 'left'
      },
      {
        type: 'value',
        name: '金额(元)',
        position: 'right'
      }
    ],
    series: [
      {
        name: '成交数',
        type: 'bar',
        yAxisIndex: 0,
        data: data.map((item: any) => item.count),
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
          formatter: '{c}',
          fontSize: 11
        }
      },
      {
        name: '成交金额',
        type: 'line',
        yAxisIndex: 1,
        data: data.map((item: any) => item.totalAmount),
        smooth: true,
        itemStyle: {
          color: '#e6a23c'
        },
        symbol: 'circle',
        symbolSize: 8
      }
    ]
  }
})

const consignorRankingOption = computed(() => {
  const data = statsStore.consignmentStats?.consignorRanking || []
  if (data.length === 0) {
    return {
      title: { text: '暂无数据', left: 'center', top: 'center', textStyle: { color: '#c0c4cc', fontSize: 14 } }
    }
  }
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const item = data.find(d => d.name === params[0].name)
        return `${params[0].name}<br/>成交数: ${item?.count || 0}<br/>成交金额: ¥${item?.totalAmount || 0}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map((item: any) => item.name),
      axisLabel: {
        rotate: 15,
        fontSize: 11
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '成交数',
        position: 'left'
      },
      {
        type: 'value',
        name: '金额(元)',
        position: 'right'
      }
    ],
    series: [
      {
        name: '成交数',
        type: 'bar',
        yAxisIndex: 0,
        data: data.map((item: any) => item.count),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#409eff' },
              { offset: 1, color: '#79bbff' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
          fontSize: 11
        }
      },
      {
        name: '成交金额',
        type: 'line',
        yAxisIndex: 1,
        data: data.map((item: any) => item.totalAmount),
        smooth: true,
        itemStyle: {
          color: '#67c23a'
        },
        symbol: 'circle',
        symbolSize: 8
      }
    ]
  }
})

const outfitRentalRateOption = computed(() => {
  const data = statsStore.outfitRentalRates || []
  if (data.length === 0) {
    return {
      title: { text: '暂无数据', left: 'center', top: 'center', textStyle: { color: '#c0c4cc', fontSize: 14 } }
    }
  }
  return {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>出租率: {c}%<br/>租赁次数: ' + (data.find((d: any) => d.themeName === '{b}')?.rentalCount || 0)
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map((item: any) => item.themeName),
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
        data: data.map((item: any) => item.rentalRate),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#9b59b6' },
              { offset: 1, color: '#c39bd3' }
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

const outfitPriceComparisonOption = computed(() => {
  const data = statsStore.outfitPriceComparison
  if (!data) {
    return {
      title: { text: '暂无数据', left: 'center', top: 'center', textStyle: { color: '#c0c4cc', fontSize: 14 } }
    }
  }
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['单裙客单价', '套装客单价'],
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
      data: ['客单价对比'],
      axisLabel: {
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: '金额(元)'
    },
    series: [
      {
        name: '单裙客单价',
        type: 'bar',
        data: [data.avgSingleOrderPrice],
        itemStyle: {
          color: '#409eff',
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: '¥{c}',
          fontSize: 11
        }
      },
      {
        name: '套装客单价',
        type: 'bar',
        data: [data.avgSetOrderPrice],
        itemStyle: {
          color: '#e74c8c',
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: '¥{c}\n(+' + data.premiumPercentage + '%)',
          fontSize: 11
        }
      }
    ]
  }
})

const outfitAccessoryLossOption = computed(() => {
  const data = statsStore.outfitAccessoryLossStats || []
  if (data.length === 0) {
    return {
      title: { text: '暂无数据', left: 'center', top: 'center', textStyle: { color: '#c0c4cc', fontSize: 14 } }
    }
  }
  const pieData = data.map(item => ({
    value: item.lossCount,
    name: item.typeName
  }))
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const item = data.find(d => d.typeName === params.name)
        return `${params.name}<br/>遗失数: ${params.value}次`
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
          formatter: '{b}\n{c}次\n{d}%'
        },
        data: pieData,
        color: ['#f56c6c', '#e6a23c', '#409eff', '#67c23a', '#909399', '#9b59b6', '#e74c8c']
      }
    ]
  }
})

const outfitScenarioOption = computed(() => {
  const data = statsStore.outfitMostPopularScenarios || []
  if (data.length === 0) {
    return {
      title: { text: '暂无数据', left: 'center', top: 'center', textStyle: { color: '#c0c4cc', fontSize: 14 } }
    }
  }
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: '{b}<br/>使用次数: {c}次'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '使用次数'
    },
    yAxis: {
      type: 'category',
      data: data.map((item: any) => item.scenario),
      axisLabel: {
        fontSize: 12
      }
    },
    series: [
      {
        name: '使用次数',
        type: 'bar',
        data: data.map((item: any) => item.count),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#1abc9c' },
              { offset: 1, color: '#82e0aa' }
            ]
          },
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}次',
          fontSize: 11
        }
      }
    ]
  }
})

const creditLevelDistributionOption = computed(() => {
  const memberStats = memberStore.memberStats
  if (!memberStats || memberStats.totalMembers === 0) {
    return {
      title: { text: '暂无数据', left: 'center', top: 'center', textStyle: { color: '#c0c4cc', fontSize: 14 } }
    }
  }
  const pieData = [
    { value: memberStats.creditLevelDistribution.S, name: 'S级' },
    { value: memberStats.creditLevelDistribution.A, name: 'A级' },
    { value: memberStats.creditLevelDistribution.B, name: 'B级' },
    { value: memberStats.creditLevelDistribution.C, name: 'C级' },
    { value: memberStats.creditLevelDistribution.D, name: 'D级' },
  ]
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const percent = memberStats.totalMembers > 0
          ? ((params.value / memberStats.totalMembers) * 100).toFixed(1)
          : 0
        return `${params.name}<br/>人数: ${params.value}<br/>占比: ${percent}%`
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center'
    },
    series: [
      {
        name: '信用等级分布',
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
          formatter: '{b}\n{c}人\n{d}%'
        },
        data: pieData,
        color: ['#67c23a', '#409eff', '#e6a23c', '#f56c6c', '#909399']
      }
    ]
  }
})

const creditScoreTrendOption = computed(() => {
  const trendData = memberStore.memberStats?.creditScoreTrend || []
  if (trendData.length === 0) {
    return {
      title: { text: '暂无数据', left: 'center', top: 'center', textStyle: { color: '#c0c4cc', fontSize: 14 } }
    }
  }
  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        return `${params[0].name}<br/>平均信用分: ${params[0]?.value || 0}分`
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
      boundaryGap: false,
      data: trendData.map(item => item.date),
      axisLabel: {
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      name: '信用分',
      min: 0,
      max: 100
    },
    series: [
      {
        name: '平均信用分',
        type: 'line',
        smooth: true,
        data: trendData.map(item => item.avgScore),
        itemStyle: {
          color: '#e74c8c'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(231, 76, 140, 0.3)' },
              { offset: 1, color: 'rgba(231, 76, 140, 0.05)' }
            ]
          }
        },
        symbol: 'circle',
        symbolSize: 8
      }
    ]
  }
})

onMounted(() => {
  statsStore.fetchAllStats()
  memberStore.fetchMemberStats()
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

.onshelf-icon {
  background: linear-gradient(135deg, #909399, #c0c4cc);
}

.sold-icon {
  background: linear-gradient(135deg, #67c23a, #95d475);
}

.transaction-icon {
  background: linear-gradient(135deg, #e74c8c, #ff9ec4);
}

.platform-commission-icon {
  background: linear-gradient(135deg, #e6a23c, #f3d19e);
}

.avg-cycle-icon {
  background: linear-gradient(135deg, #409eff, #79bbff);
}

.expired-icon {
  background: linear-gradient(135deg, #f56c6c, #fab6b6);
}

.pending-settlement-icon {
  background: linear-gradient(135deg, #9b59b6, #c39bd3);
}

.settled-icon {
  background: linear-gradient(135deg, #1abc9c, #82e0aa);
}

.cancelled-icon {
  background: linear-gradient(135deg, #909399, #c0c4cc);
}

.dispute-icon {
  background: linear-gradient(135deg, #e6a23c, #f3d19e);
}

.approve-icon {
  background: linear-gradient(135deg, #67c23a, #95d475);
}

.deduct-icon {
  background: linear-gradient(135deg, #f56c6c, #fab6b6);
}

.pending-icon {
  background: linear-gradient(135deg, #909399, #c0c4cc);
}

.outfit-icon {
  background: linear-gradient(135deg, #9b59b6, #c39bd3);
}

.outfit-rent-icon {
  background: linear-gradient(135deg, #e74c8c, #ff9ec4);
}

.outfit-money-icon {
  background: linear-gradient(135deg, #1abc9c, #82e0aa);
}

.outfit-price-icon {
  background: linear-gradient(135deg, #f39c12, #f9e79f);
}

.member-icon {
  background: linear-gradient(135deg, #409eff, #79bbff);
}

.high-risk-icon {
  background: linear-gradient(135deg, #f56c6c, #fab6b6);
}

.avg-credit-icon {
  background: linear-gradient(135deg, #e6a23c, #f3d19e);
}

.reduction-icon {
  background: linear-gradient(135deg, #67c23a, #95d475);
}

.overdue-icon {
  background: linear-gradient(135deg, #e74c8c, #ff9ec4);
}

.deduction-icon {
  background: linear-gradient(135deg, #9b59b6, #c39bd3);
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
</style>
