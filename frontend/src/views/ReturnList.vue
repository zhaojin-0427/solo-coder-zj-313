<template>
  <div class="return-page">
    <div class="page-header">
      <h2>归还验收</h2>
      <div class="header-actions">
        <el-select v-model="filterStatus" placeholder="状态筛选" clearable style="width: 140px; margin-right: 12px" @change="handleFilterChange">
          <el-option label="全部" value="" />
          <el-option label="待处理" value="pending" />
          <el-option label="验收中" value="inspecting" />
          <el-option label="已完成" value="completed" />
          <el-option label="有争议" value="disputed" />
        </el-select>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增归还
        </el-button>
      </div>
    </div>

    <el-card class="table-card">
      <el-table
        :data="filteredReturnList"
        v-loading="returnStore.loading"
        stripe
        border
      >
        <el-table-column label="类型" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.isOutfitReturn" type="success" effect="dark">套装归还</el-tag>
            <el-tag v-else type="primary">单裙归还</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="名称" width="180">
          <template #default="{ row }">
            <template v-if="row.isOutfitReturn">
              <div>{{ row.outfitName }}</div>
              <div style="color: #909399; font-size: 12px">包含{{ row.outfitItems?.length || 0 }}件单品</div>
            </template>
            <template v-else>
              {{ row.dressName }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="returnDate" label="归还日期" width="120" />
        <el-table-column label="套装完整度" width="120">
          <template #default="{ row }">
            <template v-if="row.isOutfitReturn">
              <el-tag :type="row.outfitComplete ? 'success' : 'danger'">
                {{ row.outfitComplete ? '完整' : '不完整' }}
              </el-tag>
            </template>
            <span v-else style="color: #c0c4cc">—</span>
          </template>
        </el-table-column>
        <el-table-column label="配件情况" width="120">
          <template #default="{ row }">
            <template v-if="!row.isOutfitReturn">
              <el-tag :type="getAccessoriesStatusType(row.accessories)">
                {{ getAccessoriesStatusText(row.accessories) }}
              </el-tag>
            </template>
            <span v-else style="color: #c0c4cc">—</span>
          </template>
        </el-table-column>
        <el-table-column label="洗护状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getCleaningStatusType(row.cleaningStatus)">
              {{ row.cleaningStatus }}
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
            <span :class="{ 'text-red': row.totalDamageDeduction > 0 }">
              ¥{{ row.totalDamageDeduction }}
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
        <el-table-column label="争议" width="90" align="center">
          <template #default="{ row }">
            <el-tag
              v-if="getDisputeForReturn(row.id)"
              :type="getDisputeStatusType(getDisputeForReturn(row.id)!.reviewStatus)"
              effect="dark"
              size="small"
              class="dispute-tag"
              @click="handleViewDispute(getDisputeForReturn(row.id)!)"
            >
              {{ getDisputeStatusLabel(getDisputeForReturn(row.id)!.reviewStatus) }}
            </el-tag>
            <span v-else style="color: #c0c4cc">—</span>
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
      width="780px"
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
            :label="(r.isOutfitRental ? '[套装] ' + r.outfitName : r.dressName) + ' - ' + r.userInfo?.name"
            :value="r.id"
          />
        </el-select>
      </el-form-item>

      <el-alert
        v-if="selectedRental"
        :title="(selectedRental.isOutfitRental ? '套装预约：' : '单裙预约：') + (selectedRental.isOutfitRental ? selectedRental.outfitName : selectedRental.dressName)"
        :type="selectedRental.isOutfitRental ? 'success' : 'info'"
        :closable="false"
        show-icon
      />

      <el-form-item label="归还日期" prop="returnDate">
        <el-date-picker
          v-model="formData.returnDate"
          type="date"
          placeholder="请选择归还日期"
          value-format="YYYY-MM-DD"
          style="width: 100%"
          @change="calculateLateFee"
        />
      </el-form-item>
      <el-form-item label="验收人" prop="inspector">
        <el-input v-model="formData.inspector" placeholder="请输入验收人姓名" />
      </el-form-item>

      <template v-if="selectedRental?.isOutfitRental">
        <el-divider content-position="left">套装单品核对</el-divider>
        <el-alert
          v-if="formData.outfitItems && formData.outfitItems.length > 0"
          :title="'套装完整度：' + (outfitComplete ? '完整' : '不完整') + '（已归还 ' + returnedOutfitItemsCount + '/' + formData.outfitItems.length + ' 件）'"
          :type="outfitComplete ? 'success' : 'warning'"
          :closable="false"
          show-icon
        >
          <template #default>
            套装单品扣减：<b style="color: #f56c6c">¥{{ totalOutfitItemsDeduction }}</b>
          </template>
        </el-alert>
        <el-form-item label="套装单品">
          <div class="outfit-item-list">
            <div
              v-for="(item, index) in formData.outfitItems"
              :key="index"
              class="outfit-item"
              :class="{ 'item-missing': !item.isReturned }"
            >
              <div class="outfit-item-header">
                <el-checkbox v-model="item.isReturned" @change="() => handleOutfitItemChange(item)">
                  <span class="item-title">
                    <el-tag size="small" :type="item.isCore ? 'danger' : 'info'" style="margin-right: 6px">
                      {{ item.typeName }}
                    </el-tag>
                    <el-tag v-if="item.isCore" size="small" type="danger" effect="dark" style="margin-right: 6px">
                      核心
                    </el-tag>
                    <span class="item-name">{{ item.name }}</span>
                  </span>
                </el-checkbox>
              </div>
              <div class="outfit-item-content">
                <div class="outfit-item-detail">
                  <div class="outfit-item-detail-item">
                    <span class="detail-label">成色：</span>
                    <el-select
                      v-model="item.condition"
                      size="small"
                      style="width: 120px"
                      :disabled="!item.isReturned"
                    >
                      <el-option label="完好" value="完好" />
                      <el-option label="轻微污渍" value="轻微污渍" />
                      <el-option label="损坏" value="损坏" />
                      <el-option label="遗失" value="遗失" />
                    </el-select>
                  </div>
                  <div class="outfit-item-detail-item">
                    <span class="detail-label">扣减：</span>
                    <el-input-number
                      v-model="item.deductionAmount"
                      size="small"
                      :min="0"
                      :step="10"
                      :disabled="item.isReturned"
                      style="width: 100px"
                    />
                  </div>
                  <div class="outfit-item-detail-item">
                    <span class="detail-label">备注：</span>
                    <el-input
                      v-model="item.notes"
                      size="small"
                      placeholder="备注说明"
                      style="width: 150px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </template>

      <template v-else>
        <el-divider content-position="left">配件核对</el-divider>
        <el-form-item label="配件清单">
          <div class="accessory-list">
            <div
              v-for="(item, index) in formData.accessories"
              :key="index"
              class="accessory-item"
            >
              <el-checkbox v-model="item.isComplete" @change="() => handleAccessoryChange(item)">
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
              <el-input-number
                v-model="item.deductionAmount"
                size="small"
                :min="0"
                :step="10"
                :disabled="item.isComplete"
                style="width: 100px"
              />
              <span style="font-size: 12px; color: #909399">扣减</span>
              <el-input
                v-model="item.notes"
                size="small"
                placeholder="备注"
                style="width: 150px"
              />
            </div>
          </div>
        </el-form-item>
      </template>

      <el-divider content-position="left">瑕疵检查</el-divider>
      <el-form-item label="瑕疵记录">
        <div class="damage-list">
          <div
            v-for="(item, index) in formData.damages"
            :key="index"
            class="damage-item"
          >
            <el-input
              v-model="item.location"
              size="small"
              placeholder="部位"
              style="width: 100px"
            />
            <el-input
              v-model="item.description"
              size="small"
              placeholder="描述"
              style="width: 140px"
            />
            <el-select
              v-model="item.severity"
              size="small"
              placeholder="严重程度"
              style="width: 100px"
            >
              <el-option label="轻微" value="minor" />
              <el-option label="中等" value="moderate" />
              <el-option label="严重" value="major" />
            </el-select>
            <el-checkbox v-model="item.isNew" size="small">新增</el-checkbox>
            <el-input-number
              v-model="item.deductionAmount"
              size="small"
              :min="0"
              :step="10"
              style="width: 90px"
            />
            <el-button
              link
              type="danger"
              size="small"
              @click="removeDamage(index)"
            >
              删除
            </el-button>
          </div>
          <el-button type="primary" size="small" plain @click="addDamage">
            <el-icon><Plus /></el-icon>
            添加瑕疵
          </el-button>
        </div>
      </el-form-item>

      <el-divider content-position="left">洗护与逾期</el-divider>
      <el-form-item label="洗护状态" prop="cleaningStatus">
        <el-radio-group v-model="formData.cleaningStatus">
          <el-radio value="clean">干净无需洗护</el-radio>
          <el-radio value="needs_cleaning">需要常规洗护</el-radio>
          <el-radio value="needs_professional_cleaning">需要专业洗护</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="洗护费用" prop="cleaningCost">
        <el-input-number v-model="formData.cleaningCost" :min="0" :step="10" />
      </el-form-item>
      <el-form-item label="逾期费用" prop="lateFee">
        <el-input-number v-model="formData.lateFee" :min="0" :step="10" />
        <span style="margin-left: 8px; font-size: 12px; color: #909399">
          {{ lateDays > 0 ? `逾期 ${lateDays} 天` : '未逾期' }}
        </span>
      </el-form-item>

      <el-divider content-position="left">说明与备注</el-divider>
      <el-form-item label="顾客说明" prop="customerNote">
        <el-input
          v-model="formData.customerNote"
          type="textarea"
          :rows="2"
          placeholder="请输入顾客说明"
        />
      </el-form-item>
      <el-form-item label="店员备注" prop="staffNote">
        <el-input
          v-model="formData.staffNote"
          type="textarea"
          :rows="2"
          placeholder="请输入店员备注"
        />
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
        :title="refundAlertText"
        type="info"
        :closable="false"
        show-icon
      />

      <el-alert
        v-if="disputeWarning"
        type="warning"
        :closable="false"
        show-icon
        title="本次归还涉及争议金额，提交后将自动生成争议记录"
      />
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="detailVisible" title="归还详情" width="750px">
    <el-descriptions v-if="currentDetail" :column="2" border>
      <el-descriptions-item label="归还类型">
        <el-tag v-if="currentDetail.isOutfitReturn" type="success" effect="dark">套装归还</el-tag>
        <el-tag v-else type="primary">单裙归还</el-tag>
      </el-descriptions-item>
      <el-descriptions-item v-if="currentDetail.isOutfitReturn" label="套装名称">{{ currentDetail.outfitName }}</el-descriptions-item>
      <el-descriptions-item v-else label="裙子名称">{{ currentDetail.dressName }}</el-descriptions-item>
      <el-descriptions-item label="归还日期">{{ currentDetail.returnDate }}</el-descriptions-item>
      <el-descriptions-item v-if="currentDetail.isOutfitReturn" label="套装完整度">
        <el-tag :type="currentDetail.outfitComplete ? 'success' : 'danger'">
          {{ currentDetail.outfitComplete ? '完整' : '不完整' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item v-if="currentDetail.isOutfitReturn" label="套装单品扣减">
        <span style="color: #f56c6c">¥{{ currentDetail.totalOutfitItemsDeduction || 0 }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="洗护状态">
        <el-tag :type="getCleaningStatusType(currentDetail.cleaningStatus)">
          {{ currentDetail.cleaningStatus }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="洗护费用">¥{{ currentDetail.cleaningCost }}</el-descriptions-item>
      <el-descriptions-item label="损坏扣减">
        <span style="color: #f56c6c">¥{{ currentDetail.totalDamageDeduction }}</span>
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

      <el-descriptions-item v-if="currentDetail.isOutfitReturn && currentDetail.outfitItems?.length" label="套装单品" :span="2">
        <div class="outfit-item-detail-list">
          <div
            v-for="(item, index) in currentDetail.outfitItems"
            :key="index"
            class="outfit-item-detail-row"
            :class="{ 'item-missing': !item.isReturned }"
          >
            <div class="item-main-info">
              <el-tag size="small" :type="item.isCore ? 'danger' : 'info'">{{ item.typeName }}</el-tag>
              <el-tag v-if="item.isCore" size="small" type="danger" effect="dark" style="margin-left: 4px">核心</el-tag>
              <span style="margin-left: 8px; font-weight: 500">{{ item.name }}</span>
            </div>
            <div class="item-status-info">
              <el-tag :type="item.isReturned ? 'success' : 'danger'" size="small">
                {{ item.isReturned ? (item.condition || '已归还') : '未归还' }}
              </el-tag>
              <span v-if="item.deductionAmount && item.deductionAmount > 0" style="color: #f56c6c; font-size: 12px; margin-left: 8px">
                扣¥{{ item.deductionAmount }}
              </span>
              <span v-if="item.notes" style="color: #909399; font-size: 12px; margin-left: 8px">
                {{ item.notes }}
              </span>
            </div>
          </div>
        </div>
      </el-descriptions-item>

      <el-descriptions-item v-if="!currentDetail.isOutfitReturn" label="配件情况" :span="2">
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
            <span v-if="item.deductionAmount && item.deductionAmount > 0" style="color: #f56c6c; font-size: 12px">
              扣¥{{ item.deductionAmount }}
            </span>
            <span v-if="item.notes" style="color: #909399; font-size: 12px">{{ item.notes }}</span>
          </div>
        </div>
      </el-descriptions-item>

      <el-descriptions-item v-if="currentDetail.damages && currentDetail.damages.length > 0" label="瑕疵记录" :span="2">
        <div class="damage-detail">
          <div
            v-for="(item, index) in currentDetail.damages"
            :key="index"
            class="damage-detail-item"
          >
            <el-tag size="small" :type="item.isNew ? 'danger' : 'info'">
              {{ item.isNew ? '新增' : '原有' }}
            </el-tag>
            <span style="font-weight: 500">{{ item.location }}</span>
            <span style="color: #606266">{{ item.description }}</span>
            <el-tag size="small" type="warning">{{ getSeverityLabel(item.severity) }}</el-tag>
            <span style="color: #f56c6c">扣¥{{ item.deductionAmount }}</span>
          </div>
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <div v-if="currentDetailDispute" class="dispute-section">
      <el-divider content-position="left">
        <el-tag type="warning" effect="dark" size="small">争议记录</el-tag>
      </el-divider>
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="复核状态" :span="2">
          <el-tag :type="getDisputeStatusType(currentDetailDispute.reviewStatus)" effect="dark">
            {{ getDisputeStatusLabel(currentDetailDispute.reviewStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="触发原因" :span="2">
          <div class="trigger-list">
            <el-tag
              v-for="(reason, idx) in currentDetailDispute.triggerReasons"
              :key="idx"
              :type="getTriggerTypeColor(reason.type)"
              size="small"
              style="margin: 2px 4px 2px 0"
            >
              {{ reason.description }}
            </el-tag>
          </div>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentDetailDispute.isOutfitDispute" label="关联套装">
          <el-tag type="success" size="small">{{ currentDetailDispute.outfitName }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-else label="关联裙子">{{ currentDetailDispute.dressName }}</el-descriptions-item>
        <el-descriptions-item label="关联预约">{{ currentDetailDispute.rentalId }}</el-descriptions-item>
        <el-descriptions-item label="扣减明细" :span="2">
          <div class="deduction-list">
            <div v-for="(d, idx) in currentDetailDispute.deductionDetails" :key="idx" class="deduction-item">
              <span class="deduction-category">{{ getCategoryLabel(d.category) }}</span>
              <span>{{ d.itemName }}</span>
              <span style="color: #f56c6c; font-weight: 500">¥{{ d.amount }}</span>
              <span style="color: #909399; font-size: 12px">{{ d.description }}</span>
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="原押金">¥{{ currentDetailDispute.originalDeposit }}</el-descriptions-item>
        <el-descriptions-item label="原扣减">¥{{ currentDetailDispute.originalTotalDeduction }}</el-descriptions-item>
        <el-descriptions-item label="原退款">¥{{ currentDetailDispute.originalRefundAmount }}</el-descriptions-item>
        <el-descriptions-item label="当前退款">
          <span style="color: #e6a23c; font-weight: 600">¥{{ currentDetailDispute.currentRefundAmount }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="顾客说明" :span="2">
          {{ currentDetailDispute.customerNote || '无' }}
        </el-descriptions-item>
        <el-descriptions-item label="店员备注" :span="2">
          {{ currentDetailDispute.staffNote || '无' }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentDetailDispute.reviewConclusion" label="复核结论" :span="2">
          {{ currentDetailDispute.reviewConclusion }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentDetailDispute.reviewOperator" label="复核人">
          {{ currentDetailDispute.reviewOperator }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentDetailDispute.reviewDate" label="复核日期">
          {{ currentDetailDispute.reviewDate }}
        </el-descriptions-item>
      </el-descriptions>

      <div v-if="currentDetailDispute.reviewStatus === 'pending'" class="review-actions">
        <el-button type="success" @click="openReviewDialog('approved')">通过复核</el-button>
        <el-button type="danger" @click="openReviewDialog('rejected')">驳回争议</el-button>
      </div>
    </div>
  </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="争议复核" width="500px">
      <el-form ref="reviewFormRef" :model="reviewFormData" :rules="reviewFormRules" label-width="100px">
        <el-form-item label="复核结果">
          <el-tag :type="reviewFormData.reviewStatus === 'approved' ? 'success' : 'danger'" effect="dark">
            {{ reviewFormData.reviewStatus === 'approved' ? '通过' : '驳回' }}
          </el-tag>
        </el-form-item>
        <el-form-item label="复核结论" prop="reviewConclusion">
          <el-input
            v-model="reviewFormData.reviewConclusion"
            type="textarea"
            :rows="3"
            placeholder="请输入复核结论"
          />
        </el-form-item>
        <el-form-item label="调整退款" prop="adjustedRefundAmount">
          <el-input-number
            v-model="reviewFormData.adjustedRefundAmount"
            :min="0"
            :step="50"
            style="width: 100%"
          />
          <div style="color: #909399; font-size: 12px; margin-top: 4px">
            原退款金额：¥{{ reviewingDispute?.originalRefundAmount || 0 }}
          </div>
        </el-form-item>
        <el-form-item label="复核人" prop="reviewOperator">
          <el-input v-model="reviewFormData.reviewOperator" placeholder="请输入复核人姓名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleReviewSubmit">确认提交</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="disputeDetailVisible" title="争议详情" width="600px">
      <template v-if="currentDisputeDetail">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="复核状态" :span="2">
            <el-tag :type="getDisputeStatusType(currentDisputeDetail.reviewStatus)" effect="dark">
              {{ getDisputeStatusLabel(currentDisputeDetail.reviewStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="裙子名称">{{ currentDisputeDetail.dressName }}</el-descriptions-item>
          <el-descriptions-item label="顾客">{{ currentDisputeDetail.userName }}</el-descriptions-item>
          <el-descriptions-item label="触发原因" :span="2">
            <div class="trigger-list">
              <el-tag
                v-for="(reason, idx) in currentDisputeDetail.triggerReasons"
                :key="idx"
                :type="getTriggerTypeColor(reason.type)"
                size="small"
                style="margin: 2px 4px 2px 0"
              >
                {{ reason.description }}
              </el-tag>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="原退款">¥{{ currentDisputeDetail.originalRefundAmount }}</el-descriptions-item>
          <el-descriptions-item label="当前退款">
            <span style="color: #e6a23c; font-weight: 600">¥{{ currentDisputeDetail.currentRefundAmount }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="顾客说明" :span="2">
            {{ currentDisputeDetail.customerNote || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="店员备注" :span="2">
            {{ currentDisputeDetail.staffNote || '无' }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useReturnStore } from '../stores/return'
import { useRentalStore } from '../stores/rental'
import { useDisputeStore } from '../stores/dispute'
import { useDressStore } from '../stores/dress'
import type { ReturnRecord, ReturnAccessory, ReturnDamage, CreateReturnRequest, DisputeRecord, ReviewDisputeRequest, OutfitItemCheck, OutfitRentalItem, Rental } from '../types'

const returnStore = useReturnStore()
const rentalStore = useRentalStore()
const disputeStore = useDisputeStore()
const dressStore = useDressStore()

const dialogVisible = ref(false)
const detailVisible = ref(false)
const reviewDialogVisible = ref(false)
const disputeDetailVisible = ref(false)
const formRef = ref<FormInstance>()
const reviewFormRef = ref<FormInstance>()
const currentDetail = ref<ReturnRecord | null>(null)
const currentDisputeDetail = ref<DisputeRecord | null>(null)
const currentRentalDeposit = ref(0)
const currentRentalEndDate = ref('')
const filterStatus = ref('')
const reviewingDispute = ref<DisputeRecord | null>(null)
const selectedRental = ref<Rental | null>(null)

const formData = reactive<CreateReturnRequest & { dressName?: string; isOutfitReturn: boolean; outfitItems?: OutfitItemCheck[] }>({
  rentalId: '',
  returnDate: '',
  isOutfitReturn: false,
  outfitItems: [],
  accessories: [],
  damages: [],
  cleaningStatus: 'clean',
  cleaningCost: 0,
  lateFee: 0,
  damageDeduction: 0,
  notes: '',
  customerNote: '',
  staffNote: '',
  inspector: '',
})

const reviewFormData = reactive<ReviewDisputeRequest & { adjustedRefundAmount: number }>({
  reviewStatus: 'approved',
  reviewConclusion: '',
  reviewOperator: '',
  adjustedRefundAmount: 0,
})

const formRules: FormRules = {
  rentalId: [{ required: true, message: '请选择预约订单', trigger: 'change' }],
  returnDate: [{ required: true, message: '请选择归还日期', trigger: 'change' }],
  cleaningStatus: [{ required: true, message: '请选择洗护状态', trigger: 'change' }],
  inspector: [{ required: true, message: '请输入验收人', trigger: 'blur' }],
}

const reviewFormRules: FormRules = {
  reviewConclusion: [{ required: true, message: '请输入复核结论', trigger: 'blur' }],
  reviewOperator: [{ required: true, message: '请输入复核人', trigger: 'blur' }],
}

const totalOutfitItemsDeduction = computed(() => {
  if (!formData.outfitItems) return 0
  return formData.outfitItems.reduce((sum, item) => sum + (item.deductionAmount || 0), 0)
})

const outfitComplete = computed(() => {
  if (!formData.outfitItems || formData.outfitItems.length === 0) return true
  return formData.outfitItems.every(item => item.isReturned)
})

const returnedOutfitItemsCount = computed(() => {
  if (!formData.outfitItems) return 0
  return formData.outfitItems.filter(item => item.isReturned).length
})

const totalDeduction = computed(() => {
  const accessoriesDeduction = formData.accessories.reduce((sum, a) => sum + (a.deductionAmount || 0), 0)
  const damageDeduction = formData.damages.reduce((sum, d) => sum + d.deductionAmount, 0)
  return accessoriesDeduction + damageDeduction + formData.cleaningCost + formData.lateFee + totalOutfitItemsDeduction.value
})

const refundAmount = computed(() => {
  return Math.max(0, currentRentalDeposit.value - totalDeduction.value)
})

const refundAlertText = computed(() => {
  return '押金 ¥' + currentRentalDeposit.value + '，预计退款: ¥' + refundAmount.value + '（扣减 ¥' + totalDeduction.value + '）'
})

const lateDays = computed(() => {
  if (!formData.returnDate || !currentRentalEndDate.value) return 0
  const returnDate = new Date(formData.returnDate)
  const endDate = new Date(currentRentalEndDate.value)
  const diff = Math.ceil((returnDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
})

const disputeWarning = computed(() => {
  const hasMissingAccessory = formData.accessories.some(a => !a.isComplete)
  const hasMissingOutfitItem = formData.outfitItems?.some(item => !item.isReturned) || false
  const hasNewDamage = formData.damages.some(d => d.isNew)
  const hasExcessiveCleaning = formData.cleaningCost > 100
  const accessoriesDeduction = formData.accessories.reduce((sum, a) => sum + (a.deductionAmount || 0), 0)
  const outfitItemsDeduction = totalOutfitItemsDeduction.value
  const damageDeduction = formData.damages.filter(d => d.isNew).reduce((sum, d) => sum + d.deductionAmount, 0)
  const totalDeductionExceptLate = accessoriesDeduction + outfitItemsDeduction + damageDeduction + formData.cleaningCost
  const hasExcessiveDeduction = totalDeductionExceptLate > 80
  return hasMissingAccessory || hasMissingOutfitItem || hasNewDamage || hasExcessiveCleaning || hasExcessiveDeduction
})

const inProgressRentals = computed(() => {
  const returnedRentalIds = returnStore.returnList.map((r) => r.rentalId)
  return rentalStore.rentalList.filter(
    (r) => (r.status === 'in_progress' || r.status === 'confirmed') && !returnedRentalIds.includes(r.id),
  )
})

const filteredReturnList = computed(() => {
  let list = returnStore.returnList
  if (filterStatus.value === 'disputed') {
    list = list.filter((r) => getDisputeForReturn(r.id))
  } else if (filterStatus.value) {
    list = list.filter((r) => r.status === filterStatus.value)
  }
  return list
})

const currentDetailDispute = computed(() => {
  if (!currentDetail.value) return null
  return getDisputeForReturn(currentDetail.value.id)
})

function getDisputeForReturn(returnId: string): DisputeRecord | undefined {
  return disputeStore.disputeList.find((d) => d.returnId === returnId)
}

function getDisputeStatusType(status: string) {
  const map: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
  }
  return map[status] || 'info'
}

function getDisputeStatusLabel(status: string) {
  const map: Record<string, string> = {
    pending: '待复核',
    approved: '已通过',
    rejected: '已驳回',
  }
  return map[status] || status
}

function getTriggerTypeColor(type: string) {
  const map: Record<string, string> = {
    accessory_missing: 'warning',
    damage_new: 'danger',
    cleaning_excessive: '',
    deduction_excessive: 'warning',
  }
  return map[type] || 'info'
}

function getCategoryLabel(category: string) {
  const map: Record<string, string> = {
    accessories: '配件',
    damage: '损坏',
    cleaning: '洗护',
    late: '逾期',
    outfit_items: '套装单品',
  }
  return map[category] || category
}

function getCleaningStatusType(status: string) {
  const map: Record<string, string> = {
    '干净': 'success',
    'clean': 'success',
    '需洗护': 'warning',
    'need_wash': 'warning',
    'needs_cleaning': 'warning',
    '需专业洗护': 'danger',
    'needs_professional_cleaning': 'danger',
    '损坏': 'danger',
    'damaged': 'danger',
    '已送洗': 'info',
    'sent_out': 'info'
  }
  return map[status] || 'info'
}

function getCleaningStatusText(status: string) {
  const map: Record<string, string> = {
    clean: '干净',
    need_wash: '需洗护',
    needs_cleaning: '需洗护',
    needs_professional_cleaning: '需专业洗护',
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

function getSeverityLabel(severity: string) {
  const map: Record<string, string> = {
    minor: '轻微',
    moderate: '中等',
    major: '严重',
  }
  return map[severity] || severity
}

function handleFilterChange() {}

function handleAdd() {
  resetForm()
  dialogVisible.value = true
}

function handleView(row: ReturnRecord) {
  currentDetail.value = row
  detailVisible.value = true
}

function handleViewDispute(dispute: DisputeRecord) {
  currentDisputeDetail.value = dispute
  disputeDetailVisible.value = true
}

function handleRentalChange(rentalId: string) {
  const rental = rentalStore.rentalList.find((r) => r.id === rentalId)
  if (rental) {
    selectedRental.value = rental
    formData.dressName = rental.dressName
    formData.isOutfitReturn = rental.isOutfitRental
    currentRentalDeposit.value = rental.deposit
    currentRentalEndDate.value = rental.endDate

    if (rental.isOutfitRental && rental.outfitItems && rental.outfitItems.length > 0) {
      formData.outfitItems = rental.outfitItems.map((item: OutfitRentalItem) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        typeName: item.typeName,
        isCore: item.isCore,
        isReturned: true,
        condition: '完好',
        deductionAmount: 0,
        notes: '',
      }))
      formData.accessories = []
    } else {
      formData.outfitItems = []
      const dress = dressStore.dressList.find((d) => d.id === rental.dressId)
      if (dress && dress.accessories && dress.accessories.length > 0) {
        formData.accessories = dress.accessories.map((acc) => ({
          name: acc.name,
          expectedQuantity: acc.quantity,
          actualQuantity: acc.quantity,
          condition: acc.condition || '完好',
          isComplete: true,
          deductionAmount: 0,
          notes: '',
        }))
      } else {
        formData.accessories = []
      }
    }
    formData.damages = []
    calculateLateFee()
  }
}

function handleAccessoryChange(item: ReturnAccessory) {
  if (!item.isComplete) {
    if (!item.deductionAmount || item.deductionAmount === 0) {
      item.deductionAmount = 50
    }
  } else {
    item.deductionAmount = 0
  }
}

function handleOutfitItemChange(item: OutfitItemCheck) {
  if (!item.isReturned) {
    if (!item.deductionAmount || item.deductionAmount === 0) {
      item.deductionAmount = 100
    }
    item.condition = '遗失'
  } else {
    item.deductionAmount = 0
    item.condition = '完好'
  }
}

function addDamage() {
  formData.damages.push({
    location: '',
    description: '',
    severity: 'minor',
    isNew: true,
    deductionAmount: 0,
  })
}

function removeDamage(index: number) {
  formData.damages.splice(index, 1)
}

function calculateLateFee() {
  if (lateDays.value > 0 && formData.lateFee === 0) {
    formData.lateFee = lateDays.value * 30
  }
}

function resetForm() {
  Object.assign(formData, {
    rentalId: '',
    dressName: '',
    isOutfitReturn: false,
    outfitItems: [],
    returnDate: '',
    accessories: [],
    damages: [],
    cleaningStatus: 'clean',
    cleaningCost: 0,
    lateFee: 0,
    damageDeduction: 0,
    notes: '',
    customerNote: '',
    staffNote: '',
    inspector: '',
  })
  selectedRental.value = null
  currentRentalDeposit.value = 0
  currentRentalEndDate.value = ''
  formRef.value?.resetFields()
}

function handleDialogClose() {
  resetForm()
}

async function handleSubmit() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const submitData: CreateReturnRequest & { isOutfitReturn: boolean; outfitItems?: OutfitItemCheck[] } = {
        rentalId: formData.rentalId,
        returnDate: formData.returnDate,
        isOutfitReturn: formData.isOutfitReturn,
        accessories: formData.accessories.map(a => ({
          ...a,
          expectedQuantity: a.expectedQuantity || 1,
          actualQuantity: a.isComplete ? (a.expectedQuantity || 1) : 0,
        })),
        damages: formData.damages,
        cleaningStatus: formData.cleaningStatus,
        cleaningCost: formData.cleaningCost,
        lateFee: formData.lateFee,
        damageDeduction: formData.damages.reduce((sum, d) => sum + d.deductionAmount, 0),
        notes: formData.notes,
        customerNote: formData.customerNote,
        staffNote: formData.staffNote,
        inspector: formData.inspector,
      }

      if (formData.isOutfitReturn && formData.outfitItems) {
        submitData.outfitItems = formData.outfitItems
      }
      
      await returnStore.addNewReturn(submitData as any)
      await disputeStore.fetchDisputeList()
      ElMessage.success('归还记录创建成功')
      dialogVisible.value = false
    }
  })
}

function openReviewDialog(status: 'approved' | 'rejected') {
  if (!currentDetailDispute.value) return
  reviewingDispute.value = currentDetailDispute.value
  reviewFormData.reviewStatus = status
  reviewFormData.reviewConclusion = ''
  reviewFormData.reviewOperator = ''
  reviewFormData.adjustedRefundAmount = currentDetailDispute.value.originalRefundAmount
  reviewDialogVisible.value = true
}

async function handleReviewSubmit() {
  if (!reviewFormRef.value || !reviewingDispute.value) return

  await reviewFormRef.value.validate(async (valid) => {
    if (valid) {
      await disputeStore.reviewDisputeRecord(reviewingDispute.value!.id, {
        reviewStatus: reviewFormData.reviewStatus,
        reviewConclusion: reviewFormData.reviewConclusion,
        reviewOperator: reviewFormData.reviewOperator,
        adjustedRefundAmount: reviewFormData.adjustedRefundAmount,
      })
      ElMessage.success('复核提交成功')
      reviewDialogVisible.value = false
      detailVisible.value = false
      await returnStore.fetchReturnList()
    }
  })
}

onMounted(() => {
  returnStore.fetchReturnList()
  rentalStore.fetchRentalList()
  disputeStore.fetchDisputeList()
  dressStore.fetchDressList()
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

.header-actions {
  display: flex;
  align-items: center;
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

.damage-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.damage-detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  padding: 6px 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.damage-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.damage-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.dispute-tag {
  cursor: pointer;
}

.dispute-section {
  margin-top: 16px;
}

.review-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.trigger-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.deduction-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.deduction-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.deduction-category {
  display: inline-block;
  min-width: 36px;
  padding: 1px 6px;
  background: #f0f2f5;
  border-radius: 3px;
  font-size: 12px;
  color: #606266;
  text-align: center;
}

.outfit-item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.outfit-item {
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.outfit-item.item-missing {
  background: #fef0f0;
  border-color: #fbc4c4;
}

.outfit-item-header {
  margin-bottom: 10px;
}

.item-title {
  display: flex;
  align-items: center;
}

.item-name {
  font-weight: 500;
  color: #303133;
}

.outfit-item-content {
  padding-left: 28px;
}

.outfit-item-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.outfit-item-detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-label {
  font-size: 12px;
  color: #909399;
}

.outfit-item-detail-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.outfit-item-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.outfit-item-detail-row.item-missing {
  background: #fef0f0;
}

.item-main-info {
  display: flex;
  align-items: center;
}

.item-status-info {
  display: flex;
  align-items: center;
}
</style>
