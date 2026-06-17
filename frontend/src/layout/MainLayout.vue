<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="sidebar">
      <div class="logo">
        <h2>Lolita 管理后台</h2>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="menu"
        router
        background-color="transparent"
        text-color="#333"
        active-text-color="#e74c8c"
      >
        <el-menu-item index="/dresses">
          <el-icon><Collection /></el-icon>
          <span>服饰档案</span>
        </el-menu-item>
        <el-menu-item index="/outfits">
          <el-icon><Suitcase /></el-icon>
          <span>主题搭配</span>
        </el-menu-item>
        <el-menu-item index="/reservations">
          <el-icon><Calendar /></el-icon>
          <span>租赁预约</span>
        </el-menu-item>
        <el-menu-item index="/feedbacks">
          <el-icon><ChatDotRound /></el-icon>
          <span>试穿反馈</span>
        </el-menu-item>
        <el-menu-item index="/returns">
          <el-icon><ShoppingCart /></el-icon>
          <span>归还验收</span>
        </el-menu-item>
        <el-menu-item index="/consignments">
          <el-icon><Goods /></el-icon>
          <span>寄售管理</span>
        </el-menu-item>
        <el-menu-item index="/statistics">
          <el-icon><DataLine /></el-icon>
          <span>数据统计</span>
        </el-menu-item>
        <el-menu-item index="/members">
          <el-icon><User /></el-icon>
          <span>会员管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <span class="breadcrumb">管理后台 / {{ currentPageTitle }}</span>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32" icon="User" />
              <span class="username">管理员</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Suitcase, Goods, User } from '@element-plus/icons-vue'

const route = useRoute()

const activeMenu = computed(() => route.path)

const currentPageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/dresses': '服饰档案',
    '/outfits': '主题搭配',
    '/reservations': '租赁预约',
    '/feedbacks': '试穿反馈',
    '/returns': '归还验收',
    '/consignments': '寄售管理',
    '/statistics': '数据统计',
    '/members': '会员管理'
  }
  return titles[route.path] || '首页'
})
</script>

<style scoped>
.layout-container {
  height: 100%;
}

.sidebar {
  background: linear-gradient(180deg, #fff5f9 0%, #ffffff 100%);
  border-right: 1px solid #f0e6ec;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0e6ec;
}

.logo h2 {
  font-size: 18px;
  color: #e74c8c;
  font-weight: 600;
}

.menu {
  border-right: none;
  padding: 20px 0;
}

.menu :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  margin: 5px 15px;
  border-radius: 8px;
}

.menu :deep(.el-menu-item.is-active) {
  background-color: #ffe9f2;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.breadcrumb {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #606266;
}

.main-content {
  padding: 24px;
  background-color: #f5f7fa;
}
</style>
