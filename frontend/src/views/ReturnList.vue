<template>
  <div class="return-page">
    <div class="page-header">
      <h2>归还验收</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增归还
      </el-button>
    </div>

    <el-card class="table-card">
      <el-table
        :data="returnStore.returnList"
        v-loading="returnStore.loading"
        stripe
        border
      >
        <el-table-column prop="dressName" label="裙子名称" width="150" />
        <el-table-column prop="returnDate" label="归还日期" width="120" />
        <el-table-column label="配件情况" width="120">
          <template #default="{ row }">
            <el-tag :type="getAccessoriesStatusType(row.accessories)">
              {{ getAccessoriesStatusText(row.accessories) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="洗护状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getCleaningStatusType(row.cleaningStatus)">
              {{ getCleaningStatusText(row.cleaningStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="洗护费用" width="100">
          <template #default="{ row }">
            ¥{{ row.cleaningCost }}
          </template>
        </el-table-column>
        <el-table-column label="损坏扣减" width="100">
          <template #default="{ row }">
            <span :class="{ 'text-red': row.damageDeduction > 0 }">
              ¥{{ row.damageDeduction }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="总扣减" width="100">
          <template #default="{ row }">
            <span class="text-red">
              ¥{{ row.totalDeduction }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="退款金额" width="100">
          <template #default="{ row }">
            ¥{{ row.refundAmount }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="新增归还记录"
      width="650px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="110px"
      >
        <el-form-item label="选择预约" prop="rentalId">
          <el-select
            v-model="formData.rentalId"
            placeholder="请选择进行中的预约"
            style="width: 100%"
            @change="handleRentalChange"
          >
            <el-option
              v-for="r in inProgressRentals"
              :key="r.id"
              :label="r.dressName + ' - ' + r.userInfo?.name"
              :value="r.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="归还日期" prop="returnDate">
          <el-date-picker
            v-model="formData.returnDate"
            type="date"
            placeholder="请选择归还日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-divider content-position="left">配件核对</el-divider>
        <el-form-item label="配件清单">
          <div class="accessory-list">
            <div
              v-for="(item, index) in formData.accessories"
              :key="index"
              class="accessory-item"
            >
              <el-checkbox v-model="item.isComplete" @change="handleAccessoryChange">
                {{ item.name }}
              </el-checkbox>
              <el-select
                v-model="item.condition"
                size="small"
                style="width: 120px"
                :disabled="!item.isComplete"
              >
                <el-option label="完好" value="完好" />
                <el-option label="轻微污渍" value="轻微污渍" />
                <el-option label="损坏" value="损坏" />
                <el-option label="遗失" value="遗失" />
              </el-select>
              <el-input
                v-model="item.notes"
                size="small"
                placeholder="备注"
                style="width: 150px"
              />
            </div>
          </div>
        </el-form-item>
        <el-divider content-position="left">洗护状态</el-divider>
        <el-form-item label="洗护状态" prop="cleaningStatus">
          <el-radio-group v-model="formData.cleaningStatus">
            <el-radio value="clean">干净无需洗护</el-radio>
            <el-radio value="need_wash">需要洗护</el-radio>
            <el-radio value="damaged">有损坏</el-radio>
            <el-radio value="sent_out">已送洗</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="洗护费用" prop="cleaningCost">
          <el-input-number v-model="formData.cleaningCost" :min="0" :step="10" />
        </el-form-item>
        <el-divider content-position="left">押金处理</el-divider>
        <el-form-item label="损坏扣减" prop="damageDeduction">
          <el-input-number v-model="formData.damageDeduction" :min="0" :step="50" />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="formData.notes"
            type="textarea"
            :rows="2"
            placeholder="请输入备注信息"
          />
        </el-form-item>
        <el-alert
          :title="'预计退款: ¥' + refundAmount"
          type="info"
          :closable="false"
          show-icon
        />
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="归还详情" width="600px">
      <el-descriptions v-if="currentDetail" :column="2" border>
        <el-descriptions-item label="裙子名称">{{ currentDetail.dressName }}</el-descriptions-item>
        <el-descriptions-item label="归还日期">{{ currentDetail.returnDate }}</el-descriptions-item>
        <el-descriptions-item label="洗护状态">
          <el-tag :type="getCleaningStatusType(currentDetail.cleaningStatus)">
            {{ getCleaningStatusText(currentDetail.cleaningStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="洗护费用">¥{{ currentDetail.cleaningCost }}</el-descriptions-item>
        <el-descriptions-item label="损坏扣减">
          <span style="color: #f56c6c">¥{{ currentDetail.damageDeduction }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="配件扣减">
          <span style="color: #f56c6c">¥{{ currentDetail.totalAccessoriesDeduction }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="总扣减">
          <span style="color: #f56c6c; font-weight: 600">¥{{ currentDetail.totalDeduction }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="退款金额" type="success">
          <span style="color: #67c23a; font-weight: 600">¥{{ currentDetail.refundAmount }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">
          {{ currentDetail.notes || '无' }}
        </el-descriptions-item>
        <el-descriptions-item label="配件情况" :span="2">
          <div class="accessory-detail">
            <div
              v-for="(item, index) in currentDetail.accessories"
              :key="index"
              class="accessory-detail-item"
            >
              <span>{{ item.name }}</span>
              <el-tag :type="item.isComplete ? 'success' : 'danger'" size="small">
                {{ item.isComplete ? item.condition : '遗失' }}
              </el-tag>
              <span v-if="item.notes" style="color: #909399; font-size: 12px">{{ item.notes }}</span>
            </div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useReturnStore } from '../stores/return'
import { useRentalStore } from '../stores/rental'
import type { ReturnRecord, ReturnAccessory, CreateReturnRequest } from '../types'

const returnStore = useReturnStore()
const rentalStore = useRentalStore()

const dialogVisible = ref(false)
const detailVisible = ref(false)
const formRef = ref<FormInstance>()
const currentDetail = ref<ReturnRecord | null>(null)
const currentRentalDeposit = ref(0)

const formData = reactive<CreateReturnRequest & { dressName?: string }>({
  rentalId: '',
  returnDate: '',
  accessories: [],
  cleaningStatus: 'clean',
  cleaningCost: 0,
  damageDeduction: 0,
  notes: ''
})

const formRules: FormRules = {
  rentalId: [{ required: true, message: '请选择预约订单', trigger: 'change' }],
  returnDate: [{ required: true, message: '请选择归还日期', trigger: 'change' }],
  cleaningStatus: [{ required: true, message: '请选择洗护状态', trigger: 'change' }]
}

const refundAmount = computed(() => {
  const accessoriesDeduction = formData.accessories.filter(a => !a.isComplete).length * 50
  const totalDeduction = formData.damageDeduction + formData.cleaningCost + accessoriesDeduction
  return Math.max(0, currentRentalDeposit.value - totalDeduction)
})

const inProgressRentals = computed(() => {
  return rentalStore.rentalList.filter((r) => r.status === 'in_progress')
})

function getCleaningStatusType(status: string) {
  const map: Record<string, string> = {
    clean: 'success',
    need_wash: 'warning',
    damaged: 'danger',
    sent_out: 'info'
  }
  return map[status] || 'info'
}

function getCleaningStatusText(status: string) {
  const map: Record<string, string> = {
    clean: '干净',
    need_wash: '需洗护',
    damaged: '损坏',
    sent_out: '已送洗'
  }
  return map[status] || status
}

function getAccessoriesStatusType(accessories: ReturnAccessory[]) {
  if (!accessories || accessories.length === 0) return 'info'
  const allComplete = accessories.every(a => a.isComplete)
  return allComplete ? 'success' : 'warning'
}

function getAccessoriesStatusText(accessories: ReturnAccessory[]) {
  if (!accessories || accessories.length === 0) return '无配件'
  const allComplete = accessories.every(a => a.isComplete)
  return allComplete ? '齐全' : '有缺失'
}

function handleAdd() {
  resetForm()
  dialogVisible.value = true
}

function handleView(row: ReturnRecord) {
  currentDetail.value = row
  detailVisible.value = true
}

function handleRentalChange(rentalId: string) {
  const rental = rentalStore.rentalList.find((r) => r.id === rentalId)
  if (rental) {
    formData.dressName = rental.dressName
    currentRentalDeposit.value = rental.deposit
    formData.accessories = [
      { name: '原配发带/KC', isComplete: true, condition: '完好', notes: '' },
      { name: '衬裙', isComplete: true, condition: '完好', notes: '' },
      { name: '项链/配饰', isComplete: true, condition: '完好', notes: '' }
    ]
  }
}

function handleAccessoryChange() {
}

function resetForm() {
  Object.assign(formData, {
    rentalId: '',
    dressName: '',
    returnDate: '',
    accessories: [],
    cleaningStatus: 'clean',
    cleaningCost: 0,
    damageDeduction: 0,
    notes: ''
  })
  currentRentalDeposit.value = 0
  formRef.value?.resetFields()
}

function handleDialogClose() {
  resetForm()
}

async function handleSubmit() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const submitData: CreateReturnRequest = {
        rentalId: formData.rentalId,
        returnDate: formData.returnDate,
        accessories: formData.accessories,
        cleaningStatus: formData.cleaningStatus,
        cleaningCost: formData.cleaningCost,
        damageDeduction: formData.damageDeduction,
        notes: formData.notes
      }
      
      await returnStore.addNewReturn(submitData)
      ElMessage.success('归还记录创建成功')
      dialogVisible.value = false
    }
  })
}

onMounted(() => {
  returnStore.fetchReturnList()
  rentalStore.fetchRentalList()
})
</script>

<style scoped>
.return-page {
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

.table-card {
  border-radius: 8px;
}

.accessory-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.accessory-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.text-red {
  color: #f56c6c;
  font-weight: 500;
}

.accessory-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.accessory-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
</style>
