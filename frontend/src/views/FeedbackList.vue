<template>
  <div class="fitting-page">
    <div class="page-header">
      <h2>试穿反馈</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增反馈
      </el-button>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="裙子">
          <el-select v-model="searchForm.dressId" placeholder="全部裙子" clearable @change="handleSearch">
            <el-option
              v-for="dress in dressStore.dressList"
              :key="dress.id"
              :label="dress.name"
              :value="dress.id"
            />
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
        :data="fittingStore.fittingList"
        v-loading="fittingStore.loading"
        stripe
        border
      >
        <el-table-column prop="dressName" label="裙子名称" width="150" />
        <el-table-column prop="userName" label="用户" width="120" />
        <el-table-column label="综合评分" width="150">
          <template #default="{ row }">
            <el-rate :model-value="row.overallScore" disabled show-text />
          </template>
        </el-table-column>
        <el-table-column label="合身度" width="120">
          <template #default="{ row }">
            <el-rate :model-value="row.fitScore" disabled />
          </template>
        </el-table-column>
        <el-table-column label="质量" width="120">
          <template #default="{ row }">
            <el-rate :model-value="row.qualityScore" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="评价" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="反馈时间" width="180" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="新增反馈"
      width="550px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="选择预约" prop="rentalId">
          <el-select
            v-model="formData.rentalId"
            placeholder="请选择已完成的预约"
            style="width: 100%"
            @change="handleRentalChange"
          >
            <el-option
              v-for="r in completedRentals"
              :key="r.id"
              :label="r.dressName + ' - ' + r.userInfo?.name"
              :value="r.id"
            />
          </el-select>
        </el-form-item>
        <el-divider content-position="left">评分</el-divider>
        <el-form-item label="综合评分" prop="overallScore">
          <el-rate v-model="formData.overallScore" show-text />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合身度" prop="fitScore">
              <el-rate v-model="formData.fitScore" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质量" prop="qualityScore">
              <el-rate v-model="formData.qualityScore" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="评价内容" prop="comment">
          <el-input
            v-model="formData.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入试穿评价"
          />
        </el-form-item>
        <el-form-item label="建议" prop="suggestions">
          <el-input
            v-model="formData.suggestions"
            type="textarea"
            :rows="3"
            placeholder="请输入改进建议"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交反馈</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="反馈详情" width="550px">
      <el-descriptions v-if="currentDetail" :column="2" border>
        <el-descriptions-item label="裙子名称">{{ currentDetail.dressName }}</el-descriptions-item>
        <el-descriptions-item label="用户">{{ currentDetail.userName }}</el-descriptions-item>
        <el-descriptions-item label="反馈时间" :span="2">{{ currentDetail.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="综合评分" :span="2">
          <el-rate :model-value="currentDetail.overallScore" disabled show-text />
        </el-descriptions-item>
        <el-descriptions-item label="合身度">
          <el-rate :model-value="currentDetail.fitScore" disabled />
        </el-descriptions-item>
        <el-descriptions-item label="质量">
          <el-rate :model-value="currentDetail.qualityScore" disabled />
        </el-descriptions-item>
        <el-descriptions-item label="评价" :span="2">
          {{ currentDetail.comment }}
        </el-descriptions-item>
        <el-descriptions-item label="建议" :span="2">
          {{ currentDetail.suggestions || '无' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useFittingStore } from '../stores/fitting'
import { useRentalStore } from '../stores/rental'
import { useDressStore } from '../stores/dress'
import type { Fitting } from '../types'

const fittingStore = useFittingStore()
const rentalStore = useRentalStore()
const dressStore = useDressStore()

const searchForm = reactive({
  dressId: ''
})

const dialogVisible = ref(false)
const detailVisible = ref(false)
const formRef = ref<FormInstance>()
const currentDetail = ref<Fitting | null>(null)

const formData = reactive<Partial<Fitting>>({
  rentalId: '',
  dressId: '',
  dressName: '',
  userName: '',
  fitScore: 5,
  qualityScore: 5,
  overallScore: 5,
  comment: '',
  suggestions: ''
})

const formRules: FormRules = {
  rentalId: [{ required: true, message: '请选择预约订单', trigger: 'change' }],
  overallScore: [{ required: true, message: '请给出综合评分', trigger: 'change' }],
  comment: [{ required: true, message: '请输入评价内容', trigger: 'blur' }]
}

const completedRentals = computed(() => {
  return rentalStore.rentalList.filter((r) => r.status === 'completed')
})

function handleSearch() {
  fittingStore.fetchFittingList({
    dressId: searchForm.dressId || undefined
  })
}

function handleReset() {
  searchForm.dressId = ''
  fittingStore.fetchFittingList()
}

function handleAdd() {
  resetForm()
  dialogVisible.value = true
}

function handleView(row: Fitting) {
  currentDetail.value = row
  detailVisible.value = true
}

function handleRentalChange(rentalId: string) {
  const rental = rentalStore.rentalList.find((r) => r.id === rentalId)
  if (rental) {
    formData.dressId = rental.dressId
    formData.dressName = rental.dressName
    formData.userName = rental.userInfo?.name || ''
  }
}

function resetForm() {
  Object.assign(formData, {
    rentalId: '',
    dressId: '',
    dressName: '',
    userName: '',
    fitScore: 5,
    qualityScore: 5,
    overallScore: 5,
    comment: '',
    suggestions: ''
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
      await fittingStore.addNewFitting(formData as Omit<Fitting, 'id' | 'createdAt'>)
      ElMessage.success('反馈提交成功')
      dialogVisible.value = false
    }
  })
}

onMounted(() => {
  fittingStore.fetchFittingList()
  rentalStore.fetchRentalList()
  dressStore.fetchDressList()
})
</script>

<style scoped>
.fitting-page {
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
