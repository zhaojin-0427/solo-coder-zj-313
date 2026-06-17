<template>
  <div class="rental-page">
    <div class="page-header">
      <h2>租赁预约</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增预约
      </el-button>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable @change="handleSearch">
            <el-option label="待确认" value="pending" />
            <el-option label="已确认" value="confirmed" />
            <el-option label="进行中" value="in_progress" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
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
        :data="rentalStore.rentalList"
        v-loading="rentalStore.loading"
        stripe
        border
      >
        <el-table-column label="类型" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.isOutfitRental" type="success" effect="dark">套装租赁</el-tag>
            <el-tag v-else type="primary">单裙租赁</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="名称" width="200">
          <template #default="{ row }">
            <template v-if="row.isOutfitRental">
              <div>{{ row.outfitName }}</div>
              <div style="color: #909399; font-size: 12px">包含{{ row.outfitItems?.length || 0 }}件单品</div>
            </template>
            <template v-else>
              {{ row.dressName }}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" width="180">
          <template #default="{ row }">
            <div>{{ row.userInfo?.name }}</div>
            <div style="color: #909399; font-size: 12px">{{ row.userInfo?.phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="身高/体重" width="120">
          <template #default="{ row }">
            {{ row.userInfo?.height }}cm / {{ row.userInfo?.weight }}kg
          </template>
        </el-table-column>
        <el-table-column label="使用场景" width="120">
          <template #default="{ row }">
            {{ row.userInfo?.usageScenario }}
          </template>
        </el-table-column>
        <el-table-column label="租期" width="200">
          <template #default="{ row }">
            {{ row.startDate }} 至 {{ row.endDate }}
            <div style="color: #909399; font-size: 12px">共{{ row.totalDays }}天</div>
          </template>
        </el-table-column>
        <el-table-column label="合身风险" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.fitRiskAssessment" :type="getRiskType(row.fitRiskAssessment.riskLevel)" effect="dark">
              {{ getRiskText(row.fitRiskAssessment.riskLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="总金额" width="100">
          <template #default="{ row }">
            ¥{{ row.totalPrice }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">详情</el-button>
            <el-button v-if="row.status === 'pending'" link type="success" size="small" @click="handleConfirm(row)">确认</el-button>
            <el-button v-if="row.status === 'in_progress'" link type="warning" size="small" @click="handleComplete(row)">完成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="新增预约"
      width="750px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="110px"
      >
        <el-form-item label="预约类型">
          <el-radio-group v-model="isOutfitRental" @change="handleRentalTypeChange">
            <el-radio-button :value="false">单裙预约</el-radio-button>
            <el-radio-button :value="true">套装预约</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item v-if="!isOutfitRental" label="选择裙子" prop="dressId">
              <el-select
                v-model="formData.dressId"
                placeholder="请选择裙子"
                style="width: 100%"
                @change="handleDressChange"
              >
                <el-option
                  v-for="dress in availableDresses"
                  :key="dress.id"
                  :label="dress.name + ' - ' + dress.size + '码'"
                  :value="dress.id"
                />
              </el-select>
            </el-form-item>
            <el-alert
              v-if="!isOutfitRental && selectedDressConsignmentLocked"
              title="该裙子正在寄售中且已被锁定（协商中或已售出），无法用于租赁预约"
              type="warning"
              :closable="false"
              show-icon
              style="margin-bottom: 12px"
            />
            <el-form-item v-if="isOutfitRental" label="选择套装" prop="outfitId">
              <el-select
                v-model="formData.outfitId"
                placeholder="请选择搭配方案"
                style="width: 100%"
                @change="handleOutfitChange"
              >
                <el-option
                  v-for="outfit in availableOutfits"
                  :key="outfit.id"
                  :label="outfit.themeName + ' - ' + outfit.applicableScenario"
                  :value="outfit.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用场景" prop="userInfo.usageScenario">
              <el-select v-model="formData.userInfo.usageScenario" placeholder="请选择" style="width: 100%">
                <el-option label="漫展" value="漫展" />
                <el-option label="生日派对" value="生日派对" />
                <el-option label="婚纱照" value="婚纱照" />
                <el-option label="日常出街" value="日常出街" />
                <el-option label="约会" value="约会" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider v-if="isOutfitRental && selectedOutfit" content-position="left">套装单品</el-divider>
        <div v-if="isOutfitRental && selectedOutfit" class="outfit-items-section">
          <el-row :gutter="12">
            <el-col v-for="item in selectedOutfit.items" :key="item.id" :span="12">
              <el-card class="outfit-item-card" :class="{ 'item-unavailable': item.status !== 'available' }">
                <div class="item-header">
                  <span class="item-type">{{ item.typeName }}</span>
                  <el-tag v-if="item.isCore" type="danger" effect="dark" size="small">核心单品</el-tag>
                  <el-tag v-if="item.status !== 'available'" type="info" size="small">{{ getItemStatusText(item.status) }}</el-tag>
                </div>
                <div class="item-name">{{ item.name }}</div>
                <div class="item-info">
                  <span>押金: ¥{{ item.deposit }}</span>
                  <span>日租: ¥{{ item.dailyPrice }}</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="outfit-summary">
            <el-col :span="12">
              <el-form-item label="套装押金">
                <el-input :model-value="formData.deposit" disabled>
                  <template #prepend>¥</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="套装日租">
                <el-input :model-value="selectedOutfit?.totalDailyPrice || 0" disabled>
                  <template #prepend>¥</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-divider content-position="left">用户信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="userInfo.name">
              <el-input v-model="formData.userInfo.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="userInfo.phone">
              <el-input v-model="formData.userInfo.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="身高(cm)" prop="userInfo.height">
              <el-input-number v-model="formData.userInfo.height" :min="140" :max="190" style="width: 100%" @change="calculateRisk" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="体重(kg)" prop="userInfo.weight">
              <el-input-number v-model="formData.userInfo.weight" :min="30" :max="100" style="width: 100%" @change="calculateRisk" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="试穿偏好" prop="userInfo.tryOnPreference">
              <el-input v-model="formData.userInfo.tryOnPreference" placeholder="宽松/修身等" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="胸围" prop="userInfo.bust">
              <el-input-number v-model="formData.userInfo.bust" :min="60" :max="120" style="width: 100%" @change="calculateRisk" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="腰围" prop="userInfo.waist">
              <el-input-number v-model="formData.userInfo.waist" :min="50" :max="110" style="width: 100%" @change="calculateRisk" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="臀围" prop="userInfo.hip">
              <el-input-number v-model="formData.userInfo.hip" :min="70" :max="130" style="width: 100%" @change="calculateRisk" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">租赁信息</el-divider>
        <el-form-item label="租赁日期" prop="dateRange">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
            @change="handleDateChange"
          />
        </el-form-item>

        <el-alert
          v-if="isOutfitRental && availabilityCheckResult && !availabilityCheckResult.isAvailable"
          title="可用性检查"
          type="error"
          :closable="false"
          show-icon
        >
          <div v-if="unavailableCoreItems.length > 0" style="margin-bottom: 8px">
            <strong>不可用核心单品：</strong>
            <el-tag v-for="item in unavailableCoreItems" :key="item.id" type="danger" size="small" style="margin-right: 5px">
              {{ item.name }}
            </el-tag>
          </div>
          <div v-if="availabilityCheckResult.conflictingSlots.length > 0" style="margin-bottom: 8px">
            <strong>档期冲突：</strong>
            <div v-for="(slot, index) in availabilityCheckResult.conflictingSlots" :key="index" style="font-size: 12px; color: #606266">
              {{ slot.startDate }} 至 {{ slot.endDate }}
            </div>
          </div>
          <div v-if="availabilityCheckResult.messages.length > 0">
            <div v-for="(msg, index) in availabilityCheckResult.messages" :key="index" style="font-size: 12px">
              {{ msg }}
            </div>
          </div>
        </el-alert>

        <el-alert
          v-if="isOutfitRental && availabilityCheckResult && availabilityCheckResult.isAvailable"
          title="套装可用"
          type="success"
          :closable="false"
          show-icon
        >
          <div v-if="availabilityCheckResult.messages.length > 0">
            <div v-for="(msg, index) in availabilityCheckResult.messages" :key="index" style="font-size: 12px">
              {{ msg }}
            </div>
          </div>
        </el-alert>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="押金">
              <el-input :model-value="formData.deposit" disabled>
                <template #prepend>¥</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总金额">
              <el-input :model-value="formData.totalPrice" disabled>
                <template #prepend>¥</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-alert
          v-if="fitRiskAssessment.riskLevel !== 'low'"
          :title="'合身风险: ' + getRiskText(fitRiskAssessment.riskLevel)"
          :type="getRiskAlertType(fitRiskAssessment.riskLevel)"
          :description="fitRiskAssessment.factors.join('；')"
          show-icon
          :closable="false"
        />
        <el-form-item label="备注">
          <el-input
            v-model="formData.userInfo.notes"
            type="textarea"
            :rows="2"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :disabled="isSubmitDisabled">提交预约</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="预约详情" width="600px">
      <el-descriptions v-if="currentDetail" :column="2" border>
        <el-descriptions-item label="类型">
          <el-tag v-if="currentDetail.isOutfitRental" type="success" effect="dark">套装租赁</el-tag>
          <el-tag v-else type="primary">单裙租赁</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentDetail.status)">
            {{ getStatusText(currentDetail.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentDetail.isOutfitRental" label="套装名称">{{ currentDetail.outfitName }}</el-descriptions-item>
        <el-descriptions-item v-else label="裙子名称">{{ currentDetail.dressName }}</el-descriptions-item>
        <el-descriptions-item label="使用场景">{{ currentDetail.userInfo?.usageScenario }}</el-descriptions-item>
        <el-descriptions-item label="用户姓名">{{ currentDetail.userInfo?.name }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentDetail.userInfo?.phone }}</el-descriptions-item>
        <el-descriptions-item label="身高">{{ currentDetail.userInfo?.height }}cm</el-descriptions-item>
        <el-descriptions-item label="体重">{{ currentDetail.userInfo?.weight }}kg</el-descriptions-item>
        <el-descriptions-item label="胸围">{{ currentDetail.userInfo?.bust || '-' }}cm</el-descriptions-item>
        <el-descriptions-item label="腰围">{{ currentDetail.userInfo?.waist || '-' }}cm</el-descriptions-item>
        <el-descriptions-item label="臀围">{{ currentDetail.userInfo?.hip || '-' }}cm</el-descriptions-item>
        <el-descriptions-item label="试穿偏好">{{ currentDetail.userInfo?.tryOnPreference }}</el-descriptions-item>
        <el-descriptions-item label="开始日期">{{ currentDetail.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ currentDetail.endDate }}</el-descriptions-item>
        <el-descriptions-item label="总天数">{{ currentDetail.totalDays }}天</el-descriptions-item>
        <el-descriptions-item label="总金额">¥{{ currentDetail.totalPrice }}</el-descriptions-item>
        <el-descriptions-item label="押金">¥{{ currentDetail.deposit }}</el-descriptions-item>
        <el-descriptions-item label="合身风险" :span="2">
          <el-tag v-if="currentDetail.fitRiskAssessment" :type="getRiskType(currentDetail.fitRiskAssessment.riskLevel)">
            {{ getRiskText(currentDetail.fitRiskAssessment.riskLevel) }}
          </el-tag>
          <span v-if="currentDetail.fitRiskAssessment" style="margin-left: 10px">
            风险评分: {{ currentDetail.fitRiskAssessment.score }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentDetail.fitRiskAssessment?.factors?.length" label="风险因素" :span="2">
          {{ currentDetail.fitRiskAssessment.factors.join('；') }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentDetail.fitRiskAssessment?.suggestions?.length" label="建议" :span="2">
          {{ currentDetail.fitRiskAssessment.suggestions.join('；') }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentDetail.isOutfitRental && currentDetail.outfitItems?.length" label="套装单品" :span="2">
          <div v-for="item in currentDetail.outfitItems" :key="item.id" class="detail-outfit-item">
            <el-tag size="small" :type="item.isCore ? 'danger' : 'info'">{{ item.typeName }}</el-tag>
            <span style="margin-left: 8px">{{ item.name }}</span>
            <span style="margin-left: 8px; color: #909399">押金: ¥{{ item.deposit }} / 日租: ¥{{ item.dailyPrice }}</span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentDetail.userInfo?.notes" label="备注" :span="2">
          {{ currentDetail.userInfo.notes }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useRentalStore } from '../stores/rental'
import { useDressStore } from '../stores/dress'
import { useOutfitStore } from '../stores/outfit'
import { useConsignmentStore } from '../stores/consignment'
import { calculateFitRisk } from '../api/rental'
import { getOutfitFitRisk } from '../api/outfit'
import type { Rental, FitRiskAssessment, CreateRentalRequest, Outfit, OutfitAvailabilityCheckResult, OutfitItem } from '../types'

const rentalStore = useRentalStore()
const dressStore = useDressStore()
const outfitStore = useOutfitStore()
const consignmentStore = useConsignmentStore()

const searchForm = reactive({
  status: ''
})

const dialogVisible = ref(false)
const detailVisible = ref(false)
const formRef = ref<FormInstance>()
const dateRange = ref<string[]>([])
const currentDetail = ref<Rental | null>(null)
const isOutfitRental = ref(false)
const availabilityCheckResult = ref<OutfitAvailabilityCheckResult | null>(null)

const fitRiskAssessment = reactive<FitRiskAssessment>({
  riskLevel: 'low',
  score: 0,
  factors: [],
  suggestions: []
})

const defaultUserInfo = {
  name: '',
  phone: '',
  height: 160,
  weight: 50,
  bust: 85,
  waist: 68,
  hip: 90,
  tryOnPreference: '',
  usageScenario: '',
  notes: ''
}

const formData = reactive({
  dressId: '',
  dressName: '',
  outfitId: '',
  outfitName: '',
  userInfo: { ...defaultUserInfo },
  startDate: '',
  endDate: '',
  totalDays: 0,
  totalPrice: 0,
  deposit: 0,
  status: 'pending' as const
})

const formRules = computed<FormRules>(() => {
  const baseRules: FormRules = {
    'userInfo.name': [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
    'userInfo.phone': [
      { required: true, message: '请输入联系电话', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    'userInfo.height': [{ required: true, message: '请输入身高', trigger: 'blur' }],
    'userInfo.weight': [{ required: true, message: '请输入体重', trigger: 'blur' }],
    'userInfo.usageScenario': [{ required: true, message: '请选择使用场景', trigger: 'change' }]
  }

  if (isOutfitRental.value) {
    baseRules.outfitId = [{ required: true, message: '请选择搭配方案', trigger: 'change' }]
  } else {
    baseRules.dressId = [{ required: true, message: '请选择裙子', trigger: 'change' }]
  }

  return baseRules
})

const availableDresses = computed(() => {
  return dressStore.dressList.filter((d) => {
    if (d.status !== 'available') return false
    if (d.saleType === 'consignment') {
      const locked = consignmentStore.consignmentList.some(
        (c) => c.dressId === d.id && (c.status === 'sold' || c.status === 'negotiating')
      )
      if (locked) return false
    }
    return true
  })
})

const selectedDressConsignmentLocked = computed(() => {
  if (!formData.dressId) return false
  const dress = dressStore.dressList.find((d) => d.id === formData.dressId)
  if (!dress || dress.saleType !== 'consignment') return false
  return consignmentStore.consignmentList.some(
    (c) => c.dressId === dress.id && (c.status === 'sold' || c.status === 'negotiating')
  )
})

const availableOutfits = computed(() => {
  return outfitStore.activeOutfits
})

const selectedOutfit = computed<Outfit | null>(() => {
  if (!formData.outfitId) return null
  return outfitStore.outfitList.find((o) => o.id === formData.outfitId) || null
})

const unavailableCoreItems = computed<OutfitItem[]>(() => {
  if (!availabilityCheckResult.value) return []
  return availabilityCheckResult.value.unavailableItems.filter((item) => item.isCore)
})

const isSubmitDisabled = computed(() => {
  if (isOutfitRental.value && availabilityCheckResult.value) {
    return unavailableCoreItems.value.length > 0
  }
  return false
})

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

function getRiskType(risk: string) {
  const map: Record<string, string> = {
    low: 'success',
    medium: 'warning',
    high: 'danger'
  }
  return map[risk] || 'info'
}

function getRiskText(risk: string) {
  const map: Record<string, string> = {
    low: '低风险',
    medium: '中风险',
    high: '高风险'
  }
  return map[risk] || risk
}

function getRiskAlertType(risk: string) {
  const map: Record<string, string> = {
    low: 'success',
    medium: 'warning',
    high: 'error'
  }
  return map[risk] || 'info'
}

function getItemStatusText(status: string) {
  const map: Record<string, string> = {
    available: '可用',
    rented: '已出租',
    cleaning: '清洁中',
    maintenance: '维护中'
  }
  return map[status] || status
}

function handleSearch() {
  rentalStore.fetchRentalList({
    status: searchForm.status || undefined
  })
}

function handleReset() {
  searchForm.status = ''
  rentalStore.fetchRentalList()
}

function handleAdd() {
  resetForm()
  dialogVisible.value = true
}

function handleView(row: Rental) {
  currentDetail.value = row
  detailVisible.value = true
}

function handleConfirm(row: Rental) {
  rentalStore.updateRentalItem(row.id, { status: 'confirmed' })
  ElMessage.success('已确认预约')
}

function handleComplete(row: Rental) {
  rentalStore.updateRentalItem(row.id, { status: 'completed' })
  ElMessage.success('已完成预约')
}

function handleRentalTypeChange() {
  formData.dressId = ''
  formData.dressName = ''
  formData.outfitId = ''
  formData.outfitName = ''
  formData.deposit = 0
  formData.totalPrice = 0
  formData.totalDays = 0
  dateRange.value = []
  availabilityCheckResult.value = null
  outfitStore.clearCurrent()
  Object.assign(fitRiskAssessment, {
    riskLevel: 'low',
    score: 0,
    factors: [],
    suggestions: []
  })
  formRef.value?.clearValidate()
}

function handleDressChange(dressId: string) {
  const dress = dressStore.dressList.find((d) => d.id === dressId)
  if (dress) {
    formData.dressName = dress.name
    formData.deposit = dress.deposit
    calculateTotalPrice()
    calculateRisk()
  }
}

function handleOutfitChange(outfitId: string) {
  const outfit = outfitStore.outfitList.find((o) => o.id === outfitId)
  if (outfit) {
    formData.outfitName = outfit.themeName
    formData.deposit = outfit.totalDeposit
    calculateTotalPrice()
    calculateRisk()
    checkOutfitAvailability()
  }
}

async function checkOutfitAvailability() {
  if (!formData.outfitId || !dateRange.value || dateRange.value.length !== 2) {
    availabilityCheckResult.value = null
    return
  }

  try {
    const result = await outfitStore.checkAvailability(formData.outfitId, {
      startDate: dateRange.value[0],
      endDate: dateRange.value[1]
    })
    availabilityCheckResult.value = result
  } catch (e) {
    console.error('检查套装可用性失败', e)
    ElMessage.error('检查套装可用性失败')
  }
}

function handleDateChange() {
  if (dateRange.value && dateRange.value.length === 2) {
    formData.startDate = dateRange.value[0]
    formData.endDate = dateRange.value[1]
    calculateTotalPrice()

    if (isOutfitRental.value && formData.outfitId) {
      checkOutfitAvailability()
    }
  }
}

function calculateTotalPrice() {
  if (isOutfitRental.value) {
    const outfit = selectedOutfit.value
    if (outfit && dateRange.value && dateRange.value.length === 2) {
      const start = new Date(dateRange.value[0])
      const end = new Date(dateRange.value[1])
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      formData.totalDays = days
      formData.totalPrice = days * outfit.totalDailyPrice
    }
  } else {
    const dress = dressStore.dressList.find((d) => d.id === formData.dressId)
    if (dress && dateRange.value && dateRange.value.length === 2) {
      const start = new Date(dateRange.value[0])
      const end = new Date(dateRange.value[1])
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      formData.totalDays = days
      formData.totalPrice = days * dress.dailyPrice
    }
  }
}

async function calculateRisk() {
  if (isOutfitRental.value) {
    if (!formData.outfitId) return

    try {
      const result = await getOutfitFitRisk(formData.outfitId, {
        height: formData.userInfo.height,
        bust: formData.userInfo.bust,
        waist: formData.userInfo.waist,
        hip: formData.userInfo.hip
      })
      Object.assign(fitRiskAssessment, result)
    } catch (e) {
      console.error('计算套装合身风险失败', e)
    }
  } else {
    if (!formData.dressId) return

    try {
      const result = await calculateFitRisk(formData.dressId, {
        height: formData.userInfo.height,
        weight: formData.userInfo.weight,
        bust: formData.userInfo.bust,
        waist: formData.userInfo.waist,
        hip: formData.userInfo.hip
      })
      Object.assign(fitRiskAssessment, result)
    } catch (e) {
      console.error('计算合身风险失败', e)
    }
  }
}

function resetForm() {
  isOutfitRental.value = false
  formData.dressId = ''
  formData.dressName = ''
  formData.outfitId = ''
  formData.outfitName = ''
  formData.userInfo = { ...defaultUserInfo }
  formData.startDate = ''
  formData.endDate = ''
  formData.totalDays = 0
  formData.totalPrice = 0
  formData.deposit = 0
  formData.status = 'pending'
  dateRange.value = []
  availabilityCheckResult.value = null
  outfitStore.clearCurrent()
  Object.assign(fitRiskAssessment, {
    riskLevel: 'low',
    score: 0,
    factors: [],
    suggestions: []
  })
  formRef.value?.resetFields()
}

function handleDialogClose() {
  resetForm()
}

async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (!formData.startDate || !formData.endDate) {
        ElMessage.warning('请选择租赁日期')
        return
      }

      if (isOutfitRental.value && isSubmitDisabled.value) {
        ElMessage.warning('存在不可用的核心单品，无法提交预约')
        return
      }

      const submitData: CreateRentalRequest = {
        isOutfitRental: isOutfitRental.value,
        userInfo: { ...formData.userInfo },
        startDate: formData.startDate,
        endDate: formData.endDate
      }

      if (isOutfitRental.value) {
        submitData.outfitId = formData.outfitId
      } else {
        submitData.dressId = formData.dressId
      }

      await rentalStore.addNewRental(submitData)
      ElMessage.success('预约提交成功')
      dialogVisible.value = false
    }
  })
}

onMounted(() => {
  rentalStore.fetchRentalList()
  dressStore.fetchDressList()
  outfitStore.fetchOutfitList()
  consignmentStore.fetchConsignmentList()
})
</script>

<style scoped>
.rental-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  font-size: 20px;
  color: #303133;
  margin: 0;
}

.search-card,
.table-card {
  border-radius: 8px;
}

.outfit-items-section {
  margin-bottom: 16px;
}

.outfit-item-card {
  margin-bottom: 12px;
  padding: 12px;
}

.outfit-item-card.item-unavailable {
  opacity: 0.6;
  border: 1px solid #e4e7ed;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.item-type {
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.item-info {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #606266;
}

.outfit-summary {
  margin-top: 12px;
}

.detail-outfit-item {
  padding: 6px 0;
  font-size: 13px;
  border-bottom: 1px dashed #e4e7ed;
}

.detail-outfit-item:last-child {
  border-bottom: none;
}
</style>
