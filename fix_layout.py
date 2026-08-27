import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_content = '''<!-- 财务概览与周期切换控制条 -->
<div class="wf-card p-5 border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/20 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">

  <!-- 左侧：核心数据（实收总额） -->
  <div class="flex-shrink-0">
    <div class="flex items-center gap-2 mb-1.5">
      <span class="font-medium text-stone-600 dark:text-stone-400 text-sm">实收总额</span>
      <span class="text-[11px] px-1.5 py-0.5 rounded font-mono text-stone-500 bg-stone-100 dark:bg-stone-800">
        {{ periodStatSummary.orderCount }} 笔
      </span>
    </div>
    <div class="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
      ¥ {{ periodStatSummary.totalAmount.toLocaleString() }}
    </div>
    <div class="text-xs text-stone-500 font-mono mt-1.5">
      周期实收资金
    </div>
  </div>

  <!-- 右侧：统计周期切换与选择器 -->
  <div class="flex flex-col items-start md:items-end gap-3">
    <!-- 周期切换按钮组 -->
    <div class="flex items-center gap-1 bg-stone-200/60 dark:bg-stone-800/80 p-1 rounded-lg text-xs font-medium">
      <button @click="statPeriodMode = 'month'"
        :class="statPeriodMode === 'month' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm font-bold' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'"
        class="px-3 py-1.5 rounded transition">按月统计</button>
      
      <button @click="statPeriodMode = 'quarter'"
        :class="statPeriodMode === 'quarter' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm font-bold' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'"
        class="px-3 py-1.5 rounded transition">按季度统计</button>
      
      <button @click="statPeriodMode = 'year'"
        :class="statPeriodMode === 'year' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm font-bold' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'"
        class="px-3 py-1.5 rounded transition">按年统计</button>
      
      <button @click="statPeriodMode = 'all'"
        :class="statPeriodMode === 'all' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm font-bold' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'"
        class="px-3 py-1.5 rounded transition">全部历史</button>
    </div>

    <!-- 联动选择器 -->
    <div class="flex items-center gap-2 text-xs flex-wrap">
      <!-- 按月 -->
      <div v-if="statPeriodMode === 'month'" class="flex items-center gap-2">
        <span class="text-stone-500">月份:</span>
        <input type="month" v-model="selectedMonthStr" class="px-2.5 py-1 wf-input font-mono text-xs bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
        <button @click="selectedMonthStr = currentYearMonth" class="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:underline">返回当月</button>
      </div>

      <!-- 按季 -->
      <div v-if="statPeriodMode === 'quarter'" class="flex items-center gap-2">
        <span class="text-stone-500">年份:</span>
        <select v-model="selectedYearStr" class="px-2 py-1 wf-select font-mono text-xs bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
          <option v-for="y in availableStatYears" :key="y" :value="y">{{ y }} 年度</option>
        </select>
        <div class="flex items-center bg-stone-200/60 dark:bg-stone-800/80 p-0.5 rounded text-xs font-mono font-medium">
          <button v-for="q in ['Q1', 'Q2', 'Q3', 'Q4']" :key="q"
            @click="selectedQuarterStr = q"
            :class="selectedQuarterStr === q ? 'bg-emerald-600 text-white font-bold' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'"
            class="px-2 py-0.5 rounded transition">
            {{ q }} ({{ q === 'Q1' ? '1-3月' : q === 'Q2' ? '4-6月' : q === 'Q3' ? '7-9月' : '10-12月' }})
          </button>
        </div>
      </div>

      <!-- 按年 -->
      <div v-if="statPeriodMode === 'year'" class="flex items-center gap-2">
        <span class="text-stone-500">年份:</span>
        <select v-model="selectedYearStr" class="px-2.5 py-1 wf-select font-mono text-xs bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
          <option v-for="y in availableStatYears" :key="y" :value="y">{{ y }} 年度</option>
        </select>
      </div>
    </div>
  </div>
</div>\n'''

new_lines = lines[:1374] + [new_content] + lines[1463:]

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
