<template>
  <div class="member-page">
    <div class="page-header">
      <h2>会员管理</h2>
    </div>

    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon member-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ memberStore.memberList.length }}</div>
              <div class="stat-label">会员总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon high-risk-icon">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ memberStore.highRiskMembers.length }}</div>
              <div class="stat-label">高风险会员</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon credit-icon">
              <el-icon><Star /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ avgCreditScore }}</div>
              <div class="stat-label">平均信用分</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon reduction-icon">
              <el-icon><Wallet /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ totalDeductions }}</div>
              <div class="stat-label">累计扣减金额</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="会员姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable @input="handleSearch" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable @input="handleSearch" />
        </el-form-item>
        <el-form-item label="信用等级">
          <el-select v-model="searchForm.creditLevel" placeholder="全部" clearable @change="handleSearch">
            <el-option label="S级 - 信用极佳" value="S" />
            <el-option label="A级 - 信用良好" value="A" />
            <el-option label="B级 - 信用一般" value="B" />
            <el-option label="C级 - 信用较低" value="C" />
            <el-option label="D级 - 信用极低" value="D" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table
        :data="filteredMembers"
        v-loading="memberStore.loading"
        stripe
        border
      >
        <el-table-column label="会员信息" width="200">
          <template #default="{ row }">
            <div class="member-info">
              <div class="member-name">{{ row.name }}</div>
              <div class="member-phone">{{ row.phone }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="信用等级" width="120">
          <template #default="{ row }">
            <el-tag :type="getCreditLevelType(row.creditLevel)" effect="dark">
              {{ row.creditLevel }}级
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="信用分" width="120">
          <template #default="{ row }">
            <div class="credit-score">
              <el-progress
                :percentage="row.creditScore"
                :color="getCreditScoreColor(row.creditScore)"
                :stroke-width="8"
              />
              <span class="score-text">{{ row.creditScore }}分</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="可用减免额度">
          <template #default="{ row }">
            <div>
              <span class="reduction-ratio">
                {{ getReductionRatio(row.creditLevel) }}
              </span>
              <el-tag v-if="!canUseReduction(row)" type="danger" size="small" style="margin-left: 8px">
                暂不可用
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="租赁统计" width="180">
          <template #default="{ row }">
            <div class="rental-stats">
              <span>总预约: {{ row.totalRentals }}</span>
              <span>已完成: {{ row.completedRentals }}</span>
            </div>
            <div class="rental-stats">
              <span>已取消: {{ row.cancelledRentals }}</span>
              <span>逾期: {{ row.lateReturns }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="累计扣减" width="120">
          <template #default="{ row }">
            <span :class="{ 'text-danger': row.totalDeductions > 0 }">
              ¥{{ row.totalDeductions }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="120">
          <template #default="{ row }">
            {{ row.createdAt }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleViewDetail(row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="detailVisible"
      title="会员详情"
      width="900px"
      @close="handleDetailClose"
    >
      <div v-if="memberStore.currentMemberDetail" class="member-detail">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="会员姓名">
            {{ memberStore.currentMemberDetail.member.name }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ memberStore.currentMemberDetail.member.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="注册时间">
            {{ memberStore.currentMemberDetail.member.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item label="信用等级">
            <el-tag :type="getCreditLevelType(memberStore.currentMemberDetail.member.creditLevel)" effect="dark">
              {{ memberStore.currentMemberDetail.member.creditLevel }}级 - {{ getCreditLevelLabel(memberStore.currentMemberDetail.member.creditLevel) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="信用分">
            {{ memberStore.currentMemberDetail.member.creditScore }}分
          </el-descriptions-item>
          <el-descriptions-item label="可用减免额度">
            {{ getReductionRatio(memberStore.currentMemberDetail.member.creditLevel) }}
            <el-tag v-if="!canUseReduction(memberStore.currentMemberDetail.member)" type="danger" size="small" style="margin-left: 8px">
              暂不可用
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="总预约数" :span="3">
            <div class="detail-stats">
              <span>总预约: <strong>{{ memberStore.currentMemberDetail.member.totalRentals }}</strong></span>
              <span>已完成: <strong>{{ memberStore.currentMemberDetail.member.completedRentals }}</strong></span>
              <span>已取消: <strong>{{ memberStore.currentMemberDetail.member.cancelledRentals }}</strong></span>
              <span>逾期归还: <strong>{{ memberStore.currentMemberDetail.member.lateReturns }}</strong></span>
              <span>累计扣减: <strong class="text-danger">¥{{ memberStore.currentMemberDetail.member.totalDeductions }}</strong></span>
            </div>
          </el-descriptions-item>
        </el-descriptions>

        <el-tabs v-model="activeTab" class="detail-tabs">
          <el-tab-pane label="信用变动记录" name="credit">
            <el-table :data="memberStore.currentMemberDetail.member.creditLogs" size="small">
              <el-table-column label="变动时间" prop="createdAt" width="120" />
              <el-table-column label="变动原因" prop="reason" />
              <el-table-column label="变动值" width="100">
                <template #default="{ row }">
                  <span :class="row.change >= 0 ? 'text-success' : 'text-danger'">
                    {{ row.change >= 0 ? '+' : '' }}{{ row.change }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="变动后分数" prop="afterScore" width="120" />
              <el-table-column label="关联类型" width="100">
                <template #default="{ row }">
                  <el-tag v-if="row.relatedType" size="small">
                    {{ getRelatedTypeLabel(row.relatedType) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="历史租赁记录" name="rentals">
            <el-table :data="memberStore.currentMemberDetail.rentals" size="small">
              <el-table-column label="租赁类型" width="100">
                <template #default="{ row }">
                  <el-tag v-if="row.isOutfitRental" type="success" size="small">套装</el-tag>
                  <el-tag v-else type="primary" size="small">单裙</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="名称">
                <template #default="{ row }">
                  {{ row.isOutfitRental ? row.outfitName : row.dressName }}
                </template>
              </el-table-column>
              <el-table-column label="租期" width="200">
                <template #default="{ row }">
                  {{ row.startDate }} 至 {{ row.endDate }} ({{ row.totalDays }}天)
                </template>
              </el-table-column>
              <el-table-column label="押金" width="100">
                <template #default="{ row }">¥{{ row.deposit }}</template>
              </el-table-column>
              <el-table-column label="总金额" width="100">
                <template #default="{ row }">¥{{ row.totalPrice }}</template>
              </el-table-column>
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)" size="small">
                    {{ getStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="归还记录" name="returns">
            <el-table :data="memberStore.currentMemberDetail.returns" size="small">
              <el-table-column label="归还日期" prop="returnDate" width="120" />
              <el-table-column label="服装名称">
                <template #default="{ row }">
                  {{ row.isOutfitReturn ? row.outfitName : row.dressName }}
                </template>
              </el-table-column>
              <el-table-column label="是否逾期" width="80">
                <template #default="{ row }">
                  <el-tag v-if="row.isLate" type="danger" size="small">是</el-tag>
                  <el-tag v-else type="success" size="small">否</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="配件完整" width="80">
                <template #default="{ row }">
                  <el-tag v-if="row.accessoriesComplete" type="success" size="small">是</el-tag>
                  <el-tag v-else type="warning" size="small">否</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="总扣减" width="100">
                <template #default="{ row }">
                  <span class="text-danger">¥{{ row.totalDeduction }}</span>
                </template>
              </el-table-column>
              <el-table-column label="退款金额" width="100">
                <template #default="{ row }">¥{{ row.refundAmount }}</template>
              </el-table-column>
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'disputed' ? 'warning' : 'success'" size="small">
                    {{ row.status === 'disputed' ? '争议中' : '已完成' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="争议记录" name="disputes">
            <el-table :data="memberStore.currentMemberDetail.disputes" size="small">
              <el-table-column label="创建时间" prop="createdAt" width="120" />
              <el-table-column label="服装名称">
                <template #default="{ row }">
                  {{ row.isOutfitDispute ? row.outfitName : row.dressName }}
                </template>
              </el-table-column>
              <el-table-column label="触发原因">
                <template #default="{ row }">
                  <div v-for="reason in row.triggerReasons" :key="reason.type" class="dispute-reason">
                    {{ reason.description }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="原扣减" width="100">
                <template #default="{ row }">¥{{ row.originalTotalDeduction }}</template>
              </el-table-column>
              <el-table-column label="现退款" width="100">
                <template #default="{ row }">¥{{ row.currentRefundAmount }}</template>
              </el-table-column>
              <el-table-column label="复核状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getDisputeStatusType(row.reviewStatus)" size="small">
                    {{ getDisputeStatusText(row.reviewStatus) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="押金扣减记录" name="deductions">
            <el-table :data="memberStore.currentMemberDetail.member.deductionRecords" size="small">
              <el-table-column label="扣减时间" prop="createdAt" width="120" />
              <el-table-column label="关联租赁" width="100" prop="rentalId" />
              <el-table-column label="原始押金" width="100">
                <template #default="{ row }">¥{{ row.originalDeposit }}</template>
              </el-table-column>
              <el-table-column label="扣减金额" width="100">
                <template #default="{ row }">
                  <span class="text-danger">¥{{ row.deductionAmount }}</span>
                </template>
              </el-table-column>
              <el-table-column label="退款金额" width="100">
                <template #default="{ row }">¥{{ row.refundAmount }}</template>
              </el-table-column>
              <el-table-column label="扣减原因" prop="reason" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Warning, Star, Wallet } from '@element-plus/icons-vue'
import { useMemberStore } from '../stores/member'
import type { Member, CreditLevel } from '../types'

const memberStore = useMemberStore()

const searchForm = reactive({
  name: '',
  phone: '',
  creditLevel: ''
})

const detailVisible = ref(false)
const activeTab = ref('credit')

const filteredMembers = computed(() => {
  return memberStore.memberList.filter((member) => {
    if (searchForm.name && !member.name.includes(searchForm.name)) return false
    if (searchForm.phone && !member.phone.includes(searchForm.phone)) return false
    if (searchForm.creditLevel && member.creditLevel !== searchForm.creditLevel) return false
    return true
  })
})

const avgCreditScore = computed(() => {
  if (memberStore.memberList.length === 0) return '0.0'
  const sum = memberStore.memberList.reduce((acc, m) => acc + m.creditScore, 0)
  return (sum / memberStore.memberList.length).toFixed(1)
})

const totalDeductions = computed(() => {
  return memberStore.memberList.reduce((acc, m) => acc + m.totalDeductions, 0)
})

function getCreditLevelType(level: CreditLevel) {
  const map: Record<CreditLevel, string> = {
    S: 'success',
    A: 'primary',
    B: 'warning',
    C: 'danger',
    D: 'info'
  }
  return map[level] || 'info'
}

function getCreditLevelLabel(level: CreditLevel) {
  const map: Record<CreditLevel, string> = {
    S: '信用极佳',
    A: '信用良好',
    B: '信用一般',
    C: '信用较低',
    D: '信用极低'
  }
  return map[level] || ''
}

function getCreditScoreColor(score: number) {
  if (score >= 90) return '#67c23a'
  if (score >= 70) return '#409eff'
  if (score >= 50) return '#e6a23c'
  if (score >= 30) return '#f56c6c'
  return '#909399'
}

function getReductionRatio(level: CreditLevel) {
  const map: Record<CreditLevel, string> = {
    S: '减免50%',
    A: '减免30%',
    B: '减免15%（需人工审核）',
    C: '不可减免',
    D: '不可减免'
  }
  return map[level] || ''
}

function canUseReduction(member: Member) {
  if (member.creditLevel === 'C' || member.creditLevel === 'D') return false
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  const recentHighDeduction = member.deductionRecords.some(
    (d) => new Date(d.createdAt) >= threeMonthsAgo && d.deductionAmount > 200
  )
  return !recentHighDeduction
}

function getRelatedTypeLabel(type: string) {
  const map: Record<string, string> = {
    rental: '预约',
    return: '归还',
    dispute: '争议'
  }
  return map[type] || ''
}

function getStatusType(status: string) {
  const map: Record<string, string> = {
    pending: 'warning',
    confirmed: 'primary',
    in_progress: 'success',
    completed: 'info',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

function getDisputeStatusType(status: string) {
  const map: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

function getDisputeStatusText(status: string) {
  const map: Record<string, string> = {
    pending: '待复核',
    approved: '已通过',
    rejected: '已驳回'
  }
  return map[status] || status
}

function handleSearch() {}

function handleReset() {
  searchForm.name = ''
  searchForm.phone = ''
  searchForm.creditLevel = ''
}

async function handleViewDetail(row: Member) {
  try {
    await memberStore.fetchMemberDetail(row.id)
    detailVisible.value = true
  } catch (e) {
    ElMessage.error('获取会员详情失败')
  }
}

function handleDetailClose() {
  memberStore.clearCurrent()
  activeTab.value = 'credit'
}

onMounted(() => {
  memberStore.fetchMemberList()
})
</script>

<style scoped>
.member-page {
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

.member-icon {
  background: linear-gradient(135deg, #409eff, #79bbff);
}

.high-risk-icon {
  background: linear-gradient(135deg, #f56c6c, #fab6b6);
}

.credit-icon {
  background: linear-gradient(135deg, #e6a23c, #f3d19e);
}

.reduction-icon {
  background: linear-gradient(135deg, #67c23a, #95d475);
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

.search-card,
.table-card {
  border-radius: 8px;
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.member-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.member-phone {
  font-size: 12px;
  color: #909399;
}

.credit-score {
  display: flex;
  align-items: center;
  gap: 8px;
}

.credit-score .score-text {
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
}

.reduction-ratio {
  font-weight: 500;
  color: #67c23a;
}

.rental-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
}

.rental-stats:last-child {
  margin-bottom: 0;
}

.text-danger {
  color: #f56c6c;
  font-weight: 500;
}

.text-success {
  color: #67c23a;
  font-weight: 500;
}

.member-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.detail-tabs {
  margin-top: 20px;
}

.dispute-reason {
  font-size: 12px;
  color: #606266;
  margin-bottom: 2px;
}

.dispute-reason:last-child {
  margin-bottom: 0;
}
</style>
