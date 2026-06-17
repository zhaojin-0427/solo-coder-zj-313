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
        <el-table-column prop="dressName" label="裙子名称" width="150" />
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
      width="650px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="110px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="选择裙子" prop="dressId">
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
        <el-button type="primary" @click="handleSubmit">提交预约</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="预约详情" width="550px">
      <el-descriptions v-if="currentDetail" :column="2" border>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentDetail.status)">
            {{ getStatusText(currentDetail.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="裙子名称">{{ currentDetail.dressName }}</el-descriptions-item>
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
import { calculateFitRisk } from '../api/rental'
import type { Rental, FitRiskAssessment, CreateRentalRequest } from '../types'

const rentalStore = useRentalStore()
const dressStore = useDressStore()

const searchForm = reactive({
  status: ''
})

const dialogVisible = ref(false)
const detailVisible = ref(false)
const formRef = ref<FormInstance>()
const dateRange = ref<string[]>([])
const currentDetail = ref<Rental | null>(null)

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
  userInfo: { ...defaultUserInfo },
  startDate: '',
  endDate: '',
  totalDays: 0,
  totalPrice: 0,
  deposit: 0,
  status: 'pending' as const
})

const formRules: FormRules = {
  dressId: [{ required: true, message: '请选择裙子', trigger: 'change' }],
  'userInfo.name': [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
  'userInfo.phone': [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  'userInfo.height': [{ required: true, message: '请输入身高', trigger: 'blur' }],
  'userInfo.weight': [{ required: true, message: '请输入体重', trigger: 'blur' }],
  'userInfo.usageScenario': [{ required: true, message: '请选择使用场景', trigger: 'change' }]
}

const availableDresses = computed(() => {
  return dressStore.dressList.filter((d) => d.status === 'available')
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

function handleDressChange(dressId: string) {
  const dress = dressStore.dressList.find((d) => d.id === dressId)
  if (dress) {
    formData.dressName = dress.name
    formData.deposit = dress.deposit
    calculateTotalPrice()
    calculateRisk()
  }
}

function handleDateChange() {
  if (dateRange.value && dateRange.value.length === 2) {
    formData.startDate = dateRange.value[0]
    formData.endDate = dateRange.value[1]
    calculateTotalPrice()
  }
}

function calculateTotalPrice() {
  const dress = dressStore.dressList.find((d) => d.id === formData.dressId)
  if (dress && dateRange.value && dateRange.value.length === 2) {
    const start = new Date(dateRange.value[0])
    const end = new Date(dateRange.value[1])
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    formData.totalDays = days
    formData.totalPrice = days * dress.dailyPrice
  }
}

async function calculateRisk() {
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

function resetForm() {
  formData.dressId = ''
  formData.dressName = ''
  formData.userInfo = { ...defaultUserInfo }
  formData.startDate = ''
  formData.endDate = ''
  formData.totalDays = 0
  formData.totalPrice = 0
  formData.deposit = 0
  formData.status = 'pending'
  dateRange.value = []
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
      
      const submitData: CreateRentalRequest = {
        dressId: formData.dressId,
        userInfo: { ...formData.userInfo },
        startDate: formData.startDate,
        endDate: formData.endDate
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
</style>
