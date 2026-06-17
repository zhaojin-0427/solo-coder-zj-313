<template>
  <div class="outfit-page">
    <div class="page-header">
      <h2>主题搭配方案</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增搭配方案
      </el-button>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入主题名称或适用场景"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable>
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
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
        :data="outfitStore.outfitList"
        v-loading="outfitStore.loading"
        stripe
        border
      >
        <el-table-column label="封面" width="100">
          <template #default="{ row }">
            <el-image
              v-if="row.coverImage"
              :src="row.coverImage"
              :preview-src-list="[row.coverImage]"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px"
            />
            <div v-else class="no-cover">无图</div>
          </template>
        </el-table-column>
        <el-table-column prop="themeName" label="主题名称" width="150" />
        <el-table-column prop="applicableScenario" label="适用场景" width="120" />
        <el-table-column label="推荐身高" width="120">
          <template #default="{ row }">
            {{ row.recommendedHeightRange?.min }}-{{ row.recommendedHeightRange?.max }}cm
          </template>
        </el-table-column>
        <el-table-column label="推荐尺码" width="120">
          <template #default="{ row }">
            {{ row.recommendedSizeRange?.min }}-{{ row.recommendedSizeRange?.max }}
          </template>
        </el-table-column>
        <el-table-column label="单品数量" width="100">
          <template #default="{ row }">
            {{ row.items?.length || 0 }} 件
          </template>
        </el-table-column>
        <el-table-column label="套装押金" width="110">
          <template #default="{ row }">
            ¥{{ row.totalDeposit }}
          </template>
        </el-table-column>
        <el-table-column label="套装日租" width="110">
          <template #default="{ row }">
            ¥{{ row.totalDailyPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="rentalCount" label="租赁次数" width="100" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
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
      :title="isEdit ? '编辑搭配方案' : '新增搭配方案'"
      width="800px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="110px"
      >
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="主题名称" prop="themeName">
                  <el-input v-model="formData.themeName" placeholder="请输入主题名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="适用场景" prop="applicableScenario">
                  <el-select v-model="formData.applicableScenario" placeholder="请选择适用场景" style="width: 100%">
                    <el-option label="日常出街" value="日常出街" />
                    <el-option label="生日派对" value="生日派对" />
                    <el-option label="漫展活动" value="漫展活动" />
                    <el-option label="写真拍摄" value="写真拍摄" />
                    <el-option label="婚纱照" value="婚纱照" />
                    <el-option label="毕业典礼" value="毕业典礼" />
                    <el-option label="其他" value="其他" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="身高最小">
                  <el-input-number v-model="formData.recommendedHeightRange.min" :min="100" :max="200" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="身高最大">
                  <el-input-number v-model="formData.recommendedHeightRange.max" :min="100" :max="200" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="最小尺码">
                  <el-select v-model="formData.recommendedSizeRange.min" style="width: 100%">
                    <el-option label="XS" value="XS" />
                    <el-option label="S" value="S" />
                    <el-option label="M" value="M" />
                    <el-option label="L" value="L" />
                    <el-option label="XL" value="XL" />
                    <el-option label="XXL" value="XXL" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="最大尺码">
                  <el-select v-model="formData.recommendedSizeRange.max" style="width: 100%">
                    <el-option label="XS" value="XS" />
                    <el-option label="S" value="S" />
                    <el-option label="M" value="M" />
                    <el-option label="L" value="L" />
                    <el-option label="XL" value="XL" />
                    <el-option label="XXL" value="XXL" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="封面图" prop="coverImage">
                  <el-input v-model="formData.coverImage" placeholder="请输入封面图URL" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态" prop="status">
                  <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                    <el-option label="启用" value="active" />
                    <el-option label="停用" value="inactive" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="搭配说明" prop="description">
              <el-input
                v-model="formData.description"
                type="textarea"
                :rows="3"
                placeholder="请输入搭配说明"
              />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="包含单品" name="items">
            <div class="item-toolbar">
              <el-button type="primary" size="small" @click="addItem">+ 添加单品</el-button>
              <span class="item-summary">
                共 {{ formData.items.length }} 件 | 
                总押金: ¥{{ calcTotalDeposit }} | 
                总日租: ¥{{ calcTotalDailyPrice }}
              </span>
            </div>
            <div class="item-list">
              <div
                v-for="(item, index) in formData.items"
                :key="index"
                class="item-card"
              >
                <div class="item-header">
                  <span class="item-index">单品 {{ index + 1 }}</span>
                  <el-switch
                    v-model="item.isCore"
                    active-text="核心单品"
                    inactive-text="可选单品"
                  />
                  <el-button type="danger" link size="small" @click="removeItem(index)">删除</el-button>
                </div>
                <el-row :gutter="10">
                  <el-col :span="6">
                    <el-form-item label="类型">
                      <el-select v-model="item.type" style="width: 100%" @change="updateTypeName(item)">
                        <el-option label="主裙" value="dress" />
                        <el-option label="配饰" value="accessory" />
                        <el-option label="KC" value="kc" />
                        <el-option label="衬裙" value="petticoat" />
                        <el-option label="鞋包" value="shoes_bag" />
                        <el-option label="假发" value="wig" />
                        <el-option label="摄影道具" value="photo_prop" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="名称">
                      <el-input v-model="item.name" placeholder="单品名称" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="押金">
                      <el-input-number v-model="item.deposit" :min="0" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="日租">
                      <el-input-number v-model="item.dailyPrice" :min="0" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-form-item label="状态">
                      <el-select v-model="item.status" style="width: 100%">
                        <el-option label="可租" value="available" />
                        <el-option label="已租" value="rented" />
                        <el-option label="洗护" value="cleaning" />
                        <el-option label="维护" value="maintenance" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-alert
              v-if="formData.items.length === 0"
              title="请至少添加一件单品"
              type="warning"
              :closable="false"
              show-icon
            />
            <el-alert
              v-else-if="!hasCoreItem"
              title="请至少添加一件核心单品（主裙）"
              type="warning"
              :closable="false"
              show-icon
            />
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="搭配方案详情" width="700px">
      <template v-if="currentDetail">
        <div class="detail-header">
          <el-image
            v-if="currentDetail.coverImage"
            :src="currentDetail.coverImage"
            :preview-src-list="[currentDetail.coverImage]"
            fit="cover"
            class="detail-cover"
          />
          <div class="detail-info">
            <h3>{{ currentDetail.themeName }}</h3>
            <div class="detail-tags">
              <el-tag size="small" type="warning">{{ currentDetail.applicableScenario }}</el-tag>
              <el-tag size="small" :type="currentDetail.status === 'active' ? 'success' : 'info'">
                {{ currentDetail.status === 'active' ? '启用' : '停用' }}
              </el-tag>
              <el-tag size="small" type="info">租赁 {{ currentDetail.rentalCount }} 次</el-tag>
            </div>
            <p class="detail-price">
              <span>套装押金: <b>¥{{ currentDetail.totalDeposit }}</b></span>
              <span>套装日租: <b>¥{{ currentDetail.totalDailyPrice }}</b></span>
            </p>
          </div>
        </div>

        <el-descriptions :column="2" border class="detail-desc">
          <el-descriptions-item label="推荐身高">
            {{ currentDetail.recommendedHeightRange.min }}-{{ currentDetail.recommendedHeightRange.max }}cm
          </el-descriptions-item>
          <el-descriptions-item label="推荐尺码">
            {{ currentDetail.recommendedSizeRange.min }}-{{ currentDetail.recommendedSizeRange.max }}
          </el-descriptions-item>
          <el-descriptions-item label="搭配说明" :span="2">
            {{ currentDetail.description }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">包含单品 ({{ currentDetail.items.length }} 件)</el-divider>
        <div class="detail-items">
          <div
            v-for="(item, index) in currentDetail.items"
            :key="index"
            class="detail-item"
          >
            <div class="item-main">
              <el-tag size="small" :type="item.isCore ? 'danger' : 'info'" class="item-type-tag">
                {{ item.isCore ? '核心' : '可选' }}
              </el-tag>
              <el-tag size="small" class="item-cat-tag">{{ item.typeName }}</el-tag>
              <span class="item-name">{{ item.name }}</span>
            </div>
            <div class="item-price">
              <span>押金: ¥{{ item.deposit }}</span>
              <span>日租: ¥{{ item.dailyPrice }}</span>
              <el-tag size="small" :type="getStatusType(item.status)">
                {{ getStatusText(item.status) }}
              </el-tag>
            </div>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useOutfitStore } from '../stores/outfit'
import type { Outfit, OutfitItem, CreateOutfitRequest, UpdateOutfitRequest } from '../types'

const outfitStore = useOutfitStore()

const searchForm = reactive({
  keyword: '',
  status: ''
})

const dialogVisible = ref(false)
const detailVisible = ref(false)
const isEdit = ref(false)
const editId = ref<string | null>(null)
const formRef = ref<FormInstance>()
const currentDetail = ref<Outfit | null>(null)
const activeTab = ref('basic')

const defaultOutfitItem = (): OutfitItem => ({
  id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: '',
  type: 'accessory',
  typeName: '配饰',
  isCore: false,
  deposit: 0,
  dailyPrice: 0,
  status: 'available'
})

const formData = reactive<CreateOutfitRequest>({
  themeName: '',
  applicableScenario: '日常出街',
  recommendedHeightRange: { min: 155, max: 175 },
  recommendedSizeRange: { min: 'S', max: 'L' },
  items: [
    {
      id: `item_${Date.now()}_1`,
      name: '',
      type: 'dress',
      typeName: '主裙',
      isCore: true,
      deposit: 0,
      dailyPrice: 0,
      status: 'available'
    }
  ],
  description: '',
  coverImage: '',
  status: 'active'
})

const formRules: FormRules = {
  themeName: [{ required: true, message: '请输入主题名称', trigger: 'blur' }],
  applicableScenario: [{ required: true, message: '请选择适用场景', trigger: 'change' }],
  coverImage: [{ required: true, message: '请输入封面图URL', trigger: 'blur' }]
}

const calcTotalDeposit = computed(() => {
  return formData.items.reduce((sum, item) => sum + (item.deposit || 0), 0)
})

const calcTotalDailyPrice = computed(() => {
  return formData.items.reduce((sum, item) => sum + (item.dailyPrice || 0), 0)
})

const hasCoreItem = computed(() => {
  return formData.items.some(item => item.isCore)
})

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

function updateTypeName(item: OutfitItem) {
  const typeMap: Record<string, string> = {
    dress: '主裙',
    accessory: '配饰',
    kc: 'KC',
    petticoat: '衬裙',
    shoes_bag: '鞋包',
    wig: '假发',
    photo_prop: '摄影道具'
  }
  item.typeName = typeMap[item.type] || item.type
}

function handleSearch() {
  outfitStore.fetchOutfitList({
    keyword: searchForm.keyword || undefined,
    status: searchForm.status || undefined
  })
}

function handleReset() {
  searchForm.keyword = ''
  searchForm.status = ''
  outfitStore.fetchOutfitList()
}

function handleAdd() {
  isEdit.value = false
  editId.value = null
  resetForm()
  dialogVisible.value = true
}

function handleView(row: Outfit) {
  currentDetail.value = row
  detailVisible.value = true
}

function handleEdit(row: Outfit) {
  isEdit.value = true
  editId.value = row.id
  Object.assign(formData, {
    themeName: row.themeName,
    applicableScenario: row.applicableScenario,
    recommendedHeightRange: { ...row.recommendedHeightRange },
    recommendedSizeRange: { ...row.recommendedSizeRange },
    items: row.items.map(item => ({ ...item })),
    description: row.description,
    coverImage: row.coverImage,
    status: row.status
  })
  dialogVisible.value = true
}

function handleDelete(row: Outfit) {
  ElMessageBox.confirm(`确定要删除搭配方案"${row.themeName}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await outfitStore.deleteOutfitItem(row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function addItem() {
  formData.items.push(defaultOutfitItem())
}

function removeItem(index: number) {
  formData.items.splice(index, 1)
}

function resetForm() {
  Object.assign(formData, {
    themeName: '',
    applicableScenario: '日常出街',
    recommendedHeightRange: { min: 155, max: 175 },
    recommendedSizeRange: { min: 'S', max: 'L' },
    items: [
      {
        id: `item_${Date.now()}_1`,
        name: '',
        type: 'dress',
        typeName: '主裙',
        isCore: true,
        deposit: 0,
        dailyPrice: 0,
        status: 'available'
      }
    ],
    description: '',
    coverImage: '',
    status: 'active'
  })
  activeTab.value = 'basic'
  formRef.value?.resetFields()
}

function handleDialogClose() {
  resetForm()
}

async function handleSubmit() {
  if (!formRef.value) return
  
  if (formData.items.length === 0) {
    ElMessage.warning('请至少添加一件单品')
    return
  }
  if (!hasCoreItem.value) {
    ElMessage.warning('请至少添加一件核心单品（主裙）')
    return
  }
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (isEdit.value && editId.value) {
        const updateData: UpdateOutfitRequest = {
          themeName: formData.themeName,
          applicableScenario: formData.applicableScenario,
          recommendedHeightRange: formData.recommendedHeightRange,
          recommendedSizeRange: formData.recommendedSizeRange,
          items: formData.items,
          description: formData.description,
          coverImage: formData.coverImage,
          status: formData.status
        }
        await outfitStore.updateOutfitItem(editId.value, updateData)
        ElMessage.success('编辑成功')
      } else {
        const createData: CreateOutfitRequest = {
          themeName: formData.themeName,
          applicableScenario: formData.applicableScenario,
          recommendedHeightRange: formData.recommendedHeightRange,
          recommendedSizeRange: formData.recommendedSizeRange,
          items: formData.items,
          description: formData.description,
          coverImage: formData.coverImage,
          status: formData.status
        }
        await outfitStore.addNewOutfit(createData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
    }
  })
}

onMounted(() => {
  outfitStore.fetchOutfitList()
})
</script>

<style scoped>
.outfit-page {
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

.no-cover {
  width: 60px;
  height: 60px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #999;
  font-size: 12px;
}

.item-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.item-summary {
  font-size: 14px;
  color: #666;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
}

.item-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 15px;
  background: #fafafa;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #e4e7ed;
}

.item-index {
  font-weight: 600;
  color: #303133;
}

.detail-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.detail-cover {
  width: 160px;
  height: 160px;
  border-radius: 8px;
  flex-shrink: 0;
}

.detail-info {
  flex: 1;
}

.detail-info h3 {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #303133;
}

.detail-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.detail-price {
  display: flex;
  gap: 30px;
  font-size: 15px;
}

.detail-price b {
  color: #e6a23c;
  font-size: 18px;
}

.detail-desc {
  margin-top: 20px;
}

.detail-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.item-main {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-type-tag {
  margin-right: 0 !important;
}

.item-cat-tag {
  margin-right: 0 !important;
  background: #ecf5ff;
  color: #409eff;
  border-color: #b3d8ff;
}

.item-name {
  font-weight: 500;
  color: #303133;
}

.item-price {
  display: flex;
  gap: 15px;
  align-items: center;
  font-size: 14px;
  color: #666;
}
</style>
