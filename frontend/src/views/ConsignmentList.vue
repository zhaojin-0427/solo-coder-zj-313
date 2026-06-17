<template>
  <div class="consignment-page">
    <div class="page-header">
      <h2>寄售管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增寄售
      </el-button>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable @change="handleSearch">
            <el-option label="在架" value="active" />
            <el-option label="议价中" value="negotiating" />
            <el-option label="已成交" value="sold" />
            <el-option label="已取消" value="cancelled" />
            <el-option label="已到期" value="expired" />
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
        :data="consignmentStore.consignmentList"
        v-loading="consignmentStore.loading"
        stripe
        border
      >
        <el-table-column prop="dressName" label="裙子名称" width="180" />
        <el-table-column prop="brand" label="品牌" width="120" />
        <el-table-column prop="size" label="尺码" width="80" />
        <el-table-column label="委托人" width="120">
          <template #default="{ row }">
            <div>{{ row.consignorName }}</div>
            <div style="color: #909399; font-size: 12px">{{ row.consignorPhone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="寄售价" width="100">
          <template #default="{ row }">
            ¥{{ row.consignmentPrice }}
          </template>
        </el-table-column>
        <el-table-column label="最低价" width="100">
          <template #default="{ row }">
            ¥{{ row.minimumPrice }}
          </template>
        </el-table-column>
        <el-table-column label="佣金率" width="80">
          <template #default="{ row }">
            {{ (row.commissionRate * 100).toFixed(0) }}%
          </template>
        </el-table-column>
        <el-table-column label="寄售日期" width="200">
          <template #default="{ row }">
            {{ row.startDate }} 至 {{ row.endDate }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="结算状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'sold'" :type="getSettlementType(row.settlementStatus)" size="small">
              {{ getSettlementText(row.settlementStatus) }}
            </el-tag>
            <span v-else style="color: #c0c4cc">—</span>
          </template>
        </el-table-column>
        <el-table-column label="成交价" width="100">
          <template #default="{ row }">
            <span v-if="row.finalPrice > 0" style="color: #67c23a; font-weight: 600">¥{{ row.finalPrice }}</span>
            <span v-else style="color: #c0c4cc">—</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">详情</el-button>
            <el-button v-if="row.status === 'active' || row.status === 'negotiating'" link type="warning" size="small" @click="handleNegotiate(row)">议价</el-button>
            <el-button v-if="row.status === 'active' || row.status === 'negotiating'" link type="success" size="small" @click="handleCompleteSale(row)">成交</el-button>
            <el-button v-if="row.status === 'active' || row.status === 'negotiating'" link type="danger" size="small" @click="handleCancel(row)">取消</el-button>
            <el-button v-if="row.status === 'active' || row.status === 'negotiating'" link type="info" size="small" @click="handleExpire(row)">到期下架</el-button>
            <el-button v-if="row.status === 'sold' && row.settlementStatus === 'processing'" link type="success" size="small" @click="handleSettle(row)">结算</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="addDialogVisible" title="新增寄售委托" width="700px" @close="resetAddForm">
      <el-form ref="addFormRef" :model="addFormData" :rules="addFormRules" label-width="120px">
        <el-form-item label="选择裙子" prop="dressId">
          <el-select v-model="addFormData.dressId" placeholder="请选择裙子" style="width: 100%">
            <el-option
              v-for="dress in dressStore.dressList"
              :key="dress.id"
              :label="dress.name + ' - ' + dress.size + '码'"
              :value="dress.id"
            />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="委托人姓名" prop="consignorName">
              <el-input v-model="addFormData.consignorName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="consignorPhone">
              <el-input v-model="addFormData.consignorPhone" placeholder="请输入电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="寄售价" prop="consignmentPrice">
              <el-input-number v-model="addFormData.consignmentPrice" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最低成交价" prop="minimumPrice">
              <el-input-number v-model="addFormData.minimumPrice" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="佣金比例" prop="commissionRate">
              <el-input-number v-model="addFormData.commissionRate" :min="0" :max="1" :step="0.05" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="寄售日期" prop="startDate">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
                @change="handleDateRangeChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="瑕疵说明">
          <el-input v-model="addFormData.defectDescription" type="textarea" :rows="2" placeholder="请输入瑕疵说明" />
        </el-form-item>
        <el-divider content-position="left">随附配件</el-divider>
        <div class="accessory-list">
          <div v-for="(acc, index) in addFormData.includedAccessories" :key="index" class="accessory-item">
            <el-input v-model="acc.name" placeholder="配件名称" style="width: 150px" />
            <el-input-number v-model="acc.quantity" :min="1" style="width: 100px" />
            <el-input v-model="acc.condition" placeholder="成色" style="flex: 1" />
            <el-button type="danger" link @click="removeAddAccessory(index)">删除</el-button>
          </div>
        </div>
        <el-button type="primary" link @click="addAddAccessory">+ 添加配件</el-button>
        <el-form-item label="备注">
          <el-input v-model="addFormData.notes" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="negotiateDialogVisible" title="登记议价" width="500px">
      <el-form ref="negotiateFormRef" :model="negotiateFormData" :rules="negotiateFormRules" label-width="100px">
        <el-form-item label="裙子名称">
          <el-input :model-value="currentRecord?.dressName" disabled />
        </el-form-item>
        <el-form-item label="当前寄售价">
          <el-input :model-value="'¥' + (currentRecord?.consignmentPrice || 0)" disabled />
        </el-form-item>
        <el-form-item label="最低成交价">
          <el-input :model-value="'¥' + (currentRecord?.minimumPrice || 0)" disabled />
        </el-form-item>
        <el-form-item label="买方姓名" prop="buyerName">
          <el-input v-model="negotiateFormData.buyerName" placeholder="请输入买方姓名" />
        </el-form-item>
        <el-form-item label="买方电话" prop="buyerPhone">
          <el-input v-model="negotiateFormData.buyerPhone" placeholder="请输入买方电话" />
        </el-form-item>
        <el-form-item label="出价" prop="offerPrice">
          <el-input-number v-model="negotiateFormData.offerPrice" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="negotiateFormData.notes" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="negotiateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleNegotiateSubmit">确认议价</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="saleDialogVisible" title="确认成交" width="500px">
      <el-form label-width="100px">
        <el-form-item label="裙子名称">
          <el-input :model-value="currentRecord?.dressName" disabled />
        </el-form-item>
        <el-form-item label="寄售价">
          <el-input :model-value="'¥' + (currentRecord?.consignmentPrice || 0)" disabled />
        </el-form-item>
        <el-form-item label="最低成交价">
          <el-input :model-value="'¥' + (currentRecord?.minimumPrice || 0)" disabled />
        </el-form-item>
        <el-form-item v-if="currentRecord?.currentOffer" label="当前出价">
          <el-input :model-value="'¥' + currentRecord.currentOffer" disabled />
        </el-form-item>
        <el-form-item label="成交价">
          <el-input-number v-model="saleFinalPrice" :min="currentRecord?.minimumPrice || 0" style="width: 100%" />
        </el-form-item>
        <el-alert v-if="saleFinalPrice > 0" type="info" :closable="false" show-icon>
          <template #title>
            <div>平台佣金：¥{{ (saleFinalPrice * (currentRecord?.commissionRate || 0)).toFixed(2) }}</div>
            <div>应付委托人：¥{{ (saleFinalPrice - saleFinalPrice * (currentRecord?.commissionRate || 0)).toFixed(2) }}</div>
          </template>
        </el-alert>
      </el-form>
      <template #footer>
        <el-button @click="saleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaleSubmit">确认成交</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="寄售详情" width="750px">
      <template v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="裙子名称" :span="2">{{ currentRecord.dressName }}</el-descriptions-item>
          <el-descriptions-item label="品牌">{{ currentRecord.brand }}</el-descriptions-item>
          <el-descriptions-item label="尺码">{{ currentRecord.size }}</el-descriptions-item>
          <el-descriptions-item label="柄图">{{ currentRecord.print }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentRecord.status)">{{ getStatusText(currentRecord.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="委托人">{{ currentRecord.consignorName }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{ currentRecord.consignorPhone }}</el-descriptions-item>
          <el-descriptions-item label="寄售价">¥{{ currentRecord.consignmentPrice }}</el-descriptions-item>
          <el-descriptions-item label="最低成交价">¥{{ currentRecord.minimumPrice }}</el-descriptions-item>
          <el-descriptions-item label="佣金比例">{{ (currentRecord.commissionRate * 100).toFixed(0) }}%</el-descriptions-item>
          <el-descriptions-item label="寄售日期" :span="2">{{ currentRecord.startDate }} 至 {{ currentRecord.endDate }}</el-descriptions-item>
          <el-descriptions-item v-if="currentRecord.defectDescription" label="瑕疵说明" :span="2">{{ currentRecord.defectDescription }}</el-descriptions-item>
          <el-descriptions-item v-if="currentRecord.includedAccessories?.length" label="随附配件" :span="2">
            <div v-for="(acc, index) in currentRecord.includedAccessories" :key="index">
              {{ acc.name }} × {{ acc.quantity }} ({{ acc.condition }})
            </div>
          </el-descriptions-item>
          <el-descriptions-item v-if="currentRecord.finalPrice > 0" label="成交价">
            <span style="color: #67c23a; font-weight: 600">¥{{ currentRecord.finalPrice }}</span>
          </el-descriptions-item>
          <el-descriptions-item v-if="currentRecord.platformCommission > 0" label="平台佣金">
            <span style="color: #e6a23c">¥{{ currentRecord.platformCommission }}</span>
          </el-descriptions-item>
          <el-descriptions-item v-if="currentRecord.consignorAmount > 0" label="应付委托人">
            <span style="color: #409eff; font-weight: 600">¥{{ currentRecord.consignorAmount }}</span>
          </el-descriptions-item>
          <el-descriptions-item v-if="currentRecord.settlementDeadline" label="结算截止日期">{{ currentRecord.settlementDeadline }}</el-descriptions-item>
          <el-descriptions-item v-if="currentRecord.transactionDate" label="成交日期">{{ currentRecord.transactionDate }}</el-descriptions-item>
          <el-descriptions-item v-if="currentRecord.status === 'sold'" label="结算状态">
            <el-tag :type="getSettlementType(currentRecord.settlementStatus)">{{ getSettlementText(currentRecord.settlementStatus) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item v-if="currentRecord.buyerName" label="买方">{{ currentRecord.buyerName }}</el-descriptions-item>
          <el-descriptions-item v-if="currentRecord.buyerPhone" label="买方电话">{{ currentRecord.buyerPhone }}</el-descriptions-item>
          <el-descriptions-item v-if="currentRecord.notes" label="备注" :span="2">{{ currentRecord.notes }}</el-descriptions-item>
        </el-descriptions>

        <el-divider v-if="currentRecord.negotiations?.length" content-position="left">议价记录</el-divider>
        <el-timeline v-if="currentRecord.negotiations?.length">
          <el-timeline-item
            v-for="neg in currentRecord.negotiations"
            :key="neg.id"
            :timestamp="neg.createdAt"
            placement="top"
          >
            <el-card shadow="never" class="negotiation-card">
              <div class="negotiation-info">
                <span><strong>{{ neg.buyerName }}</strong> ({{ neg.buyerPhone }})</span>
                <span style="color: #e6a23c; font-weight: 600; margin-left: 12px">出价: ¥{{ neg.offerPrice }}</span>
              </div>
              <div v-if="neg.notes" style="color: #909399; font-size: 13px; margin-top: 4px">{{ neg.notes }}</div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useConsignmentStore } from '../stores/consignment'
import { useDressStore } from '../stores/dress'
import type { ConsignmentRecord, ConsignmentAccessory } from '../types'

const consignmentStore = useConsignmentStore()
const dressStore = useDressStore()

const searchForm = reactive({ status: '' })
const addDialogVisible = ref(false)
const negotiateDialogVisible = ref(false)
const saleDialogVisible = ref(false)
const detailVisible = ref(false)
const addFormRef = ref<FormInstance>()
const negotiateFormRef = ref<FormInstance>()
const currentRecord = ref<ConsignmentRecord | null>(null)
const saleFinalPrice = ref(0)
const dateRange = ref<string[]>([])

const addFormData = reactive({
  dressId: '',
  consignorName: '',
  consignorPhone: '',
  consignmentPrice: 0,
  minimumPrice: 0,
  commissionRate: 0.3,
  startDate: '',
  endDate: '',
  defectDescription: '',
  includedAccessories: [] as ConsignmentAccessory[],
  notes: '',
})

const addFormRules: FormRules = {
  dressId: [{ required: true, message: '请选择裙子', trigger: 'change' }],
  consignorName: [{ required: true, message: '请输入委托人姓名', trigger: 'blur' }],
  consignorPhone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  consignmentPrice: [{ required: true, message: '请输入寄售价', trigger: 'blur' }],
  minimumPrice: [{ required: true, message: '请输入最低成交价', trigger: 'blur' }],
  commissionRate: [{ required: true, message: '请输入佣金比例', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择寄售日期', trigger: 'change' }],
}

const negotiateFormData = reactive({
  buyerName: '',
  buyerPhone: '',
  offerPrice: 0,
  notes: '',
})

const negotiateFormRules: FormRules = {
  buyerName: [{ required: true, message: '请输入买方姓名', trigger: 'blur' }],
  buyerPhone: [{ required: true, message: '请输入买方电话', trigger: 'blur' }],
  offerPrice: [{ required: true, message: '请输入出价', trigger: 'blur' }],
}

function getStatusType(status: string) {
  const map: Record<string, string> = {
    active: 'success',
    negotiating: 'warning',
    sold: 'primary',
    cancelled: 'danger',
    expired: 'info',
  }
  return map[status] || 'info'
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    active: '在架',
    negotiating: '议价中',
    sold: '已成交',
    cancelled: '已取消',
    expired: '已到期',
  }
  return map[status] || status
}

function getSettlementType(status: string) {
  const map: Record<string, string> = {
    pending: 'info',
    processing: 'warning',
    settled: 'success',
  }
  return map[status] || 'info'
}

function getSettlementText(status: string) {
  const map: Record<string, string> = {
    pending: '待结算',
    processing: '结算中',
    settled: '已结算',
  }
  return map[status] || status
}

function handleSearch() {
  consignmentStore.fetchConsignmentList({
    status: searchForm.status || undefined,
  })
}

function handleReset() {
  searchForm.status = ''
  consignmentStore.fetchConsignmentList()
}

function handleAdd() {
  resetAddForm()
  addDialogVisible.value = true
}

function handleView(row: ConsignmentRecord) {
  currentRecord.value = row
  detailVisible.value = true
}

function handleNegotiate(row: ConsignmentRecord) {
  currentRecord.value = row
  negotiateFormData.buyerName = row.buyerName || ''
  negotiateFormData.buyerPhone = row.buyerPhone || ''
  negotiateFormData.offerPrice = row.currentOffer || row.minimumPrice
  negotiateFormData.notes = ''
  negotiateDialogVisible.value = true
}

function handleCompleteSale(row: ConsignmentRecord) {
  currentRecord.value = row
  saleFinalPrice.value = row.currentOffer || row.consignmentPrice
  saleDialogVisible.value = true
}

function handleCancel(row: ConsignmentRecord) {
  ElMessageBox.confirm(`确定要取消"${row.dressName}"的寄售吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await consignmentStore.cancelRecord(row.id)
    ElMessage.success('已取消寄售')
  }).catch(() => {})
}

function handleExpire(row: ConsignmentRecord) {
  ElMessageBox.confirm(`确定要将"${row.dressName}"标记为到期下架吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await consignmentStore.expireRecord(row.id)
    ElMessage.success('已标记为到期下架')
  }).catch(() => {})
}

function handleSettle(row: ConsignmentRecord) {
  ElMessageBox.confirm(`确认结算"${row.dressName}"？应付委托人 ¥${row.consignorAmount}`, '结算确认', {
    confirmButtonText: '确认结算',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await consignmentStore.settleRecord(row.id, 'settled')
    ElMessage.success('结算完成')
  }).catch(() => {})
}

function handleDateRangeChange() {
  if (dateRange.value && dateRange.value.length === 2) {
    addFormData.startDate = dateRange.value[0]
    addFormData.endDate = dateRange.value[1]
  }
}

function addAddAccessory() {
  addFormData.includedAccessories.push({ name: '', quantity: 1, condition: '完好' })
}

function removeAddAccessory(index: number) {
  addFormData.includedAccessories.splice(index, 1)
}

function resetAddForm() {
  Object.assign(addFormData, {
    dressId: '',
    consignorName: '',
    consignorPhone: '',
    consignmentPrice: 0,
    minimumPrice: 0,
    commissionRate: 0.3,
    startDate: '',
    endDate: '',
    defectDescription: '',
    includedAccessories: [],
    notes: '',
  })
  dateRange.value = []
  addFormRef.value?.resetFields()
}

async function handleAddSubmit() {
  if (!addFormRef.value) return
  await addFormRef.value.validate(async (valid) => {
    if (valid) {
      if (!addFormData.startDate || !addFormData.endDate) {
        ElMessage.warning('请选择寄售日期')
        return
      }
      await consignmentStore.addNewConsignment({ ...addFormData })
      ElMessage.success('新增寄售成功')
      addDialogVisible.value = false
    }
  })
}

async function handleNegotiateSubmit() {
  if (!negotiateFormRef.value || !currentRecord.value) return
  await negotiateFormRef.value.validate(async (valid) => {
    if (valid) {
      await consignmentStore.negotiate(currentRecord.value!.id, { ...negotiateFormData })
      ElMessage.success('议价登记成功')
      negotiateDialogVisible.value = false
    }
  })
}

async function handleSaleSubmit() {
  if (!currentRecord.value) return
  await consignmentStore.completeSale(currentRecord.value.id, saleFinalPrice.value)
  ElMessage.success('成交确认成功')
  saleDialogVisible.value = false
}

onMounted(() => {
  consignmentStore.fetchConsignmentList()
  dressStore.fetchDressList()
})
</script>

<style scoped>
.consignment-page {
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

.accessory-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.accessory-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.negotiation-card {
  padding: 0;
}

.negotiation-card :deep(.el-card__body) {
  padding: 12px;
}

.negotiation-info {
  display: flex;
  align-items: center;
  font-size: 14px;
}
</style>
