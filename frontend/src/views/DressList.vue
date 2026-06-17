<template>
  <div class="dress-page">
    <div class="page-header">
      <h2>服饰档案</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增裙子
      </el-button>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入名称或系列"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable>
            <el-option label="可租" value="available" />
            <el-option label="已租出" value="rented" />
            <el-option label="洗护中" value="cleaning" />
            <el-option label="维护中" value="maintenance" />
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
        :data="dressStore.dressList"
        v-loading="dressStore.loading"
        stripe
        border
      >
        <el-table-column prop="name" label="裙子名称" width="150" />
        <el-table-column prop="brand" label="品牌" width="120" />
        <el-table-column prop="series" label="系列/柄图" width="120" />
        <el-table-column prop="silhouette" label="版型" width="80" />
        <el-table-column prop="size" label="尺码" width="80" />
        <el-table-column prop="color" label="颜色" width="100" />
        <el-table-column label="尺码范围" width="180">
          <template #default="{ row }">
            <span v-if="row.sizeRange">
              胸{{ row.sizeRange.bust.min }}-{{ row.sizeRange.bust.max }}
              腰{{ row.sizeRange.waist.min }}-{{ row.sizeRange.waist.max }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="日租金" width="100">
          <template #default="{ row }">
            ¥{{ row.dailyPrice }}
          </template>
        </el-table-column>
        <el-table-column label="押金" width="100">
          <template #default="{ row }">
            ¥{{ row.deposit }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="经营类型" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.saleType === 'consignment'" type="warning">寄售</el-tag>
            <el-tag v-else type="primary">自营</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">详情</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑裙子' : '新增裙子'"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="裙子名称" prop="name">
                  <el-input v-model="formData.name" placeholder="请输入裙子名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="品牌" prop="brand">
                  <el-input v-model="formData.brand" placeholder="请输入品牌" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="系列/柄图" prop="series">
                  <el-input v-model="formData.series" placeholder="请输入系列/柄图名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="印花描述" prop="print">
                  <el-input v-model="formData.print" placeholder="请输入印花描述" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="版型" prop="silhouette">
                  <el-select v-model="formData.silhouette" placeholder="请选择版型" style="width: 100%">
                    <el-option label="JSK无袖" value="JSK" />
                    <el-option label="OP有袖" value="OP" />
                    <el-option label="SK半裙" value="SK" />
                    <el-option label="其他" value="other" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="尺码" prop="size">
                  <el-select v-model="formData.size" placeholder="请选择尺码" style="width: 100%">
                    <el-option label="S" value="S" />
                    <el-option label="M" value="M" />
                    <el-option label="L" value="L" />
                    <el-option label="均码" value="F" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="颜色" prop="color">
                  <el-input v-model="formData.color" placeholder="请输入颜色" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="日租金" prop="dailyPrice">
                  <el-input-number v-model="formData.dailyPrice" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="押金" prop="deposit">
                  <el-input-number v-model="formData.deposit" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="状态" prop="status">
              <el-select v-model="formData.status" placeholder="请选择状态" style="width: 200px">
                <el-option label="可租" value="available" />
                <el-option label="已租出" value="rented" />
                <el-option label="洗护中" value="cleaning" />
                <el-option label="维护中" value="maintenance" />
              </el-select>
            </el-form-item>
            <el-form-item label="封面图" prop="coverImage">
              <el-input v-model="formData.coverImage" placeholder="请输入封面图URL" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input
                v-model="formData.description"
                type="textarea"
                :rows="3"
                placeholder="请输入裙子描述"
              />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="尺码范围" name="sizeRange">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="胸围最小">
                  <el-input-number v-model="formData.sizeRange!.bust.min" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="胸围最大">
                  <el-input-number v-model="formData.sizeRange!.bust.max" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="腰围最小">
                  <el-input-number v-model="formData.sizeRange!.waist.min" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="腰围最大">
                  <el-input-number v-model="formData.sizeRange!.waist.max" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="臀围最小">
                  <el-input-number v-model="formData.sizeRange!.hip.min" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="臀围最大">
                  <el-input-number v-model="formData.sizeRange!.hip.max" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="裙长">
              <el-input-number v-model="formData.sizeRange!.length" :min="0" style="width: 200px" />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="瑕疵与配件" name="flaws">
            <el-divider content-position="left">瑕疵记录</el-divider>
            <div class="flaw-list">
              <div
                v-for="(flaw, index) in formData.flaws"
                :key="index"
                class="flaw-item"
              >
                <el-input v-model="flaw.location" placeholder="位置" style="width: 120px" />
                <el-select v-model="flaw.severity" placeholder="严重程度" style="width: 100px">
                  <el-option label="轻微" value="minor" />
                  <el-option label="中等" value="moderate" />
                  <el-option label="严重" value="major" />
                </el-select>
                <el-input v-model="flaw.description" placeholder="描述" style="flex: 1" />
                <el-button type="danger" link @click="removeFlaw(index)">删除</el-button>
              </div>
            </div>
            <el-button type="primary" link @click="addFlaw">+ 添加瑕疵</el-button>

            <el-divider content-position="left">配件清单</el-divider>
            <div class="accessory-list">
              <div
                v-for="(acc, index) in formData.accessories"
                :key="index"
                class="accessory-item"
              >
                <el-input v-model="acc.name" placeholder="配件名称" style="width: 150px" />
                <el-input-number v-model="acc.quantity" :min="1" style="width: 100px" />
                <el-input v-model="acc.condition" placeholder="成色" style="flex: 1" />
                <el-button type="danger" link @click="removeAccessory(index)">删除</el-button>
              </div>
            </div>
            <el-button type="primary" link @click="addAccessory">+ 添加配件</el-button>
          </el-tab-pane>

          <el-tab-pane label="寄售信息" name="consignment">
            <el-form-item label="经营类型">
              <el-radio-group v-model="formData.saleType">
                <el-radio value="self_operated">自营</el-radio>
                <el-radio value="consignment">寄售</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="formData.saleType === 'consignment'">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="寄售人姓名">
                    <el-input v-model="formData.consignment!.ownerName" placeholder="请输入姓名" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="寄售人电话">
                    <el-input v-model="formData.consignment!.ownerPhone" placeholder="请输入电话" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="寄售开始日期">
                    <el-date-picker
                      v-model="formData.consignment!.consignmentStartDate"
                      type="date"
                      value-format="YYYY-MM-DD"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="寄售结束日期">
                    <el-date-picker
                      v-model="formData.consignment!.consignmentEndDate"
                      type="date"
                      value-format="YYYY-MM-DD"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="寄售价">
                    <el-input-number v-model="formData.consignment!.consignmentPrice" :min="0" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="最低成交价">
                    <el-input-number v-model="formData.consignment!.minimumPrice" :min="0" style="width: 100%" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="佣金比例(%)">
                    <el-input-number v-model="formData.consignment!.commissionRate" :min="0" :max="100" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="底价">
                    <el-input-number v-model="formData.consignment!.basePrice" :min="0" style="width: 100%" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="瑕疵说明">
                <el-input v-model="formData.consignment!.defectDescription" type="textarea" :rows="2" placeholder="请输入瑕疵说明" />
              </el-form-item>
              <el-divider content-position="left">随附配件</el-divider>
              <div class="accessory-list">
                <div
                  v-for="(acc, index) in formData.consignment!.includedAccessories"
                  :key="index"
                  class="accessory-item"
                >
                  <el-input v-model="acc.name" placeholder="配件名称" style="width: 150px" />
                  <el-input-number v-model="acc.quantity" :min="1" style="width: 100px" />
                  <el-input v-model="acc.condition" placeholder="成色" style="flex: 1" />
                  <el-button type="danger" link @click="removeConsignmentAccessory(index)">删除</el-button>
                </div>
              </div>
              <el-button type="primary" link @click="addConsignmentAccessory">+ 添加配件</el-button>
              <el-form-item label="寄售状态">
                <el-select v-model="formData.consignment!.status" placeholder="请选择状态" style="width: 200px">
                  <el-option label="进行中" value="active" />
                  <el-option label="已结束" value="ended" />
                  <el-option label="待开始" value="pending" />
                </el-select>
              </el-form-item>
              <el-form-item label="结算状态">
                <el-select v-model="formData.consignment!.settlementStatus" placeholder="请选择结算状态" style="width: 200px">
                  <el-option label="待结算" value="pending" />
                  <el-option label="结算中" value="processing" />
                  <el-option label="已结算" value="settled" />
                </el-select>
              </el-form-item>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="裙子详情" width="650px">
      <el-descriptions v-if="currentDetail" :column="2" border>
        <el-descriptions-item label="裙子名称" :span="2">{{ currentDetail.name }}</el-descriptions-item>
        <el-descriptions-item label="品牌">{{ currentDetail.brand }}</el-descriptions-item>
        <el-descriptions-item label="系列/柄图">{{ currentDetail.series }}</el-descriptions-item>
        <el-descriptions-item label="版型">{{ currentDetail.silhouette }}</el-descriptions-item>
        <el-descriptions-item label="尺码">{{ currentDetail.size }}</el-descriptions-item>
        <el-descriptions-item label="颜色">{{ currentDetail.color }}</el-descriptions-item>
        <el-descriptions-item label="日租金">¥{{ currentDetail.dailyPrice }}</el-descriptions-item>
        <el-descriptions-item label="押金">¥{{ currentDetail.deposit }}</el-descriptions-item>
        <el-descriptions-item label="经营类型">
          <el-tag v-if="currentDetail.saleType === 'consignment'" type="warning">寄售</el-tag>
          <el-tag v-else type="primary">自营</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentDetail.status)">
            {{ getStatusText(currentDetail.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="尺码范围" :span="2">
          <span v-if="currentDetail.sizeRange">
            胸围: {{ currentDetail.sizeRange.bust.min }}-{{ currentDetail.sizeRange.bust.max }}cm |
            腰围: {{ currentDetail.sizeRange.waist.min }}-{{ currentDetail.sizeRange.waist.max }}cm |
            臀围: {{ currentDetail.sizeRange.hip.min }}-{{ currentDetail.sizeRange.hip.max }}cm |
            裙长: {{ currentDetail.sizeRange.length }}cm
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="印花描述" :span="2">{{ currentDetail.print }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ currentDetail.description }}</el-descriptions-item>
        <el-descriptions-item label="瑕疵" :span="2">
          <div v-if="currentDetail.flaws && currentDetail.flaws.length > 0">
            <div v-for="(flaw, index) in currentDetail.flaws" :key="index" class="flaw-detail">
              <el-tag size="small" :type="getSeverityType(flaw.severity)">{{ getSeverityText(flaw.severity) }}</el-tag>
              {{ flaw.location }}: {{ flaw.description }}
            </div>
          </div>
          <span v-else>无</span>
        </el-descriptions-item>
        <el-descriptions-item label="配件" :span="2">
          <div v-if="currentDetail.accessories && currentDetail.accessories.length > 0">
            <div v-for="(acc, index) in currentDetail.accessories" :key="index">
              {{ acc.name }} × {{ acc.quantity }} ({{ acc.condition }})
            </div>
          </div>
          <span v-else>无</span>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentDetail.consignment && currentDetail.saleType === 'consignment'" label="寄售人" :span="2">
          {{ currentDetail.consignment.ownerName }} ({{ currentDetail.consignment.ownerPhone }})
        </el-descriptions-item>
        <el-descriptions-item v-if="currentDetail.consignment && currentDetail.saleType === 'consignment'" label="寄售价">
          ¥{{ currentDetail.consignment.consignmentPrice }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentDetail.consignment && currentDetail.saleType === 'consignment'" label="最低成交价">
          ¥{{ currentDetail.consignment.minimumPrice }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentDetail.consignment?.defectDescription" label="寄售瑕疵" :span="2">
          {{ currentDetail.consignment.defectDescription }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentDetail.consignment?.includedAccessories?.length" label="寄售配件" :span="2">
          <div v-for="(acc, index) in currentDetail.consignment.includedAccessories" :key="index">
            {{ acc.name }} × {{ acc.quantity }} ({{ acc.condition }})
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useDressStore } from '../stores/dress'
import type { Dress, Flaw, AccessoryItem, ConsignmentAccessory } from '../types'

const dressStore = useDressStore()

const searchForm = reactive({
  keyword: '',
  status: ''
})

const dialogVisible = ref(false)
const detailVisible = ref(false)
const isEdit = ref(false)
const editId = ref<string | null>(null)
const formRef = ref<FormInstance>()
const currentDetail = ref<Dress | null>(null)
const activeTab = ref('basic')

const defaultSizeRange = {
  bust: { min: 80, max: 90 },
  waist: { min: 60, max: 70 },
  hip: { min: 85, max: 95 },
  length: 100
}

const defaultConsignment = {
  ownerName: '',
  ownerPhone: '',
  consignmentStartDate: '',
  consignmentEndDate: '',
  commissionRate: 0,
  basePrice: 0,
  status: 'active' as const,
  consignmentPrice: 0,
  minimumPrice: 0,
  defectDescription: '',
  includedAccessories: [] as ConsignmentAccessory[],
  settlementStatus: 'pending' as const,
}

const formData = reactive<Partial<Dress>>({
  name: '',
  brand: '',
  series: '',
  print: '',
  silhouette: 'JSK',
  color: '',
  size: 'M',
  sizeRange: { ...defaultSizeRange },
  flaws: [],
  accessories: [],
  rentalSlots: [],
  consignment: {
    ownerName: '',
    ownerPhone: '',
    consignmentStartDate: '',
    consignmentEndDate: '',
    commissionRate: 0,
    basePrice: 0,
    status: 'active',
    consignmentPrice: 0,
    minimumPrice: 0,
    defectDescription: '',
    includedAccessories: [],
    settlementStatus: 'pending',
  },
  saleType: 'self_operated',
  dailyPrice: 0,
  deposit: 0,
  status: 'available',
  coverImage: '',
  description: ''
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入裙子名称', trigger: 'blur' }],
  brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
  series: [{ required: true, message: '请输入系列/柄图', trigger: 'blur' }],
  silhouette: [{ required: true, message: '请选择版型', trigger: 'change' }],
  size: [{ required: true, message: '请选择尺码', trigger: 'change' }],
  color: [{ required: true, message: '请输入颜色', trigger: 'blur' }],
  dailyPrice: [{ required: true, message: '请输入日租金', trigger: 'blur' }],
  deposit: [{ required: true, message: '请输入押金', trigger: 'blur' }]
}

function getStatusType(status: string) {
  const map: Record<string, string> = {
    available: 'success',
    rented: 'warning',
    cleaning: 'info',
    maintenance: 'danger'
  }
  return map[status] || 'info'
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    available: '可租',
    rented: '已租出',
    cleaning: '洗护中',
    maintenance: '维护中'
  }
  return map[status] || status
}

function getSeverityType(severity: string) {
  const map: Record<string, string> = {
    minor: 'success',
    moderate: 'warning',
    major: 'danger'
  }
  return map[severity] || 'info'
}

function getSeverityText(severity: string) {
  const map: Record<string, string> = {
    minor: '轻微',
    moderate: '中等',
    major: '严重'
  }
  return map[severity] || severity
}

function handleSearch() {
  dressStore.fetchDressList({
    keyword: searchForm.keyword || undefined,
    status: searchForm.status || undefined
  })
}

function handleReset() {
  searchForm.keyword = ''
  searchForm.status = ''
  dressStore.fetchDressList()
}

function handleAdd() {
  isEdit.value = false
  editId.value = null
  resetForm()
  dialogVisible.value = true
}

function handleView(row: Dress) {
  currentDetail.value = row
  detailVisible.value = true
}

function handleEdit(row: Dress) {
  isEdit.value = true
  editId.value = row.id
  Object.assign(formData, {
    ...row,
    sizeRange: row.sizeRange ? { ...row.sizeRange } : { ...defaultSizeRange },
    flaws: row.flaws ? [...row.flaws] : [],
    accessories: row.accessories ? [...row.accessories] : [],
    consignment: row.consignment ? {
      ...row.consignment,
      includedAccessories: row.consignment.includedAccessories ? [...row.consignment.includedAccessories] : [],
    } : { ...defaultConsignment, includedAccessories: [] },
    saleType: row.saleType || 'self_operated',
  })
  dialogVisible.value = true
}

function handleDelete(row: Dress) {
  ElMessageBox.confirm(`确定要删除"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await dressStore.deleteDressItem(row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function addFlaw() {
  formData.flaws?.push({
    location: '',
    description: '',
    severity: 'minor'
  })
}

function removeFlaw(index: number) {
  formData.flaws?.splice(index, 1)
}

function addAccessory() {
  formData.accessories?.push({
    name: '',
    quantity: 1,
    condition: '全新'
  })
}

function removeAccessory(index: number) {
  formData.accessories?.splice(index, 1)
}

function addConsignmentAccessory() {
  formData.consignment?.includedAccessories?.push({
    name: '',
    quantity: 1,
    condition: '完好',
  })
}

function removeConsignmentAccessory(index: number) {
  formData.consignment?.includedAccessories?.splice(index, 1)
}

function resetForm() {
  Object.assign(formData, {
    name: '',
    brand: '',
    series: '',
    print: '',
    silhouette: 'JSK',
    color: '',
    size: 'M',
    sizeRange: { ...defaultSizeRange },
    flaws: [],
    accessories: [],
    rentalSlots: [],
    consignment: { ...defaultConsignment, includedAccessories: [] },
    saleType: 'self_operated',
    dailyPrice: 0,
    deposit: 0,
    status: 'available',
    coverImage: '',
    description: ''
  })
  activeTab.value = 'basic'
  formRef.value?.resetFields()
}

function handleDialogClose() {
  resetForm()
}

async function handleSubmit() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const submitData = { ...formData } as any
      if (isEdit.value && editId.value) {
        await dressStore.updateDressItem(editId.value, submitData)
        ElMessage.success('编辑成功')
      } else {
        await dressStore.addNewDress(submitData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
    }
  })
}

onMounted(() => {
  dressStore.fetchDressList()
})
</script>

<style scoped>
.dress-page {
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

.table-card {
  overflow: hidden;
}

.flaw-list,
.accessory-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.flaw-item,
.accessory-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.flaw-detail {
  margin-bottom: 5px;
}
</style>
