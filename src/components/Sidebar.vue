<template>
  <div class="relative h-full" ref="sidebar">
    <aside 
      class="sidebar-container bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full overflow-y-auto transition-all duration-300"
      :class="{
        'w-34 p-4': !isCollapsed,
        'min-w-[4rem] max-w-[4rem] px-2': isCollapsed
      }"
      @mouseenter="showToggle = true"
      @mouseleave="showToggle = false">
      
      <!-- 修改后的网站标题区域 -->
      <div class="flex items-center" :class="{'mb-4 pl-2': !isCollapsed, 'py-3 justify-center': isCollapsed}">
        <router-link 
          to="/"
          @click.native="resetCategory">
         <i class="fas fa-globe text-purple-500 text-base"></i>
        </router-link>
        <!-- 添加 router-link 实现跳转 -->
        <router-link 
          to="/"
          class="ml-2 font-bold text-purple-600 dark:text-purple-400"
          :class="{ 'hidden': isCollapsed }"
          @click.native="resetCategory"
        >
          Simple NAV
        </router-link>
      </div>

      <ul>
        <li v-for="category in categories" :key="category" class="mb-2">
          <button
            @click="selectCategory(category)"
            class="flex items-center w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
            @mouseenter="showTooltip(category, $event)"
            @mouseleave="hideTooltip"
          >
            <i class="fas" :class="getCategoryIcon(category)"></i>
            <span class="ml-2" :class="{ 'hidden': isCollapsed }">{{ category }}</span>
            
            <!-- 修改提示框为横向布局 -->
            <div 
              v-if="hoveredCategory && isCollapsed"
              class="absolute left-full ml-2 px-2 py-1 bg-gray-600 dark:bg-gray-200 text-white dark:text-gray-800 text-sm rounded-md shadow-md z-50 whitespace-nowrap"
              :style="{ top: tooltipPosition }"
            >
              <div class="relative">
                {{ hoveredCategory }}
                <!-- 修改箭头方向 -->
                <div class="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-600 dark:bg-gray-200 transform rotate-45"></div>
              </div>
            </div>
          </button>
        </li>
      </ul>
      
      <!-- 收缩按钮 -->
      <button 
        v-if="showToggle"
        @click="$emit('toggle-sidebar')"
        class="absolute bottom-2 left-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
      >
        <i class="fas" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
      </button>
      <!-- 在侧边栏底部添加 -->
      <!-- 修改此处，移除 p-4 内边距 -->
      <div class="mt-auto">
        <router-link 
          to="/about" 
          class="flex items-center w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
        >
          <i class="fas fa-info-circle mr-0.1"></i>
          <span class="ml-2" :class="{ 'hidden': isCollapsed }">关于本站</span>
        </router-link>
      </div>
    </aside>
  </div>
</template>
<script>
export default {
  props: ['categories', 'isCollapsed'],
  data() {
    return {
      showToggle: false,
      hoveredCategory: null,
      tooltipPosition: '0px'
    };
  },
  methods: {
    showTooltip(category, event) {
      if (this.isCollapsed) {
        this.hoveredCategory = category;
        // 计算位置
        const rect = event.currentTarget.getBoundingClientRect();
        this.tooltipPosition = `${rect.top + window.scrollY + 8}px`;
      }
    },
    hideTooltip() {
      this.hoveredCategory = null;
    },
    selectCategory(category) {
      this.$emit('select-category', category);
    },
    getCategoryIcon(category) {
      // 从localStorage读取图标映射
      const savedIcons = localStorage.getItem('categoryIcons');
      const iconMap = savedIcons ? JSON.parse(savedIcons) : {};
      
      // 如果有配置的图标，直接返回完整图标类名，否则返回默认图标
      return iconMap[category] || 'fas fa-question-circle';
    },
    resetCategory() {
      this.$emit('select-category', null); // 发送null表示重置分类
    },
  },
};
</script>

<style scoped>
/* 添加平滑过渡效果 */
aside {
  transition: width 0.3s ease, box-shadow 0.3s ease;
}

/* 按钮样式 */
button {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* 添加过渡效果 */
button:hover {
  transition-delay: 0.1s; /* 提前触发悬停效果 */
}

/* 提示框动画 */
div[class*="bg-gray-"] {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-5px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
