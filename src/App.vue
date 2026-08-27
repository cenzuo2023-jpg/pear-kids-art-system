<template>
<div v-cloak class="notion-app-shell min-h-screen flex flex-col justify-between">
    
    <!-- ============================================================ -->
    <!-- 1. 🌟 固定通栏顶栏 (极简纯粹设计 · 四大核心Tab · 最高置顶 z-50) -->
    <!-- ============================================================ -->
    <header class="notion-sidebar sticky top-0 z-50 border-b border-black/[0.08] dark:border-white/10 w-full transition-colors"
      style="background-color: var(--bg-surface);">
      <div class="notion-sidebar-inner w-full px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        <!-- 品牌标识 (🍐 徽标 + 想吃梨儿童美术) -->
        <div class="notion-brand flex items-center gap-3 cursor-pointer group select-none flex-shrink-0" @click="currentTab = 'attendance'; profileStudent = null; selectedClassDetail = null;">
          <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-lg shadow-sm flex-shrink-0">
            🍐
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="font-black text-base sm:text-lg tracking-tight group-hover:text-emerald-400 transition-colors">
                {{ studioInfo.name }}
              </span>
            </div>
            <span class="text-[10px] text-black dark:text-stone-400 font-mono hidden md:inline">
              陈老师 · 美育教务工作台
            </span>
          </div>
        </div>

        <!-- 🌟 原生四大主功能导航 (极简纯粹线框胶囊) -->
        <nav class="notion-primary-nav hidden md:flex items-center wf-pill-container">
          
          <button @click="currentTab = 'attendance'; profileStudent = null; selectedClassDetail = null;"
            :class="currentTab === 'attendance' ? 'active' : ''"
            class="wf-pill-btn">
            <span>考勤大表</span>
          </button>

          <button @click="currentTab = 'ranking'; profileStudent = null; selectedClassDetail = null;"
            :class="currentTab === 'ranking' ? 'active' : ''"
            class="wf-pill-btn">
            <span>课时积分</span>
          </button>

          <button @click="currentTab = 'students'"
            :class="currentTab === 'students' || currentTab === 'class_detail' ? 'active' : ''"
            class="wf-pill-btn">
            <span>班级学员</span>
          </button>

          <button @click="currentTab = 'records'; profileStudent = null; selectedClassDetail = null;"
            :class="currentTab === 'records' ? 'active' : ''"
            class="wf-pill-btn">
            <span>财务中心</span>
          </button>

        </nav>

        <!-- 右侧工具栏 -->
        <div class="notion-sidebar-tools flex items-center gap-2">
          <button @click="exportDataJSON" title="导出数据备份" class="wf-btn-outline text-xs hidden sm:flex">
            <i class="fa-solid fa-cloud-arrow-down text-emerald-400"></i>
            <span>备份</span>
          </button>

          <label title="导入数据备份" class="wf-btn-outline text-xs hidden sm:flex cursor-pointer">
            <i class="fa-solid fa-cloud-arrow-up text-emerald-400"></i>
            <span>还原</span>
            <input type="file" accept=".json" @change="importDataJSON" class="hidden">
          </label>

          <!-- 🌓 主题模式切换 -->
          <button @click="toggleTheme" 
            class="w-9 h-9 rounded-full wf-btn-outline p-0 flex items-center justify-center"
            title="切换深色/浅色线框模式">
            <span v-if="!isDarkMode">☀️</span>
            <span v-else>🌙</span>
          </button>
        </div>

      </div>

      <!-- 📱 移动端底栏导航 (极简精简版) -->
      <div class="notion-mobile-nav md:hidden flex px-3 pb-2 pt-1 border-t border-black/[0.04] dark:border-white/[0.08]">
        <div class="grid grid-cols-4 gap-1 w-full text-center">
          <button @click="currentTab = 'attendance'; profileStudent = null; selectedClassDetail = null;"
            :class="currentTab === 'attendance' ? 'active' : ''"
            class="wf-pill-btn justify-center py-2 text-xs font-bold truncate">
            <span>考勤大表</span>
          </button>
          <button @click="currentTab = 'ranking'; profileStudent = null; selectedClassDetail = null;"
            :class="currentTab === 'ranking' ? 'active' : ''"
            class="wf-pill-btn justify-center py-2 text-xs font-bold truncate">
            <span>课时积分</span>
          </button>
          <button @click="currentTab = 'students'"
            :class="currentTab === 'students' || currentTab === 'class_detail' ? 'active' : ''"
            class="wf-pill-btn justify-center py-2 text-xs font-bold truncate">
            <span>班级学员</span>
          </button>
          <button @click="currentTab = 'records'; profileStudent = null; selectedClassDetail = null;"
            :class="currentTab === 'records' ? 'active' : ''"
            class="wf-pill-btn justify-center py-2 text-xs font-bold truncate">
            <span>财务中心</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ============================================================ -->
    <!-- 2. 🌟 固定通栏考勤工具条 (极简 Notion 工具栏 · 无多余重叠文字) -->
    <div v-if="currentTab === 'attendance'" class="sticky top-14 sm:top-16 z-40 w-full border-b border-[#e2e2e0] dark:border-[#333] py-2 px-4 sm:px-6 transition-colors shadow-sm"
      style="background-color: var(--bg-surface-subtle);">
      <div class="w-full flex items-center justify-between gap-4 flex-wrap">
        
        <!-- 左侧：班级快速下拉切换器与任课信息 -->
        <div class="flex items-center gap-3 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">班级</span>
          </div>

          <div class="relative">
            <select v-model="matrixClassId" 
              class="appearance-none pl-3 pr-8 py-1.5 nt-select text-sm font-bold cursor-pointer shadow-sm">
              <option v-for="c in activeClasses" :key="c.id" :value="c.id">
                🎨 {{ c.name }} ({{ activeStudents.filter(s => s.classId === c.id).length }}人)
              </option>
            </select>
            <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none"></i>
          </div>

          <span class="text-xs text-gray-600 dark:text-gray-400 hidden sm:inline font-medium pl-2 border-l border-[#e2e2e0] dark:border-[#333]">
            任课：<strong class="text-[#111827] dark:text-[#f3f4f6]">{{ getClassById(matrixClassId).teacher || '未设置' }}</strong> · {{ getClassById(matrixClassId).schedule || '未设置' }}
          </span>

          <span class="text-xs text-gray-500 font-mono hidden md:inline">
            (共 {{ matrixAttendanceRecords.length }} 次排课记录)
          </span>
        </div>

        <!-- 右侧：精简有力的操作按钮组 + 导出 -->
        <div class="flex items-center gap-2 flex-wrap flex-shrink-0">
          
          <!-- 全班一键奖积分 -->
          <button @click="openBatchPointReward(matrixClassId)" class="nt-btn text-xs sm:text-sm text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30">
            <i class="fa-solid fa-star text-amber-500 text-xs"></i>
            <span>全班奖积分</span>
          </button>

          <!-- 新增排课考勤 -->
          <button @click="openAddMatrixRow" class="nt-btn-primary text-xs sm:text-sm">
            <i class="fa-solid fa-plus text-xs"></i>
            <span>新增考勤</span>
          </button>

          <!-- 补录考勤 -->
          <button @click="openAdhocAttendanceModal('')" class="nt-btn text-xs sm:text-sm text-emerald-700 dark:text-emerald-400">
            <i class="fa-regular fa-clock text-xs"></i>
            <span>补考勤</span>
          </button>

          <!-- 导出大表 -->
          <button @click="openExportModal('matrix', null, matrixClassId)" class="nt-btn-export text-xs sm:text-sm">
            <i class="fa-solid fa-file-excel text-xs"></i>
            <span>导出大表 CSV</span>
          </button>

        </div>

      </div>
    </div>

    <!-- 主要内容区域 -->
    <!-- ============================================================ -->
    <main class="notion-workspace flex-1 pb-0" @click="activeCellDropdownKey = null">
      
      <!-- ======================================================== -->
      <!-- TAB 1: 📝 二维考勤总大表 (极简线框 · 紧凑排版 · 顺畅横向滑动) -->
      <!-- ======================================================== -->
      <section v-if="currentTab === 'attendance'" class="w-full">
        
        <!-- 表格水平滚动容器 (支持多学员流畅横向滑动，前两列固定) -->
        <div class="attendance-table-scroll w-full border-b border-[#e2e2e0] dark:border-[#333]" 
          style="overflow-x: auto !important; overflow-y: auto !important; max-width: 100vw; height: calc(100vh - 125px); -webkit-overflow-scrolling: touch; background-color: var(--bg-page);">
          <table class="attendance-matrix text-center text-sm border-collapse select-none" 
            style="width: max-content; min-width: 100%; border-spacing: 0; background-color: var(--bg-page);">
            
            <!-- 表头 (14px 粗体 · 课程与日期固定置顶与左置) -->
            <thead class="sticky top-0 z-30 shadow-sm border-b border-[#e2e2e0] dark:border-[#333]" style="background-color: var(--bg-surface);">
              <tr class="font-bold select-none">
                <!-- 01 课程主题 (固定左侧第1列 · 160px 宽 · 绝不挤压) -->
                <th class="py-3 pl-4 pr-3 text-left border-r border-[#e2e2e0] dark:border-[#333] min-w-[160px] w-[160px] whitespace-nowrap sticky left-0 z-30 shadow-sm" style="background-color: var(--bg-surface);">
                  <div class="flex items-center gap-1.5 whitespace-nowrap">
                    <span class="text-xs text-gray-500 font-mono font-bold">01</span>
                    <span class="text-sm font-bold tracking-tight text-[#111827] dark:text-[#f3f4f6]">课程主题</span>
                    <span class="text-xs text-gray-400 ml-0.5">✏️</span>
                  </div>
                </th>

                <!-- 02 上课日期 (固定左侧第2列 · 145px 宽 · 带排序) -->
                <th class="py-3 px-3 text-left border-r border-[#e2e2e0] dark:border-[#333] min-w-[145px] w-[145px] whitespace-nowrap sticky left-[160px] z-30 shadow-sm" style="background-color: var(--bg-surface);">
                  <div class="flex items-center gap-1.5 whitespace-nowrap cursor-pointer group hover:text-emerald-600 transition" @click="attendanceSortOrder = attendanceSortOrder === 'desc' ? 'asc' : 'desc'" title="点击切换时间排序">
                    <span class="text-xs text-gray-500 font-mono font-bold">02</span>
                    <span class="text-sm font-bold tracking-tight text-[#111827] dark:text-[#f3f4f6]">上课日期</span>
                    <i class="fa-solid fa-sort text-xs opacity-50 group-hover:opacity-100 transition text-gray-600" :class="attendanceSortOrder === 'desc' ? 'fa-sort-down text-emerald-600 opacity-100' : 'fa-sort-up text-emerald-600 opacity-100'"></i>
                    <span class="text-xs text-gray-400 ml-0.5">📅</span>
                  </div>
                </th>
                
                <!-- 🌟 学员列 (固定宽度 110px · 16人横排可顺畅横向滚动 · 绝对不截断) -->
                <th v-for="(stu, idx) in matrixStudents" :key="'name_' + stu.id" 
                  class="py-2.5 px-2 border-r border-[#e2e2e0] dark:border-[#333] min-w-[110px] w-[110px] whitespace-nowrap z-20" 
                  style="background-color: var(--bg-surface);">
                  
                  <div class="flex flex-col items-center justify-center gap-1">
                    <!-- 序号与学员姓名 -->
                    <div @click="openStudentProfile(stu)" 
                      class="cursor-pointer group flex items-center justify-center gap-1 font-bold text-sm text-[#111827] dark:text-[#f3f4f6] hover:text-emerald-600 transition whitespace-nowrap" 
                      :title="'#' + (idx + 1) + ' ' + stu.name + ' (点击查看档案)'">
                      <span class="text-xs font-mono text-gray-400 font-normal">#{{ idx + 1 }}</span>
                      <span class="text-[14px]">{{ stu.name }}</span>
                    </div>
                    
                    <!-- 剩余课时与积分微标签 -->
                    <div class="flex items-center justify-center gap-1 font-mono text-xs leading-none whitespace-nowrap">
                      <!-- 剩余课时 -->
                      <span :class="stu.remainHours <= 0 ? 'nt-tag-red' : stu.remainHours <= 3 ? 'nt-tag-yellow' : 'nt-tag-green'"
                        class="px-1.5 py-0.5 rounded font-bold font-mono">
                        余{{ stu.remainHours }}
                      </span>

                      <!-- 画币积分 -->
                      <button @click.stop="openIndividualPointModal(stu, 'add')" 
                        class="nt-tag-gold hover:border-amber-400 transition cursor-pointer font-bold flex items-center gap-0.5" 
                        :title="'点击为【' + stu.name + '】变更积分'">
                        <span>⭐</span>
                        <span>{{ stu.points || 0 }}</span>
                      </button>
                    </div>
                  </div>

                </th>

                <!-- 操作列 (固定最右侧) -->
                <th class="py-3 px-2 w-16 min-w-[64px] text-center text-gray-500 text-xs font-semibold sticky right-0 z-30 shadow-sm" style="background-color: var(--bg-surface);">
                  操作
                </th>
              </tr>
            </thead>

            <!-- 矩阵数据行 -->
            <tbody class="divide-y divide-[#e2e2e0] dark:divide-[#333]" style="background-color: var(--bg-page);">
              <tr v-for="att in matrixAttendanceRecords" :key="att.id" class="hover:bg-[#f7f7f5] dark:hover:bg-[#222] transition-colors">
                
                <!-- 🌟 课程主题 (固定第1列 · 160px · 单行快速修改) -->
                <td class="py-2.5 pl-4 pr-3 text-left border-r border-[#e2e2e0] dark:border-[#333] min-w-[160px] w-[160px] whitespace-nowrap sticky left-0 z-10 shadow-sm" style="background-color: var(--bg-surface);">
                  <div @click="openEditAttendanceRow(att)" 
                    class="cursor-pointer group flex items-center justify-between gap-1.5 py-1 px-1.5 -mx-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#282828] transition whitespace-nowrap"
                    title="点击修改课程主题与上课日期">
                    <div class="flex items-center gap-1.5 truncate max-w-[130px]">
                      <i class="fa-regular fa-file-lines text-gray-400 text-xs flex-shrink-0"></i>
                      <span class="font-bold text-sm text-[#111827] dark:text-[#f3f4f6] group-hover:text-emerald-600 transition-colors truncate">{{ att.theme }}</span>
                    </div>
                    <i class="fa-solid fa-pen text-xs text-gray-400 opacity-0 group-hover:opacity-100 text-emerald-600 transition-opacity flex-shrink-0"></i>
                  </div>
                </td>

                <!-- 🌟 上课日期 (固定第2列 · 145px · 单行快速修改) -->
                <td class="py-2.5 px-3 text-left border-r border-[#e2e2e0] dark:border-[#333] min-w-[145px] w-[145px] whitespace-nowrap sticky left-[160px] z-10 shadow-sm" style="background-color: var(--bg-surface);">
                  <div @click="openEditAttendanceRow(att)" 
                    class="cursor-pointer group flex items-center justify-between gap-1.5 py-1 px-1.5 -mx-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#282828] transition whitespace-nowrap"
                    title="点击修改上课日期与课程主题">
                    <div class="flex items-center gap-1.5 truncate">
                      <i class="fa-regular fa-calendar text-gray-400 text-xs flex-shrink-0"></i>
                      <span class="font-mono text-sm text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 transition-colors whitespace-nowrap">{{ att.date }}</span>
                    </div>
                    <i class="fa-solid fa-pen text-xs text-gray-400 opacity-0 group-hover:opacity-100 text-emerald-600 transition-opacity flex-shrink-0"></i>
                  </div>
                </td>

                <!-- 🌟 考勤状态单元格 (110px 宽度 · O(1)极速状态匹配 · 点击快速下拉) -->
                <td v-for="stu in matrixStudents" :key="stu.id" 
                  class="py-1.5 px-1 border-r border-[#e2e2e0] dark:border-[#333] relative transition-all text-center min-w-[110px] w-[110px]">
                  
                  <div @click.stop="toggleCellDropdown(att.id, stu.id, $event, att, stu)" 
                    class="cursor-pointer py-1 px-2 rounded-md font-bold text-xs inline-flex items-center justify-center gap-1 min-w-[76px] transition select-none hover:opacity-90 active:scale-95 shadow-sm"
                    :class="getMatrixCellClass(getStudentAttendanceCell(stu.id, att).status)"
                    :title="'点击修改【' + stu.name + '】出勤状态' + (getStudentAttendanceCell(stu.id, att).note ? ' (备注: ' + getStudentAttendanceCell(stu.id, att).note + ')' : '')">
                    
                    <span>{{ getStudentAttendanceCell(stu.id, att).status }}</span>
                    <i class="fa-solid fa-chevron-down text-[8px] opacity-60"></i>
                  </div>

                  <!-- 交互式浮层操作菜单 (Popover) -->
                  <div v-if="activeCellDropdownKey === (att.id + '_' + stu.id)" 
                    class="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-1 w-48 p-2 rounded-lg border border-[#e2e2e0] dark:border-[#444] shadow-xl space-y-1 text-left"
                    style="background-color: var(--bg-surface);">
                    

                    <button @click.stop="selectCellStatusFromDropdown(att, stu, '到课')"
                      class="w-full flex items-center px-2.5 py-1.5 rounded text-xs font-bold hover:bg-emerald-50 text-emerald-700 dark:hover:bg-emerald-950/30 transition"
                      :class="getStudentAttendanceCell(stu.id, att).status === '到课' ? 'bg-emerald-50 border border-emerald-300' : ''">
                      <span class="flex items-center gap-1.5"><span>🟢</span> 到课</span>
                    </button>

                    <button @click.stop="selectCellStatusFromDropdown(att, stu, '未到')"
                      class="w-full flex items-center px-2.5 py-1.5 rounded text-xs font-bold hover:bg-rose-50 text-rose-700 dark:hover:bg-rose-950/30 transition"
                      :class="getStudentAttendanceCell(stu.id, att).status === '未到' || getStudentAttendanceCell(stu.id, att).status === '请假' ? 'bg-rose-50 border border-rose-300' : ''">
                      <span class="flex items-center gap-1.5"><span>🔴</span> 请假/未到</span>
                    </button>

                    <button @click.stop="selectCellStatusFromDropdown(att, stu, '放假')"
                      class="w-full flex items-center px-2.5 py-1.5 rounded text-xs font-bold hover:bg-purple-50 text-purple-700 dark:hover:bg-purple-950/30 transition"
                      :class="getStudentAttendanceCell(stu.id, att).status === '放假' ? 'bg-purple-50 border border-purple-300' : ''">
                      <span class="flex items-center gap-1.5"><span>🟣</span> 全班放假</span>
                    </button>


                  </div>
                </td>

                <!-- 操作列 (固定右侧) -->
                <td class="py-2 px-2 text-center whitespace-nowrap sticky right-0 z-10 shadow-sm" style="background-color: var(--bg-surface);">
                  <div class="flex items-center justify-center gap-1.5">
                    <button @click="openEditAttendanceRow(att)" class="p-1 text-gray-500 hover:text-black dark:hover:text-white transition" title="编辑整行考勤">
                      <i class="fa-solid fa-pen text-xs"></i>
                    </button>
                    <button @click="deleteMatrixRow(att)" class="p-1 text-gray-400 hover:text-rose-600 transition" title="删除该次排课">
                      <i class="fa-regular fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </td>

              </tr>

              <tr v-if="matrixAttendanceRecords.length === 0">
                <td :colspan="matrixStudents.length + 3" class="py-16 text-center text-gray-500 text-sm">
                  该班级暂无排课考勤记录，点击右上角【+ 新增排课】开始记录
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </section>

      <!-- ======================================================== -->
      <!-- TAB 2: 📊 排行榜中心 (课时榜 & 积分榜) -->
      <!-- ======================================================== -->
      <section v-if="currentTab === 'ranking'" class="max-w-[1600px] mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        <!-- 排行榜子导航 (极简纯净胶囊) -->
        <div class="flex items-center justify-between gap-4 pb-3 border-b border-black/10 dark:border-white/10 flex-wrap">
          <div class="flex items-center gap-2 wf-pill-container">
            <button @click="rankingViewType = 'hours'"
              :class="rankingViewType === 'hours' ? 'active' : ''"
              class="wf-pill-btn">
              <span>课时榜</span>
            </button>

            <button @click="rankingViewType = 'points'"
              :class="rankingViewType === 'points' ? 'active' : ''"
              class="wf-pill-btn">
              <span>积分榜</span>
            </button>
          </div>

          <!-- 右侧统计快捷标签 -->
          <div class="text-xs text-black dark:text-stone-400 flex items-center gap-3">
            <span>全校在读：<strong>{{ kpiStats.totalStudents }}</strong> 人</span>
            <span>全校画币积分池：<strong class="text-amber-400 font-mono font-bold">{{ kpiStats.totalPoints }}</strong> 分</span>
          </div>
        </div>

        <!-- 视图 A: 📊 课时排行榜 -->
        <div v-if="rankingViewType === 'hours'" class="space-y-6">
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="wf-card p-5">
              <div class="text-xs text-black dark:text-stone-400 font-medium">在读小艺术家</div>
              <div class="text-3xl font-black mt-1">{{ kpiStats.totalStudents }} <span class="text-xs font-normal text-black dark:text-stone-400">人</span></div>
            </div>
            <div class="wf-card p-5">
              <div class="text-xs text-black dark:text-stone-400 font-medium">全校总剩余课时</div>
              <div class="text-3xl font-black text-emerald-400 mt-1">{{ kpiStats.totalHours }} <span class="text-xs font-normal text-black dark:text-stone-400">节</span></div>
            </div>
            <div @click="rankingHourFilter = 'depleted'" class="wf-card-interactive p-5">
              <div class="text-xs text-rose-400 font-bold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>已耗尽 (0 课时)</span>
              </div>
              <div class="text-3xl font-black text-rose-400 mt-1">{{ kpiStats.depleted }} <span class="text-xs font-normal text-rose-400/80">人需续费</span></div>
            </div>
            <div @click="rankingHourFilter = 'warning'" class="wf-card-interactive p-5">
              <div class="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>预警期 (1~3 课时)</span>
              </div>
              <div class="text-3xl font-black text-amber-400 mt-1">{{ kpiStats.warning }} <span class="text-xs font-normal text-amber-400/80">人待提醒</span></div>
            </div>
          </div>

          <!-- 筛选与控制栏 -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div class="flex items-center gap-3 flex-1 max-w-xl">
              <div class="relative flex-1">
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-xs"></i>
                <input v-model="rankingSearchQuery" type="text" placeholder="搜索学员姓名或电话..."
                  class="w-full pl-9 pr-4 py-2 wf-input text-xs placeholder:text-black dark:text-stone-400">
              </div>

              <div class="relative">
                <select v-model="rankingClassFilter" class="appearance-none pl-4 pr-8 py-2 wf-select text-xs font-medium cursor-pointer">
                  <option value="all">🌈 全部班级</option>
                  <option v-for="c in activeClasses" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-[10px] pointer-events-none"></i>
              </div>
            </div>

            <button @click="exportRankingCSV" class="wf-btn-outline text-xs text-emerald-400 border-emerald-500/30 whitespace-nowrap">
              <i class="fa-solid fa-file-csv mr-1"></i>
              <span>导出课时排行 CSV</span>
            </button>
          </div>

          <!-- 课时排行大表 -->
          <div class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400" style="background-color: var(--bg-surface-subtle);">
                  <th class="py-3.5 px-4 whitespace-nowrap">排序</th>
                  <th class="py-3.5 px-4 whitespace-nowrap">学员姓名</th>
                  <th class="py-3.5 px-4 whitespace-nowrap">所在班级</th>
                  <th class="py-3.5 px-4 whitespace-nowrap">剩余课时</th>
                  <th class="py-3.5 px-4 whitespace-nowrap">画币积分</th>
                  <th class="py-3.5 px-4 whitespace-nowrap">累计消课</th>
                  <th class="py-3.5 px-4 whitespace-nowrap">家长联系电话</th>
                  <th class="py-3.5 px-5 text-right whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                <tr v-for="(stu, idx) in rankingList" :key="stu.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                  <td class="py-3 px-4 font-mono font-bold text-black dark:text-stone-400 whitespace-nowrap">#{{ (idx + 1).toString().padStart(2, '0') }}</td>
                  <td class="py-3 px-4 font-bold cursor-pointer group whitespace-nowrap" @click="openStudentProfile(stu)">
                    <span class="group-hover:text-emerald-400 transition">{{ stu.name }} ↗</span>
                  </td>
                  <td class="py-3 px-4 text-black dark:text-stone-400 whitespace-nowrap">{{ getClassById(stu.classId).name }}</td>
                  <td class="py-3 px-4 font-bold font-mono text-sm whitespace-nowrap" :class="stu.remainHours <= 0 ? 'text-rose-400' : stu.remainHours <= 3 ? 'text-amber-400' : 'text-emerald-400'">
                    {{ stu.remainHours }} 节
                  </td>
                  <td class="py-3 px-4 whitespace-nowrap">
                    <button @click.stop="openIndividualPointModal(stu, 'add')" class="wf-badge-gold cursor-pointer hover:scale-105 active:scale-95 transition" :title="'点击变更【' + stu.name + '】积分'">
                      <span>⭐ {{ stu.points || 0 }}</span>
                      <span class="text-[9px] opacity-75 ml-0.5">▾</span>
                    </button>
                  </td>
                  <td class="py-3 px-4 font-mono text-black dark:text-stone-300 whitespace-nowrap">{{ stu.totalConsumed || 0 }} 节</td>
                  <td class="py-3 px-4 font-mono text-black dark:text-stone-400 whitespace-nowrap">{{ stu.parentName }} ({{ stu.parentPhone }})</td>
                  <td class="py-3 px-5 text-right space-x-2 whitespace-nowrap">
                    <button @click="openIndividualPointModal(stu, 'add')" class="text-xs text-amber-400 font-bold hover:underline">⭐ 变更积分</button>
                    <button @click="openRecharge(stu)" class="text-xs text-emerald-400 font-bold hover:underline">续费</button>
                    <button @click="openStudentProfile(stu)" class="text-xs text-black dark:text-stone-400 hover:text-emerald-400">档案 ↗</button>
                    <button @click="archiveStudent(stu)" class="text-xs text-amber-500 hover:underline">归档</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <!-- 视图 B: 🏆 积分光荣榜 -->
        <div v-if="rankingViewType === 'points'" class="space-y-6">
          
          <!-- 前三甲领奖台 -->
          <div v-if="pointsRankingList.length >= 3" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- 🥈 亚军 -->
            <div class="wf-card p-6 flex flex-col justify-between items-center text-center order-2 md:order-1 border-stone-400/30 bg-stone-500/[0.04]">
              <div>
                <div class="text-xs font-bold text-black dark:text-stone-400">🥈 荣耀亚军</div>
                <div class="text-base font-black mt-0.5">{{ pointsRankingList[1].name }} ({{ pointsRankingList[1].className }})</div>
                <div class="text-2xl font-black text-amber-400 mt-2 font-mono">
                  ⭐ {{ pointsRankingList[1].points }} <span class="text-xs text-black dark:text-stone-400 font-normal">可用画币</span>
                </div>
                <div class="text-xs text-black dark:text-stone-400 mt-1">累计获得: {{ pointsRankingList[1].totalPointsEarned }} 分</div>
              </div>
              <div class="flex gap-2 w-full mt-4 pt-3 border-t border-black/10 dark:border-white/10">
                <button @click="openIndividualPointModal(pointsRankingList[1], 'add')" class="wf-btn-primary flex-1 text-xs py-1.5 justify-center">
                  ⭐ 变更积分
                </button>
                <button @click="openIndividualPointModal(pointsRankingList[1], 'redeem')" class="wf-btn-outline flex-1 text-xs py-1.5 justify-center text-amber-400 border-amber-500/30">
                  🎁 兑换礼物
                </button>
              </div>
            </div>

            <!-- 🥇 冠军 -->
            <div class="wf-card p-6 flex flex-col justify-between items-center text-center order-1 md:order-2 border-amber-400/50 bg-amber-500/[0.08] shadow-lg md:-translate-y-2">
              <div>
                <div class="text-xs font-bold text-amber-400">👑 荣耀榜首 · 积分之星</div>
                <div class="text-lg font-black mt-0.5 text-amber-400">{{ pointsRankingList[0].name }} ({{ pointsRankingList[0].className }})</div>
                <div class="text-3xl font-black text-amber-400 mt-2 font-mono">
                  ⭐ {{ pointsRankingList[0].points }} <span class="text-xs text-black dark:text-stone-400 font-normal">可用画币</span>
                </div>
                <div class="text-xs text-black dark:text-stone-300 mt-1">累计获得: {{ pointsRankingList[0].totalPointsEarned }} 分</div>
              </div>
              <div class="flex gap-2 w-full mt-4 pt-3 border-t border-amber-500/20">
                <button @click="openIndividualPointModal(pointsRankingList[0], 'add')" class="wf-btn-primary flex-1 text-xs py-1.5 justify-center">
                  ⭐ 变更积分
                </button>
                <button @click="openIndividualPointModal(pointsRankingList[0], 'redeem')" class="wf-btn-outline flex-1 text-xs py-1.5 justify-center text-amber-400 border-amber-500/30">
                  🎁 兑换礼物
                </button>
              </div>
            </div>

            <!-- 🥉 季军 -->
            <div class="wf-card p-6 flex flex-col justify-between items-center text-center order-3 md:order-3 border-amber-700/30 bg-amber-700/[0.04]">
              <div>
                <div class="text-xs font-bold text-amber-600">🥉 荣耀季军</div>
                <div class="text-base font-black mt-0.5">{{ pointsRankingList[2].name }} ({{ pointsRankingList[2].className }})</div>
                <div class="text-2xl font-black text-amber-500 mt-2 font-mono">
                  ⭐ {{ pointsRankingList[2].points }} <span class="text-xs text-black dark:text-stone-400 font-normal">可用画币</span>
                </div>
                <div class="text-xs text-black dark:text-stone-400 mt-1">累计获得: {{ pointsRankingList[2].totalPointsEarned }} 分</div>
              </div>
              <div class="flex gap-2 w-full mt-4 pt-3 border-t border-black/10 dark:border-white/10">
                <button @click="openIndividualPointModal(pointsRankingList[2], 'add')" class="wf-btn-primary flex-1 text-xs py-1.5 justify-center">
                  ⭐ 变更积分
                </button>
                <button @click="openIndividualPointModal(pointsRankingList[2], 'redeem')" class="wf-btn-outline flex-1 text-xs py-1.5 justify-center text-amber-400 border-amber-500/30">
                  🎁 兑换礼物
                </button>
              </div>
            </div>

          </div>

          <!-- 积分榜筛选控制栏 -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div class="flex items-center gap-3 flex-1 max-w-xl">
              <div class="relative flex-1">
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-xs"></i>
                <input v-model="pointsSearchQuery" type="text" placeholder="搜索小画家姓名..."
                  class="w-full pl-9 pr-4 py-2 wf-input text-xs placeholder:text-black dark:text-stone-400">
              </div>

              <div class="relative">
                <select v-model="pointsClassFilter" class="appearance-none pl-4 pr-8 py-2 wf-select text-xs font-medium cursor-pointer">
                  <option value="all">🌈 全部班级</option>
                  <option v-for="c in activeClasses" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-[10px] pointer-events-none"></i>
              </div>

              <div class="relative">
                <select v-model="pointsRankingSort" class="appearance-none pl-4 pr-8 py-2 wf-select text-xs font-bold cursor-pointer">
                  <option value="points">⭐ 按当前可用积分</option>
                  <option value="total">🏆 按累计总获得积分</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-[10px] pointer-events-none"></i>
              </div>
            </div>

            <button @click="exportPointsRankingCSV" class="wf-btn-outline text-xs text-amber-400 border-amber-500/30 whitespace-nowrap">
              <i class="fa-solid fa-file-csv mr-1"></i>
              <span>导出积分光荣榜 CSV</span>
            </button>
          </div>

          <!-- 积分光荣榜大表 -->
          <div class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400" style="background-color: var(--bg-surface-subtle);">
                  <th class="py-3.5 px-4 whitespace-nowrap">排名</th>
                  <th class="py-3.5 px-4 whitespace-nowrap">小艺术家</th>
                  <th class="py-3.5 px-4 whitespace-nowrap">所在班级</th>
                  <th class="py-3.5 px-4 whitespace-nowrap">当前可用画币</th>
                  <th class="py-3.5 px-4 whitespace-nowrap">累计总获得</th>
                  <th class="py-3.5 px-4 whitespace-nowrap">已兑换礼物</th>
                  <th class="py-3.5 px-4 hidden md:table-cell whitespace-nowrap">家长联系方式</th>
                  <th class="py-3.5 px-5 text-right whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                <tr v-for="stu in pointsRankingList" :key="stu.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                  <td class="py-3.5 px-4 font-mono font-bold">
                    <span v-if="stu.rank === 1" class="text-amber-400 font-black">🥇 01</span>
                    <span v-else-if="stu.rank === 2" class="text-black dark:text-stone-300 font-black">🥈 02</span>
                    <span v-else-if="stu.rank === 3" class="text-amber-600 font-black">🥉 03</span>
                    <span v-else class="text-black dark:text-stone-400">#{{ stu.rank.toString().padStart(2, '0') }}</span>
                  </td>

                  <td class="py-3.5 px-4 cursor-pointer group" @click="openStudentProfile(stu)" title="点击查看个人档案">
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-lg border border-black/10 dark:border-white/20 flex items-center justify-center font-bold text-xs group-hover:border-emerald-400 transition" style="background-color: var(--bg-surface-hover);">
                        {{ stu.name.charAt(0) }}
                      </div>
                      <div>
                        <div class="font-bold group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                          <span>{{ stu.name }}</span>
                          <i class="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity"></i>
                        </div>
                        <div class="text-[10px] text-black dark:text-stone-400">{{ stu.age }}岁</div>
                      </div>
                    </div>
                  </td>

                  <td class="py-3.5 px-4">
                    <span class="text-xs text-black dark:text-stone-400 font-medium">{{ stu.className }}</span>
                  </td>

                  <td class="py-3.5 px-4">
                    <span class="font-black font-mono text-base text-amber-400">
                      ⭐ {{ stu.points || 0 }} <span class="text-xs font-normal text-black dark:text-stone-400">分</span>
                    </span>
                  </td>

                  <td class="py-3.5 px-4 font-mono text-black dark:text-stone-300 font-bold">
                    {{ stu.totalPointsEarned || 0 }} 分
                  </td>

                  <td class="py-3.5 px-4">
                    <span class="text-xs px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 font-medium">
                      🎁 {{ stu.redeemedCount || 0 }} 件
                    </span>
                  </td>

                  <td class="py-3.5 px-4 hidden md:table-cell text-xs text-black dark:text-stone-400 font-mono">
                    {{ stu.parentName }} ({{ stu.parentPhone }})
                  </td>

                  <td class="py-3.5 px-5 text-right space-x-2">
                    <button @click="openIndividualPointModal(stu, 'add')" class="wf-btn-primary text-xs py-1 px-3">
                      ⭐ 变更积分
                    </button>
                    <button @click="openIndividualPointModal(stu, 'redeem')" class="wf-btn-outline text-xs py-1 px-2.5 text-amber-400 border-amber-500/30">
                      🎁 兑换
                    </button>
                    <button @click="openStudentProfile(stu)" class="text-xs text-black dark:text-stone-400 hover:text-emerald-400 font-medium">
                      档案 ↗
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </section>

      <!-- ======================================================== -->
      <!-- TAB 3: 🎨 班级与学员系统 -->
      <!-- ======================================================== -->
      <section v-if="currentTab === 'students'" class="max-w-[1600px] mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        <!-- 三位一体顶级子导航 -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-black/10 dark:border-white/10">
          
          <div class="flex items-center gap-1.5 wf-pill-container">
            <button @click="rosterSubTab = 'classes'"
              :class="rosterSubTab === 'classes' ? 'active' : ''"
              class="wf-pill-btn">
              <span>班级管理</span>
            </button>

            <button @click="rosterSubTab = 'students'"
              :class="rosterSubTab === 'students' ? 'active' : ''"
              class="wf-pill-btn">
              <span>学员名册</span>
            </button>

            <button @click="rosterSubTab = 'archive'"
              :class="rosterSubTab === 'archive' ? 'active' : ''"
              class="wf-pill-btn">
              <span>归档中心</span>
            </button>
          </div>

          <!-- 右侧操作入口 -->
          <div class="flex items-center gap-3 flex-shrink-0">
            <button v-if="rosterSubTab === 'classes'" @click="openAddClass" class="wf-btn-primary">
              <i class="fa-solid fa-folder-plus text-xs"></i>
              <span>开设新班级</span>
            </button>

            <button v-if="rosterSubTab === 'students'" @click="openAddStudent(selectedRosterClassId)" class="wf-btn-primary">
              <i class="fa-solid fa-user-plus text-xs"></i>
              <span>录入新学员</span>
            </button>
          </div>

        </div>

        <!-- 视图 1: 班级管理系统 (极简优雅卡片流) -->
        <div v-if="rosterSubTab === 'classes'" class="space-y-4">
          
          <div class="flex items-center justify-between text-xs text-black dark:text-stone-400">
            <div>正常开班：<strong class="text-black dark:text-stone-200">{{ activeClasses.length }}</strong> 班 · 在读学员：<strong class="text-black dark:text-stone-200">{{ activeStudents.length }}</strong> 人</div>
            <button @click="exportClassAttendanceCSV('all')" class="text-emerald-400 hover:underline font-bold flex items-center gap-1">
              <i class="fa-solid fa-file-csv"></i>
              <span>导出全校考勤表</span>
            </button>
          </div>

          <!-- 班级极简线框卡片网格 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="cls in activeClasses" :key="cls.id"
              class="wf-card p-5 flex flex-col justify-between hover:border-emerald-500/40 transition group space-y-4">
              
              <div class="space-y-3">
                <!-- 头部：班级名与在读人数胶囊 (点击进入二级班级管理主页) -->
                <div class="flex items-start justify-between gap-3">
                  <div @click="openClassDetail(cls)" class="cursor-pointer">
                    <h4 class="font-black text-base group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <span>{{ cls.name }}</span>
                      <i class="fa-solid fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity"></i>
                    </h4>
                    <p class="text-xs text-black dark:text-stone-400 font-mono mt-1">
                      {{ cls.schedule }} · {{ cls.classroom || '梨香画坊' }}
                    </p>
                  </div>

                  <!-- 满班状态微胶囊 (禁止折行) -->
                  <span class="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap"
                    :class="activeStudents.filter(s => s.classId === cls.id).length >= (cls.capacity || 8) ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'">
                    {{ activeStudents.filter(s => s.classId === cls.id).length }}/{{ cls.capacity || 8 }} 人
                  </span>
                </div>

                <!-- 学员头像叠层流与任课老师 -->
                <div class="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                  <div class="flex items-center -space-x-1.5 overflow-hidden">
                    <div v-for="stu in activeStudents.filter(s => s.classId === cls.id).slice(0, 6)" :key="stu.id"
                      @click="openStudentProfile(stu)"
                      :title="'点击查看【' + stu.name + '】档案'"
                      class="w-7 h-7 rounded-full border-2 border-[var(--bg-surface)] flex items-center justify-center font-bold text-[11px] cursor-pointer hover:scale-110 transition shadow-sm"
                      style="background-color: var(--bg-surface-hover);">
                      {{ stu.name.charAt(0) }}
                    </div>
                    <div v-if="activeStudents.filter(s => s.classId === cls.id).length > 6"
                      class="w-7 h-7 rounded-full border-2 border-[var(--bg-surface)] flex items-center justify-center font-mono text-[10px] font-bold text-black dark:text-stone-400"
                      style="background-color: var(--bg-surface-subtle);">
                      +{{ activeStudents.filter(s => s.classId === cls.id).length - 6 }}
                    </div>
                    <span v-if="activeStudents.filter(s => s.classId === cls.id).length === 0" class="text-xs text-black dark:text-stone-400 italic">
                      暂无在读学员
                    </span>
                  </div>

                  <span class="text-xs text-black dark:text-stone-400 font-medium">
                    {{ cls.teacher || '陈老师' }}
                  </span>
                </div>

              </div>

              <!-- 底部操作栏 -->
              <div class="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
                <button @click="openClassDetail(cls)" class="wf-btn-primary text-xs py-1.5 px-3 flex-1 justify-center" title="进入该班级学员与考勤二级主页">
                  <i class="fa-solid fa-users text-[11px]"></i>
                  <span>班级学员 ↗</span>
                </button>

                <button @click="goToAttendanceForClass(cls.id)" class="wf-btn-outline text-xs py-1.5 px-3 whitespace-nowrap" title="前往本班二维考勤大表">
                  <span>考勤大表</span>
                </button>

                <button @click="openAddStudent(cls.id)" class="wf-btn-outline text-xs py-1.5 px-2.5 whitespace-nowrap" title="为此班级添加新学员">
                  <span>+ 学员</span>
                </button>

                <div class="flex items-center gap-1">
                  <button @click="openBatchPointReward(cls.id)" title="全班奖积分" class="wf-btn-outline text-xs p-1.5 text-amber-400">
                    <i class="fa-solid fa-star"></i>
                  </button>
                  <button @click="openEditClass(cls)" title="编辑班级" class="wf-btn-outline text-xs p-1.5">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button @click="archiveClass(cls)" title="归档班级" class="wf-btn-outline text-xs p-1.5 text-black dark:text-stone-400 hover:text-amber-400">
                    <i class="fa-solid fa-box-archive"></i>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        <!-- 视图 2: 👶 学员名册档案 -->
        <div v-if="rosterSubTab === 'students'" class="space-y-4">
          
          <!-- Notion 风格筛选与快速操作栏 -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#e2e2e0] dark:border-[#333] flex-wrap">
            
            <!-- 左侧：班级下拉 + 课时状态标签筛选 + 搜索框 -->
            <div class="flex items-center gap-2.5 flex-wrap">
              
              <!-- 班级筛选 -->
              <div class="relative">
                <select v-model="selectedRosterClassId" 
                  class="appearance-none pl-3 pr-8 py-1.5 nt-select text-sm font-bold cursor-pointer">
                  <option value="all">🌈 全校在读小画家 ({{ activeStudents.length }}人)</option>
                  <option v-for="c in activeClasses" :key="c.id" :value="c.id">
                    🎨 {{ c.name }} ({{ activeStudents.filter(s => s.classId === c.id).length }}人)
                  </option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none"></i>
              </div>

              <!-- 课时预警快捷分段标签 (Notion Filter Pills) -->
              <div class="inline-flex items-center p-0.5 rounded-md border border-[#e2e2e0] dark:border-[#333] bg-[#f7f7f5] dark:bg-[#262626] text-xs">
                <button @click="rosterHourFilter = 'all'"
                  :class="rosterHourFilter === 'all' ? 'bg-white dark:bg-[#333] font-bold shadow-sm text-black dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-black'"
                  class="px-2.5 py-1 rounded transition">
                  全部 ({{ activeStudents.length }})
                </button>
                <button @click="rosterHourFilter = 'sufficient'"
                  :class="rosterHourFilter === 'sufficient' ? 'bg-white dark:bg-[#333] font-bold shadow-sm text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600'"
                  class="px-2.5 py-1 rounded transition">
                  充足 ({{ activeStudents.filter(s => Number(s.remainHours || 0) > 3).length }})
                </button>
                <button @click="rosterHourFilter = 'warning'"
                  :class="rosterHourFilter === 'warning' ? 'bg-white dark:bg-[#333] font-bold shadow-sm text-amber-700 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400 hover:text-amber-600'"
                  class="px-2.5 py-1 rounded transition">
                  ⚠️ 待续费 ({{ activeStudents.filter(s => Number(s.remainHours || 0) <= 3 && Number(s.remainHours || 0) > 0).length }})
                </button>
                <button @click="rosterHourFilter = 'exhausted'"
                  :class="rosterHourFilter === 'exhausted' ? 'bg-white dark:bg-[#333] font-bold shadow-sm text-rose-700 dark:text-rose-400' : 'text-gray-600 dark:text-gray-400 hover:text-rose-600'"
                  class="px-2.5 py-1 rounded transition">
                  🚫 告罄/欠费 ({{ activeStudents.filter(s => Number(s.remainHours || 0) <= 0).length }})
                </button>
              </div>

              <!-- 搜索框 -->
              <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <input v-model="rosterStudentSearch" type="text" placeholder="搜索姓名/电话/家长..."
                  class="w-44 sm:w-52 pl-8 pr-3 py-1.5 nt-input text-xs sm:text-sm placeholder:text-gray-400">
              </div>
            </div>

            <!-- 右侧：录入与导出 -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <button @click="openAddStudent(selectedRosterClassId)" class="nt-btn-primary text-xs sm:text-sm">
                <i class="fa-solid fa-user-plus text-xs"></i>
                <span>录入新学员</span>
              </button>
              <button @click="exportClassAttendanceCSV(selectedRosterClassId)" class="nt-btn-export text-xs sm:text-sm">
                <i class="fa-solid fa-file-excel text-xs"></i>
                <span>导出学员花名册 CSV</span>
              </button>
            </div>

          </div>

          <div class="overflow-x-auto w-full nt-card">
            <table class="w-full text-left text-sm border-collapse select-none">
              <thead>
                <tr class="border-b border-[#e2e2e0] dark:border-[#333] text-gray-600 dark:text-gray-400 font-bold text-xs uppercase tracking-wider" style="background-color: var(--bg-surface-subtle);">
                  <th class="py-3 px-4 whitespace-nowrap min-w-[140px]">学员姓名</th>
                  <th class="py-3 px-3 whitespace-nowrap min-w-[90px]">年龄/性别</th>
                  <th class="py-3 px-4 whitespace-nowrap min-w-[170px]">所属班级</th>
                  <th class="py-3 px-4 whitespace-nowrap min-w-[120px]">课时余额</th>
                  <th class="py-3 px-3 whitespace-nowrap min-w-[100px]">画币积分</th>
                  <th class="py-3 px-4 whitespace-nowrap min-w-[150px]">家长联系方式</th>
                  <th class="py-3 px-4 min-w-[140px]">备注说明</th>
                  <th class="py-3 px-4 text-right whitespace-nowrap min-w-[190px]">快捷管理</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#e2e2e0] dark:divide-[#333]">
                <tr v-for="s in currentClassStudentsList" :key="s.id" class="hover:bg-[#f7f7f5] dark:hover:bg-[#222222] transition-colors">
                  
                  <!-- 学员姓名 (大号字体 · 头像与姓名) -->
                  <td class="py-3 px-4 font-bold cursor-pointer group whitespace-nowrap" @click="openStudentProfile(s)" title="点击进入学员完整档案">
                    <div class="flex items-center gap-2.5 whitespace-nowrap">
                      <div class="w-7 h-7 rounded-md border border-[#e2e2e0] dark:border-[#444] bg-[#f7f7f5] dark:bg-[#262626] flex items-center justify-center font-bold text-xs text-black dark:text-white group-hover:border-black transition flex-shrink-0">
                        {{ s.name.charAt(0) }}
                      </div>
                      <span class="group-hover:text-emerald-600 transition-colors flex items-center gap-1 font-bold text-[15px] text-[#111827] dark:text-[#f3f4f6] whitespace-nowrap">
                        <span>{{ s.name }}</span>
                        <i class="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-0 group-hover:opacity-100 text-emerald-600 transition-opacity flex-shrink-0"></i>
                      </span>
                    </div>
                  </td>

                  <!-- 年龄/性别 -->
                  <td class="py-3 px-3 text-gray-700 dark:text-gray-300 whitespace-nowrap text-sm">
                    <span class="font-mono font-semibold">{{ s.age || '-' }}</span> 岁 · {{ s.gender || '女' }}
                  </td>

                  <!-- 所属班级 -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    <span class="font-semibold text-sm text-[#111827] dark:text-gray-200">{{ getClassById(s.classId).name }}</span>
                  </td>

                  <!-- 剩余课时 (Notion 显眼状态标签) -->
                  <td class="py-3 px-4 whitespace-nowrap font-mono font-bold">
                    <span :class="s.remainHours <= 0 ? 'nt-tag-red' : s.remainHours <= 3 ? 'nt-tag-yellow' : 'nt-tag-green'"
                      class="px-2.5 py-1 rounded text-sm inline-block font-mono">
                      余 {{ s.remainHours }} 节
                    </span>
                  </td>

                  <!-- 画币积分 -->
                  <td class="py-3 px-3 whitespace-nowrap">
                    <button @click.stop="openIndividualPointModal(s, 'add')" 
                      class="nt-tag-gold cursor-pointer hover:border-amber-400 transition"
                      :title="'点击为【' + s.name + '】变更积分'">
                      <span>⭐ {{ s.points || 0 }}</span>
                      <span class="text-[9px] opacity-60 ml-0.5">▾</span>
                    </button>
                  </td>

                  <!-- 家长联系方式 -->
                  <td class="py-3 px-4 font-mono text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    <span class="font-semibold text-black dark:text-white">{{ s.parentName || '-' }}</span>
                    <span v-if="s.parentPhone" class="text-gray-500 dark:text-gray-400 ml-1.5 font-mono text-xs">({{ s.parentPhone }})</span>
                  </td>

                  <!-- 备注 -->
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400 text-xs truncate max-w-xs" :title="s.notes || ''">
                    {{ s.notes || '-' }}
                  </td>

                  <!-- 快捷操作栏 (Notion 简洁工具动作) -->
                  <td class="py-3 px-4 text-right whitespace-nowrap space-x-1">
                    <button @click="openRecharge(s)" class="px-2 py-1 rounded text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition">
                      续费
                    </button>
                    <button @click="openIndividualPointModal(s, 'add')" title="为学员变更积分" class="px-2 py-1 rounded text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition">
                      积分
                    </button>
                    <button @click="openEditStudent(s)" class="px-2 py-1 rounded text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                      编辑
                    </button>
                    <button @click="archiveStudent(s)" title="归档该学员" class="px-2 py-1 rounded text-xs font-semibold text-gray-600 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition">
                      归档
                    </button>
                    <button @click="deleteStudent(s)" class="px-2 py-1 rounded text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition">
                      删除
                    </button>
                  </td>

                </tr>

                <tr v-if="currentClassStudentsList.length === 0">
                  <td colspan="8" class="py-12 text-center text-gray-500 text-sm">
                    未找到符合条件的学员，点击右上角【录入新学员】建档
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <!-- 视图 3: 🗄️ 双向归档历史中心 -->
        <div v-if="rosterSubTab === 'archive'" class="space-y-6">
          
          <div class="wf-card p-4 space-y-1">
            <h4 class="font-bold text-sm">🗄️ 教务历史归档库</h4>
            <p class="text-xs text-black dark:text-stone-400">已结课班级与毕业学员档案安全存放，所有历史考勤、积分流水与账单永久留存，可随时一键恢复。</p>
          </div>

          <!-- 已归档班级 -->
          <div class="space-y-3">
            <h4 class="font-bold text-xs text-black dark:text-stone-400 uppercase tracking-wider">已归档结课班级 ({{ archivedClasses.length }})</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="cls in archivedClasses" :key="cls.id"
                class="wf-card p-4 flex items-center justify-between">
                <div>
                  <h5 class="font-bold text-sm line-through text-black dark:text-stone-400">{{ cls.name }}</h5>
                  <p class="text-xs text-black dark:text-stone-400 font-mono mt-0.5">归档时间: {{ cls.archivedAt }} · 老师: {{ cls.teacher }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button @click="unarchiveClass(cls)" class="wf-btn-outline text-xs text-emerald-400 border-emerald-500/30">
                    <i class="fa-solid fa-rotate-left"></i>
                    <span>恢复开班</span>
                  </button>
                  <button @click="deleteClass(cls)" class="text-rose-400 hover:text-rose-300 p-1.5 text-xs">
                    <i class="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </div>
              <div v-if="archivedClasses.length === 0" class="col-span-full py-6 text-center text-xs text-black dark:text-stone-400">
                暂无已归档班级
              </div>
            </div>
          </div>

          <!-- 已归档学员 -->
          <div class="space-y-3">
            <h4 class="font-bold text-xs text-black dark:text-stone-400 uppercase tracking-wider">已毕业/归档学员 ({{ archivedStudents.length }})</h4>
            <div class="overflow-x-auto w-full wf-card">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400" style="background-color: var(--bg-surface-subtle);">
                    <th class="py-3 px-4">学员姓名</th>
                    <th class="py-3 px-4">原所在班级</th>
                    <th class="py-3 px-4">毕业/归档时间</th>
                    <th class="py-3 px-4">累计消课</th>
                    <th class="py-3 px-4">总获画币</th>
                    <th class="py-3 px-4">归档说明</th>
                    <th class="py-3 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                  <tr v-for="stu in archivedStudents" :key="stu.id">
                    <td class="py-3 px-4 font-bold">{{ stu.name }}</td>
                    <td class="py-3 px-4 text-black dark:text-stone-400">{{ getClassById(stu.classId).name }}</td>
                    <td class="py-3 px-4 text-black dark:text-stone-400 font-mono">{{ stu.archivedAt || '-' }}</td>
                    <td class="py-3 px-4 font-mono">{{ stu.totalConsumed || 0 }} 节</td>
                    <td class="py-3 px-4 font-mono text-amber-400">⭐ {{ stu.totalPointsEarned || 0 }} 分</td>
                    <td class="py-3 px-4 text-black dark:text-stone-400 italic">{{ stu.notes || '-' }}</td>
                    <td class="py-3 px-4 text-right space-x-2">
                      <button @click="unarchiveStudent(stu)" class="text-xs text-emerald-400 font-bold hover:underline">
                        恢复在读
                      </button>
                      <button @click="deleteStudent(stu)" class="text-xs text-rose-400 hover:underline">
                        彻底删除
                      </button>
                    </td>
                  </tr>

                  <tr v-if="archivedStudents.length === 0">
                    <td colspan="7" class="py-6 text-center text-xs text-black dark:text-stone-400">
                      暂无已归档的学员
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </section>

      <!-- ======================================================== -->
      <!-- TAB: 🏫 班级专属二级管理独立主页 (Class Detail Secondary Page) -->
      <!-- ======================================================== -->
      <section v-if="currentTab === 'class_detail' && selectedClassDetail" class="max-w-[1600px] mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        <!-- 顶部返回导航与快捷按钮 -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-black/10 dark:border-white/10">
          <div class="flex items-center gap-3">
            <button @click="closeClassDetail" class="wf-btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5">
              <i class="fa-solid fa-arrow-left"></i>
              <span>返回班级列表</span>
            </button>
            <div class="h-4 w-[1px] bg-black/10 dark:border-white/10 hidden sm:block"></div>
            <div class="text-xs text-black dark:text-stone-400 font-mono hidden sm:block">
              班级管理 / {{ selectedClassDetail.name }}
            </div>
          </div>

          <!-- 右侧高频操作组 -->
          <div class="flex items-center gap-2 flex-wrap">
            <button @click="goToAttendanceForClass(selectedClassDetail.id)" class="wf-btn-primary text-xs py-1.5 px-3">
              <i class="fa-solid fa-calendar-check text-xs"></i>
              <span>进入本班考勤大表</span>
            </button>
            <button @click="openAddStudent(selectedClassDetail.id)" class="wf-btn-outline text-xs py-1.5 px-3">
              <i class="fa-solid fa-user-plus text-xs text-emerald-400"></i>
              <span>添加学员</span>
            </button>
            <button @click="openBatchPointReward(selectedClassDetail.id)" class="wf-btn-outline text-xs py-1.5 px-3 text-amber-400 border-amber-500/30">
              <i class="fa-solid fa-star text-xs"></i>
              <span>全班奖积分</span>
            </button>
            <button @click="openEditClass(selectedClassDetail)" class="wf-btn-outline text-xs py-1.5 px-2.5" title="编辑班级">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button @click="exportClassAttendanceCSV(selectedClassDetail.id)" class="wf-btn-outline text-xs py-1.5 px-2.5 text-emerald-400" title="导出本班名单与考勤 CSV">
              <i class="fa-solid fa-file-csv"></i>
            </button>
          </div>
        </div>

        <!-- 班级头部概览卡片 -->
        <div class="wf-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-2xl shadow-sm flex-shrink-0">
              🎨
            </div>
            <div class="space-y-1.5">
              <div class="flex items-center gap-3 flex-wrap">
                <h3 class="text-2xl font-black">{{ selectedClassDetail.name }}</h3>
                <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full"
                  :class="classDetailStats.studentCount >= classDetailStats.capacity ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'">
                  {{ classDetailStats.studentCount }}/{{ classDetailStats.capacity }} 人 ({{ classDetailStats.studentCount >= classDetailStats.capacity ? '已满班' : '可报读' }})
                </span>
              </div>
              <p class="text-xs text-black dark:text-stone-400 flex items-center gap-2 flex-wrap">
                <span>时段：<strong class="text-black dark:text-stone-200">{{ selectedClassDetail.schedule }}</strong></span>
                <span>·</span>
                <span>画坊：{{ selectedClassDetail.classroom || '梨香画坊' }}</span>
                <span>·</span>
                <span>主讲老师：<strong class="text-black dark:text-stone-200">{{ selectedClassDetail.teacher }}</strong></span>
                <span v-if="selectedClassDetail.notes">·</span>
                <span v-if="selectedClassDetail.notes" class="italic text-black dark:text-stone-300">{{ selectedClassDetail.notes }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- 4 维班级指标卡 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-black dark:text-stone-400">班级在读人数</div>
            <div class="text-3xl font-black font-mono"
              :class="classDetailStats.studentCount >= classDetailStats.capacity ? 'text-amber-400' : 'text-emerald-400'">
              {{ classDetailStats.studentCount }} <span class="text-xs font-normal text-black dark:text-stone-400">/ {{ classDetailStats.capacity }} 人</span>
            </div>
            <div class="text-[11px] text-black dark:text-stone-400 font-mono">
              班级容量满载率：{{ ((classDetailStats.studentCount / classDetailStats.capacity) * 100).toFixed(0) }}%
            </div>
          </div>

          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-black dark:text-stone-400">本班累计消课</div>
            <div class="text-3xl font-black font-mono text-emerald-400">
              {{ classDetailStats.totalConsumed }} <span class="text-xs font-normal text-black dark:text-stone-400">节</span>
            </div>
            <div class="text-[11px] text-black dark:text-stone-400">
              已完成考勤：{{ classDetailStats.totalSessions }} 节课
            </div>
          </div>

          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-black dark:text-stone-400">班级平均出勤率</div>
            <div class="text-3xl font-black font-mono text-[#10E57A]">
              {{ classDetailStats.attendanceRate }}
            </div>
            <div class="text-[11px] text-black dark:text-stone-400 font-mono">
              全员到课情况良好
            </div>
          </div>

          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-black dark:text-stone-400">本班画币积分池</div>
            <div class="text-3xl font-black font-mono text-amber-400">
              ⭐ {{ classDetailStats.pointsPool }} <span class="text-xs font-normal text-black dark:text-stone-400">分</span>
            </div>
            <div class="text-[11px] text-black dark:text-stone-400">
              全员可用画币奖励总额
            </div>
          </div>
        </div>

        <!-- 班级详情二级子导航 -->
        <div class="flex items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-3 flex-wrap">
          <div class="flex items-center gap-2 wf-pill-container">
            <button @click="classDetailSubTab = 'students'"
              :class="classDetailSubTab === 'students' ? 'active' : ''"
              class="wf-pill-btn">
              <span>在读学员名册 ({{ classDetailStudents.length }}人)</span>
            </button>

            <button @click="classDetailSubTab = 'attendance'"
              :class="classDetailSubTab === 'attendance' ? 'active' : ''"
              class="wf-pill-btn">
              <span>历史考勤课次 ({{ classDetailAttendance.length }}节)</span>
            </button>

            <button @click="classDetailSubTab = 'logs'"
              :class="classDetailSubTab === 'logs' ? 'active' : ''"
              class="wf-pill-btn">
              <span>本班消课流水 ({{ classDetailLogs.length }}条)</span>
            </button>
          </div>

          <button v-if="classDetailSubTab === 'students'" @click="openAddStudent(selectedClassDetail.id)" class="wf-btn-primary text-xs py-1.5 px-3">
            <i class="fa-solid fa-user-plus mr-1"></i>
            <span>添加学员到本班</span>
          </button>
        </div>

        <!-- 班级详情内容区 -->
        <div class="space-y-4">
          
          <!-- 1. 在读学员名册表格 -->
          <div v-if="classDetailSubTab === 'students'" class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400" style="background-color: var(--bg-surface-subtle);">
                  <th class="py-4 px-5 whitespace-nowrap">学员姓名</th>
                  <th class="py-4 px-4 whitespace-nowrap">年龄/性别</th>
                  <th class="py-4 px-4 whitespace-nowrap">剩余课时</th>
                  <th class="py-4 px-4 whitespace-nowrap">画币积分</th>
                  <th class="py-4 px-4 whitespace-nowrap">累计消课</th>
                  <th class="py-4 px-4 whitespace-nowrap">家长联系方式</th>
                  <th class="py-4 px-4">学员习惯与备注</th>
                  <th class="py-4 px-5 text-right whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                <tr v-for="stu in classDetailStudents" :key="stu.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                  <!-- 学员姓名 (单行) -->
                  <td class="py-3.5 px-5 font-bold cursor-pointer group whitespace-nowrap" @click="openStudentProfile(stu)" title="点击查看个人全屏独立档案">
                    <div class="flex items-center gap-2.5 whitespace-nowrap">
                      <div class="w-7 h-7 rounded-lg border border-black/10 dark:border-white/20 flex items-center justify-center font-bold text-xs group-hover:border-emerald-400 transition flex-shrink-0" style="background-color: var(--bg-surface-hover);">
                        {{ stu.name.charAt(0) }}
                      </div>
                      <span class="group-hover:text-emerald-400 transition-colors flex items-center gap-1 font-black text-sm whitespace-nowrap">
                        <span>{{ stu.name }}</span>
                        <i class="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity flex-shrink-0"></i>
                      </span>
                    </div>
                  </td>

                  <td class="py-3.5 px-4 text-black dark:text-stone-400 whitespace-nowrap">{{ stu.age }}岁 · {{ stu.gender }}</td>
                  <td class="py-3.5 px-4 font-bold font-mono whitespace-nowrap"
                    :class="stu.remainHours <= 0 ? 'text-rose-400' : stu.remainHours <= 3 ? 'text-amber-400' : 'text-[#10E57A]'">
                    {{ stu.remainHours }} 节
                  </td>

                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <button @click.stop="openIndividualPointModal(stu, 'add')" class="wf-badge-gold cursor-pointer hover:scale-105 active:scale-95 transition" :title="'点击变更【' + stu.name + '】积分'">
                      <span>⭐ {{ stu.points || 0 }}</span>
                      <span class="text-[9px] opacity-75 ml-0.5">▾</span>
                    </button>
                  </td>

                  <td class="py-3.5 px-4 font-mono text-black dark:text-stone-300 whitespace-nowrap">{{ stu.totalConsumed || 0 }} 节</td>
                  <td class="py-3.5 px-4 font-mono text-black dark:text-stone-400 whitespace-nowrap">{{ stu.parentName }} ({{ stu.parentPhone }})</td>
                  <td class="py-3.5 px-4 text-black dark:text-stone-400 text-xs italic">{{ stu.notes || '-' }}</td>
                  <td class="py-3.5 px-5 text-right space-x-2 whitespace-nowrap">
                    <button @click="openIndividualPointModal(stu, 'add')" class="text-xs text-amber-400 font-bold hover:underline">⭐ 变更积分</button>
                    <button @click="openRecharge(stu)" class="text-xs text-emerald-400 font-bold hover:underline">续费</button>
                    <button @click="openEditStudent(stu)" class="text-black dark:text-stone-400 hover:text-emerald-400">编辑</button>
                    <button @click="openStudentProfile(stu)" class="text-xs text-black dark:text-stone-400 hover:text-emerald-400">档案 ↗</button>
                    <button @click="archiveStudent(stu)" class="text-xs text-amber-500 hover:underline">归档</button>
                  </td>
                </tr>

                <tr v-if="classDetailStudents.length === 0">
                  <td colspan="8" class="py-16 text-center text-black dark:text-stone-400 text-xs">
                    该班级暂无在读学员，点击上方【添加学员到本班】录入学员
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 2. 历史考勤大表课次 -->
          <div v-if="classDetailSubTab === 'attendance'" class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400" style="background-color: var(--bg-surface-subtle);">
                  <th class="py-4 px-5 whitespace-nowrap">上课日期</th>
                  <th class="py-4 px-4 whitespace-nowrap">课程绘画主题</th>
                  <th class="py-4 px-4 whitespace-nowrap">任课老师</th>
                  <th class="py-4 px-4 whitespace-nowrap">到课人数</th>
                  <th class="py-4 px-4 whitespace-nowrap">未到/请假</th>
                  <th class="py-4 px-4 whitespace-nowrap">放假人数</th>
                  <th class="py-4 px-5 text-right whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                <tr v-for="att in classDetailAttendance" :key="att.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                  <td class="py-3.5 px-5 font-mono text-black dark:text-stone-400 whitespace-nowrap">{{ att.date }}</td>
                  <td class="py-3.5 px-4 font-black text-sm text-black dark:text-stone-100 whitespace-nowrap">{{ att.theme }}</td>
                  <td class="py-3.5 px-4 text-black dark:text-stone-400 whitespace-nowrap">{{ att.teacher }}</td>
                  <td class="py-3.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">{{ att.presentCount || 0 }} 人</td>
                  <td class="py-3.5 px-4 font-mono font-bold text-rose-400 whitespace-nowrap">{{ att.leaveCount || 0 }} 人</td>
                  <td class="py-3.5 px-4 font-mono font-bold text-purple-400 whitespace-nowrap">{{ att.holidayCount || 0 }} 人</td>
                  <td class="py-3.5 px-5 text-right whitespace-nowrap">
                    <button @click="goToAttendanceForClass(selectedClassDetail.id)" class="text-xs text-emerald-400 font-bold hover:underline mr-3">在大表查看</button>
                    <button @click="deleteMatrixRow(att)" class="text-black dark:text-stone-400 hover:text-rose-400 text-xs">撤销/删除</button>
                  </td>
                </tr>

                <tr v-if="classDetailAttendance.length === 0">
                  <td colspan="7" class="py-16 text-center text-black dark:text-stone-400 text-xs">
                    该班级暂无考勤历史课次
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 3. 本班消课流水 -->
          <div v-if="classDetailSubTab === 'logs'" class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400" style="background-color: var(--bg-surface-subtle);">
                  <th class="py-4 px-5 whitespace-nowrap">记录时间</th>
                  <th class="py-4 px-4 whitespace-nowrap">学员姓名</th>
                  <th class="py-4 px-4 whitespace-nowrap">流水类型</th>
                  <th class="py-4 px-4 whitespace-nowrap">课时变动</th>
                  <th class="py-4 px-4 whitespace-nowrap">变动后结余</th>
                  <th class="py-4 px-5">详细业务说明</th>
                  <th class="py-4 px-4 whitespace-nowrap">经办人</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                <tr v-for="log in classDetailLogs" :key="log.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                  <td class="py-3.5 px-5 font-mono text-black dark:text-stone-400 whitespace-nowrap">{{ log.time }}</td>
                  <td class="py-3.5 px-4 font-bold whitespace-nowrap">{{ log.studentName }}</td>
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <span class="text-xs font-bold px-2.5 py-0.5 rounded-full inline-block"
                      :class="log.change > 0 ? 'wf-badge-green' : log.change < 0 ? 'wf-badge-red' : 'wf-badge-yellow'">
                      {{ log.type }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-mono font-bold whitespace-nowrap" :class="log.change > 0 ? 'text-[#10E57A]' : log.change < 0 ? 'text-rose-400' : 'text-black dark:text-stone-400'">
                    {{ log.change > 0 ? '+' + log.change : log.change === 0 ? '0' : log.change }} 节
                  </td>
                  <td class="py-3.5 px-4 font-bold font-mono text-black dark:text-stone-300 whitespace-nowrap">{{ log.balanceAfter }} 节</td>
                  <td class="py-3.5 px-5 text-black dark:text-stone-300">{{ log.relatedInfo }}</td>
                  <td class="py-3.5 px-4 text-black dark:text-stone-400 whitespace-nowrap">{{ log.operator || '陈老师' }}</td>
                </tr>

                <tr v-if="classDetailLogs.length === 0">
                  <td colspan="7" class="py-16 text-center text-black dark:text-stone-400 text-xs">
                    该班级暂无消课流水记录
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </section>

      <!-- ======================================================== -->
      <!-- TAB 4: 💰 财务与收费管理中心 (统一高雅 · 极简线框设计系统) -->
      <!-- ======================================================== -->
            <!-- ======================================================== -->
      <!-- TAB 4: 💰 财务与经营管理中心 (系统化多周期统计 · 订单全生命周期 · 收支总账) -->
      <!-- ======================================================== -->
            <!-- ======================================================== -->
      <!-- TAB 4: 💰 财务收费管理中心 (极简直观 · 月/季/年统计 · 单条直接编辑与删除) -->
      <!-- ======================================================== -->
            <!-- ======================================================== -->
      <!-- TAB 4: 财务收费管理中心 (极简典雅 · 统一字体配色 · 无过度符号) -->
      <!-- ======================================================== -->
      <section v-if="currentTab === 'records'" class="max-w-[1500px] mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        <!-- 顶部通栏标题与操作 -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-lg font-bold text-stone-900 dark:text-stone-100">财务收费管理</h2>
              <span class="text-xs px-2.5 py-0.5 rounded font-mono font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {{ activePeriodLabel }}
              </span>
            </div>
            <p class="text-xs text-stone-500 mt-1">
              按月度、季度与年度统计收费数据，支持单条收费记录直接修改与删除。
            </p>
          </div>

          <!-- 右侧操作 -->
          <div class="flex items-center gap-3">
            <button @click="exportPaymentOrdersCSV" class="wf-btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700">
              <i class="fa-solid fa-file-csv text-xs text-stone-500"></i>
              <span>导出表格 (CSV)</span>
            </button>
            <button @click="openRechargeModal" class="wf-btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5">
              <i class="fa-solid fa-plus text-xs"></i>
              <span>录入收费</span>
            </button>
          </div>
        </div>

        <!-- 周期统计切换控制栏 -->
        <div class="wf-card p-3.5 space-y-3 bg-stone-50/50 dark:bg-stone-900/20 border border-stone-200 dark:border-stone-800">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <!-- 周期切换按钮组 -->
            <div class="flex items-center gap-1 bg-stone-200/60 dark:bg-stone-800/80 p-1 rounded-lg text-xs font-medium">
              <button @click="statPeriodMode = 'month'"
                :class="statPeriodMode === 'month' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm font-bold' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'"
                class="px-3 py-1.5 rounded transition">
                按月统计
              </button>

              <button @click="statPeriodMode = 'quarter'"
                :class="statPeriodMode === 'quarter' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm font-bold' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'"
                class="px-3 py-1.5 rounded transition">
                按季度统计
              </button>

              <button @click="statPeriodMode = 'year'"
                :class="statPeriodMode === 'year' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm font-bold' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'"
                class="px-3 py-1.5 rounded transition">
                按年统计
              </button>

              <button @click="statPeriodMode = 'all'"
                :class="statPeriodMode === 'all' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm font-bold' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'"
                class="px-3 py-1.5 rounded transition">
                全部历史
              </button>
            </div>

            <!-- 联动选择器 -->
            <div class="flex items-center gap-2 text-xs flex-wrap">
              <!-- 按月 -->
              <div v-if="statPeriodMode === 'month'" class="flex items-center gap-2">
                <span class="text-stone-500">月份:</span>
                <input type="month" v-model="selectedMonthStr" class="px-2.5 py-1 wf-input font-mono text-xs bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                <button @click="selectedMonthStr = currentYearMonth" class="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:underline">
                  返回当月
                </button>
              </div>

              <!-- 按季 -->
              <div v-if="statPeriodMode === 'quarter'" class="flex items-center gap-2">
                <span class="text-stone-500">年份:</span>
                <select v-model="selectedYearStr" class="px-2 py-1 wf-select font-mono text-xs bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                  <option v-for="y in availableStatYears" :key="y" :value="y">{{ y }} 年</option>
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
        </div>

        <!-- 4 维核心统计卡片 (统一色调 · 统一字号 · 纯粹典雅) -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <!-- 1. 实收金额 -->
          <div @click="cardFilterMode = 'all'"
            :class="cardFilterMode === 'all' ? 'border-emerald-500/80 bg-emerald-50/20 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30' : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'"
            class="wf-card p-4 space-y-2 cursor-pointer transition flex flex-col justify-between">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-stone-600 dark:text-stone-400">实收总额</span>
              <span class="text-[11px] px-1.5 py-0.5 rounded font-mono text-stone-500 bg-stone-100 dark:bg-stone-800">
                {{ periodStatSummary.orderCount }} 笔
              </span>
            </div>
            <div class="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
              ¥ {{ periodStatSummary.totalAmount.toLocaleString() }}
            </div>
            <div class="text-[11px] text-stone-500 font-mono pt-1.5 border-t border-stone-100 dark:border-stone-800/80 flex justify-between">
              <span>周期实收资金</span>
              <span class="text-stone-400 hover:text-stone-700 dark:hover:text-stone-300">显示全部</span>
            </div>
          </div>


        </div>

        <!-- 搜索与筛选工具栏 -->
        <div class="wf-card p-3.5 space-y-3 border border-stone-200 dark:border-stone-800">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <!-- 搜索框 -->
            <div class="relative flex-1 min-w-[240px]">
              <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
              <input v-model="feeSearchQuery" type="text"
                placeholder="搜索学员姓名、单号、经办人、备注..."
                class="w-full pl-9 pr-4 py-1.5 wf-input text-xs border-stone-200 dark:border-stone-700">
            </div>

            <!-- 筛选下拉 -->
            <div class="flex items-center gap-2.5 text-xs flex-wrap">
              <!-- 支付方式 -->
              <select v-model="feePayMethodFilter" class="px-2.5 py-1.5 wf-select text-xs font-medium border-stone-200 dark:border-stone-700">
                <option value="all">全部支付方式</option>
                <option value="微信支付">微信支付</option>
                <option value="支付宝">支付宝</option>
                <option value="现金">现金</option>
                <option value="银行转账">银行转账</option>
                <option value="POS刷卡">POS刷卡</option>
              </select>

              <!-- 业务类型 -->
              <select v-model="feeTypeFilter" class="px-2.5 py-1.5 wf-select text-xs font-medium border-stone-200 dark:border-stone-700">
                <option value="all">全部业务类型</option>
                <option value="新生报名">新生报名</option>
                <option value="老生续费">老生续费</option>
              </select>

              <button v-if="feeSearchQuery || feePayMethodFilter !== 'all' || feeTypeFilter !== 'all' || cardFilterMode !== 'all'"
                @click="feeSearchQuery = ''; feePayMethodFilter = 'all'; feeTypeFilter = 'all'; cardFilterMode = 'all'"
                class="wf-btn-outline py-1.5 px-2.5 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 border-stone-200 dark:border-stone-700">
                重置
              </button>
            </div>
          </div>
        </div>

        <!-- 收费记录表格 (统一字号 · 吸附右侧清晰操作列) -->
        <div class="wf-card border border-stone-200 dark:border-stone-800 shadow-none overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="text-stone-500 bg-stone-50/80 dark:bg-stone-900/60 font-medium border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th class="py-3 px-4 whitespace-nowrap min-w-[110px]">订单编号</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[110px]">缴费时间</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[90px]">学员姓名</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[80px]">业务类型</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[100px]">实收金额</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[80px]">购买正课</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[70px]">赠送课时</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[80px]">支付方式</th>
                <th class="py-3 px-4 whitespace-nowrap min-w-[80px]">经办人</th>
                <th class="py-3 px-4 min-w-[130px]">备注说明</th>
                <th class="py-3 px-4 text-center whitespace-nowrap sticky right-0 bg-stone-50 dark:bg-stone-900 shadow-[-4px_0_6px_rgba(0,0,0,0.03)] min-w-[140px] z-10 font-medium">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
              <tr v-for="order in displayedPaymentOrders" :key="order.id"
                class="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition">
                
                <!-- 订单编号 -->
                <td class="py-3 px-4 font-mono text-stone-400 whitespace-nowrap">
                  {{ order.id }}
                </td>

                <!-- 缴费时间 -->
                <td class="py-3 px-4 font-mono text-stone-600 dark:text-stone-400 whitespace-nowrap">
                  {{ order.payDate || order.date }}
                </td>

                <!-- 学员姓名 -->
                <td class="py-3 px-4 font-medium whitespace-nowrap">
                  <span @click="openStudentProfile(students.find(s => s.name === order.studentName) || { name: order.studentName })" 
                    class="cursor-pointer text-stone-900 dark:text-stone-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition inline-flex items-center gap-1">
                    <span>{{ order.studentName }}</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[9px] text-stone-400"></i>
                  </span>
                </td>

                <!-- 业务类型 -->
                <td class="py-3 px-4 whitespace-nowrap">
                  <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {{ order.type || '老生续费' }}
                  </span>
                </td>

                <!-- 实收金额 -->
                <td class="py-3 px-4 font-mono font-bold text-stone-900 dark:text-stone-100 whitespace-nowrap">
                  ¥ {{ (order.amount || 0).toLocaleString() }}
                </td>

                <!-- 购买正课 -->
                <td class="py-3 px-4 font-mono text-stone-800 dark:text-stone-200 whitespace-nowrap">
                  {{ order.hoursBought || order.hours || 0 }} 节
                </td>

                <!-- 赠送课时 -->
                <td class="py-3 px-4 font-mono whitespace-nowrap text-stone-500">
                  <span v-if="order.hoursGift > 0" class="text-stone-700 dark:text-stone-300 font-medium">+{{ order.hoursGift }} 节</span>
                  <span v-else>-</span>
                </td>

                <!-- 支付方式 -->
                <td class="py-3 px-4 whitespace-nowrap font-mono text-stone-600 dark:text-stone-400">
                  {{ order.payMethod || '微信支付' }}
                </td>

                <!-- 经办人 -->
                <td class="py-3 px-4 text-stone-600 dark:text-stone-400 whitespace-nowrap">{{ order.operator || '陈老师' }}</td>

                <!-- 备注说明 -->
                <td class="py-3 px-4 text-stone-500 text-xs">
                  {{ order.remark || '-' }}
                </td>

                <!-- 操作管理按钮 (极简精致 · 固定吸附) -->
                <td class="py-3 px-4 whitespace-nowrap text-center space-x-1.5 sticky right-0 bg-white dark:bg-[#1a1a1a] shadow-[-4px_0_6px_rgba(0,0,0,0.03)] z-10">
                  <!-- 编辑 -->
                  <button @click.stop="openDirectEditModal(order)"
                    class="px-2.5 py-1 rounded text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 transition" title="修改记录">
                    编辑
                  </button>

                  <!-- 删除 -->
                  <button @click.stop="directDeleteOrder(order)"
                    class="px-2.5 py-1 rounded text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 transition" title="删除记录">
                    删除
                  </button>
                </td>
              </tr>

              <tr v-if="displayedPaymentOrders.length === 0">
                <td colspan="11" class="py-12 text-center text-stone-400 text-xs">
                  暂无收费记录
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </section>



      
      <!-- ======================================================== -->
      <!-- TAB 5: 🌟 学员个人全景成长档案独立主页 (通栏全屏视角) -->
      <!-- ======================================================== -->
      <section v-if="currentTab === 'profile' && profileStudent" class="max-w-[1600px] mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        <!-- 顶部返回导航与快捷按钮 -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-black/10 dark:border-white/10">
          <div class="flex items-center gap-3">
            <button @click="closeStudentProfile" class="wf-btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5">
              <i class="fa-solid fa-arrow-left"></i>
              <span>返回{{ profilePreviousTab === 'attendance' ? '考勤大表' : profilePreviousTab === 'ranking' ? '课时积分榜' : profilePreviousTab === 'class_detail' ? '班级主页' : '班级学员' }}</span>
            </button>
            <div class="h-4 w-[1px] bg-black/10 dark:border-white/10 hidden sm:block"></div>
            <div class="text-xs text-black dark:text-stone-400 font-mono hidden sm:block">
              学员成长档案 / {{ profileStudent.name }}
            </div>
          </div>

          <!-- 右侧高频操作组 -->
          <div class="flex items-center gap-2 flex-wrap">
            <button @click="openIndividualPointModal(profileStudent, 'add')" class="wf-btn-primary text-xs py-1.5 px-3">
              <i class="fa-solid fa-star text-xs"></i>
              <span>变更画币积分</span>
            </button>
            <button @click="openIndividualPointModal(profileStudent, 'redeem')" class="wf-btn-outline text-xs py-1.5 px-3 text-amber-400 border-amber-500/30">
              <i class="fa-solid fa-gift text-xs"></i>
              <span>兑换礼物</span>
            </button>
            <button @click="openRecharge(profileStudent)" class="wf-btn-outline text-xs py-1.5 px-3">
              <i class="fa-solid fa-plus text-xs text-emerald-400"></i>
              <span>续费充值</span>
            </button>
            <button @click="openEditStudent(profileStudent)" class="wf-btn-outline text-xs py-1.5 px-2.5" title="编辑学员档案">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button @click="archiveStudent(profileStudent); profileStudent = null" class="wf-btn-outline text-xs py-1.5 px-3 text-amber-500 border-amber-500/30 hover:bg-amber-500/10" title="归档该学员">
              <i class="fa-solid fa-box-archive text-xs mr-1"></i>
              <span>归档学员</span>
            </button>
            <button @click="openExportModal('student', profileStudent)" class="wf-btn-outline text-xs py-1.5 px-3 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 flex items-center gap-1.5" title="导出个人考勤档案 (支持选择时间范围与格式)">
              <i class="fa-solid fa-file-export text-xs"></i>
              <span>导出考勤档案</span>
            </button>
          </div>
        </div>

        <!-- 学员头部大信息卡 -->
        <div class="wf-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-2xl shadow-sm flex-shrink-0">
              {{ profileStudent.name.charAt(0) }}
            </div>
            <div class="space-y-1.5">
              <div class="flex items-center gap-3 flex-wrap">
                <h3 class="text-2xl font-black">{{ profileStudent.name }}</h3>
                <span class="text-xs px-2.5 py-0.5 rounded-full font-bold" 
                  :class="profileStudent.gender === '女' ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'">
                  {{ profileStudent.gender }} · {{ profileStudent.age }}岁
                </span>
                <span class="text-xs px-2.5 py-0.5 rounded-full font-bold"
                  :class="profileStudent.status === '在读' ? 'wf-badge-green' : 'wf-badge-red'">
                  {{ profileStudent.status || '在读' }}
                </span>
              </div>
              <p class="text-xs text-black dark:text-stone-400 flex items-center gap-2 flex-wrap">
                <span>班级：<strong class="text-black dark:text-stone-200">{{ getClassById(profileStudent.classId).name }}</strong></span>
                <span>·</span>
                <span>家长联系方式：<strong class="text-black dark:text-stone-200">{{ profileStudent.parentName }}</strong> ({{ profileStudent.parentPhone }})</span>
                <span v-if="profileStudent.notes">·</span>
                <span v-if="profileStudent.notes" class="italic text-black dark:text-stone-300">习惯备注：{{ profileStudent.notes }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- 4 维核心业务指标卡 (大号宽敞卡片) -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-black dark:text-stone-400">当前剩余课时</div>
            <div class="text-3xl font-black font-mono"
              :class="profileStudent.remainHours <= 0 ? 'text-rose-400' : profileStudent.remainHours <= 3 ? 'text-amber-400' : 'text-emerald-400'">
              {{ profileStudent.remainHours }} <span class="text-xs font-normal text-black dark:text-stone-400">节</span>
            </div>
            <div class="text-[11px] text-black dark:text-stone-400 font-mono">
              {{ profileStudent.remainHours <= 0 ? '已耗尽，需续费' : profileStudent.remainHours <= 3 ? '预警期，待提醒续费' : '课时充足' }}
            </div>
          </div>

          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-black dark:text-stone-400 items-center justify-between flex">
              <span>可用画币积分</span>
              <span @click="openIndividualPointModal(profileStudent, 'add')" class="text-[10px] text-amber-400 cursor-pointer hover:underline">变更 ✏️</span>
            </div>
            <div class="text-3xl font-black font-mono text-amber-400">
              ⭐ {{ profileStudent.points || 0 }} <span class="text-xs font-normal text-black dark:text-stone-400">分</span>
            </div>
            <div class="text-[11px] text-black dark:text-stone-400">
              累计总获得：{{ profileStudent.totalPointsEarned || 0 }} 分
            </div>
          </div>

          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-black dark:text-stone-400">出勤率统计</div>
            <div class="text-3xl font-black font-mono text-[#10E57A]">
              {{ profileStudentStats.attendanceRate }}
            </div>
            <div class="text-[11px] text-black dark:text-stone-400 font-mono">
              到课 {{ profileStudentStats.presentCount }} 节 · 请假未到 {{ profileStudentStats.leaveCount }} 节
            </div>
          </div>

          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-black dark:text-stone-400">累计消课与兑换</div>
            <div class="text-3xl font-black font-mono text-emerald-400">
              {{ profileStudent.totalConsumed || 0 }} <span class="text-xs font-normal text-black dark:text-stone-400">节</span>
            </div>
            <div class="text-[11px] text-black dark:text-stone-400">
              已兑换礼物：<strong class="text-amber-300">{{ profileStudent.redeemedCount || 0 }}</strong> 件
            </div>
          </div>

        </div>

        <!-- 详细数据明细子导航 -->
        <div class="flex items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-3 flex-wrap">
          <div class="flex items-center gap-2 wf-pill-container">
            <button @click="profileSubTab = 'attendance'"
              :class="profileSubTab === 'attendance' ? 'active' : ''"
              class="wf-pill-btn">
              <span>考勤记录 ({{ profileStudentAttendanceList.length }}节)</span>
            </button>

            <button @click="profileSubTab = 'points'"
              :class="profileSubTab === 'points' ? 'active' : ''"
              class="wf-pill-btn">
              <span>积分明细 ({{ profileStudentPointLogs.length }}条)</span>
            </button>

            <button @click="profileSubTab = 'logs'"
              :class="profileSubTab === 'logs' ? 'active' : ''"
              class="wf-pill-btn">
              <span>课时流水 ({{ profileStudentLogs.length }}条)</span>
            </button>
          </div>

          <div v-if="profileSubTab === 'attendance'" class="flex items-center gap-2">
            <button @click="openExportModal('student_csv', profileStudent)" class="nt-btn-export text-xs sm:text-sm">
              <i class="fa-solid fa-file-excel mr-1 text-xs"></i>
              <span>导出考勤 CSV</span>
            </button>
            <button @click="openExportModal('student_pdf', profileStudent)" class="nt-btn text-xs sm:text-sm text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-950/30">
              <i class="fa-solid fa-file-pdf mr-1 text-xs text-rose-500"></i>
              <span>导出/打印 PDF 清单</span>
            </button>
          </div>
        </div>

        <!-- 详细数据明细表格 (全屏通栏展示 · 无高度截断限制 · 充足呼吸感) -->
        <div class="space-y-4">
          
          <!-- 1. 考勤记录大表 (彻底告别微小滚动条) -->
          <div v-if="profileSubTab === 'attendance'" class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400" style="background-color: var(--bg-surface-subtle);">
                  <th class="py-4 px-5 whitespace-nowrap">上课日期</th>
                  <th class="py-4 px-4 whitespace-nowrap">课程绘画主题</th>
                  <th class="py-4 px-4 whitespace-nowrap">所属班级</th>
                  <th class="py-4 px-4 whitespace-nowrap">考勤状态</th>
                  <th class="py-4 px-4 whitespace-nowrap">消课数</th>
                  <th class="py-4 px-4 whitespace-nowrap">任课老师</th>
                  <th class="py-4 px-5">具体考勤原因与课堂表现备注</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                <tr v-for="att in profileStudentAttendanceList" :key="att.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                  <td class="py-3.5 px-5 font-mono text-black dark:text-stone-400 whitespace-nowrap">{{ att.date }}</td>
                  <td class="py-3.5 px-4 font-black text-sm text-black dark:text-stone-100 whitespace-nowrap">{{ att.theme }}</td>
                  <td class="py-3.5 px-4 text-black dark:text-stone-400 whitespace-nowrap">{{ att.className }}</td>
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <span class="text-xs font-bold px-2.5 py-0.5 rounded-full inline-block"
                      :class="att.status === '到课' ? 'wf-badge-green' : att.status === '未到' || att.status === '请假' ? 'wf-badge-red' : 'wf-badge-purple'">
                      {{ att.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-mono font-bold whitespace-nowrap" :class="att.deductHours > 0 ? 'text-rose-400' : 'text-black dark:text-stone-400'">
                    {{ att.deductHours > 0 ? '-' + att.deductHours + ' 节' : '0 节' }}
                  </td>
                  <td class="py-3.5 px-4 text-black dark:text-stone-400 whitespace-nowrap">{{ att.teacher }}</td>
                  <td class="py-3.5 px-5 text-black dark:text-stone-300">
                    {{ att.note || '-' }}
                  </td>
                </tr>

                <tr v-if="profileStudentAttendanceList.length === 0">
                  <td colspan="7" class="py-16 text-center text-black dark:text-stone-400 text-xs">
                    该学员暂无历史考勤课次记录
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 2. 积分明细大表 -->
          <div v-if="profileSubTab === 'points'" class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400" style="background-color: var(--bg-surface-subtle);">
                  <th class="py-4 px-5 whitespace-nowrap">记录时间</th>
                  <th class="py-4 px-4 whitespace-nowrap">变动类型</th>
                  <th class="py-4 px-4 whitespace-nowrap">画币变动</th>
                  <th class="py-4 px-4 whitespace-nowrap">变动后结余</th>
                  <th class="py-4 px-5">奖励原因与礼物明细</th>
                  <th class="py-4 px-4 whitespace-nowrap">经办人</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                <tr v-for="plog in profileStudentPointLogs" :key="plog.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                  <td class="py-3.5 px-5 font-mono text-black dark:text-stone-400 whitespace-nowrap">{{ plog.time }}</td>
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <span class="text-xs font-bold px-2.5 py-0.5 rounded-full inline-block"
                      :class="plog.points > 0 ? 'wf-badge-gold' : 'wf-badge-purple'">
                      {{ plog.type }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-mono font-black text-sm whitespace-nowrap"
                    :class="plog.points > 0 ? 'text-amber-400' : 'text-purple-400'">
                    {{ plog.points > 0 ? '+' + plog.points : plog.points }} 分
                  </td>
                  <td class="py-3.5 px-4 font-mono font-bold text-amber-300 whitespace-nowrap">
                    ⭐ {{ plog.balanceAfter }} 分
                  </td>
                  <td class="py-3.5 px-5 text-black dark:text-stone-300">{{ plog.reason }}</td>
                  <td class="py-3.5 px-4 text-black dark:text-stone-400 whitespace-nowrap">{{ plog.operator || '陈老师' }}</td>
                </tr>

                <tr v-if="profileStudentPointLogs.length === 0">
                  <td colspan="6" class="py-16 text-center text-black dark:text-stone-400 text-xs">
                    暂无积分变动明细，点击右上角【变更画币积分】开始发放
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 3. 课时流水大表 -->
          <div v-if="profileSubTab === 'logs'" class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400" style="background-color: var(--bg-surface-subtle);">
                  <th class="py-4 px-5 whitespace-nowrap">记录时间</th>
                  <th class="py-4 px-4 whitespace-nowrap">流水类型</th>
                  <th class="py-4 px-4 whitespace-nowrap">课时变动</th>
                  <th class="py-4 px-4 whitespace-nowrap">变动后结余</th>
                  <th class="py-4 px-5">详细业务说明</th>
                  <th class="py-4 px-4 whitespace-nowrap">经办人</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                <tr v-for="log in profileStudentLogs" :key="log.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                  <td class="py-3.5 px-5 font-mono text-black dark:text-stone-400 whitespace-nowrap">{{ log.time }}</td>
                  <td class="py-3.5 px-4 font-bold whitespace-nowrap">
                    <span class="text-xs font-bold px-2.5 py-0.5 rounded-full inline-block"
                      :class="log.change > 0 ? 'wf-badge-green' : log.change < 0 ? 'wf-badge-red' : 'wf-badge-yellow'">
                      {{ log.type }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-mono font-bold whitespace-nowrap" :class="log.change > 0 ? 'text-[#10E57A]' : log.change < 0 ? 'text-rose-400' : 'text-black dark:text-stone-400'">
                    {{ log.change > 0 ? '+' + log.change : log.change === 0 ? '0' : log.change }} 节
                  </td>
                  <td class="py-3.5 px-4 font-bold font-mono text-black dark:text-stone-300 whitespace-nowrap">{{ log.balanceAfter }} 节</td>
                  <td class="py-3.5 px-5 text-black dark:text-stone-300">{{ log.relatedInfo }}</td>
                  <td class="py-3.5 px-4 text-black dark:text-stone-400 whitespace-nowrap">{{ log.operator || '陈老师' }}</td>
                </tr>

                <tr v-if="profileStudentLogs.length === 0">
                  <td colspan="6" class="py-16 text-center text-black dark:text-stone-400 text-xs">
                    该学员暂无课时变动流水
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </section>

    </main>

    <!-- ============================================================ -->
    <!-- 🌟 全局核心模态窗 0.5: 【修改考勤课次主题与日期】 ⭐⭐⭐ -->
    <!-- ============================================================ -->
    <div v-if="showEditAttendanceModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="wf-card p-6 max-w-md w-full space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <h3 class="font-bold text-base flex items-center gap-2">
            <i class="fa-solid fa-pen-to-square text-emerald-400"></i>
            <span>修改课程主题与上课日期</span>
          </h3>
          <button @click="showEditAttendanceModal = false" class="text-black dark:text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">课程绘画主题 *</label>
            <input v-model="editingAttendanceForm.theme" type="text" placeholder="例: 《梵高的星空》" class="w-full px-3 py-2 wf-input font-bold text-sm text-emerald-400">
          </div>

          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1 font-semibold">上课日期 *</label>
            <input v-model="editingAttendanceForm.rawDate" type="date" class="w-full px-3 py-2 nt-input font-mono font-bold text-sm">
          </div>

          <div>
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">任课主讲老师</label>
            <input v-model="editingAttendanceForm.teacher" type="text" placeholder="例: 陈老师" class="w-full px-3 py-2 wf-input">
          </div>
        </div>

        <div class="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
          <button @click="deleteMatrixRow(attendanceHistory.find(a => a.id === editingAttendanceForm.id)); showEditAttendanceModal = false" 
            type="button"
            class="text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1.5 py-2 px-3 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 transition cursor-pointer"
            title="撤销/删除此节课 (自动退还学员消课)">
            <i class="fa-regular fa-trash-can text-xs"></i>
            <span>删除此节课</span>
          </button>
          <div class="flex items-center gap-2">
            <button @click="showEditAttendanceModal = false" class="wf-btn-outline py-2 px-3.5 justify-center">取消</button>
            <button @click="submitEditAttendanceRow" class="wf-btn-primary py-2 px-4 justify-center">保存修改</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 🌟 全局考勤导出时间范围选择器模态窗 (Notion Date Range Export) -->
    <!-- ============================================================ -->
    <div v-if="showExportAttendanceModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="nt-card p-6 max-w-lg w-full space-y-4 shadow-2xl" style="background-color: var(--bg-surface);">
        
        <!-- 弹窗顶栏 -->
        <div class="flex items-center justify-between border-b border-[#e2e2e0] dark:border-[#333] pb-3">
          <div>
            <h3 class="font-bold text-base flex items-center gap-2">
              <i class="fa-solid fa-calendar-days text-emerald-600"></i>
              <span>选择导出考勤时间范围</span>
            </h3>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ exportModalConfig.title }}
            </p>
          </div>
          <button @click="showExportAttendanceModal = false" class="text-gray-400 hover:text-black dark:hover:text-white p-1">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- 快捷时间范围预设 (Notion Filter Pills) -->
        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-600 dark:text-gray-400">快捷时间段：</label>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            <button @click="applyExportPreset('all')"
              :class="exportModalConfig.presetRange === 'all' ? 'bg-[#111827] text-white dark:bg-[#10e57a] dark:text-black font-bold' : 'nt-btn text-gray-700 dark:text-gray-300'"
              class="py-1.5 px-2 rounded-md text-xs transition text-center">
              全部历史
            </button>
            <button @click="applyExportPreset('this_month')"
              :class="exportModalConfig.presetRange === 'this_month' ? 'bg-[#111827] text-white dark:bg-[#10e57a] dark:text-black font-bold' : 'nt-btn text-gray-700 dark:text-gray-300'"
              class="py-1.5 px-2 rounded-md text-xs transition text-center">
              本月
            </button>
            <button @click="applyExportPreset('last_month')"
              :class="exportModalConfig.presetRange === 'last_month' ? 'bg-[#111827] text-white dark:bg-[#10e57a] dark:text-black font-bold' : 'nt-btn text-gray-700 dark:text-gray-300'"
              class="py-1.5 px-2 rounded-md text-xs transition text-center">
              上月
            </button>
            <button @click="applyExportPreset('last_30_days')"
              :class="exportModalConfig.presetRange === 'last_30_days' ? 'bg-[#111827] text-white dark:bg-[#10e57a] dark:text-black font-bold' : 'nt-btn text-gray-700 dark:text-gray-300'"
              class="py-1.5 px-2 rounded-md text-xs transition text-center">
              近30天
            </button>
            <button @click="applyExportPreset('last_3_months')"
              :class="exportModalConfig.presetRange === 'last_3_months' ? 'bg-[#111827] text-white dark:bg-[#10e57a] dark:text-black font-bold' : 'nt-btn text-gray-700 dark:text-gray-300'"
              class="py-1.5 px-2 rounded-md text-xs transition text-center">
              近3个月
            </button>
            <button @click="applyExportPreset('this_year')"
              :class="exportModalConfig.presetRange === 'this_year' ? 'bg-[#111827] text-white dark:bg-[#10e57a] dark:text-black font-bold' : 'nt-btn text-gray-700 dark:text-gray-300'"
              class="py-1.5 px-2 rounded-md text-xs transition text-center">
              本年度
            </button>
          </div>
        </div>

        <!-- 精准起止日期选择 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">开始日期 (含)</label>
            <input v-model="exportModalConfig.startDate" @change="exportModalConfig.presetRange = 'custom'" type="date" 
              class="w-full px-3 py-2 nt-input font-mono text-sm">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">结束日期 (含)</label>
            <input v-model="exportModalConfig.endDate" @change="exportModalConfig.presetRange = 'custom'" type="date" 
              class="w-full px-3 py-2 nt-input font-mono text-sm">
          </div>
        </div>

        <!-- 导出范围与符合条数实时统计预览 -->
        <div class="p-3 rounded-lg border border-[#e2e2e0] dark:border-[#333] bg-[#f7f7f5] dark:bg-[#222] text-xs text-gray-600 dark:text-gray-300 flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <i class="fa-solid fa-circle-info text-emerald-600 text-xs"></i>
            <span>选定区间：<strong>{{ exportModalConfig.startDate || '不限' }}</strong> 至 <strong>{{ exportModalConfig.endDate || '不限' }}</strong></span>
          </div>
          <span class="font-mono font-bold text-emerald-700 dark:text-emerald-400">符合 {{ filteredExportRecordsCount }} 次排课记录</span>
        </div>

        <!-- 底部导出格式选择与确认 -->
        <div class="pt-3 border-t border-[#e2e2e0] dark:border-[#333] flex items-center justify-between gap-2 flex-wrap">
          <button @click="showExportAttendanceModal = false" class="nt-btn py-1.5 px-3">
            取消
          </button>
          <div class="flex items-center gap-2">
            <button @click="executeExport('csv')" class="nt-btn-export py-1.5 px-3 font-bold">
              <i class="fa-solid fa-file-excel mr-1 text-xs"></i>
              <span>确认导出 CSV 表格</span>
            </button>
            <button v-if="exportModalConfig.mode === 'student' || exportModalConfig.mode === 'student_pdf' || exportModalConfig.mode === 'student_csv'" 
              @click="executeExport('pdf')" 
              class="nt-btn py-1.5 px-3 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-bold">
              <i class="fa-solid fa-file-pdf mr-1 text-xs text-rose-500"></i>
              <span>生成/打印 A4 PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 🌟 全局核心模态窗: 【学员专属画币积分变更中心 (加分/扣分/校准/兑换)】 ⭐⭐⭐ -->
    <!-- ============================================================ -->
    <div v-if="showIndividualPointModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
      <div class="wf-card p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[92vh] flex flex-col">
        
        <!-- 弹窗顶栏 -->
        <div class="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <div>
            <h3 class="font-bold text-base flex items-center gap-1.5">
              <span class="text-amber-400">⭐</span>
              <span>学员画币积分变更中心</span>
            </h3>
            <p class="text-xs text-black dark:text-stone-400 mt-0.5">
              正在操作学员：<strong class="text-emerald-400 font-bold text-sm">{{ individualPointForm.studentName }}</strong>
            </p>
          </div>
          <button @click="showIndividualPointModal = false" class="text-black dark:text-stone-400 hover:text-white p-1">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- 当前与变更后积分预览大卡 -->
        <div class="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between">
          <div>
            <div class="text-[11px] text-amber-300/80 font-medium">当前可用画币</div>
            <div class="text-xl font-black font-mono text-amber-300 mt-0.5">
              ⭐ {{ individualPointForm.currentPoints }} 分
            </div>
          </div>

          <div class="text-xl font-mono font-bold text-black dark:text-stone-400">➔</div>

          <div class="text-right">
            <div class="text-[11px] text-emerald-400 font-medium">变更后预计结余</div>
            <div class="text-xl font-black font-mono text-[#10E57A] mt-0.5">
              ⭐ {{ calculatedNewPoints }} 分
            </div>
          </div>
        </div>

        <!-- 4 种变更模式子切换标签 -->
        <div class="grid grid-cols-4 gap-1 p-1 rounded-xl border border-black/10 dark:border-white/10" style="background-color: var(--bg-surface-subtle);">
          <button @click="individualPointForm.actionType = 'add'"
            :class="individualPointForm.actionType === 'add' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' : 'text-black dark:text-stone-400'"
            class="py-1.5 rounded-lg text-xs transition text-center">
            🟢 奖励加分
          </button>
          <button @click="individualPointForm.actionType = 'deduct'"
            :class="individualPointForm.actionType === 'deduct' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold' : 'text-black dark:text-stone-400'"
            class="py-1.5 rounded-lg text-xs transition text-center">
            🔴 扣除扣分
          </button>
          <button @click="individualPointForm.actionType = 'set'"
            :class="individualPointForm.actionType === 'set' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold' : 'text-black dark:text-stone-400'"
            class="py-1.5 rounded-lg text-xs transition text-center">
            ⚙️ 直接校准
          </button>
          <button @click="individualPointForm.actionType = 'redeem'"
            :class="individualPointForm.actionType === 'redeem' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold' : 'text-black dark:text-stone-400'"
            class="py-1.5 rounded-lg text-xs transition text-center">
            🎁 礼物兑换
          </button>
        </div>

        <!-- 内容区域 (根据不同模式呈现) -->
        <div class="space-y-3 overflow-y-auto flex-1 pr-1 text-xs">
          
          <!-- 模式 1: 🟢 奖励加分 (快捷预设按钮 + 自定义点数) -->
          <div v-if="individualPointForm.actionType === 'add'" class="space-y-3">
            <div>
              <label class="block text-black dark:text-stone-400 mb-1.5 font-semibold">快捷好习惯 / 表现奖励选项：</label>
              <div class="grid grid-cols-2 gap-2">
                <button v-for="opt in pointRewardOptions" :key="opt.id"
                  @click="onSelectRewardOption(opt)"
                  type="button"
                  :class="individualPointForm.reason === opt.name ? 'border-emerald-400 bg-emerald-500/15' : ''"
                  class="wf-reward-opt">
                  <span class="flex items-center gap-1.5">
                    <span>{{ opt.icon }}</span>
                    <span>{{ opt.name }}</span>
                  </span>
                  <span class="font-mono font-bold text-emerald-400">+{{ opt.points }}</span>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label class="block text-black dark:text-stone-400 mb-1 font-semibold">奖励画币分值 (+)*</label>
                <input v-model.number="individualPointForm.points" type="number" min="1" max="1000"
                  class="w-full px-3 py-2 wf-input text-emerald-400 font-bold font-mono text-sm">
              </div>
              <div>
                <label class="block text-black dark:text-stone-400 mb-1 font-semibold">奖励原因说明 *</label>
                <input v-model="individualPointForm.reason" type="text" placeholder="例: 主动收拾画具"
                  class="w-full px-3 py-2 wf-input">
              </div>
            </div>
          </div>

          <!-- 模式 2: 🔴 扣除扣分 -->
          <div v-if="individualPointForm.actionType === 'deduct'" class="space-y-3">
            <div class="p-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 text-[11px]">
              提示：违纪或未带画具扣除，将从该学员可用画币中扣减。
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-black dark:text-stone-400 mb-1 font-semibold">扣除画币分值 (-)*</label>
                <input v-model.number="individualPointForm.points" type="number" min="1" :max="individualPointForm.currentPoints"
                  class="w-full px-3 py-2 wf-input text-rose-400 font-bold font-mono text-sm">
              </div>
              <div>
                <label class="block text-black dark:text-stone-400 mb-1 font-semibold">扣除原因说明 *</label>
                <input v-model="individualPointForm.reason" type="text" placeholder="例: 损坏画具 / 课堂严重打闹"
                  class="w-full px-3 py-2 wf-input">
              </div>
            </div>
          </div>

          <!-- 模式 3: ⚙️ 直接校准目标余额 -->
          <div v-if="individualPointForm.actionType === 'set'" class="space-y-3">
            <div class="p-2.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300 text-[11px]">
              直接将该学员画币余额重置为目标分值，系统将自动计算差额并生成审计流水记录。
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-black dark:text-stone-400 mb-1 font-semibold">校准后目标积分余额 *</label>
                <input v-model.number="individualPointForm.targetPoints" type="number" min="0" max="99999"
                  class="w-full px-3 py-2 wf-input text-blue-400 font-bold font-mono text-sm">
              </div>
              <div>
                <label class="block text-black dark:text-stone-400 mb-1 font-semibold">校准原因说明 *</label>
                <input v-model="individualPointForm.reason" type="text" placeholder="例: 期初画币盘点校准"
                  class="w-full px-3 py-2 wf-input">
              </div>
            </div>
          </div>

          <!-- 模式 4: 🎁 礼物兑换商场 -->
          <div v-if="individualPointForm.actionType === 'redeem'" class="space-y-3">
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">选择要兑换的精美画画礼物：</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div v-for="prize in pointPrizes" :key="prize.id"
                @click="individualPointForm.selectedPrize = prize; individualPointForm.reason = '兑换【' + prize.name + '】'"
                :class="individualPointForm.selectedPrize?.id === prize.id ? 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400' : individualPointForm.currentPoints < prize.cost ? 'opacity-50' : ''"
                class="wf-prize-card">
                <div class="text-2xl">{{ prize.icon }}</div>
                <div class="flex-1">
                  <div class="font-bold text-xs">{{ prize.name }}</div>
                  <div class="text-[10px] text-black dark:text-stone-400 mt-0.5">{{ prize.desc }}</div>
                  <div class="flex items-center justify-between mt-1.5">
                    <span class="font-mono font-black text-amber-400 text-xs">⭐ {{ prize.cost }} 积分</span>
                    <span class="text-[10px] text-black dark:text-stone-400 font-mono">库存 {{ prize.stock }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- 弹窗底部操作按钮 -->
        <div class="pt-3 border-t border-black/10 dark:border-white/10 flex gap-2">
          <button @click="showIndividualPointModal = false" class="wf-btn-outline flex-1 py-2 justify-center">
            取消
          </button>
          <button @click="submitIndividualPointChange" class="wf-btn-primary flex-1 py-2 justify-center">
            确认执行变更
          </button>
        </div>

      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 🌟 全局电子收据 / 缴费凭据模态窗 (Printable Receipt) ⭐⭐⭐ -->
    <!-- ============================================================ -->
        <!-- ============================================================ -->
    <!-- 模态框 0.1: 🧾 学员缴费电子收据凭证 (官方标准规范设计 · 支持打印) -->
    <!-- ============================================================ -->
        <!-- ============================================================ -->
    <!-- 模态框 0: ✏️ 直接修改收费单条记录 (直接修改金额/课时/日期并同步学员课时) -->
    <!-- ============================================================ -->
    <div v-if="showDirectEditModal && directEditTargetOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="wf-card p-6 max-w-md w-full space-y-4 shadow-2xl bg-white dark:bg-[#1e1e1e]">
        <div class="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">✏️</span>
            <h3 class="font-bold text-base text-stone-900 dark:text-stone-100">修改单条收费记录</h3>
          </div>
          <button @click="showDirectEditModal = false" class="text-stone-400 hover:text-stone-900 dark:hover:text-white">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <!-- 订单单号与学员 -->
          <div class="p-3 rounded-xl bg-stone-100/70 dark:bg-stone-800/60 border border-black/5 dark:border-white/5 space-y-1 font-mono">
            <div class="flex justify-between">
              <span class="text-stone-500 font-sans">订单编号:</span>
              <span class="font-bold text-stone-600 dark:text-stone-400">{{ directEditTargetOrder.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-500 font-sans">学员姓名:</span>
              <span class="font-bold font-sans text-stone-900 dark:text-stone-100">{{ directEditTargetOrder.studentName }}</span>
            </div>
          </div>

          <!-- 实收金额 -->
          <div>
            <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">实收金额 (元) *</label>
            <input type="number" v-model.number="directEditForm.amount" min="0" step="1"
              class="w-full px-3 py-2 wf-input font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
          </div>

          <!-- 购买课时 & 赠送课时 -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">购买正课课时 (节) *</label>
              <input type="number" v-model.number="directEditForm.hoursBought" min="0" step="1"
                class="w-full px-3 py-2 wf-input font-mono font-bold">
            </div>
            <div>
              <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">赠送课时 (节)</label>
              <input type="number" v-model.number="directEditForm.hoursGift" min="0" step="1"
                class="w-full px-3 py-2 wf-input font-mono font-bold text-amber-500">
            </div>
          </div>

          <!-- 缴费时间 & 支付方式 -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">缴费日期 *</label>
              <input type="date" v-model="directEditForm.payDate" class="w-full px-3 py-2 wf-input font-mono text-xs">
            </div>
            <div>
              <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">支付方式</label>
              <select v-model="directEditForm.payMethod" class="w-full px-3 py-2 wf-select font-bold">
                <option value="微信支付">微信支付</option>
                <option value="支付宝">支付宝</option>
                <option value="现金">现金</option>
                <option value="银行转账">银行转账</option>
                <option value="POS刷卡">POS刷卡</option>
              </select>
            </div>
          </div>

          <!-- 经办人 & 业务类型 -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">经办老师</label>
              <input type="text" v-model="directEditForm.operator" placeholder="陈老师" class="w-full px-3 py-2 wf-input">
            </div>
            <div>
              <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">业务类型</label>
              <select v-model="directEditForm.type" class="w-full px-3 py-2 wf-select font-bold">
                <option value="新生报名">新生报名</option>
                <option value="老生续费">老生续费</option>
              </select>
            </div>
          </div>

          <!-- 备注说明 -->
          <div>
            <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">收费说明与备注</label>
            <textarea v-model="directEditForm.remark" rows="2" placeholder="填写说明..." class="w-full px-3 py-2 wf-input"></textarea>
          </div>
        </div>

        <div class="pt-2 flex gap-3">
          <button @click="showDirectEditModal = false" class="wf-btn-outline flex-1 py-2 justify-center">取消</button>
          <button @click="saveDirectEdit" class="wf-btn-primary flex-1 py-2 justify-center shadow-sm">
            <i class="fa-solid fa-check mr-1"></i>
            <span>保存修改并同步课时</span>
          </button>
        </div>
      </div>
    </div>


    <!-- ============================================================ -->
    <!-- 模态框 0.2: ↩️ 学员退费办理 (自定义金额与课时扣减 · 资金与课时闭环) -->
    <!-- ============================================================ -->
    <div v-if="showRefundModal && refundOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="wf-card p-6 max-w-md w-full space-y-4 shadow-2xl bg-white dark:bg-[#1e1e1e]">
        <div class="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-lg text-rose-500">↩️</span>
            <h3 class="font-bold text-base text-stone-900 dark:text-stone-100">办理学员退费</h3>
          </div>
          <button @click="showRefundModal = false" class="text-stone-400 hover:text-stone-900 dark:hover:text-white">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <!-- 订单基本信息 -->
          <div class="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1">
            <div class="flex justify-between">
              <span class="text-stone-500">原订单号:</span>
              <span class="font-mono font-bold">{{ refundOrder.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-500">学员姓名:</span>
              <span class="font-bold text-stone-900 dark:text-stone-100">{{ refundOrder.studentName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-500">原缴费金额:</span>
              <span class="font-mono font-black text-emerald-600">¥ {{ refundOrder.amount }} ({{ refundOrder.hoursBought }}节正课)</span>
            </div>
            <div v-if="refundOrder.refundAmount > 0" class="flex justify-between text-rose-500">
              <span>此前已退款:</span>
              <span class="font-mono font-bold">¥ {{ refundOrder.refundAmount }}</span>
            </div>
          </div>

          <!-- 退款金额输入 -->
          <div>
            <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">
              本次退费金额 (元) *
            </label>
            <input type="number" v-model.number="refundForm.refundAmount" min="0.01" :max="refundMaxAmount"
              class="w-full px-3 py-2 wf-input font-mono font-black text-sm text-rose-600">
            <span class="text-[10px] text-stone-400 mt-0.5 block">
              当前订单最大可退金额: ¥{{ refundMaxAmount }}
            </span>
          </div>

          <!-- 扣减学员课时数 -->
          <div>
            <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">
              同步扣除学员剩余课时 (节) *
            </label>
            <input type="number" v-model.number="refundForm.refundHours" min="0"
              class="w-full px-3 py-2 wf-input font-mono font-bold">
            <span class="text-[10px] text-stone-400 mt-0.5 block">
              系统将自动从学员剩余课时和累计充值中扣除相应课时
            </span>
          </div>

          <!-- 退费原因 -->
          <div>
            <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">退费原因说明 *</label>
            <input type="text" v-model="refundForm.refundReason" placeholder="例如: 家长搬家申请结清退费 / 课时转让退款等"
              class="w-full px-3 py-2 wf-input">
          </div>

          <!-- 经办人 -->
          <div>
            <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">经办人</label>
            <input type="text" v-model="refundForm.operator" placeholder="陈老师" class="w-full px-3 py-2 wf-input">
          </div>
        </div>

        <div class="pt-2 flex gap-2">
          <button @click="showRefundModal = false" class="wf-btn-outline flex-1 py-2 justify-center">取消</button>
          <button @click="submitRefund" class="wf-btn-primary flex-1 py-2 justify-center bg-rose-500 hover:bg-rose-600 text-white border-transparent">
            确认办理退费
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 模态框 0.3: ✏️ 修改订单信息 (经办人/支付方式/备注) -->
    <!-- ============================================================ -->
    <div v-if="showEditOrderModal && editOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="wf-card p-6 max-w-md w-full space-y-4 shadow-2xl bg-white dark:bg-[#1e1e1e]">
        <div class="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <h3 class="font-bold text-base text-stone-900 dark:text-stone-100">修改收费订单信息</h3>
          <button @click="showEditOrderModal = false" class="text-stone-400 hover:text-stone-900 dark:hover:text-white">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">学员姓名</label>
            <input type="text" :value="editOrder.studentName" disabled class="w-full px-3 py-2 wf-input opacity-60 font-bold">
          </div>

          <div>
            <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">支付方式</label>
            <select v-model="editOrderForm.payMethod" class="w-full px-3 py-2 wf-select font-bold">
              <option value="微信支付">微信支付</option>
              <option value="支付宝">支付宝</option>
              <option value="现金">现金</option>
              <option value="银行转账">银行转账</option>
              <option value="POS刷卡">POS刷卡</option>
            </select>
          </div>

          <div>
            <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">交费日期</label>
            <input type="date" v-model="editOrderForm.payDate" class="w-full px-3 py-2 wf-input font-mono">
          </div>

          <div>
            <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">经办老师</label>
            <input type="text" v-model="editOrderForm.operator" placeholder="例如: 陈老师" class="w-full px-3 py-2 wf-input">
          </div>

          <div>
            <label class="block text-stone-700 dark:text-stone-300 mb-1 font-bold">收费备注说明</label>
            <textarea v-model="editOrderForm.remark" rows="3" placeholder="补充订单备注..." class="w-full px-3 py-2 wf-input"></textarea>
          </div>
        </div>

        <div class="pt-2 flex gap-2">
          <button @click="showEditOrderModal = false" class="wf-btn-outline flex-1 py-2 justify-center">取消</button>
          <button @click="submitEditOrder" class="wf-btn-primary flex-1 py-2 justify-center">保存修改</button>
        </div>
      </div>
    </div>


    <!-- ============================================================ -->
    <!-- 模态弹窗 1: 新增考勤课次 -->
    <!-- ============================================================ -->
    <div v-if="showAddMatrixRowModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="wf-card p-6 max-w-md w-full space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <h3 class="font-bold text-base">添加班级考勤课次</h3>
          <button @click="showAddMatrixRowModal = false" class="text-black dark:text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">上课班级</label>
            <input type="text" :value="getClassById(matrixClassId).name" disabled class="w-full px-3 py-2 opacity-75 border border-black/10 dark:border-white/10 rounded-lg">
          </div>

          <div>
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">课程绘画主题 *</label>
            <input v-model="newMatrixRowForm.theme" type="text" placeholder="例：《梵高的向日葵》" class="w-full px-3 py-2 wf-input font-bold">
          </div>

          <div>
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">上课日期 *</label>
            <input v-model="newMatrixRowForm.date" type="date" class="w-full px-3 py-2 wf-input font-mono">
          </div>

          <div>
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">默认全员初始出勤状态</label>
            <select v-model="newMatrixRowForm.defaultStatus" class="w-full px-3 py-2 wf-select font-bold">
              <option value="到课">🟢 全员到课 (自动消课-1节)</option>
              <option value="未到">🔴 全员未到 (请假不扣课)</option>
              <option value="放假">🟣 全员放假 (休假停课)</option>
            </select>
          </div>
        </div>

        <div class="pt-2 flex gap-2">
          <button @click="showAddMatrixRowModal = false" class="wf-btn-outline flex-1 py-2 justify-center">取消</button>
          <button @click="submitAddMatrixRow" class="wf-btn-primary flex-1 py-2 justify-center">确认添加并消课</button>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 模态弹窗 1.1: 单独补课/调课消课 (Ad-hoc) -->
    <!-- ============================================================ -->
    <div v-if="showAdhocAttendanceModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="wf-card p-6 max-w-md w-full space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <h3 class="font-bold text-base">补考勤 / 单独补课消课</h3>
          <button @click="showAdhocAttendanceModal = false" class="text-black dark:text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">选择学员 *</label>
            <select v-model="adhocForm.studentId" class="w-full px-3 py-2 wf-select font-bold">
              <option value="">[请选择要补课的学员]</option>
              <option v-for="s in activeStudents" :key="s.id" :value="s.id">{{ s.name }} (余{{ s.remainHours }}节 · {{ getClassById(s.classId).name }})</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">补课日期 *</label>
              <input v-model="adhocForm.date" type="date" class="w-full px-3 py-2 wf-input">
            </div>

            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">出勤状态</label>
              <select v-model="adhocForm.status" class="w-full px-3 py-2 wf-select font-bold">
                <option value="到课">🟢 补课到课 (消课)</option>
                <option value="请假">🔴 请假 (不扣课)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">扣减课时数</label>
              <input v-model.number="adhocForm.deductHours" type="number" min="0" max="10" 
                :disabled="adhocForm.status === '请假'"
                class="w-full px-3 py-2 wf-input text-emerald-400 font-bold">
            </div>

            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">临时参加班级</label>
              <select v-model="adhocForm.targetClassId" class="w-full px-3 py-2 wf-select">
                <option value="">[单独补课/加练]</option>
                <option v-for="c in activeClasses" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">课题名称</label>
            <input v-model="adhocForm.theme" type="text" placeholder="例：《水彩写生特训》" class="w-full px-3 py-2 wf-input">
          </div>

          <div>
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">具体上课原因备注 *</label>
            <textarea v-model="adhocForm.remark" rows="2" placeholder="例：上周六请假，本次单独补课..." class="w-full px-3 py-2 wf-input"></textarea>
          </div>

        </div>

        <div class="pt-2 flex gap-2">
          <button @click="showAdhocAttendanceModal = false" class="wf-btn-outline flex-1 py-2 justify-center">取消</button>
          <button @click="submitAdhocAttendance" class="wf-btn-primary flex-1 py-2 justify-center">确认补录消课</button>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 模态弹窗 2: 续费充值 (含积分赠送) -->
    <!-- ============================================================ -->
    <div v-if="showRechargeModal" class="recharge-drawer-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="recharge-drawer wf-card p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <h3 class="font-bold text-base">学员收费录入 / 续费充值</h3>
          <button @click="showRechargeModal = false" class="text-black dark:text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <!-- 模式切换: 在读老生续费 vs 新生交费建档 -->
        <div class="flex p-1 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-bold">
          <button @click="rechargeMode = 'existing'" 
            :class="rechargeMode === 'existing' ? 'bg-[#10E57A] text-black shadow-sm font-black' : 'text-black dark:text-stone-400 hover:text-black dark:hover:text-white'"
            class="flex-1 py-1.5 rounded-lg transition text-center flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-user-check"></i>
            <span>在读老生续费</span>
          </button>
          <button @click="rechargeMode = 'new'" 
            :class="rechargeMode === 'new' ? 'bg-[#10E57A] text-black shadow-sm font-black' : 'text-black dark:text-stone-400 hover:text-black dark:hover:text-white'"
            class="flex-1 py-1.5 rounded-lg transition text-center flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-user-plus"></i>
            <span>➕ 新生交费建档</span>
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <!-- 在读老生选择 -->
          <div v-if="rechargeMode === 'existing'">
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">选择在读学员</label>
            <select v-model="rechargeForm.studentId" class="w-full px-3 py-2 wf-select font-bold">
              <option value="" disabled>请选择在读学员...</option>
              <option v-for="stu in activeStudents" :key="stu.id" :value="stu.id">
                {{ stu.name }} ({{ getClassById(stu.classId)?.name || '未分班' }}) · 现余{{ stu.remainHours }}节
              </option>
            </select>
          </div>

          <!-- 新生建档字段 -->
          <div v-if="rechargeMode === 'new'" class="space-y-3 p-3 bg-black/[0.02] dark:bg-white/[0.02] rounded-xl border border-black/10 dark:border-white/10">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-black dark:text-stone-400 mb-1 font-semibold">新生姓名 <span class="text-rose-500">*</span></label>
                <input v-model="rechargeForm.newStudentName" type="text" placeholder="例: 张小明" class="w-full px-3 py-2 wf-input font-bold">
              </div>
              <div>
                <label class="block text-black dark:text-stone-400 mb-1 font-semibold">分配班级</label>
                <select v-model="rechargeForm.newStudentClassId" class="w-full px-3 py-2 wf-select">
                  <option v-for="c in activeClasses" :key="c.id" :value="c.id">🎨 {{ c.name }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-black dark:text-stone-400 mb-1 font-semibold">性别</label>
                <select v-model="rechargeForm.newStudentGender" class="w-full px-3 py-2 wf-select">
                  <option>女</option>
                  <option>男</option>
                </select>
              </div>
              <div>
                <label class="block text-black dark:text-stone-400 mb-1 font-semibold">年龄 (岁)</label>
                <input v-model.number="rechargeForm.newStudentAge" type="number" class="w-full px-3 py-2 wf-input">
              </div>
              <div>
                <label class="block text-black dark:text-stone-400 mb-1 font-semibold">家长电话</label>
                <input v-model="rechargeForm.newStudentParentPhone" type="text" placeholder="手机号" class="w-full px-3 py-2 wf-input">
              </div>
            </div>
          </div>

          <!-- 🌟 缴费时间与经办老师 (置顶突出显示) -->
          <div class="grid grid-cols-2 gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
            <div>
              <label class="block text-black dark:text-stone-300 mb-1 font-bold flex items-center gap-1">
                <span>📅 缴费时间 / 日期</span>
                <span class="text-rose-500">*</span>
              </label>
              <input v-model="rechargeForm.payDate" type="date" class="w-full px-3 py-2 wf-input font-mono font-bold cursor-pointer bg-white dark:bg-stone-900 border-emerald-500/40">
            </div>
            <div>
              <label class="block text-black dark:text-stone-300 mb-1 font-bold">经办老师</label>
              <input v-model="rechargeForm.operator" type="text" placeholder="例: 陈老师" class="w-full px-3 py-2 wf-input bg-white dark:bg-stone-900">
            </div>
          </div>

          <!-- 课时数与赠送 -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">充值/购买课时数</label>
              <input v-model.number="rechargeForm.hoursBought" type="number" class="w-full px-3 py-2 wf-input text-emerald-400 font-bold">
            </div>
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">赠送课时</label>
              <input v-model.number="rechargeForm.hoursGift" type="number" class="w-full px-3 py-2 wf-input">
            </div>
          </div>

          <!-- 实收金额与支付方式 -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">实收金额 (元)</label>
              <input v-model.number="rechargeForm.amount" type="number" class="w-full px-3 py-2 wf-input text-emerald-400 font-bold">
            </div>
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">支付方式</label>
              <select v-model="rechargeForm.payMethod" class="w-full px-3 py-2 wf-select">
                <option>微信支付</option>
                <option>支付宝</option>
                <option>现金</option>
                <option>银行转账</option>
              </select>
            </div>
          </div>

          <!-- 赠送积分提示 -->
          <div class="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-center justify-between">
            <span>🎁 充值将赠送画币积分：</span>
            <strong class="font-mono">+{{ (rechargeForm.hoursBought || 0) + (rechargeForm.hoursGift || 0) }} 分</strong>
          </div>

          <div>
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">缴费说明备注</label>
            <input v-model="rechargeForm.remark" type="text" placeholder="例: 报名春季48课时常规班" class="w-full px-3 py-2 wf-input">
          </div>
        </div>

        <div class="pt-2 flex gap-2">
          <button @click="showRechargeModal = false" class="wf-btn-outline flex-1 py-2 justify-center">取消</button>
          <button @click="submitRecharge" class="wf-btn-primary flex-1 py-2 justify-center">
            {{ rechargeMode === 'new' ? '确认建档并入账' : '确认充值入账' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 模态弹窗 3: 学员录入/编辑 (含初始积分) -->
    <!-- ============================================================ -->
    <div v-if="showStudentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="wf-card p-6 max-w-md w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <h3 class="font-bold text-base">{{ isEditStudent ? '编辑学员档案' : '录入新学员' }}</h3>
          <button @click="showStudentModal = false" class="text-black dark:text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">姓名 *</label>
              <input v-model="studentForm.name" type="text" placeholder="例: 张小梨" class="w-full px-3 py-2 wf-input font-bold">
            </div>
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">性别</label>
              <select v-model="studentForm.gender" class="w-full px-3 py-2 wf-select">
                <option>女</option>
                <option>男</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">年龄 (岁)</label>
              <input v-model.number="studentForm.age" type="number" min="2" max="18" class="w-full px-3 py-2 wf-input">
            </div>
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">所在班级 *</label>
              <select v-model="studentForm.classId" class="w-full px-3 py-2 wf-select font-bold">
                <option v-for="c in activeClasses" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">家长姓名</label>
              <input v-model="studentForm.parentName" type="text" placeholder="例: 张妈妈" class="w-full px-3 py-2 wf-input">
            </div>
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">家长联系电话 *</label>
              <input v-model="studentForm.parentPhone" type="text" placeholder="例: 13900000000" class="w-full px-3 py-2 wf-input font-mono">
            </div>
          </div>

          <div v-if="!isEditStudent" class="p-3 rounded-lg border border-black/10 dark:border-white/10 space-y-2" style="background-color: var(--bg-surface-subtle);">
            <div class="font-bold text-[11px] text-emerald-400">初始课时与赠送画币</div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-black dark:text-stone-400 mb-1 font-semibold">初始购买课时</label>
                <input v-model.number="studentForm.initialHours" type="number" min="0" class="w-full px-3 py-1.5 wf-input text-emerald-400 font-bold">
              </div>
              <div>
                <label class="block text-black dark:text-stone-400 mb-1 font-semibold">新生赠送画币</label>
                <input v-model.number="studentForm.initialPoints" type="number" min="0" class="w-full px-3 py-1.5 wf-input text-amber-400 font-bold font-mono">
              </div>
            </div>
          </div>

          <div>
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">学员绘画特点与习惯备注</label>
            <textarea v-model="studentForm.notes" rows="2" placeholder="例: 色彩感知力强，喜欢水彩与手作..." class="w-full px-3 py-2 wf-input"></textarea>
          </div>
        </div>

        <div class="pt-2 flex gap-2">
          <button @click="showStudentModal = false" class="wf-btn-outline flex-1 py-2 justify-center">取消</button>
          <button @click="saveStudent" class="wf-btn-primary flex-1 py-2 justify-center">{{ isEditStudent ? '保存修改' : '确认录入' }}</button>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 模态弹窗 4: 班级开设/编辑 -->
    <!-- ============================================================ -->
    <div v-if="showClassModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="wf-card p-6 max-w-md w-full space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <h3 class="font-bold text-base">{{ isEditClass ? '编辑班级档案' : '开设新班级' }}</h3>
          <button @click="showClassModal = false" class="text-black dark:text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">班级名称 *</label>
            <input v-model="classForm.name" type="text" placeholder="例: 周六上午 · 启蒙感官探索A班 (3-5岁)" class="w-full px-3 py-2 wf-input font-bold">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">任课主讲老师 *</label>
              <input v-model="classForm.teacher" type="text" placeholder="例: 陈老师" class="w-full px-3 py-2 wf-input">
            </div>
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">班级满额人数</label>
              <input v-model.number="classForm.capacity" type="number" min="1" max="30" class="w-full px-3 py-2 wf-input font-mono font-bold">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">授课画坊教室</label>
              <input v-model="classForm.classroom" type="text" placeholder="例: 梨香一号画坊" class="w-full px-3 py-2 wf-input">
            </div>
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">上课常规时段 *</label>
              <input v-model="classForm.schedule" type="text" placeholder="例: 每周六 09:30 - 11:00" class="w-full px-3 py-2 wf-input">
            </div>
          </div>

          <div>
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">教学大纲方向与备注</label>
            <textarea v-model="classForm.notes" rows="2" placeholder="例: 针对低幼段综合材料探索与色彩感知..." class="w-full px-3 py-2 wf-input"></textarea>
          </div>
        </div>

        <div class="pt-2 flex gap-2">
          <button @click="showClassModal = false" class="wf-btn-outline flex-1 py-2 justify-center">取消</button>
          <button @click="saveClass" class="wf-btn-primary flex-1 py-2 justify-center">{{ isEditClass ? '保存班级' : '确认开班' }}</button>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 模态弹窗 5: 考勤单元格备注编辑 -->
    <!-- ============================================================ -->
    <div v-if="showCellEditModal" class="attendance-cell-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="attendance-cell-modal wf-card p-6 max-w-sm w-full space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <h3 class="font-bold text-base">学员单节课考勤备注</h3>
          <button @click="showCellEditModal = false" class="text-black dark:text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <span class="text-black dark:text-stone-400">学员：</span>
            <strong class="text-emerald-400 font-bold text-sm">{{ editingCell.studentName }}</strong>
          </div>

          <div>
            <label class="block text-black dark:text-stone-400 mb-2 font-semibold">本节考勤状态</label>
            <div class="attendance-status-options">
              <button type="button" @click="editingCell.currentStatus = '到课'" :class="{ active: editingCell.currentStatus === '到课' }">到课 <small>扣 1 课时</small></button>
              <button type="button" @click="editingCell.currentStatus = '未到'" :class="{ active: editingCell.currentStatus === '未到' || editingCell.currentStatus === '请假' }">未到 / 请假 <small>不扣课时</small></button>
              <button type="button" @click="editingCell.currentStatus = '放假'" :class="{ active: editingCell.currentStatus === '放假' }">放假 <small>不扣课时</small></button>
            </div>
          </div>

          <div>
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">课堂表现或请假原因备注</label>
            <textarea v-model="editingCell.note" rows="3" placeholder="例: 表现非常积极，色彩搭配有创意..." class="w-full px-3 py-2 wf-input"></textarea>
          </div>
        </div>

        <div class="pt-2 flex gap-2">
          <button @click="showCellEditModal = false" class="wf-btn-outline flex-1 py-2 justify-center">取消</button>
          <button @click="submitCellEdit" class="wf-btn-primary flex-1 py-2 justify-center">保存考勤与备注</button>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 模态弹窗 6: 全班一键奖积分 -->
    <!-- ============================================================ -->
    <div v-if="showBatchPointModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="wf-card p-6 max-w-md w-full space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <h3 class="font-bold text-base flex items-center gap-1.5 text-amber-400">
            <i class="fa-solid fa-star"></i>
            <span>为全班发放集体画币奖励</span>
          </h3>
          <button @click="showBatchPointModal = false" class="text-black dark:text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">奖励班级</label>
            <input type="text" :value="getClassById(batchPointForm.classId || matrixClassId).name" disabled class="w-full px-3 py-2 opacity-75 border border-black/10 dark:border-white/10 rounded-lg font-bold">
          </div>

          <div>
            <label class="block text-black dark:text-stone-400 mb-1.5 font-semibold">快捷奖励理由：</label>
            <div class="grid grid-cols-2 gap-2">
              <button v-for="opt in pointRewardOptions" :key="opt.id"
                @click="batchPointForm.points = opt.points; batchPointForm.reason = '全班 ' + opt.name"
                type="button"
                :class="batchPointForm.reason === '全班 ' + opt.name ? 'border-amber-400 bg-amber-500/15' : ''"
                class="wf-reward-opt">
                <span class="flex items-center gap-1.5">
                  <span>{{ opt.icon }}</span>
                  <span>{{ opt.name }}</span>
                </span>
                <span class="font-mono font-bold text-amber-400">+{{ opt.points }}</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">每人奖励画币 (+)*</label>
              <input v-model.number="batchPointForm.points" type="number" min="1" max="1000"
                class="w-full px-3 py-2 wf-input text-amber-400 font-bold font-mono">
            </div>
            <div>
              <label class="block text-black dark:text-stone-400 mb-1 font-semibold">集体奖励说明 *</label>
              <input v-model="batchPointForm.reason" type="text" placeholder="例: 全班课堂卫生优秀集体加分"
                class="w-full px-3 py-2 wf-input">
            </div>
          </div>
        </div>

        <div class="pt-2 flex gap-2">
          <button @click="showBatchPointModal = false" class="wf-btn-outline flex-1 py-2 justify-center">取消</button>
          <button @click="submitBatchPointReward" class="wf-btn-primary flex-1 py-2 justify-center">确认全班发放</button>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 7. 全局轻量通知提示 (Toast) -->
    <!-- ============================================================ -->
    <transition enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="toast.show" 
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all"
        :class="toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' : toast.type === 'warning' ? 'bg-amber-950/90 border-amber-500/50 text-amber-200' : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'">
        <i :class="toast.type === 'error' ? 'fa-solid fa-circle-exclamation text-rose-400' : toast.type === 'warning' ? 'fa-solid fa-triangle-exclamation text-amber-400' : 'fa-solid fa-circle-check text-emerald-400'" class="text-base"></i>
        <span class="text-xs sm:text-sm font-bold tracking-wide">{{ toast.message }}</span>
      </div>
    </transition>

  </div>
</template>

<script setup>
const throwOnError = async (promise, context = 'Supabase 请求') => {
  const { data, error } = await promise;
  if (error) {
    const enhancedError = new Error(context + '：' + error.message);
    enhancedError.code = error.code;
    enhancedError.details = error.details;
    enhancedError.hint = error.hint;
    throw enhancedError;
  }
  return data;
};

import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue';
import { DEFAULT_INITIAL_DATA } from './data.js';
import { supabase } from './lib/supabase.js';

const STORAGE_KEY = 'XIANGCHILI_ART_STUDIO_V16';
    const THEME_KEY = 'XIANGCHILI_THEME';

    // 经典 4 大主视图：attendance | ranking | students | records
    const currentTab = ref('attendance');
    const attendanceSortOrder = ref('desc'); // 'desc' (最新在前) | 'asc' (最早在前) 
    // Tab 3 子视图：classes (班级管理) | students (学员名册) | archive (归档中心)
    const rosterSubTab = ref('classes');
    // Tab 2 排行榜子视图：hours (课时排行榜) | points (积分光荣榜)
    const rankingViewType = ref('hours');

    const isDarkMode = ref(localStorage.getItem(THEME_KEY) === 'dark' ? false : false);

    // 核心数据
    const studioInfo = ref(DEFAULT_INITIAL_DATA.studioInfo);
    const classes = ref(DEFAULT_INITIAL_DATA.classes);
    const students = ref(DEFAULT_INITIAL_DATA.students);
    const attendanceHistory = ref(DEFAULT_INITIAL_DATA.attendanceHistory);
    const hourLogs = ref(DEFAULT_INITIAL_DATA.hourLogs);
    const paymentOrders = ref(DEFAULT_INITIAL_DATA.paymentOrders);

    // 🌟 积分系统数据
    const pointRewardOptions = ref(DEFAULT_INITIAL_DATA.pointRewardOptions || []);
    const pointPrizes = ref(DEFAULT_INITIAL_DATA.pointPrizes || []);
    const pointLogs = ref(DEFAULT_INITIAL_DATA.pointLogs || []);

    // Toast 提示
    const toast = reactive({
      show: false,
      message: '',
      type: 'success',
      timer: null
    });

    const showToast = (message, type = 'success', duration = 2500) => {
      if (toast.timer) clearTimeout(toast.timer);
      toast.message = message;
      toast.type = type;
      toast.show = true;
      toast.timer = setTimeout(() => {
        toast.show = false;
      }, duration);
    };

    // ==========================================
    // 1. 主题与数据持久化
    // ==========================================
    const applyTheme = () => {
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
      localStorage.setItem(THEME_KEY, isDarkMode.value ? 'dark' : 'light');
    };

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
      applyTheme();
      showToast(isDarkMode.value ? '已切换至深色线框模式 🌙' : '已切换至浅色模式 ☀️', 'info', 1500);
    };

    
    // ----------------------------------------------------
    // Supabase 云端同步与 LocalStorage 双缓冲机制
    // 本地先落盘；云端写入必须回读确认；刷新时恢复未同步快照
    // ----------------------------------------------------
    const syncStatus = ref('loading'); // loading | pending | syncing | connected | offline
    const syncErrorMessage = ref('');
    const syncStatusLabel = computed(() => ({
      loading: '正在读取云端…',
      pending: '等待云端保存',
      syncing: '正在同步…',
      connected: '已保存到云端',
      offline: '云端保存失败 · 点击重试'
    }[syncStatus.value] || '同步状态未知'));

    const FINANCE_META_PREFIX = '__PEAR_FINANCE_V1__:';
    const SYNC_TABLE_ORDER = [
      'studio_info',
      'classes',
      'students',
      'attendance_records',
      'finance_logs',
      'point_prizes',
      'point_reward_options',
      'point_logs'
    ];
    const HOUR_LOG_TYPES = new Set([
      '课时扣除', '撤销返还', '考勤修改退还', '大表考勤消课', '大表新增消课',
      '考勤撤销返还', '学员结课归档', '学员恢复在读', '个人临时消课',
      '新生建档缴费', '续费充值', '教务手动调整', '新生建档入读'
    ]);

    const lastSyncedRows = Object.fromEntries(SYNC_TABLE_ORDER.map(table => [table, new Map()]));
    const knownCloudIds = Object.fromEntries(SYNC_TABLE_ORDER.map(table => [table, new Set()]));
    let lastSyncedAt = null;
    let saveTimer = null;
    let pendingCloudSnapshot = null;
    let pendingForceSync = false;
    let cloudSyncInFlight = null;

    const clonePlain = value => JSON.parse(JSON.stringify(value));

    const createDefaultSnapshot = () => clonePlain({
      studioInfo: DEFAULT_INITIAL_DATA.studioInfo,
      classes: DEFAULT_INITIAL_DATA.classes || [],
      students: DEFAULT_INITIAL_DATA.students || [],
      attendanceHistory: DEFAULT_INITIAL_DATA.attendanceHistory || [],
      hourLogs: DEFAULT_INITIAL_DATA.hourLogs || [],
      paymentOrders: DEFAULT_INITIAL_DATA.paymentOrders || [],
      pointRewardOptions: DEFAULT_INITIAL_DATA.pointRewardOptions || [],
      pointPrizes: DEFAULT_INITIAL_DATA.pointPrizes || [],
      pointLogs: DEFAULT_INITIAL_DATA.pointLogs || []
    });

    const normalizeSnapshot = input => {
      const fallback = createDefaultSnapshot();
      const source = input && typeof input === 'object' ? input : {};
      return clonePlain({
        studioInfo: source.studioInfo && typeof source.studioInfo === 'object' ? source.studioInfo : fallback.studioInfo,
        classes: Array.isArray(source.classes) ? source.classes : fallback.classes,
        students: Array.isArray(source.students) ? source.students : fallback.students,
        attendanceHistory: (Array.isArray(source.attendanceHistory) ? source.attendanceHistory : fallback.attendanceHistory).filter(a => !a.date || a.date <= '2026-08-31'),
        hourLogs: Array.isArray(source.hourLogs) ? source.hourLogs : fallback.hourLogs,
        paymentOrders: Array.isArray(source.paymentOrders) ? source.paymentOrders : fallback.paymentOrders,
        pointRewardOptions: Array.isArray(source.pointRewardOptions) ? source.pointRewardOptions : fallback.pointRewardOptions,
        pointPrizes: Array.isArray(source.pointPrizes) ? source.pointPrizes : fallback.pointPrizes,
        pointLogs: Array.isArray(source.pointLogs) ? source.pointLogs : fallback.pointLogs
      });
    };

    const buildDataSnapshot = () => normalizeSnapshot({
      studioInfo: studioInfo.value,
      classes: classes.value,
      students: students.value,
      attendanceHistory: attendanceHistory.value,
      hourLogs: hourLogs.value,
      paymentOrders: paymentOrders.value,
      pointRewardOptions: pointRewardOptions.value,
      pointPrizes: pointPrizes.value,
      pointLogs: pointLogs.value
    });

    const applyDataSnapshot = snapshotInput => {
      const snapshot = normalizeSnapshot(snapshotInput);
      studioInfo.value = snapshot.studioInfo;
      classes.value = snapshot.classes;
      students.value = snapshot.students;
      attendanceHistory.value = snapshot.attendanceHistory;
      hourLogs.value = snapshot.hourLogs;
      paymentOrders.value = snapshot.paymentOrders;
      pointRewardOptions.value = snapshot.pointRewardOptions;
      pointPrizes.value = snapshot.pointPrizes;
      pointLogs.value = snapshot.pointLogs;
      nextTick(() => {
        if (activeClasses.value.length > 0 && !activeClasses.value.some(c => c.id === matrixClassId.value)) {
          matrixClassId.value = activeClasses.value[0].id;
        }
      });
      return snapshot;
    };

    const serializeKnownCloudIds = () => Object.fromEntries(
      SYNC_TABLE_ORDER.map(table => [table, Array.from(knownCloudIds[table] || [])])
    );

    const restoreKnownCloudIds = metadata => {
      const saved = metadata?.knownCloudIds;
      if (!saved || typeof saved !== 'object') return;
      SYNC_TABLE_ORDER.forEach(table => {
        knownCloudIds[table] = new Set(Array.isArray(saved[table]) ? saved[table] : []);
      });
    };

    const writeLocalSnapshot = (snapshotInput, { pending = false, error = '' } = {}) => {
      const snapshot = normalizeSnapshot(snapshotInput);
      const localPayload = {
        ...snapshot,
        __sync: {
          version: 2,
          pending,
          lastSyncedAt,
          error,
          knownCloudIds: serializeKnownCloudIds()
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localPayload));
      return snapshot;
    };

    const readLocalSnapshot = () => {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const metadata = parsed.__sync || null;
      restoreKnownCloudIds(metadata);
      if (metadata?.lastSyncedAt) lastSyncedAt = metadata.lastSyncedAt;
      return {
        snapshot: normalizeSnapshot(parsed),
        metadata,
        needsRecovery: !metadata || metadata.version !== 2 || metadata.pending === true
      };
    };

    const encodeFinanceMetadata = payload => FINANCE_META_PREFIX + JSON.stringify(payload);

    const decodeFinanceMetadata = description => {
      if (typeof description !== 'string' || !description.startsWith(FINANCE_META_PREFIX)) return null;
      try {
        return JSON.parse(description.slice(FINANCE_META_PREFIX.length));
      } catch {
        return null;
      }
    };

    const isHourLogRow = row => {
      const metadata = decodeFinanceMetadata(row.description);
      if (metadata?.kind) return metadata.kind === 'hour';
      const id = String(row.id || '');
      if (id.startsWith('log_')) return true;
      if (id.startsWith('pay_')) return false;
      return HOUR_LOG_TYPES.has(row.type);
    };
    const mapCloudTablesToSnapshot = tables => {
      const studioRow = tables.studio_info?.[0];
      const financeRows = Array.isArray(tables.finance_logs) ? tables.finance_logs : [];
      const cloudHourLogs = [];
      const cloudPaymentOrders = [];

      financeRows.forEach(row => {
        const metadata = decodeFinanceMetadata(row.description);
        if (isHourLogRow(row)) {
          cloudHourLogs.push({
            id: row.id,
            studentId: row.student_id,
            studentName: row.student_name,
            type: row.type,
            hours: Number(row.hours || 0),
            balanceAfter: Number(row.amount || 0),
            reason: metadata?.reason ?? row.description ?? '',
            operator: row.operator,
            time: row.date
          });
        } else {
          cloudPaymentOrders.push({
            id: row.id,
            orderNo: metadata?.orderNo || row.id,
            studentId: row.student_id,
            studentName: row.student_name,
            type: row.type,
            amount: Number(row.amount || 0),
            hoursBought: Number(metadata?.hoursBought ?? row.hours ?? 0),
            hoursGift: Number(metadata?.hoursGift ?? 0),
            hours: Number(row.hours || 0),
            date: row.date,
            payDate: row.date,
            payMethod: metadata?.payMethod || '',
            operator: row.operator,
            remark: metadata?.remark || ''
          });
        }
      });

      return normalizeSnapshot({
        studioInfo: studioRow ? {
          ...studioRow,
          warningThreshold: studioRow.warning_threshold
        } : DEFAULT_INITIAL_DATA.studioInfo,
        classes: (tables.classes || []).map(row => ({
          ...row,
          createdAt: row.created_at,
          archivedAt: row.archived_at
        })),
        students: (tables.students || []).map(row => ({
          ...row,
          classId: row.class_id,
          parentName: row.parent_name,
          parentPhone: row.parent_phone,
          remainHours: Number(row.remain_hours || 0),
          totalPurchased: Number(row.total_purchased || 0),
          totalConsumed: Number(row.total_consumed || 0),
          totalPointsEarned: Number(row.total_points_earned || 0),
          redeemedCount: Number(row.redeemed_count || 0),
          joinDate: row.join_date,
          createdAt: row.created_at
        })),
        attendanceHistory: (tables.attendance_records || []).filter(row => !row.date || row.date <= '2026-08-31').map(row => ({
          id: row.id,
          date: row.date,
          theme: row.theme,
          classId: row.class_id,
          details: Array.isArray(row.details) ? row.details : []
        })),
        hourLogs: cloudHourLogs,
        paymentOrders: cloudPaymentOrders,
        pointPrizes: (tables.point_prizes || []).map(row => ({
          id: row.id,
          name: row.name,
          cost: Number(row.cost || 0),
          stock: Number(row.stock || 0),
          icon: row.icon,
          desc: row.desc_text
        })),
        pointLogs: (tables.point_logs || []).map(row => ({
          id: row.id,
          studentId: row.student_id,
          studentName: row.student_name,
          type: row.type,
          points: Number(row.points || 0),
          balanceAfter: Number(row.balance_after || 0),
          reason: row.reason,
          operator: row.operator,
          time: row.time
        })),
        pointRewardOptions: tables.point_reward_options || []
      });
    };

    const toDatabaseTables = snapshotInput => {
      const snapshot = normalizeSnapshot(snapshotInput);
      const studio = snapshot.studioInfo || {};
      return {
        studio_info: [{
          id: studio.id || '00000000-0000-0000-0000-000000000000',
          name: studio.name || '',
          teacher: studio.teacher || '',
          slogan: studio.slogan || '',
          phone: studio.phone || '',
          address: studio.address || '',
          warning_threshold: Number(studio.warningThreshold ?? studio.warning_threshold ?? 0)
        }],
        classes: snapshot.classes.map(row => ({
          id: row.id,
          name: row.name || '',
          teacher: row.teacher || '',
          schedule: row.schedule || '',
          classroom: row.classroom || '',
          capacity: Number(row.capacity || 0),
          status: row.status || '活跃',
          archived_at: row.archivedAt || row.archived_at || null,
          notes: row.notes || ''
        })),
        students: snapshot.students.map(row => ({
          id: row.id,
          name: row.name || '',
          gender: row.gender || '',
          age: Number(row.age || 0),
          class_id: row.classId || row.class_id || null,
          parent_name: row.parentName || row.parent_name || '',
          parent_phone: row.parentPhone || row.parent_phone || '',
          remain_hours: Number(row.remainHours ?? row.remain_hours ?? 0),
          total_purchased: Number(row.totalPurchased ?? row.total_purchased ?? 0),
          total_consumed: Number(row.totalConsumed ?? row.total_consumed ?? 0),
          points: Number(row.points || 0),
          total_points_earned: Number(row.totalPointsEarned ?? row.total_points_earned ?? 0),
          redeemed_count: Number(row.redeemedCount ?? row.redeemed_count ?? 0),
          status: row.status || '在读',
          join_date: row.joinDate || row.join_date || null,
          notes: row.notes || ''
        })),
        attendance_records: snapshot.attendanceHistory.map(row => ({
          id: row.id,
          date: row.date,
          theme: row.theme || '',
          class_id: row.classId || row.class_id || null,
          details: Array.isArray(row.details) ? row.details : []
        })),
        finance_logs: [
          ...snapshot.hourLogs.map(row => ({
            id: row.id,
            type: row.type || '课时流水',
            date: row.time || row.date,
            amount: Number(row.balanceAfter ?? row.amount ?? 0),
            student_id: row.studentId || row.student_id || null,
            student_name: row.studentName || row.student_name || '',
            description: encodeFinanceMetadata({
              kind: 'hour',
              reason: row.reason || ''
            }),
            hours: Number(row.hours || 0),
            operator: row.operator || ''
          })),
          ...snapshot.paymentOrders.map(row => ({
            id: row.id || row.orderNo,
            type: row.type || '收费订单',
            date: row.date,
            amount: Number(row.amount || 0),
            student_id: row.studentId || row.student_id || null,
            student_name: row.studentName || row.student_name || '',
            description: encodeFinanceMetadata({
              kind: 'payment',
              orderNo: row.orderNo || row.id,
              hoursBought: Number(row.hoursBought ?? row.hours ?? 0),
              hoursGift: Number(row.hoursGift || 0),
              payMethod: row.payMethod || '',
              remark: row.remark || ''
            }),
            hours: Number(row.hours ?? (Number(row.hoursBought || 0) + Number(row.hoursGift || 0))),
            operator: row.operator || ''
          }))
        ],
        point_prizes: snapshot.pointPrizes.map(row => ({
          id: row.id,
          name: row.name || '',
          cost: Number(row.cost || 0),
          stock: Number(row.stock || 0),
          icon: row.icon || '',
          desc_text: row.desc || row.desc_text || ''
        })),
        point_reward_options: snapshot.pointRewardOptions.map(row => ({
          id: row.id,
          name: row.name || '',
          points: Number(row.points || 0),
          icon: row.icon || '',
          color: row.color || ''
        })),
        point_logs: snapshot.pointLogs.map(row => ({
          id: row.id,
          student_id: row.studentId || row.student_id || null,
          student_name: row.studentName || row.student_name || '',
          type: row.type || '',
          points: Number(row.points || 0),
          balance_after: Number(row.balanceAfter ?? row.balance_after ?? 0),
          reason: row.reason || '',
          operator: row.operator || '',
          time: row.time
        }))
      };
    };

    const fetchAllRows = async table => {
      const pageSize = 500;
      const rows = [];
      for (let from = 0; ; from += pageSize) {
        const batch = await throwOnError(
          supabase.from(table).select('*').order('id', { ascending: true }).range(from, from + pageSize - 1),
          '读取 ' + table
        );
        rows.push(...(batch || []));
        if (!batch || batch.length < pageSize) break;
      }
      return rows;
    };

    const fetchCloudTables = async () => {
      const entries = await Promise.all(
        SYNC_TABLE_ORDER.map(async table => [table, await fetchAllRows(table)])
      );
      return Object.fromEntries(entries);
    };

    const refreshSyncBaseline = (databaseTables, cloudTables = databaseTables) => {
      SYNC_TABLE_ORDER.forEach(table => {
        const rows = databaseTables[table] || [];
        lastSyncedRows[table] = new Map(
          rows.filter(row => row?.id != null).map(row => [String(row.id), JSON.stringify(row)])
        );
        knownCloudIds[table] = new Set(
          (cloudTables[table] || rows).filter(row => row?.id != null).map(row => String(row.id))
        );
      });
    };

    const mergeRowsPreferLocal = (cloudRows = [], localRows = []) => {
      const localIds = new Set(localRows.filter(row => row?.id != null).map(row => String(row.id)));
      return [
        ...clonePlain(localRows),
        ...clonePlain(cloudRows.filter(row => row?.id == null || !localIds.has(String(row.id))))
      ];
    };

    const normalizeFinanceCollections = snapshotInput => {
      const snapshot = normalizeSnapshot(snapshotInput);
      const hourById = new Map();
      const paymentById = new Map();

      snapshot.hourLogs.forEach(row => {
        if (row?.id == null) return;
        hourById.set(String(row.id), row);
      });

      snapshot.paymentOrders.forEach(row => {
        if (row?.id == null) return;
        const id = String(row.id);
        const shouldBeHour = id.startsWith('log_') || (!id.startsWith('pay_') && HOUR_LOG_TYPES.has(row.type));
        if (shouldBeHour) {
          hourById.set(id, {
            id: row.id,
            studentId: row.studentId || row.student_id,
            studentName: row.studentName || row.student_name,
            type: row.type,
            hours: Number(row.hours || 0),
            balanceAfter: Number(row.balanceAfter ?? row.amount ?? 0),
            reason: row.reason || row.description || '',
            operator: row.operator,
            time: row.time || row.date
          });
          return;
        }
        paymentById.set(id, row);
      });

      hourById.forEach((row, id) => paymentById.delete(id));
      return {
        ...snapshot,
        hourLogs: Array.from(hourById.values()),
        paymentOrders: Array.from(paymentById.values())
      };
    };

    const mergeSnapshotsPreferLocal = (cloudInput, localInput) => {
      const cloud = normalizeFinanceCollections(cloudInput);
      const local = normalizeFinanceCollections(localInput);
      return normalizeSnapshot({
        studioInfo: { ...cloud.studioInfo, ...local.studioInfo },
        classes: mergeRowsPreferLocal(cloud.classes, local.classes),
        students: mergeRowsPreferLocal(cloud.students, local.students),
        attendanceHistory: mergeRowsPreferLocal(cloud.attendanceHistory, local.attendanceHistory),
        hourLogs: mergeRowsPreferLocal(cloud.hourLogs, local.hourLogs),
        paymentOrders: mergeRowsPreferLocal(cloud.paymentOrders, local.paymentOrders),
        pointRewardOptions: mergeRowsPreferLocal(cloud.pointRewardOptions, local.pointRewardOptions),
        pointPrizes: mergeRowsPreferLocal(cloud.pointPrizes, local.pointPrizes),
        pointLogs: mergeRowsPreferLocal(cloud.pointLogs, local.pointLogs)
      });
    };
    const chunkRows = (rows, size = 100) => {
      const chunks = [];
      for (let index = 0; index < rows.length; index += size) chunks.push(rows.slice(index, index + size));
      return chunks;
    };

    const syncTableRows = async (table, rowsInput, { force = false } = {}) => {
      const rows = (rowsInput || []).filter(row => row?.id != null);
      const currentHashes = new Map(rows.map(row => [String(row.id), JSON.stringify(row)]));
      const previousHashes = lastSyncedRows[table] || new Map();
      const changedRows = force
        ? rows
        : rows.filter(row => previousHashes.get(String(row.id)) !== currentHashes.get(String(row.id)));

      for (const chunk of chunkRows(changedRows)) {
        const savedRows = await throwOnError(
          supabase.from(table).upsert(chunk, { onConflict: 'id' }).select('id'),
          '保存 ' + table
        );
        if ((savedRows || []).length !== chunk.length) {
          throw new Error('保存 ' + table + ' 未完整返回：预期 ' + chunk.length + ' 行，实际 ' + (savedRows || []).length + ' 行');
        }
      }

      const currentIds = new Set(currentHashes.keys());
      const staleIds = Array.from(knownCloudIds[table] || []).filter(id => !currentIds.has(String(id)));
      for (const chunk of chunkRows(staleIds)) {
        const deletedRows = await throwOnError(
          supabase.from(table).delete().in('id', chunk).select('id'),
          '删除 ' + table + ' 的云端旧记录'
        );
        if ((deletedRows || []).length !== chunk.length) {
          throw new Error('删除 ' + table + ' 未完整返回：预期 ' + chunk.length + ' 行，实际 ' + (deletedRows || []).length + ' 行');
        }
      }

      lastSyncedRows[table] = currentHashes;
      knownCloudIds[table] = currentIds;
    };

    const persistSnapshotToCloud = async (snapshotInput, { force = false } = {}) => {
      const databaseTables = toDatabaseTables(snapshotInput);
      for (const table of SYNC_TABLE_ORDER) {
        await syncTableRows(table, databaseTables[table], { force });
      }
      return databaseTables;
    };

    const reportSyncFailure = (error, snapshot) => {
      const message = error?.message || '未知错误';
      console.error('写入 Supabase 失败:', error);
      pendingCloudSnapshot = pendingCloudSnapshot || snapshot;
      pendingForceSync = true;
      syncStatus.value = 'offline';
      const isNewError = syncErrorMessage.value !== message;
      syncErrorMessage.value = message;
      try {
        writeLocalSnapshot(buildDataSnapshot(), { pending: true, error: message });
      } catch (localError) {
        console.error('本地缓存写入也失败:', localError);
      }
      if (isNewError) {
        showToast('云端保存失败：' + message + '。数据仍保留在本机，点击右上角状态可重试。', 'error', 8000);
      }
    };

    const runCloudSyncLoop = () => {
      if (cloudSyncInFlight) return cloudSyncInFlight;
      cloudSyncInFlight = (async () => {
        let lastSuccessfulSnapshot = null;
        while (pendingCloudSnapshot) {
          const snapshot = pendingCloudSnapshot;
          const force = pendingForceSync;
          pendingCloudSnapshot = null;
          pendingForceSync = false;
          syncStatus.value = 'syncing';
          try {
            await persistSnapshotToCloud(snapshot, { force });
            lastSuccessfulSnapshot = snapshot;
          } catch (error) {
            reportSyncFailure(error, snapshot);
            return false;
          }
        }

        if (lastSuccessfulSnapshot) {
          lastSyncedAt = new Date().toISOString();
          syncErrorMessage.value = '';
          syncStatus.value = 'connected';
          writeLocalSnapshot(lastSuccessfulSnapshot, { pending: false });
        }
        return true;
      })().finally(() => {
        cloudSyncInFlight = null;
      });
      return cloudSyncInFlight;
    };

    const queueCloudSync = (snapshot, { immediate = false, force = false } = {}) => {
      pendingCloudSnapshot = snapshot;
      pendingForceSync = pendingForceSync || force;
      if (saveTimer) {
        clearTimeout(saveTimer);
        saveTimer = null;
      }
      syncStatus.value = immediate ? 'syncing' : 'pending';
      if (immediate) return runCloudSyncLoop();
      saveTimer = setTimeout(() => {
        saveTimer = null;
        runCloudSyncLoop();
      }, 450);
      return Promise.resolve(true);
    };

    const saveData = (options = {}) => {
      const safeOptions = options && typeof options === 'object' && !('target' in options) ? options : {};
      const snapshot = buildDataSnapshot();
      try {
        writeLocalSnapshot(snapshot, { pending: Boolean(supabase) });
      } catch (error) {
        console.error('本地缓存保存失败:', error);
        showToast('本机缓存保存失败：' + error.message, 'error', 8000);
      }

      if (!supabase) {
        syncStatus.value = 'offline';
        syncErrorMessage.value = 'Supabase 客户端未配置';
        return Promise.resolve(false);
      }
      return queueCloudSync(snapshot, {
        immediate: Boolean(safeOptions.immediate),
        force: Boolean(safeOptions.force)
      });
    };

    const retryCloudSync = () => saveData({ immediate: true, force: true });

    const loadData = async () => {
      let localRecord = null;
      try {
        localRecord = readLocalSnapshot();
        applyDataSnapshot(localRecord?.snapshot || createDefaultSnapshot());
      } catch (error) {
        console.warn('本地缓存解析失败，改用初始数据:', error);
        applyDataSnapshot(createDefaultSnapshot());
      }

      if (!supabase) {
        syncStatus.value = 'offline';
        syncErrorMessage.value = 'Supabase 客户端未配置';
        return;
      }

      syncStatus.value = 'loading';
      try {
        const cloudTables = await fetchCloudTables();
        const cloudIsEmpty = !cloudTables.studio_info || cloudTables.studio_info.length === 0;
        const cloudSnapshot = cloudIsEmpty
          ? createDefaultSnapshot()
          : mapCloudTablesToSnapshot(cloudTables);

        refreshSyncBaseline(toDatabaseTables(cloudSnapshot), cloudTables);

        if (cloudIsEmpty || localRecord?.needsRecovery) {
          const recoveredSnapshot = localRecord
            ? mergeSnapshotsPreferLocal(cloudSnapshot, localRecord.snapshot)
            : cloudSnapshot;
          applyDataSnapshot(recoveredSnapshot);
          await persistSnapshotToCloud(recoveredSnapshot);
          lastSyncedAt = new Date().toISOString();
          syncErrorMessage.value = '';
          syncStatus.value = 'connected';
          writeLocalSnapshot(recoveredSnapshot, { pending: false });
          if (localRecord?.needsRecovery) {
            showToast('已恢复浏览器中的未同步数据，并保存到云端。', 'success', 3500);
          }
          return;
        }

        applyDataSnapshot(cloudSnapshot);
        lastSyncedAt = new Date().toISOString();
        syncErrorMessage.value = '';
        syncStatus.value = 'connected';
        writeLocalSnapshot(cloudSnapshot, { pending: false });
      } catch (error) {
        console.error('从 Supabase 加载数据失败:', error);
        syncStatus.value = 'offline';
        syncErrorMessage.value = error?.message || '读取云端失败';
        try {
          writeLocalSnapshot(buildDataSnapshot(), {
            pending: Boolean(localRecord?.needsRecovery),
            error: syncErrorMessage.value
          });
        } catch (localError) {
          console.error('保存本地降级快照失败:', localError);
        }
        showToast('云端读取失败，当前继续使用本机数据：' + syncErrorMessage.value, 'error', 8000);
      }
    };

    const exportDataJSON = () => {
      const dataToExport = {
        studioInfo: studioInfo.value,
        classes: classes.value,
        students: students.value,
        attendanceHistory: attendanceHistory.value,
        hourLogs: hourLogs.value,
        paymentOrders: paymentOrders.value,
        pointRewardOptions: pointRewardOptions.value,
        pointPrizes: pointPrizes.value,
        pointLogs: pointLogs.value,
        exportTime: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `想吃梨教务与积分数据备份_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('🍐 完整备份文件已下载');
    };

    const importDataJSON = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed.classes && parsed.students) {
            if (parsed.studioInfo) studioInfo.value = parsed.studioInfo;
            classes.value = parsed.classes;
            students.value = parsed.students;
            if (parsed.attendanceHistory) attendanceHistory.value = parsed.attendanceHistory;
            if (parsed.hourLogs) hourLogs.value = parsed.hourLogs;
            if (parsed.paymentOrders) paymentOrders.value = parsed.paymentOrders;
            if (parsed.pointRewardOptions) pointRewardOptions.value = parsed.pointRewardOptions;
            if (parsed.pointPrizes) pointPrizes.value = parsed.pointPrizes;
            if (parsed.pointLogs) pointLogs.value = parsed.pointLogs;
            saveData();
            showToast('🍐 备份数据导入成功！');
          }
        } catch (err) {
          showToast('JSON文件解析失败', 'error');
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    };

    // ==========================================
    // 2. 活跃与归档状态划分
    // ==========================================
    const activeClasses = computed(() => {
      return classes.value.filter(c => c.status !== 'archived');
    });

    const archivedClasses = computed(() => {
      return classes.value.filter(c => c.status === 'archived');
    });

    const activeStudents = computed(() => {
      return students.value.filter(s => s.status !== '已归档');
    });

    const archivedStudents = computed(() => {
      return students.value.filter(s => s.status === '已归档');
    });

    // ==========================================
    // 3. 统计指标
    // ==========================================
    const kpiStats = computed(() => {
      const activeList = activeStudents.value;
      const totalStudents = activeList.length;
      const totalHours = activeList.reduce((sum, s) => sum + Number(s.remainHours || 0), 0);
      const threshold = studioInfo.value.warningThreshold || 3;
      
      const depleted = activeList.filter(s => Number(s.remainHours) <= 0).length;
      const warning = activeList.filter(s => Number(s.remainHours) > 0 && Number(s.remainHours) <= threshold).length;
      const sufficient = activeList.filter(s => Number(s.remainHours) > threshold).length;
      const totalConsumed = activeList.reduce((sum, s) => sum + Number(s.totalConsumed || 0), 0);
      const totalPoints = activeList.reduce((sum, s) => sum + Number(s.points || 0), 0);

      return {
        totalStudents,
        totalHours,
        totalPoints,
        depleted,
        warning,
        sufficient,
        totalConsumed,
        classesCount: activeClasses.value.length,
        archivedClassesCount: archivedClasses.value.length,
        archivedStudentsCount: archivedStudents.value.length
      };
    });

    const getClassById = (classId) => {
      return classes.value.find(c => c.id === classId) || { name: '未分班', teacher: '陈老师', schedule: '待定', capacity: 8 };
    };

    const getHourStatus = (remainHours) => {
      const h = Number(remainHours);
      const threshold = studioInfo.value.warningThreshold || 3;
      if (h <= 0) {
        return {
          label: '已耗尽',
          type: 'depleted',
          badgeClass: 'wf-badge-red font-bold',
          dotColor: 'bg-rose-500'
        };
      } else if (h <= threshold) {
        return {
          label: '急需续费',
          type: 'warning',
          badgeClass: 'wf-badge-yellow font-bold',
          dotColor: 'bg-amber-400'
        };
      } else {
        return {
          label: '正常',
          type: 'sufficient',
          badgeClass: 'wf-badge-green font-medium',
          dotColor: 'bg-[#10E57A]'
        };
      }
    };

    // ==========================================
    // 4. 🌟 专属个人积分变更中心 (支持加分/扣分/直接设定/兑换)
    // ==========================================
    const showIndividualPointModal = ref(false);
    const individualPointForm = reactive({
      studentId: '',
      studentName: '',
      currentPoints: 0,
      mode: 'add', // 'add' (奖励加分) | 'deduct' (扣除积分) | 'set' (直接设定) | 'redeem' (兑换礼物)
      selectedOptionId: 'opt_1',
      pointsVal: 5,
      reason: '🌟 课堂专注认真',
      operator: '陈老师',
      selectedPrizeId: 'prz_1',
      isBatch: false,
      classId: ''
    });

    // 打开专属个人积分变更弹窗
    const openIndividualPointModal = (student, initialMode = 'add', defaultOptId = 'opt_1') => {
      if (!student) return;
      const target = students.value.find(s => s.id === student.id) || student;
      individualPointForm.isBatch = false;
      individualPointForm.studentId = target.id;
      individualPointForm.studentName = target.name;
      individualPointForm.currentPoints = Number(target.points || 0);
      individualPointForm.mode = initialMode;
      individualPointForm.operator = '陈老师';

      if (initialMode === 'add') {
        individualPointForm.selectedOptionId = defaultOptId;
        const opt = pointRewardOptions.value.find(o => o.id === defaultOptId);
        if (opt) {
          individualPointForm.pointsVal = opt.points;
          individualPointForm.reason = `${opt.icon} ${opt.name}`;
        } else {
          individualPointForm.pointsVal = 5;
          individualPointForm.reason = '课堂表现优异';
        }
      } else if (initialMode === 'deduct') {
        individualPointForm.pointsVal = 5;
        individualPointForm.reason = '未带画具材料 / 违纪扣除';
      } else if (initialMode === 'set') {
        individualPointForm.pointsVal = target.points || 0;
        individualPointForm.reason = '教务手动直接校准积分余额';
      } else if (initialMode === 'redeem') {
        individualPointForm.selectedPrizeId = pointPrizes.value[0]?.id || '';
        individualPointForm.reason = '现场礼物兑换';
      }

      showIndividualPointModal.value = true;
    };

    // 兼容原方法名
    const openPointReward = (student, defaultOptId = 'opt_1') => {
      openIndividualPointModal(student, 'add', defaultOptId);
    };

    const openPointRedeem = (student, defaultPrizeId = '') => {
      openIndividualPointModal(student, 'redeem');
      if (defaultPrizeId) {
        individualPointForm.selectedPrizeId = defaultPrizeId;
      }
    };

    // 打开当前班级全员一键奖励
    const openBatchPointReward = (classId) => {
      const cls = getClassById(classId || matrixClassId.value);
      individualPointForm.isBatch = true;
      individualPointForm.classId = cls.id;
      individualPointForm.studentId = '';
      individualPointForm.studentName = cls.name + ' (全班在读学员)';
      individualPointForm.mode = 'add';
      individualPointForm.selectedOptionId = 'opt_1';
      const opt = pointRewardOptions.value.find(o => o.id === 'opt_1');
      if (opt) {
        individualPointForm.pointsVal = opt.points;
        individualPointForm.reason = `${opt.icon} ${opt.name}`;
      }
      individualPointForm.operator = '陈老师';
      showIndividualPointModal.value = true;
    };

    // 切换奖励预设选项
    const onSelectRewardOption = (opt) => {
      individualPointForm.selectedOptionId = opt.id;
      individualPointForm.pointsVal = opt.points;
      individualPointForm.reason = `${opt.icon} ${opt.name}`;
    };

    // 变更后积分实时计算预览
    const calculatedNewPoints = computed(() => {
      const cur = Number(individualPointForm.currentPoints || 0);
      const val = Number(individualPointForm.pointsVal || 0);
      if (individualPointForm.mode === 'add') {
        return cur + val;
      } else if (individualPointForm.mode === 'deduct') {
        return Math.max(0, cur - val);
      } else if (individualPointForm.mode === 'set') {
        return Math.max(0, val);
      } else if (individualPointForm.mode === 'redeem') {
        const prize = pointPrizes.value.find(p => p.id === individualPointForm.selectedPrizeId);
        const cost = prize ? Number(prize.cost || 0) : 0;
        return Math.max(0, cur - cost);
      }
      return cur;
    });

    // 提交积分变更
    const submitIndividualPointChange = () => {
      const nowStr = new Date().toLocaleString('zh-CN', { hour12: false });
      const mode = individualPointForm.mode;

      if (individualPointForm.isBatch) {
        // 全班批量奖励
        const pts = Number(individualPointForm.pointsVal || 0);
        if (pts <= 0) {
          showToast('奖励积分数需大于0', 'warning');
          return;
        }
        const classStudents = activeStudents.value.filter(s => s.classId === individualPointForm.classId);
        if (!classStudents.length) {
          showToast('当前班级暂无在读学员', 'warning');
          return;
        }
        classStudents.forEach(s => {
          s.points = Number(s.points || 0) + pts;
          s.totalPointsEarned = Number(s.totalPointsEarned || 0) + pts;

          pointLogs.value.unshift({
            id: 'plog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            studentId: s.id,
            studentName: s.name,
            type: '全班积分奖励',
            points: +pts,
            balanceAfter: s.points,
            reason: individualPointForm.reason,
            operator: individualPointForm.operator,
            time: nowStr
          });
        });

        saveData();
        showIndividualPointModal.value = false;
        showToast(`🎉 已为【${getClassById(individualPointForm.classId).name}】全员发放 +${pts} 积分！`);
        return;
      }

      // 单人变更
      const s = students.value.find(item => item.id === individualPointForm.studentId);
      if (!s) return;

      if (mode === 'add') {
        const pts = Number(individualPointForm.pointsVal || 0);
        if (pts <= 0) {
          showToast('奖励积分数需大于0', 'warning');
          return;
        }
        s.points = Number(s.points || 0) + pts;
        s.totalPointsEarned = Number(s.totalPointsEarned || 0) + pts;

        pointLogs.value.unshift({
          id: 'plog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          studentId: s.id,
          studentName: s.name,
          type: '个人积分奖励',
          points: +pts,
          balanceAfter: s.points,
          reason: individualPointForm.reason || '课堂表现优异',
          operator: individualPointForm.operator,
          time: nowStr
        });
        showToast(`⭐ 已为【${s.name}】增加 +${pts} 积分，结余 ${s.points} 分`);

      } else if (mode === 'deduct') {
        const pts = Number(individualPointForm.pointsVal || 0);
        if (pts <= 0) {
          showToast('扣除积分数需大于0', 'warning');
          return;
        }
        s.points = Math.max(0, Number(s.points || 0) - pts);

        pointLogs.value.unshift({
          id: 'plog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          studentId: s.id,
          studentName: s.name,
          type: '积分违纪扣除',
          points: -pts,
          balanceAfter: s.points,
          reason: individualPointForm.reason || '未带画具材料/违纪扣除',
          operator: individualPointForm.operator,
          time: nowStr
        });
        showToast(`🔴 已扣除【${s.name}】 ${pts} 积分，结余 ${s.points} 分`);

      } else if (mode === 'set') {
        const targetPts = Math.max(0, Number(individualPointForm.pointsVal || 0));
        const diff = targetPts - Number(s.points || 0);
        if (diff === 0) {
          showToast('积分数值未发生变化', 'info');
          showIndividualPointModal.value = false;
          return;
        }
        s.points = targetPts;
        if (diff > 0) {
          s.totalPointsEarned = Number(s.totalPointsEarned || 0) + diff;
        }

        pointLogs.value.unshift({
          id: 'plog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          studentId: s.id,
          studentName: s.name,
          type: '积分直接校准',
          points: diff > 0 ? `+${diff}` : diff,
          balanceAfter: s.points,
          reason: individualPointForm.reason || '教务手动直接校准',
          operator: individualPointForm.operator,
          time: nowStr
        });
        showToast(`⚙️ 已将【${s.name}】积分直接变更为 ${s.points} 分`);

      } else if (mode === 'redeem') {
        const prize = pointPrizes.value.find(p => p.id === individualPointForm.selectedPrizeId);
        if (!prize) return;
        if (Number(s.points || 0) < Number(prize.cost)) {
          showToast(`积分不足！【${s.name}】当前 ${s.points} 分，兑换需 ${prize.cost} 分`, 'warning');
          return;
        }
        const cost = Number(prize.cost);
        s.points = Number(s.points) - cost;
        s.redeemedCount = Number(s.redeemedCount || 0) + 1;
        if (prize.stock !== undefined && prize.stock > 0) prize.stock -= 1;

        pointLogs.value.unshift({
          id: 'plog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          studentId: s.id,
          studentName: s.name,
          type: '礼物兑换',
          points: -cost,
          balanceAfter: s.points,
          reason: `兑换【${prize.name}】${individualPointForm.reason ? ' (' + individualPointForm.reason + ')' : ''}`,
          operator: individualPointForm.operator,
          time: nowStr
        });
        showToast(`🎁 恭喜【${s.name}】兑换【${prize.name}】！消耗 ${cost} 分，结余 ${s.points} 分`);
      }

      if (profileStudent.value && profileStudent.value.id === s.id) {
        profileStudent.value = s;
      }

      saveData();
      showIndividualPointModal.value = false;
    };

    // ==========================================
    // 4.2 🌟 全班集体奖积分 (batchPointForm)
    // ==========================================
    const showBatchPointModal = ref(false);
    const batchPointForm = reactive({
      classId: '',
      points: 5,
      reason: '全班课堂表现优秀集体加分'
    });

    const submitBatchPointReward = () => {
      const pts = Number(batchPointForm.points || 0);
      if (pts <= 0) {
        showToast('奖励画币分值需大于0', 'warning');
        return;
      }
      const targetClassId = batchPointForm.classId || matrixClassId.value;
      const classStudents = activeStudents.value.filter(s => s.classId === targetClassId);
      if (!classStudents.length) {
        showToast('当前班级暂无在读学员', 'warning');
        return;
      }
      const nowStr = new Date().toLocaleString('zh-CN', { hour12: false });
      classStudents.forEach(s => {
        s.points = Number(s.points || 0) + pts;
        s.totalPointsEarned = Number(s.totalPointsEarned || 0) + pts;

        pointLogs.value.unshift({
          id: 'plog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          studentId: s.id,
          studentName: s.name,
          type: '全班积分奖励',
          points: +pts,
          balanceAfter: s.points,
          reason: batchPointForm.reason || '全班集体奖励',
          operator: '陈老师',
          time: nowStr
        });
      });

      saveData();
      showBatchPointModal.value = false;
      showToast(`🎉 已为【${getClassById(targetClassId).name}】全员发放 +${pts} 画币积分！`);
    };

    // ==========================================
    // 5. 🌟 积分光荣榜 (Points Leaderboard)
    // ==========================================
    const pointsRankingSort = ref('points'); // 'points' (剩余可用) | 'total' (累计总分)
    const pointsClassFilter = ref('all');
    const pointsSearchQuery = ref('');

    const pointsRankingList = computed(() => {
      let list = [...activeStudents.value];

      if (pointsClassFilter.value !== 'all') {
        list = list.filter(s => s.classId === pointsClassFilter.value);
      }

      if (pointsSearchQuery.value.trim()) {
        const q = pointsSearchQuery.value.trim().toLowerCase();
        list = list.filter(s =>
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.parentPhone && s.parentPhone.includes(q))
        );
      }

      list.sort((a, b) => {
        if (pointsRankingSort.value === 'total') {
          return Number(b.totalPointsEarned || 0) - Number(a.totalPointsEarned || 0);
        }
        return Number(b.points || 0) - Number(a.points || 0);
      });

      return list.map((item, index) => {
        const cls = getClassById(item.classId);
        return {
          ...item,
          rank: index + 1,
          className: cls.name
        };
      });
    });

    const exportPointsRankingCSV = () => {
      const data = pointsRankingList.value;
      if (!data.length) {
        showToast('暂无积分数据可导出', 'warning');
        return;
      }
      const headers = ['光荣排名', '学员姓名', '所在班级', '可用积分', '累计总获得积分', '已兑换礼物次数', '家长姓名', '家长电话'];
      const rows = data.map(s => [
        s.rank,
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.className.replace(/"/g, '""')}"`,
        s.points || 0,
        s.totalPointsEarned || 0,
        s.redeemedCount || 0,
        `"${(s.parentName || '').replace(/"/g, '""')}"`,
        `\t${s.parentPhone || ''}`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `想吃梨_小艺术家积分光荣榜_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('🍐 积分光荣榜表格已成功导出！');
    };

    // ==========================================
    // 5.1 💰 财务与收费管理中心 (本月收入/本年收入/学员收费订单/消课流水)
    // ==========================================
        // ==========================================
    // 5. 💰 财务与经营管理系统 (多周期统计 · 订单生命周期 · 收支总账)
    // ==========================================
        // ==========================================
    // 5. 💰 极简系统化财务收费管理 (月/季/年统计 · 单条直接编辑与删除)
    // ==========================================
    const statPeriodMode = ref('month'); // 'month' | 'quarter' | 'year' | 'all'
    const selectedMonthStr = ref(new Date().toISOString().slice(0, 7)); // '2026-08'
    const selectedYearStr = ref(new Date().getFullYear().toString()); // '2026'
    const selectedQuarterStr = ref('Q' + Math.ceil((new Date().getMonth() + 1) / 3)); // 'Q3'

        const cardFilterMode = ref('all'); // 'all' | 'bought' | 'gift'
    const feeSearchQuery = ref('');
    const feePayMethodFilter = ref('all');
    const feeTypeFilter = ref('all');

    // 可选年份列表
    const availableStatYears = computed(() => {
      const yearSet = new Set([
        new Date().getFullYear().toString(),
        (new Date().getFullYear() - 1).toString(),
        (new Date().getFullYear() + 1).toString()
      ]);
      (paymentOrders.value || []).forEach(o => {
        const d = o.payDate || o.date || '';
        if (d.length >= 4) yearSet.add(d.substring(0, 4));
      });
      return Array.from(yearSet).sort((a, b) => b.localeCompare(a));
    });

    // 活跃统计周期标签
    const activePeriodLabel = computed(() => {
      if (statPeriodMode.value === 'month') return `${selectedMonthStr.value} 月度统计`;
      if (statPeriodMode.value === 'quarter') return `${selectedYearStr.value}年 ${selectedQuarterStr.value} 季度统计`;
      if (statPeriodMode.value === 'year') return `${selectedYearStr.value} 年度统计`;
      return '全部历史总账';
    });

    // 判断单笔订单是否属于当前选定统计周期
    const isOrderInActivePeriod = (order) => {
      const d = order.payDate || order.date || '';
      if (!d) return statPeriodMode.value === 'all';

      if (statPeriodMode.value === 'all') return true;
      if (statPeriodMode.value === 'month') {
        return d.startsWith(selectedMonthStr.value);
      }
      if (statPeriodMode.value === 'quarter') {
        const year = d.substring(0, 4);
        if (year !== selectedYearStr.value) return false;
        const m = parseInt(d.substring(5, 7), 10);
        if (selectedQuarterStr.value === 'Q1') return m >= 1 && m <= 3;
        if (selectedQuarterStr.value === 'Q2') return m >= 4 && m <= 6;
        if (selectedQuarterStr.value === 'Q3') return m >= 7 && m <= 9;
        if (selectedQuarterStr.value === 'Q4') return m >= 10 && m <= 12;
        return true;
      }
      if (statPeriodMode.value === 'year') {
        return d.startsWith(selectedYearStr.value);
      }
      return true;
    };

    // 周期统计数据总汇 (实时计算)
    const periodStatSummary = computed(() => {
      const orders = (paymentOrders.value || []).filter(isOrderInActivePeriod);
      let totalAmount = 0;
      let totalHoursBought = 0;
      let totalHoursGift = 0;

      orders.forEach(o => {
        totalAmount += Number(o.amount || 0);
        totalHoursBought += Number(o.hoursBought || o.hours || 0);
        totalHoursGift += Number(o.hoursGift || 0);
      });

      const orderCount = orders.length;
      const avgHourPrice = totalHoursBought > 0 ? Math.round(totalAmount / totalHoursBought) : 120;
      const avgOrderAmount = orderCount > 0 ? Math.round(totalAmount / orderCount) : 0;

      return {
        totalAmount,
        totalHoursBought,
        totalHoursGift,
        orderCount,
        avgHourPrice,
        avgOrderAmount
      };
    });

    // 页面列表展示的收费记录 (带搜索与筛选)
    const displayedPaymentOrders = computed(() => {
      let list = (paymentOrders.value || []).filter(isOrderInActivePeriod);

      // 卡片点击过滤
      if (cardFilterMode.value === 'bought') {
        list = list.filter(o => Number(o.hoursBought || o.hours || 0) > 0);
      } else if (cardFilterMode.value === 'gift') {
        list = list.filter(o => Number(o.hoursGift || 0) > 0);
      }

      if (feePayMethodFilter.value !== 'all') {
        list = list.filter(o => (o.payMethod || '微信支付') === feePayMethodFilter.value);
      }

      if (feeTypeFilter.value !== 'all') {
        list = list.filter(o => (o.type || '老生续费') === feeTypeFilter.value);
      }

      if (feeSearchQuery.value.trim()) {
        const q = feeSearchQuery.value.trim().toLowerCase();
        list = list.filter(o =>
          (o.studentName && o.studentName.toLowerCase().includes(q)) ||
          (o.id && o.id.toLowerCase().includes(q)) ||
          (o.operator && o.operator.toLowerCase().includes(q)) ||
          (o.remark && o.remark.toLowerCase().includes(q))
        );
      }

      return list;
    });

    // ==========================================
    // 5.1 🗑️ 单条收费记录直接删除
    // ==========================================
    const directDeleteOrder = (order) => {
      const orderHours = Number(order.hoursBought || order.hours || 0) + Number(order.hoursGift || 0);
      if (!confirm(`确定要彻底删除该条收费记录吗？\n\n学员：${order.studentName}\n金额：¥${order.amount}\n时间：${order.payDate || order.date}\n课时：${orderHours} 节\n\n删除后将自动扣除该学员相应的课时，统计数据将实时同步更新！`)) {
        return;
      }

      // 1. 物理删除该订单
      paymentOrders.value = paymentOrders.value.filter(o => o.id !== order.id);

      // 2. 扣除学员课时与积分
      const targetStudent = students.value.find(s => s.id === order.studentId || s.name === order.studentName);
      if (targetStudent) {
        targetStudent.remainHours = Math.max(0, Number(targetStudent.remainHours || 0) - orderHours);
        targetStudent.totalPurchased = Math.max(0, Number(targetStudent.totalPurchased || 0) - orderHours);
        targetStudent.points = Math.max(0, Number(targetStudent.points || 0) - orderHours);

        const nowStr = new Date().toLocaleString('zh-CN', { hour12: false });
        hourLogs.value.unshift({
          id: 'log_del_' + Date.now(),
          studentId: targetStudent.id,
          studentName: targetStudent.name,
          type: '撤销/退费',
          hours: -orderHours,
          balanceAfter: targetStudent.remainHours,
          reason: `删除收费订单 ${order.id} 扣减课时`,
          operator: '系统',
          time: nowStr
        });
      }

      saveData();
      showToast(`已成功删除【${order.studentName}】的收费记录，统计与课时已实时同步！`);
    };

    // ==========================================
    // 5.2 ✏️ 单条收费记录直接修改
    // ==========================================
    const showDirectEditModal = ref(false);
    const directEditTargetOrder = ref(null);
    const directEditForm = reactive({
      amount: 0,
      hoursBought: 0,
      hoursGift: 0,
      payDate: '',
      payMethod: '微信支付',
      operator: '陈老师',
      type: '老生续费',
      remark: ''
    });

    const openDirectEditModal = (order) => {
      directEditTargetOrder.value = order;
      directEditForm.amount = Number(order.amount || 0);
      directEditForm.hoursBought = Number(order.hoursBought || order.hours || 0);
      directEditForm.hoursGift = Number(order.hoursGift || 0);
      directEditForm.payDate = order.payDate || order.date || '';
      directEditForm.payMethod = order.payMethod || '微信支付';
      directEditForm.operator = order.operator || '陈老师';
      directEditForm.type = order.type || '老生续费';
      directEditForm.remark = order.remark || '';
      showDirectEditModal.value = true;
    };

    const saveDirectEdit = () => {
      if (!directEditTargetOrder.value) return;
      const order = directEditTargetOrder.value;

      const oldHours = Number(order.hoursBought || order.hours || 0) + Number(order.hoursGift || 0);
      const newHours = Number(directEditForm.hoursBought || 0) + Number(directEditForm.hoursGift || 0);
      const deltaHours = newHours - oldHours;

      // 更新订单字段
      order.amount = Number(directEditForm.amount || 0);
      order.hoursBought = Number(directEditForm.hoursBought || 0);
      order.hoursGift = Number(directEditForm.hoursGift || 0);
      order.hours = newHours;
      order.payDate = directEditForm.payDate;
      order.date = directEditForm.payDate;
      order.payMethod = directEditForm.payMethod;
      order.operator = directEditForm.operator;
      order.type = directEditForm.type;
      order.remark = directEditForm.remark;

      // 差额同步更新到学员档案
      if (deltaHours !== 0) {
        const targetStudent = students.value.find(s => s.id === order.studentId || s.name === order.studentName);
        if (targetStudent) {
          targetStudent.remainHours = Math.max(0, Number(targetStudent.remainHours || 0) + deltaHours);
          targetStudent.totalPurchased = Math.max(0, Number(targetStudent.totalPurchased || 0) + deltaHours);
          targetStudent.points = Math.max(0, Number(targetStudent.points || 0) + deltaHours);

          const nowStr = new Date().toLocaleString('zh-CN', { hour12: false });
          hourLogs.value.unshift({
            id: 'log_edit_' + Date.now(),
            studentId: targetStudent.id,
            studentName: targetStudent.name,
            type: deltaHours > 0 ? '续费充值' : '撤销/退费',
            hours: deltaHours,
            balanceAfter: targetStudent.remainHours,
            reason: `修改收费订单 ${order.id} 调整课时差额 (${deltaHours > 0 ? '+' : ''}${deltaHours}节)`,
            operator: directEditForm.operator,
            time: nowStr
          });
        }
      }

      saveData();
      showDirectEditModal.value = false;
      showToast(`已成功更新【${order.studentName}】的收费记录，课时与统计已实时同步！`);
    };

    // 导出 CSV 表格
    const exportPaymentOrdersCSV = () => {
      const data = displayedPaymentOrders.value;
      if (!data.length) {
        showToast('暂无收费订单数据可导出', 'warning');
        return;
      }
      const headers = ['订单编号', '缴费日期', '学员姓名', '业务类型', '实收金额(元)', '购买正课(节)', '赠送课时(节)', '支付方式', '经办老师', '收费说明与备注'];
      const rows = data.map(o => [
        `	${o.id || ''}`,
        `	${o.payDate || o.date || ''}`,
        `"${(o.studentName || '').replace(/"/g, '""')}"`,
        `"${(o.type || '老生续费').replace(/"/g, '""')}"`,
        o.amount || 0,
        o.hoursBought || o.hours || 0,
        o.hoursGift || 0,
        `"${(o.payMethod || '微信支付').replace(/"/g, '""')}"`,
        `"${(o.operator || '陈老师').replace(/"/g, '""')}"`,
        `"${(o.remark || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `想吃梨_学员收费明细报表_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('🍐 收费明细表格已成功导出！');
    };

const selectedClassDetail = ref(null);
    const classDetailSubTab = ref('students'); // 'students' | 'attendance' | 'logs'

    const openClassDetail = (cls) => {
      if (!cls) return;
      const found = classes.value.find(c => c.id === cls.id) || cls;
      selectedClassDetail.value = found;
      classDetailSubTab.value = 'students';
      currentTab.value = 'class_detail';
    };

    const closeClassDetail = () => {
      currentTab.value = 'students';
    };

    const classDetailStudents = computed(() => {
      if (!selectedClassDetail.value) return [];
      return students.value.filter(s => s.classId === selectedClassDetail.value.id && s.status !== '已归档');
    });

    const classDetailAttendance = computed(() => {
      if (!selectedClassDetail.value) return [];
      return attendanceHistory.value.filter(a => a.classId === selectedClassDetail.value.id);
    });

    const classDetailLogs = computed(() => {
      if (!selectedClassDetail.value) return [];
      const sIds = new Set(classDetailStudents.value.map(s => s.id));
      return hourLogs.value.filter(l => sIds.has(l.studentId));
    });

    const classDetailStats = computed(() => {
      if (!selectedClassDetail.value) return { studentCount: 0, capacity: 8, totalConsumed: 0, attendanceRate: '100%', pointsPool: 0, totalSessions: 0 };
      const stus = classDetailStudents.value;
      const atts = classDetailAttendance.value;
      const totalConsumed = stus.reduce((sum, s) => sum + Number(s.totalConsumed || 0), 0);
      const pointsPool = stus.reduce((sum, s) => sum + Number(s.points || 0), 0);
      
      let totalPresent = 0;
      let totalLeave = 0;
      atts.forEach(a => {
        totalPresent += (a.presentCount || 0);
        totalLeave += (a.leaveCount || 0);
      });
      const totalLessons = totalPresent + totalLeave;
      const rate = totalLessons > 0 ? ((totalPresent / totalLessons) * 100).toFixed(0) + '%' : '100%';

      return {
        studentCount: stus.length,
        capacity: selectedClassDetail.value.capacity || 8,
        totalConsumed,
        attendanceRate: rate,
        pointsPool,
        totalSessions: atts.length
      };
    });

    // ==========================================
    // 5.3 🧾 课时与积分流水筛选与导出
    // ==========================================
    const recordsSubTab = ref('hours'); // 'hours' (课时与财务流水) | 'points' (积分与礼物流水)
    const recordsSearchQuery = ref('');
    const recordsHourTypeFilter = ref('all');
    const recordsPointTypeFilter = ref('all');

    const filteredHourLogs = computed(() => {
      let list = [...hourLogs.value];
      if (recordsHourTypeFilter.value !== 'all') {
        list = list.filter(l => l.type === recordsHourTypeFilter.value);
      }
      if (recordsSearchQuery.value.trim()) {
        const q = recordsSearchQuery.value.trim().toLowerCase();
        list = list.filter(l => 
          (l.studentName && l.studentName.toLowerCase().includes(q)) ||
          (l.relatedInfo && l.relatedInfo.toLowerCase().includes(q)) ||
          (l.operator && l.operator.toLowerCase().includes(q))
        );
      }
      return list;
    });

    const filteredPointLogs = computed(() => {
      let list = [...pointLogs.value];
      if (recordsPointTypeFilter.value !== 'all') {
        list = list.filter(l => l.type === recordsPointTypeFilter.value);
      }
      if (recordsSearchQuery.value.trim()) {
        const q = recordsSearchQuery.value.trim().toLowerCase();
        list = list.filter(l => 
          (l.studentName && l.studentName.toLowerCase().includes(q)) ||
          (l.reason && l.reason.toLowerCase().includes(q)) ||
          (l.operator && l.operator.toLowerCase().includes(q))
        );
      }
      return list;
    });

    const exportHourLogsCSV = () => {
      const data = filteredHourLogs.value;
      if (!data.length) {
        showToast('暂无课时流水可导出', 'warning');
        return;
      }
      const headers = ['记录时间', '学员姓名', '变动类型', '课时变动', '变动后结余', '详细说明', '经办人'];
      const rows = data.map(l => [
        `\t${l.time || ''}`,
        `"${(l.studentName || '').replace(/"/g, '""')}"`,
        `"${(l.type || '').replace(/"/g, '""')}"`,
        l.change > 0 ? `+${l.change}` : l.change,
        l.balanceAfter || 0,
        `"${(l.relatedInfo || '').replace(/"/g, '""')}"`,
        `"${(l.operator || '陈老师').replace(/"/g, '""')}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `想吃梨_课时与财务流水明细_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('🍐 课时财务流水已成功导出！');
    };

    const exportPointLogsCSV = () => {
      const data = filteredPointLogs.value;
      if (!data.length) {
        showToast('暂无积分流水可导出', 'warning');
        return;
      }
      const headers = ['记录时间', '学员姓名', '变动类型', '积分变动', '变动后结余', '原因与兑换明细', '经办人'];
      const rows = data.map(l => [
        `\t${l.time || ''}`,
        `"${(l.studentName || '').replace(/"/g, '""')}"`,
        `"${(l.type || '').replace(/"/g, '""')}"`,
        l.points > 0 ? `+${l.points}` : l.points,
        l.balanceAfter || 0,
        `"${(l.reason || '').replace(/"/g, '""')}"`,
        `"${(l.operator || '陈老师').replace(/"/g, '""')}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `想吃梨_画币积分与礼物兑换流水_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('🍐 积分兑换流水已成功导出！');
    };

    // ==========================================
    // 6. 🌟 学员个人专属全景档案独立页面 (Full Page Profile)
    // ==========================================
    const showStudentProfileModal = ref(false);
    const profileStudent = ref(null);
    const profilePreviousTab = ref('attendance');
    const profileSubTab = ref('attendance'); // 'attendance' | 'points' | 'logs'

    const openStudentProfile = (student) => {
      if (!student) return;
      const found = students.value.find(s => s.id === student.id) || student;
      profileStudent.value = found;
      if (currentTab.value !== 'profile') {
        profilePreviousTab.value = currentTab.value;
      }
      currentTab.value = 'profile';
      profileSubTab.value = 'attendance';
      showStudentProfileModal.value = false;
    };

    const closeStudentProfile = () => {
      currentTab.value = profilePreviousTab.value || 'attendance';
    };

    // 该学员参与的所有考勤记录列表 (按日期倒序)
    const profileStudentAttendanceList = computed(() => {
      if (!profileStudent.value) return [];
      const sId = profileStudent.value.id;
      const list = [];

      attendanceHistory.value.forEach(att => {
        if (att.details && Array.isArray(att.details)) {
          const detail = att.details.find(d => d.studentId === sId);
          if (detail) {
            list.push({
              id: att.id + '_' + sId,
              attendanceId: att.id,
              date: att.date,
              theme: att.theme,
              className: att.className || getClassById(att.classId).name,
              teacher: att.teacher || '陈老师',
              status: detail.status,
              deductHours: detail.deductHours !== undefined ? detail.deductHours : (detail.status === '到课' ? 1 : 0),
              note: detail.note || ''
            });
          }
        }
      });

      return list;
    });

    const profileStudentStats = computed(() => {
      if (!profileStudent.value) return { presentCount: 0, leaveCount: 0, holidayCount: 0, attendanceRate: '100%' };
      const list = profileStudentAttendanceList.value;
      const presentCount = list.filter(a => a.status === '到课').length;
      const leaveCount = list.filter(a => a.status === '未到' || a.status === '请假').length;
      const holidayCount = list.filter(a => a.status === '放假').length;
      const totalLessons = presentCount + leaveCount;
      const rate = totalLessons > 0 ? ((presentCount / totalLessons) * 100).toFixed(0) + '%' : '100%';

      return {
        presentCount,
        leaveCount,
        holidayCount,
        attendanceRate: rate
      };
    });

    const profileStudentLogs = computed(() => {
      if (!profileStudent.value) return [];
      return hourLogs.value.filter(l => l.studentId === profileStudent.value.id);
    });

    const profileStudentPointLogs = computed(() => {
      if (!profileStudent.value) return [];
      return pointLogs.value.filter(l => l.studentId === profileStudent.value.id);
    });

        // ==========================================
    // 🌟 考勤导出时间范围筛选引擎 (Date Range Filter)
    // ==========================================
    const showExportAttendanceModal = ref(false);
    const exportModalConfig = reactive({
      mode: 'student', // 'student' | 'student_csv' | 'student_pdf' | 'matrix'
      title: '',
      targetStudent: null,
      targetClassId: '',
      presetRange: 'all', // 'all' | 'this_month' | 'last_month' | 'last_3_months' | 'this_year' | 'custom'
      startDate: '',
      endDate: ''
    });

    const openExportModal = (mode, student = null, classId = '') => {
      exportModalConfig.mode = mode;
      exportModalConfig.targetStudent = student || profileStudent.value;
      exportModalConfig.targetClassId = classId || matrixClassId.value;
      exportModalConfig.presetRange = 'all';
      exportModalConfig.startDate = '';
      exportModalConfig.endDate = '';

      if (mode.startsWith('student') && exportModalConfig.targetStudent) {
        exportModalConfig.title = `正在导出学员【${exportModalConfig.targetStudent.name}】的个人课程出勤明细`;
      } else {
        const cls = getClassById(exportModalConfig.targetClassId);
        exportModalConfig.title = `正在导出班级【${cls.name}】的二维考勤大表`;
      }
      showExportAttendanceModal.value = true;
    };

    const applyExportPreset = (preset) => {
      exportModalConfig.presetRange = preset;
      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth(); // 0-indexed

      if (preset === 'all') {
        exportModalConfig.startDate = '';
        exportModalConfig.endDate = '';
      } else if (preset === 'this_month') {
        const firstDay = `${y}-${String(m + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(y, m + 1, 0).toISOString().slice(0, 10);
        exportModalConfig.startDate = firstDay;
        exportModalConfig.endDate = lastDay;
      } else if (preset === 'last_month') {
        const prevM = m === 0 ? 11 : m - 1;
        const prevY = m === 0 ? y - 1 : y;
        const firstDay = `${prevY}-${String(prevM + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(prevY, prevM + 1, 0).toISOString().slice(0, 10);
        exportModalConfig.startDate = firstDay;
        exportModalConfig.endDate = lastDay;
      } else if (preset === 'last_30_days') {
        const d = new Date(now);
        d.setDate(d.getDate() - 30);
        exportModalConfig.startDate = d.toISOString().slice(0, 10);
        exportModalConfig.endDate = now.toISOString().slice(0, 10);
      } else if (preset === 'last_3_months') {
        const d = new Date(now);
        d.setMonth(d.getMonth() - 3);
        exportModalConfig.startDate = d.toISOString().slice(0, 10);
        exportModalConfig.endDate = now.toISOString().slice(0, 10);
      } else if (preset === 'this_year') {
        exportModalConfig.startDate = `${y}-01-01`;
        exportModalConfig.endDate = `${y}-12-31`;
      }
    };

    const filteredExportRecordsCount = computed(() => {
      const start = exportModalConfig.startDate;
      const end = exportModalConfig.endDate;
      const targetId = exportModalConfig.targetClassId;
      const targetStu = exportModalConfig.targetStudent;

      let list = attendanceHistory.value || [];
      if (exportModalConfig.mode.startsWith('student') && targetStu) {
        list = list.filter(att => {
          if (!att.details) return false;
          return att.details.some(d => d.studentId === targetStu.id || d.student_id === targetStu.id);
        });
      } else if (targetId && targetId !== 'all') {
        list = list.filter(att => att.classId === targetId || att.class_id === targetId);
      }

      if (start) list = list.filter(a => a.date >= start);
      if (end) list = list.filter(a => a.date <= end);
      return list.length;
    });

    const executeExport = (format) => {
      showExportAttendanceModal.value = false;
      const start = exportModalConfig.startDate;
      const end = exportModalConfig.endDate;

      if (exportModalConfig.mode.startsWith('student')) {
        if (format === 'pdf') {
          printStudentAttendancePDF(exportModalConfig.targetStudent, start, end);
        } else {
          exportStudentAttendanceCSV(exportModalConfig.targetStudent, start, end);
        }
      } else {
        exportAttendanceMatrixCSV(exportModalConfig.targetClassId, start, end);
      }
    };

    const exportStudentAttendanceCSV = (student, filterStartDate = "", filterEndDate = "") => {
      const targetStudent = student || profileStudent.value;
      if (!targetStudent) {
        showToast('未选择学员', 'warning');
        return;
      }
      const stu = targetStudent;
      const sId = stu.id;
      
      // 提取该学员在全部排课考勤中的完整出勤明细
      const attList = [];
      (attendanceHistory.value || []).forEach(att => {
        if (att.details && Array.isArray(att.details)) {
          const detail = att.details.find(d => (d.studentId === sId || d.student_id === sId));
          if (detail) {
            const st = normalizeAttendanceStatus(detail.status);
            attList.push({
              date: att.date || '',
              theme: att.theme || '美育主题创作课',
              className: att.className || getClassById(att.classId || att.class_id).name,
              teacher: att.teacher || getClassById(att.classId || att.class_id).teacher || '陈老师',
              status: st,
              deductHours: detail.deductHours !== undefined ? detail.deductHours : (st === '到课' ? 1 : 0),
              note: detail.note || detail.reason || ''
            });
          }
        }
      });

      // 按时间范围过滤
      let finalAttList = attList;
      if (filterStartDate) finalAttList = finalAttList.filter(a => a.date >= filterStartDate);
      if (filterEndDate) finalAttList = finalAttList.filter(a => a.date <= filterEndDate);

      finalAttList.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      if (!finalAttList.length) {
        showToast(`学员【${stu.name}】暂无历史排课出勤记录`, 'warning');
        return;
      }

      const headers = ['学员姓名', '上课日期', '课程绘画主题', '所在班级', '出勤状态', '消课课时', '任课主讲老师', '出勤与请假备注说明'];
      const rows = finalAttList.map(a => [
        `"${stu.name.replace(/"/g, '""')}"`,
        `	${a.date}`,
        `"${(a.theme || '').replace(/"/g, '""')}"`,
        `"${(a.className || '').replace(/"/g, '""')}"`,
        `"${a.status}"`,
        a.deductHours > 0 ? `-${a.deductHours} 节` : '0 节',
        `"${(a.teacher || '陈老师').replace(/"/g, '""')}"`,
        `"${(a.note || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `想吃梨_【${stu.name}】个人排课出勤明细表_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`🍐 学员【${stu.name}】个人考勤表已成功导出！`);
    };

    const printStudentAttendancePDF = (student, filterStartDate = "", filterEndDate = "") => {
      const targetStudent = student || profileStudent.value;
      if (!targetStudent) {
        showToast('未选择学员', 'warning');
        return;
      }
      const stu = targetStudent;
      const sId = stu.id;
      const cls = getClassById(stu.classId || stu.class_id);
      const studio = studioInfo.value || { name: '想吃梨儿童美术', teacher: '陈老师', phone: '' };

      // 提取该学员所有排课出勤记录
      const attList = [];
      (attendanceHistory.value || []).forEach(att => {
        if (att.details && Array.isArray(att.details)) {
          const detail = att.details.find(d => (d.studentId === sId || d.student_id === sId));
          if (detail) {
            const st = normalizeAttendanceStatus(detail.status);
            attList.push({
              date: att.date || '',
              theme: att.theme || '美育主题创作课',
              className: att.className || cls.name,
              teacher: att.teacher || cls.teacher || '陈老师',
              status: st,
              deductHours: detail.deductHours !== undefined ? detail.deductHours : (st === '到课' ? 1 : 0),
              note: detail.note || detail.reason || ''
            });
          }
        }
      });

      // 按时间范围过滤
      let finalAttList = attList;
      if (filterStartDate) finalAttList = finalAttList.filter(a => a.date >= filterStartDate);
      if (filterEndDate) finalAttList = finalAttList.filter(a => a.date <= filterEndDate);

      finalAttList.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      const presentCount = finalAttList.filter(a => a.status === '到课').length;
      const leaveCount = finalAttList.filter(a => a.status === '未到' || a.status === '请假').length;
      const totalLessons = presentCount + leaveCount;
      const rate = totalLessons > 0 ? ((presentCount / totalLessons) * 100).toFixed(0) + '%' : '100%';
      const todayStr = new Date().toISOString().slice(0, 10);

      // 生成整洁高雅的 A4 PDF 打印文档
      const rowsHtml = finalAttList.length > 0 ? finalAttList.map((a, idx) => {
        const badgeClass = a.status === '到课' ? 'badge-green' : a.status === '请假' || a.status === '未到' ? 'badge-yellow' : 'badge-purple';
        return `<tr>
          <td style="text-align:center; font-family:monospace; font-weight:600; color:#6b7280;">#${String(idx + 1).padStart(2, '0')}</td>
          <td style="font-family:monospace; font-weight:600; white-space:nowrap;">${a.date}</td>
          <td style="font-weight:700; color:#111827;">${a.theme}</td>
          <td>${a.className}</td>
          <td style="text-align:center;"><span class="badge ${badgeClass}">${a.status}</span></td>
          <td style="text-align:center; font-family:monospace; font-weight:700; color:${a.deductHours > 0 ? '#b91c1c' : '#4b5563'};">${a.deductHours > 0 ? '-' + a.deductHours + '节' : '0节'}</td>
          <td style="text-align:center;">${a.teacher}</td>
          <td style="color:#4b5563; font-size:12px;">${a.note || '-'}</td>
        </tr>`;
      }).join('') : `<tr><td colspan="8" style="text-align:center; padding:30px; color:#9ca3af;">暂无考勤历史记录</td></tr>`;

      const printHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>想吃梨_【${stu.name}】学员课程出勤与消课成长档案_${todayStr}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 12mm 15mm 12mm;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Noto Sans SC", sans-serif;
      color: #111827;
      background: #ffffff;
      font-size: 13px;
      line-height: 1.45;
      padding: 0;
    }
    .print-container { max-width: 100%; margin: 0 auto; }
    .header-box {
      border-bottom: 2px solid #111827;
      padding-bottom: 12px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand-title { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #111827; }
    .brand-sub { font-size: 11px; font-weight: 600; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
    .doc-badge { text-align: right; font-family: monospace; font-size: 12px; color: #6b7280; }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 14px;
      font-size: 13px;
    }
    .info-item span { color: #6b7280; font-size: 11px; display: block; margin-bottom: 2px; }
    .info-item strong { color: #111827; font-weight: 700; }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 16px;
    }
    .stat-card {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 10px 12px;
      background: #ffffff;
    }
    .stat-card .label { font-size: 11px; font-weight: 600; color: #6b7280; margin-bottom: 4px; }
    .stat-card .value { font-size: 20px; font-weight: 900; font-family: monospace; color: #111827; }
    .stat-card.green .value { color: #15803d; }
    .stat-card.amber .value { color: #b45309; }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 12.5px;
    }
    th {
      background: #f3f4f6;
      color: #374151;
      font-weight: 700;
      text-align: left;
      padding: 8px 8px;
      border: 1px solid #e5e7eb;
      font-size: 12px;
    }
    td {
      padding: 7px 8px;
      border: 1px solid #e5e7eb;
      vertical-align: middle;
    }
    tr:nth-child(even) { background-color: #fafafa; }

    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
    }
    .badge-green { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .badge-yellow { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .badge-purple { background: #f3e8ff; color: #7e22ce; border: 1px solid #e9d5ff; }

    .summary-text {
      font-size: 12px;
      font-weight: 600;
      color: #374151;
      padding: 8px 12px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      margin-bottom: 16px;
    }

    .footer-box {
      border-top: 1px dashed #d1d5db;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 11px;
      color: #6b7280;
    }
    .sign-area { text-align: right; }
    .sign-line { display: inline-block; width: 140px; border-bottom: 1px solid #111827; margin-left: 6px; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="print-container">
    
    <!-- 表头与品牌 -->
    <div class="header-box">
      <div>
        <div class="brand-title">🍐 ${studio.name || '想吃梨儿童美术'}</div>
        <div class="brand-sub">PEAR KIDS ART · 学员课程出勤与课消成长档案</div>
      </div>
      <div class="doc-badge">
        <div>打印日期: <strong>${todayStr}</strong></div>
        <div>档案编号: STU-${stu.id.slice(-6).toUpperCase()}</div>
      </div>
    </div>

    <!-- 学员信息条 -->
    <div class="info-grid">
      <div class="info-item"><span>学员姓名</span><strong>${stu.name} (${stu.gender || '女'} · ${stu.age || '-'}岁)</strong></div>
      <div class="info-item"><span>所在班级</span><strong>${cls.name}</strong></div>
      <div class="info-item"><span>任课教师</span><strong>${cls.teacher || '陈老师'}</strong></div>
      <div class="info-item"><span>家长联系</span><strong>${stu.parentName || '-'} ${stu.parentPhone ? '(' + stu.parentPhone + ')' : ''}</strong></div>
    </div>

    <!-- 4 维核心课时统计 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="label">累计购课总量</div>
        <div class="value">${stu.totalPurchased || (Number(stu.remainHours || 0) + Number(stu.totalConsumed || 0))} <span style="font-size:12px; font-weight:normal;">节</span></div>
      </div>
      <div class="stat-card">
        <div class="label">累计出勤消课</div>
        <div class="value">${stu.totalConsumed || presentCount} <span style="font-size:12px; font-weight:normal;">节</span></div>
      </div>
      <div class="stat-card green">
        <div class="label">当前剩余课时</div>
        <div class="value">${stu.remainHours} <span style="font-size:12px; font-weight:normal;">节</span></div>
      </div>
      <div class="stat-card amber">
        <div class="label">历史出勤率 / 画币</div>
        <div class="value" style="font-size:18px;">${rate} <span style="font-size:12px; color:#b45309;">(⭐${stu.points || 0})</span></div>
      </div>
    </div>

    <!-- 考勤明细大表 -->
    <table>
      <thead>
        <tr>
          <th style="width:44px; text-align:center;">序号</th>
          <th style="width:90px;">上课日期</th>
          <th>课程绘画主题</th>
          <th style="width:110px;">所在班级</th>
          <th style="width:68px; text-align:center;">出勤状态</th>
          <th style="width:72px; text-align:center;">课时消课</th>
          <th style="width:68px; text-align:center;">主讲师</th>
          <th>考勤备注与课堂表现</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <!-- 课消总结 -->
    <div class="summary-text">
      📊 <strong>课消总结：</strong>截止目前，学员【${stu.name}】累计已出勤并消课 <strong>${presentCount}</strong> 课时，请假 <strong>${leaveCount}</strong> 课时，当前可用课时余额为 <strong style="color:#15803d;">${stu.remainHours}</strong> 课时。
    </div>

    <!-- 页脚与家长签字联 -->
    <div class="footer-box">
      <div>
        <div><strong>说明事项：</strong>1. 本工作室标准课时为90分钟/节；2. 如对考勤课消记录有任何疑问，请随时联系陈老师。</div>
        <div style="margin-top:2px;">想吃梨儿童美术工作室 · 用美育陪伴每一个孩子的成长与热爱</div>
      </div>
      <div class="sign-area">
        <div>家长确认签字：<span class="sign-line"></span></div>
        <div style="margin-top:4px;">确认日期：____年__月__日</div>
      </div>
    </div>

  </div>
</body>
</html>`;

      // 开启纯净打印/另存为 PDF 窗口
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(printHtml);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 300);
      } else {
        // Fallback: 创建隐藏 iframe 打印
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(printHtml);
        doc.close();
        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          setTimeout(() => { document.body.removeChild(iframe); }, 1000);
        }, 400);
      }
    };

    // ==========================================
    // 7. 二维考勤总表 (单元格下拉修改考勤 & 奖励积分)
    // ==========================================
    const matrixClassId = ref('');
    watch(activeClasses, (newVal) => {
      if (newVal && newVal.length > 0) {
        const isValid = newVal.some(c => c.id === matrixClassId.value);
        if (!isValid) {
          matrixClassId.value = newVal[0].id;
        }
      } else {
        matrixClassId.value = '';
      }
    }, { immediate: true, deep: true });


    const matrixStudents = computed(() => {
      if (!matrixClassId.value) return [];
      return activeStudents.value.filter(s => (s.classId === matrixClassId.value || s.class_id === matrixClassId.value));
    });

    const normalizeAttendanceStatus = (rawStatus) => {
      if (!rawStatus) return '--';
      const s = String(rawStatus).trim();
      if (s === 'NaT' || s === 'nan' || s === 'NaN' || s === 'null' || s === 'undefined' || s === '' || s === '--') return '--';
      if (s === '到课' || s === '出勤' || s === '到') return '到课';
      if (s === '请假' || s === '假') return '请假';
      if (s === '未到' || s === '旷课' || s === '缺勤') return '未到';
      if (s === '放假' || s === '休假') return '放假';
      return s;
    };

    const matrixAttendanceRecords = computed(() => {
      if (!matrixClassId.value) return [];
      const targetId = matrixClassId.value;
      const list = [];
      const source = attendanceHistory.value || [];
      for (let i = 0; i < source.length; i++) {
        const a = source[i];
        if (a.classId === targetId || a.class_id === targetId) {
          const detailMap = {};
          if (Array.isArray(a.details)) {
            for (let j = 0; j < a.details.length; j++) {
              const d = a.details[j];
              const st = normalizeAttendanceStatus(d.status);
              detailMap[d.studentId || d.student_id] = {
                status: st,
                note: d.note || d.reason || '',
                deductHours: d.deductHours || (st === '到课' ? 1 : 0)
              };
            }
          }
          list.push({
            ...a,
            _detailMap: detailMap,
            _time: new Date(a.date).getTime() || 0
          });
        }
      }
      const isDesc = attendanceSortOrder.value === 'desc';
      list.sort((a, b) => isDesc ? b._time - a._time : a._time - b._time);
      return list;
    });

    const getStudentAttendanceCell = (studentId, attendanceRecord) => {
      if (attendanceRecord && attendanceRecord._detailMap && attendanceRecord._detailMap[studentId]) {
        return attendanceRecord._detailMap[studentId];
      }
      if (!attendanceRecord || !attendanceRecord.details) {
        return { status: '--', note: '', deductHours: 0 };
      }
      const item = attendanceRecord.details.find(d => (d.studentId === studentId || d.student_id === studentId));
      if (!item) {
        return { status: '--', note: '', deductHours: 0 };
      }
      const st = normalizeAttendanceStatus(item.status);
      return {
        status: st,
        note: item.note || item.reason || '',
        deductHours: item.deductHours || (st === '到课' ? 1 : 0)
      };
    };

    const getMatrixCellClass = (status) => {
      if (status === '到课') {
        return 'matrix-cell-present';
      } else if (status === '未到' || status === '请假') {
        return 'matrix-cell-absent';
      } else if (status === '放假') {
        return 'matrix-cell-holiday';
      }
      return 'text-gray-400 bg-gray-50 dark:bg-[#252525] border border-[#e2e2e0] dark:border-[#333]';
    };

    // 辅助格式化日期为友好中文格式 (含星期)
    const formatChineseDateWithWeekday = (dateInput) => {
      if (!dateInput) return '';
      const parsed = parseRecordDate(dateInput);
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const dayName = weekdays[parsed.dateObj.getDay()];
      return `${parsed.year}年${Number(parsed.month)}月${Number(parsed.day)}日 ${dayName}`;
    };

    const dateToISO = (dateStr) => {
      const parsed = parseRecordDate(dateStr);
      return `${parsed.year}-${parsed.month}-${parsed.day}`;
    };

    // 单元格精准下拉菜单 (响应式 Key: 'attId_stuId')
    const activeCellDropdownKey = ref(null);

    const toggleCellDropdown = (attId, stuId, event, attendanceRecord, student) => {
      if (event) event.stopPropagation();
      if (typeof window !== 'undefined' && window.innerWidth < 768 && attendanceRecord && student) {
        openCellEdit(attendanceRecord, student);
        return;
      }
      const key = `${attId}_${stuId}`;
      activeCellDropdownKey.value = (activeCellDropdownKey.value === key ? null : key);
    };

    const selectCellStatusFromDropdown = (att, stu, newStatus) => {
      applyCellStatusChange(att, stu, newStatus);
      activeCellDropdownKey.value = null;
    };

    const openNoteFromDropdown = (att, stu) => {
      activeCellDropdownKey.value = null;
      openCellEdit(att, stu);
    };

    const handleGlobalClick = () => {
      if (activeCellDropdownKey.value) activeCellDropdownKey.value = null;
    };

    // ==========================================
    // 🌟 课程主题与上课日期编辑中心 (Row Edit Modal)
    // ==========================================
    const showEditAttendanceModal = ref(false);
    const editingAttendanceForm = reactive({
      id: '',
      classId: '',
      theme: '',
      rawDate: '',
      date: '',
      teacher: ''
    });

    const openEditAttendanceRow = (att) => {
      if (!att) return;
      const rawDate = att.date || '';
      let isoDate = rawDate;
      const m = String(rawDate).match(/(\d{4})[年/-](\d{1,2})[月/-](\d{1,2})/);
      if (m) {
        isoDate = `${m[1]}-${String(m[2]).padStart(2, '0')}-${String(m[3]).padStart(2, '0')}`;
      }
      editingAttendanceForm.id = att.id;
      editingAttendanceForm.classId = att.classId || att.class_id;
      editingAttendanceForm.theme = att.theme || '';
      editingAttendanceForm.rawDate = isoDate;
      editingAttendanceForm.date = isoDate;
      editingAttendanceForm.teacher = att.teacher || getClassById(editingAttendanceForm.classId).teacher || '陈老师';
      showEditAttendanceModal.value = true;
    };

    const submitEditAttendanceRow = () => {
      const att = attendanceHistory.value.find(a => a.id === editingAttendanceForm.id);
      if (!att) {
        showEditAttendanceModal.value = false;
        return;
      }
      const oldTheme = att.theme;
      const oldDate = att.date;
      const newTheme = editingAttendanceForm.theme.trim() || '美育主题创作课';
      const newDate = editingAttendanceForm.rawDate || att.date;

      att.theme = newTheme;
      att.date = newDate;
      att.teacher = editingAttendanceForm.teacher || '陈老师';

      // 联动更新关联流水文本说明
      hourLogs.value.forEach(l => {
        if (l.reason && (l.reason.includes(oldTheme) || l.reason.includes(oldDate))) {
          l.reason = l.reason.replace(oldTheme, newTheme).replace(oldDate, newDate);
        }
      });

      saveData();
      showEditAttendanceModal.value = false;
      showToast(`🍐 已成功更新课程《${newTheme}》与上课日期为 ${newDate}！`);
    };

    const showCellEditModal = ref(false);
    const editingCell = reactive({
      attendanceId: '',
      attendanceDate: '',
      attendanceTheme: '',
      studentId: '',
      studentName: '',
      currentStatus: '到课',
      note: ''
    });

    const openCellEdit = (attendanceRecord, student) => {
      const cell = getStudentAttendanceCell(student.id, attendanceRecord);
      editingCell.attendanceId = attendanceRecord.id;
      editingCell.attendanceDate = attendanceRecord.date;
      editingCell.attendanceTheme = attendanceRecord.theme;
      editingCell.studentId = student.id;
      editingCell.studentName = student.name;
      editingCell.currentStatus = cell.status === '--' ? '到课' : cell.status;
      editingCell.note = cell.note || '';
      showCellEditModal.value = true;
    };

    const submitCellEdit = (status) => {
      const att = attendanceHistory.value.find(a => a.id === editingCell.attendanceId);
      const stu = students.value.find(s => s.id === editingCell.studentId);
      if (att && stu) {
        applyCellStatusChange(att, stu, status || editingCell.currentStatus, editingCell.note);
      }
      showCellEditModal.value = false;
      saveData();
    };

    const applyCellStatusChange = (attendanceRecord, student, newStatus, customNote = '') => {
      if (!attendanceRecord.details) attendanceRecord.details = [];
      let detail = attendanceRecord.details.find(d => d.studentId === student.id);
      const nowStr = new Date().toLocaleString('zh-CN', { hour12: false });
      const oldStatus = detail ? detail.status : '--';

      if (oldStatus === newStatus && detail && detail.note === customNote) {
        return;
      }

      if (oldStatus === '到课' && newStatus !== '到课') {
        student.remainHours = Number(student.remainHours) + 1;
        student.totalConsumed = Math.max(0, Number(student.totalConsumed || 0) - 1);

        hourLogs.value.unshift({
          id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          studentId: student.id,
          studentName: student.name,
          type: '考勤修改退还',
          hours: +1,
          balanceAfter: student.remainHours,
          reason: `大表修改：${attendanceRecord.date}《${attendanceRecord.theme}》改为「${newStatus}」退还课时`,
          operator: '陈老师',
          time: nowStr
        });
      } else if (oldStatus !== '到课' && newStatus === '到课') {
        student.remainHours = Math.max(0, Number(student.remainHours) - 1);
        student.totalConsumed = Number(student.totalConsumed || 0) + 1;

        const noteDesc = customNote ? ` (备注: ${customNote})` : '';
        hourLogs.value.unshift({
          id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          studentId: student.id,
          studentName: student.name,
          type: '大表考勤消课',
          hours: -1,
          balanceAfter: student.remainHours,
          reason: `大表点名：${attendanceRecord.date}《${attendanceRecord.theme}》到课${noteDesc}`,
          operator: '陈老师',
          time: nowStr
        });
      }

      if (!detail) {
        detail = {
          studentId: student.id,
          studentName: student.name,
          status: newStatus,
          deductHours: newStatus === '到课' ? 1 : 0,
          note: customNote
        };
        attendanceRecord.details.push(detail);
      } else {
        detail.status = newStatus;
        detail.deductHours = newStatus === '到课' ? 1 : 0;
        detail.note = customNote;
      }

      attendanceRecord.presentCount = attendanceRecord.details.filter(d => d.status === '到课').length;
      attendanceRecord.leaveCount = attendanceRecord.details.filter(d => d.status === '未到' || d.status === '请假').length;
      attendanceRecord.holidayCount = attendanceRecord.details.filter(d => d.status === '放假').length;

      saveData();
      const statusBadge = newStatus === '到课' ? '🟢 到课 (-1节)' : newStatus === '未到' ? '🔴 未到' : '🟣 放假';
      showToast(`已将【${student.name}】设为 ${statusBadge}，结余 ${student.remainHours} 节`, 'info', 2000);
    };

    // 表格内快速新增考勤行
    const inlineNewRow = reactive({
      theme: '',
      date: new Date().toISOString().slice(0, 10),
      defaultStatus: '到课'
    });

    const submitInlineNewRow = () => {
      const cls = getClassById(matrixClassId.value);
      const stuList = activeStudents.value.filter(s => s.classId === cls.id);

      if (!stuList.length) {
        showToast('当前班级暂无在读学员，请先录入学员', 'warning');
        return;
      }

      const nowStr = new Date().toLocaleString('zh-CN', { hour12: false });
      const themeText = inlineNewRow.theme.trim() || '少儿主题美育创作课';
      const dateText = inlineNewRow.date || new Date().toISOString().slice(0, 10);
      const defStatus = inlineNewRow.defaultStatus;

      const details = [];
      let presentCount = 0;
      let leaveCount = 0;
      let holidayCount = 0;

      stuList.forEach(s => {
        if (defStatus === '到课') {
          presentCount++;
          s.remainHours = Math.max(0, Number(s.remainHours) - 1);
          s.totalConsumed = Number(s.totalConsumed || 0) + 1;

          hourLogs.value.unshift({
            id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            studentId: s.id,
            studentName: s.name,
            type: '大表新增消课',
            hours: -1,
            balanceAfter: s.remainHours,
            reason: `${dateText} ${cls.name}《${themeText}》表格考勤到课`,
            operator: cls.teacher || '陈老师',
            time: nowStr
          });

          details.push({
            studentId: s.id,
            studentName: s.name,
            status: '到课',
            deductHours: 1,
            note: ''
          });
        } else if (defStatus === '未到') {
          leaveCount++;
          details.push({
            studentId: s.id,
            studentName: s.name,
            status: '未到',
            deductHours: 0,
            note: ''
          });
        } else if (defStatus === '放假') {
          holidayCount++;
          details.push({
            studentId: s.id,
            studentName: s.name,
            status: '放假',
            deductHours: 0,
            note: '全班放假'
          });
        }
      });

      attendanceHistory.value.unshift({
        id: 'att_' + Date.now(),
        classId: cls.id,
        className: cls.name,
        date: dateText,
        teacher: cls.teacher || '陈老师',
        theme: themeText,
        presentCount,
        leaveCount,
        holidayCount,
        details,
        createdAt: nowStr
      });

      saveData();
      inlineNewRow.theme = '';
      showToast(`🎉 成功添加新课《${themeText}》！`);
    };

    const showAddMatrixRowModal = ref(false);
    const newMatrixRowForm = reactive({
      classId: '',
      date: new Date().toISOString().slice(0, 10),
      theme: '',
      defaultStatus: '到课'
    });

    const openAddMatrixRow = () => {
      newMatrixRowForm.classId = matrixClassId.value || activeClasses.value[0]?.id || '';
      newMatrixRowForm.date = new Date().toISOString().slice(0, 10);
      newMatrixRowForm.theme = '';
      newMatrixRowForm.defaultStatus = '到课';
      showAddMatrixRowModal.value = true;
    };

    const submitAddMatrixRow = () => {
      inlineNewRow.theme = newMatrixRowForm.theme;
      inlineNewRow.date = newMatrixRowForm.date;
      inlineNewRow.defaultStatus = newMatrixRowForm.defaultStatus;
      submitInlineNewRow();
      showAddMatrixRowModal.value = false;
      saveData();
    };

    const deleteAttendanceRow = (att) => deleteMatrixRow(att);
    const deleteMatrixRow = (att) => {
      if (!confirm(`确定要删除【${att.date} 《${att.theme}》】这节课吗？\n删除后该节课所有到课学员的课时将自动全额退还！`)) {
        return;
      }
      const nowStr = new Date().toLocaleString('zh-CN', { hour12: false });

      att.details.forEach(d => {
        if (d.status === '到课' && d.deductHours > 0) {
          const s = students.value.find(stu => stu.id === d.studentId);
          if (s) {
            s.remainHours = Number(s.remainHours) + d.deductHours;
            s.totalConsumed = Math.max(0, Number(s.totalConsumed || 0) - d.deductHours);

            hourLogs.value.unshift({
              id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
              studentId: s.id,
              studentName: s.name,
              type: '考勤撤销返还',
              hours: +d.deductHours,
              balanceAfter: s.remainHours,
              reason: `撤销 ${att.date} ${att.className} 考勤`,
              operator: '陈老师',
              time: nowStr
            });
          }
        }
      });

      attendanceHistory.value = attendanceHistory.value.filter(a => a.id !== att.id);
      saveData();
      showToast('🔄 课次已删除，学员课时已全额退还！', 'info');
    };

    const exportAttendanceMatrixCSV = (classId, filterStartDate = "", filterEndDate = "") => {
      const targetId = classId || matrixClassId.value;
      const cls = getClassById(targetId);
      const stuList = activeStudents.value.filter(s => s.classId === targetId);
      let attList = attendanceHistory.value.filter(a => a.classId === targetId || a.class_id === targetId);
      if (filterStartDate) attList = attList.filter(a => a.date >= filterStartDate);
      if (filterEndDate) attList = attList.filter(a => a.date <= filterEndDate);

      if (!stuList.length || !attList.length) {
        showToast('该班级暂无足够的考勤记录可导出矩阵表', 'warning');
        return;
      }

      const seqRow = ['', '', ...stuList.map((s, idx) => idx + 1)];
      const nameRow = ['课程', '日期', ...stuList.map(s => `"${s.name.replace(/"/g, '""')}"`)];

      const dataRows = attList.map(att => {
        const row = [
          `"${att.theme.replace(/"/g, '""')}"`,
          `"${att.date.replace(/"/g, '""')}"`
        ];
        stuList.forEach(s => {
          const cell = getStudentAttendanceCell(s.id, att);
          row.push(cell.status);
        });
        return row;
      });

      const csvContent = '\uFEFF' + [
        seqRow.join(','),
        nameRow.join(','),
        ...dataRows.map(r => r.join(','))
      ].join('\r\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `想吃梨_【${cls.name}】二维考勤总表_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`🍐 【${cls.name}】二维考勤大表已成功导出！`);
    };

    // ==========================================
    // 8. 课时排行榜
    // ==========================================
    const rankingSearchQuery = ref('');
    const rankingClassFilter = ref('all');
    const rankingHourFilter = ref('all');
    const rankingSortOrder = ref('asc');

    const rankingList = computed(() => {
      let list = [...activeStudents.value];

      if (rankingClassFilter.value !== 'all') {
        list = list.filter(s => s.classId === rankingClassFilter.value);
      }

      const threshold = studioInfo.value.warningThreshold || 3;
      if (rankingHourFilter.value === 'urgent_all') {
        list = list.filter(s => Number(s.remainHours) <= threshold);
      } else if (rankingHourFilter.value === 'depleted') {
        list = list.filter(s => Number(s.remainHours) <= 0);
      } else if (rankingHourFilter.value === 'warning') {
        list = list.filter(s => Number(s.remainHours) > 0 && Number(s.remainHours) <= threshold);
      } else if (rankingHourFilter.value === 'sufficient') {
        list = list.filter(s => Number(s.remainHours) > threshold);
      }

      if (rankingSearchQuery.value.trim()) {
        const q = rankingSearchQuery.value.trim().toLowerCase();
        list = list.filter(s => 
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.parentPhone && s.parentPhone.includes(q)) ||
          (s.parentName && s.parentName.toLowerCase().includes(q))
        );
      }

      list.sort((a, b) => {
        const diff = Number(a.remainHours) - Number(b.remainHours);
        return rankingSortOrder.value === 'asc' ? diff : -diff;
      });

      return list.map((item, index) => {
        const status = getHourStatus(item.remainHours);
        const cls = getClassById(item.classId);

        return {
          ...item,
          rank: index + 1,
          hourStatus: status,
          className: cls.name
        };
      });
    });

    const exportRankingCSV = () => {
      const data = rankingList.value;
      if (!data.length) {
        showToast('暂无可导出的数据', 'warning');
        return;
      }
      const headers = ['排名', '学员姓名', '年龄', '所在班级', '剩余课时', '课时状态', '当前积分', '累计购课', '累计消课', '家长姓名', '家长电话', '备注说明'];
      const rows = data.map(s => [
        s.rank,
        `"${s.name.replace(/"/g, '""')}"`,
        s.age,
        `"${s.className.replace(/"/g, '""')}"`,
        s.remainHours,
        s.status.label,
        s.points || 0,
        s.totalPurchased || 0,
        s.totalConsumed || 0,
        `"${(s.parentName || '').replace(/"/g, '""')}"`,
        `\t${s.parentPhone || ''}`,
        `"${(s.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `想吃梨_学员课时排行榜_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('🍐 课时排行榜表格已导出！');
    };

    // ==========================================
    // 9. 班级与学员名册 & 归档中心
    // ==========================================
    const selectedRosterClassId = ref('all');
    const rosterStudentSearch = ref('');
    const rosterHourFilter = ref('all'); // 'all' | 'sufficient' | 'warning' | 'exhausted'

    const currentClassStudentsList = computed(() => {
      let list = [...activeStudents.value];
      if (selectedRosterClassId.value !== 'all') {
        list = list.filter(s => s.classId === selectedRosterClassId.value);
      }
      if (rosterHourFilter.value === 'sufficient') {
        list = list.filter(s => Number(s.remainHours || 0) > 3);
      } else if (rosterHourFilter.value === 'warning') {
        list = list.filter(s => Number(s.remainHours || 0) > 0 && Number(s.remainHours || 0) <= 3);
      } else if (rosterHourFilter.value === 'exhausted') {
        list = list.filter(s => Number(s.remainHours || 0) <= 0);
      }
      if (rosterStudentSearch.value.trim()) {
        const q = rosterStudentSearch.value.trim().toLowerCase();
        list = list.filter(s =>
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.parentPhone && s.parentPhone.includes(q)) ||
          (s.parentName && s.parentName.toLowerCase().includes(q))
        );
      }
      return list;
    });

    const goToAttendanceForClass = (classId) => {
      if (classId && classId !== 'all') {
        matrixClassId.value = classId;
      }
      currentTab.value = 'attendance';
    };

    const archiveClass = (cls) => {
      if (confirm(`确定要归档班级【${cls.name}】吗？\n归档后该班级将移入归档历史中心，不再出现在日常考勤大表中，但历史考勤记录与数据仍完整保留。`)) {
        cls.status = 'archived';
        cls.archivedAt = new Date().toISOString().slice(0, 10);
        saveData();
        showToast(`📦 班级【${cls.name}】已成功归档`);
      }
    };

    const unarchiveClass = (cls) => {
      cls.status = 'active';
      delete cls.archivedAt;
      saveData();
      showToast(`🔄 班级【${cls.name}】已恢复为正常开班！`);
    };

    const archiveStudent = (stu) => {
      if (!stu) return;
      const targetId = stu.id || stu.studentId || stu.student_id;
      const realStudent = students.value.find(s => s.id === targetId);
      if (!realStudent) {
        showToast('未找到该学员信息', 'warning');
        return;
      }
      if (confirm(`确定要归档学员【${realStudent.name}】吗？\n归档后该学员将从日常在读名册与大表中移至归档中心，保留所有历史考勤与流水记录。`)) {
        realStudent.status = '已归档';
        realStudent.archivedAt = new Date().toISOString().slice(0, 10);
        stu.status = '已归档';

        hourLogs.value.unshift({
          id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          studentId: realStudent.id,
          studentName: realStudent.name,
          type: '学员结课归档',
          hours: 0,
          balanceAfter: realStudent.remainHours,
          reason: `学员档案已归档保存 (结余积分: ${realStudent.points || 0}分)`,
          operator: '陈老师',
          time: new Date().toLocaleString('zh-CN', { hour12: false })
        });
        saveData();
        showToast(`📦 学员【${realStudent.name}】已成功归档！`);
      }
    };

    const unarchiveStudent = (stu) => {
      if (!stu) return;
      const targetId = stu.id || stu.studentId || stu.student_id;
      const realStudent = students.value.find(s => s.id === targetId);
      if (!realStudent) {
        showToast('未找到该学员信息', 'warning');
        return;
      }
      realStudent.status = '在读';
      delete realStudent.archivedAt;
      stu.status = '在读';

      hourLogs.value.unshift({
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        studentId: realStudent.id,
        studentName: realStudent.name,
        type: '学员恢复在读',
        hours: 0,
        balanceAfter: realStudent.remainHours,
        reason: `学员从归档库恢复为在读状态`,
        operator: '陈老师',
        time: new Date().toLocaleString('zh-CN', { hour12: false })
      });
      saveData();
      showToast(`🔄 学员【${realStudent.name}】已恢复为在读状态！`);
    };

    // ==========================================
    // 10. 智能学员搜索选择器与个人考勤补录
    // ==========================================
    const showAdhocAttendanceModal = ref(false);
    const adhocStudentSearch = ref('');
    const adhocClassFilter = ref('all');

    const adhocForm = reactive({
      studentId: '',
      date: new Date().toISOString().slice(0, 10),
      theme: '临时补课 / 体验加课',
      status: '到课',
      deductHours: 1,
      targetClassId: '',
      remark: '',
      operator: '陈老师'
    });

    const selectedAdhocStudent = computed(() => {
      if (!adhocForm.studentId) return null;
      return students.value.find(s => s.id === adhocForm.studentId) || null;
    });

    const filteredAdhocStudents = computed(() => {
      let list = [...activeStudents.value];

      if (adhocClassFilter.value !== 'all') {
        list = list.filter(s => s.classId === adhocClassFilter.value);
      }

      if (adhocStudentSearch.value.trim()) {
        const q = adhocStudentSearch.value.trim().toLowerCase();
        list = list.filter(s => 
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.parentPhone && s.parentPhone.includes(q)) ||
          (s.parentName && s.parentName.toLowerCase().includes(q))
        );
      }

      return list;
    });

    const openAdhocAttendanceModal = (targetStudentId = '') => {
      adhocStudentSearch.value = '';
      adhocClassFilter.value = 'all';
      adhocForm.studentId = targetStudentId || activeStudents.value[0]?.id || '';
      adhocForm.date = new Date().toISOString().slice(0, 10);
      adhocForm.theme = '临时补课 / 体验加课';
      adhocForm.status = '到课';
      adhocForm.deductHours = 1;
      adhocForm.targetClassId = activeClasses.value[0]?.id || '';
      adhocForm.remark = '';
      adhocForm.operator = '陈老师';
      showAdhocAttendanceModal.value = true;
    };

    const submitAdhocAttendance = () => {
      if (!adhocForm.studentId) {
        showToast('请先选择补课学员', 'warning');
        return;
      }
      const s = students.value.find(item => item.id === adhocForm.studentId);
      if (!s) return;

      const deduct = (adhocForm.status === '到课') ? Number(adhocForm.deductHours || 1) : 0;
      const nowStr = new Date().toLocaleString('zh-CN', { hour12: false });
      const targetCls = getClassById(adhocForm.targetClassId);
      const reasonRemark = adhocForm.remark.trim() ? ` (备注: ${adhocForm.remark.trim()})` : '';

      if (deduct > 0) {
        s.remainHours = Math.max(0, Number(s.remainHours) - deduct);
        s.totalConsumed = Number(s.totalConsumed || 0) + deduct;

        hourLogs.value.unshift({
          id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          studentId: s.id,
          studentName: s.name,
          type: '个人临时消课',
          hours: -deduct,
          balanceAfter: s.remainHours,
          reason: `${adhocForm.date} 临时考勤《${adhocForm.theme}》${reasonRemark}`,
          operator: adhocForm.operator || '陈老师',
          time: nowStr
        });
      }

      attendanceHistory.value.unshift({
        id: 'att_adhoc_' + Date.now(),
        classId: adhocForm.targetClassId || 'adhoc',
        className: targetCls.name ? `[个人临时] ${targetCls.name}` : '[个人临时加课]',
        date: adhocForm.date,
        teacher: adhocForm.operator || '陈老师',
        theme: adhocForm.theme + (adhocForm.remark ? ` - ${adhocForm.remark}` : ''),
        presentCount: (adhocForm.status === '到课') ? 1 : 0,
        leaveCount: (adhocForm.status === '请假' || adhocForm.status === '未到') ? 1 : 0,
        holidayCount: 0,
        details: [
          {
            studentId: s.id,
            studentName: s.name,
            status: adhocForm.status === '到课' ? '到课' : '未到',
            deductHours: deduct,
            note: adhocForm.remark || '个人临时考勤'
          }
        ],
        createdAt: nowStr
      });

      saveData();
      showAdhocAttendanceModal.value = false;
      showToast(`🎉 已为【${s.name}】记录临时考勤，剩余 ${s.remainHours} 节`);
    };

    // ==========================================
    // 11. 班级导出功能
    // ==========================================
    const exportClassAttendanceCSV = (classId) => {
      const cls = (classId === 'all') ? { name: '全校所有学员', teacher: '陈老师' } : getClassById(classId);
      const stuList = (classId === 'all') ? activeStudents.value : activeStudents.value.filter(s => s.classId === classId);

      if (!stuList.length) {
        showToast('当前没有学员可导出', 'warning');
        return;
      }

      const headers = ['班级名称', '任课老师', '学员姓名', '年龄', '性别', '当前剩余课时', '当前积分', '累计消耗课时', '累计购课总量', '课时预警状态', '家长姓名', '家长联系电话', '学员备注'];
      const rows = stuList.map(s => {
        const status = getHourStatus(s.remainHours);
        return [
          `"${getClassById(s.classId).name.replace(/"/g, '""')}"`,
          cls.teacher || '陈老师',
          `"${s.name.replace(/"/g, '""')}"`,
          s.age,
          s.gender,
          `${s.remainHours} 节`,
          `${s.points || 0} 分`,
          `${s.totalConsumed || 0} 节`,
          `${s.totalPurchased || 0} 节`,
          status.label,
          `"${(s.parentName || '').replace(/"/g, '""')}"`,
          `\t${s.parentPhone || ''}`,
          `"${(s.notes || '').replace(/"/g, '""')}"`
        ];
      });

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `想吃梨_【${cls.name}】考勤统计表_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`🍐 【${cls.name}】考勤统计表已导出！`);
    };

    // ==========================================
    // 12. 续费充值 & 新生建档缴费
    // ==========================================
    const showRechargeModal = ref(false);
    const rechargeMode = ref('existing'); // 'existing' | 'new'
    const rechargeForm = reactive({
      studentId: '',
      studentName: '',
      newStudentName: '',
      newStudentClassId: '',
      newStudentGender: '女',
      newStudentAge: 5,
      newStudentParentPhone: '',
      hoursBought: 48,
      hoursGift: 0,
      amount: 4800,
      payMethod: '微信支付',
      payDate: new Date().toISOString().slice(0, 10),
      operator: '陈老师',
      remark: '常规续费充值'
    });

    const openRecharge = (student = {}) => {
      if (student && student.id) {
        rechargeMode.value = 'existing';
        rechargeForm.studentId = student.id;
        rechargeForm.studentName = student.name;
      } else {
        rechargeMode.value = 'existing';
        rechargeForm.studentId = activeStudents.value[0]?.id || '';
        rechargeForm.studentName = activeStudents.value[0]?.name || '';
      }
      rechargeForm.newStudentName = '';
      rechargeForm.newStudentClassId = activeClasses.value[0]?.id || '';
      rechargeForm.newStudentGender = '女';
      rechargeForm.newStudentAge = 5;
      rechargeForm.newStudentParentPhone = '';
      rechargeForm.hoursBought = 48;
      rechargeForm.hoursGift = 0;
      rechargeForm.amount = 4800;
      rechargeForm.payMethod = '微信支付';
      rechargeForm.payDate = new Date().toISOString().slice(0, 10);
      rechargeForm.operator = '陈老师';
      rechargeForm.remark = '常规充值交费';
      showRechargeModal.value = true;
    };

    const submitRecharge = () => {
      const addHours = Number(rechargeForm.hoursBought || 0) + Number(rechargeForm.hoursGift || 0);
      if (addHours <= 0) {
        showToast('充值课时数需大于0', 'warning');
        return;
      }

      let targetStudent = null;
      const nowStr = new Date().toLocaleString('zh-CN', { hour12: false });
      const bonusPoints = addHours;

      if (rechargeMode.value === 'new') {
        if (!rechargeForm.newStudentName.trim()) {
          showToast('请输入新生姓名', 'warning');
          return;
        }
        const newStu = {
          id: 'stu_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          name: rechargeForm.newStudentName.trim(),
          gender: rechargeForm.newStudentGender || '女',
          age: Number(rechargeForm.newStudentAge || 5),
          classId: rechargeForm.newStudentClassId || activeClasses.value[0]?.id || '',
          parentName: '',
          parentPhone: rechargeForm.newStudentParentPhone || '',
          remainHours: addHours,
          totalPurchased: addHours,
          totalConsumed: 0,
          points: bonusPoints,
          totalPointsEarned: bonusPoints,
          redeemedCount: 0,
          status: '在读',
          joinDate: rechargeForm.payDate || new Date().toISOString().slice(0, 10),
          notes: rechargeForm.remark || '新生缴费建档',
          createdAt: new Date().toISOString()
        };
        students.value.unshift(newStu);
        targetStudent = newStu;

        hourLogs.value.unshift({
          id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          studentId: targetStudent.id,
          studentName: targetStudent.name,
          type: '新生建档缴费',
          hours: +addHours,
          balanceAfter: targetStudent.remainHours,
          reason: `${rechargeForm.payMethod} ¥${rechargeForm.amount} (+${addHours}课时) (备注: ${rechargeForm.remark || '新生首次报名'})`,
          operator: rechargeForm.operator,
          time: nowStr
        });
      } else {
        targetStudent = students.value.find(stu => stu.id === rechargeForm.studentId);
        if (!targetStudent) {
          showToast('请选择在读学员', 'warning');
          return;
        }

        targetStudent.remainHours = Number(targetStudent.remainHours || 0) + addHours;
        targetStudent.totalPurchased = Number(targetStudent.totalPurchased || 0) + addHours;
        targetStudent.points = Number(targetStudent.points || 0) + bonusPoints;
        targetStudent.totalPointsEarned = Number(targetStudent.totalPointsEarned || 0) + bonusPoints;

        const noteText = rechargeForm.remark ? ` (备注: ${rechargeForm.remark})` : '';
        hourLogs.value.unshift({
          id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          studentId: targetStudent.id,
          studentName: targetStudent.name,
          type: '续费充值',
          hours: +addHours,
          balanceAfter: targetStudent.remainHours,
          reason: `${rechargeForm.payMethod} ¥${rechargeForm.amount} (+${addHours}课时)${noteText}`,
          operator: rechargeForm.operator,
          time: nowStr
        });
      }

      // 积分流水
      pointLogs.value.unshift({
        id: 'plog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        studentId: targetStudent.id,
        studentName: targetStudent.name,
        type: rechargeMode.value === 'new' ? '新生赠送积分' : '续费赠送积分',
        points: +bonusPoints,
        balanceAfter: targetStudent.points,
        reason: `${rechargeMode.value === 'new' ? '新生报名' : '续费'} ${addHours} 课时赠送画币积分`,
        operator: rechargeForm.operator,
        time: nowStr
      });

      // 财务开单明细
      paymentOrders.value.unshift({
        id: 'pay_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        orderNo: 'ORD' + Date.now(),
        studentId: targetStudent.id,
        studentName: targetStudent.name,
        type: rechargeMode.value === 'new' ? '新生报名' : '老生续费',
        amount: Number(rechargeForm.amount || 0),
        hoursBought: Number(rechargeForm.hoursBought || 0),
        hoursGift: Number(rechargeForm.hoursGift || 0),
        hours: addHours,
        date: rechargeForm.payDate || new Date().toISOString().slice(0, 10),
        payDate: rechargeForm.payDate || new Date().toISOString().slice(0, 10),
        payMethod: rechargeForm.payMethod,
        operator: rechargeForm.operator,
        remark: rechargeForm.remark,
        status: '正常'
      });

      saveData();
      showRechargeModal.value = false;
      showToast(`🎉 ${rechargeMode.value === 'new' ? '新生建档入账成功' : '续费充值成功'}！【${targetStudent.name}】增加 ${addHours} 课时，当前剩余 ${targetStudent.remainHours} 节`);
      saveData();
    };

    // ==========================================
    // 13. 学员录入与编辑
    // ==========================================
    const showStudentModal = ref(false);
    const isEditStudent = ref(false);
    const studentForm = reactive({
      id: '',
      name: '',
      gender: '女',
      age: 5,
      classId: '',
      parentName: '',
      parentPhone: '',
      remainHours: 48,
      points: 50,
      joinDate: new Date().toISOString().slice(0, 10),
      notes: ''
    });

    const openAddStudent = (defaultClassId = '') => {
      isEditStudent.value = false;
      studentForm.id = 'stu_' + Date.now();
      studentForm.name = '';
      studentForm.gender = '女';
      studentForm.age = 5;
      studentForm.classId = defaultClassId || (selectedRosterClassId.value !== 'all' ? selectedRosterClassId.value : activeClasses.value[0]?.id) || '';
      studentForm.parentName = '';
      studentForm.parentPhone = '';
      studentForm.remainHours = 48;
      studentForm.points = 50;
      studentForm.joinDate = new Date().toISOString().slice(0, 10);
      studentForm.notes = '';
      showStudentModal.value = true;
    };

    const openEditStudent = (s) => {
      isEditStudent.value = true;
      Object.assign(studentForm, JSON.parse(JSON.stringify(s)));
      showStudentModal.value = true;
    };

    const saveStudent = () => {
      if (!studentForm.name.trim()) {
        showToast('请输入学员姓名', 'warning');
        return;
      }
      if (isEditStudent.value) {
        const idx = students.value.findIndex(s => s.id === studentForm.id);
        if (idx !== -1) {
          const old = students.value[idx];
          const diff = Number(studentForm.remainHours) - Number(old.remainHours);
          if (diff !== 0) {
            hourLogs.value.unshift({
              id: 'log_' + Date.now(),
              studentId: old.id,
              studentName: studentForm.name,
              type: '教务手动调整',
              hours: diff,
              balanceAfter: Number(studentForm.remainHours),
              reason: `修改档案课时 (备注: ${studentForm.notes || '无备注'})`,
              operator: '陈老师',
              time: new Date().toLocaleString('zh-CN', { hour12: false })
            });
          }
          students.value[idx] = { 
            ...students.value[idx], 
            ...studentForm, 
            remainHours: Number(studentForm.remainHours),
            points: Number(studentForm.points || 0)
          };
          if (profileStudent.value && profileStudent.value.id === studentForm.id) {
            profileStudent.value = students.value[idx];
          }
          showToast(`学员【${studentForm.name}】档案已更新`);
        }
      } else {
        const newS = {
          ...studentForm,
          status: '在读',
          remainHours: Number(studentForm.remainHours),
          totalPurchased: Number(studentForm.remainHours),
          totalConsumed: 0,
          points: Number(studentForm.points || 50),
          totalPointsEarned: Number(studentForm.points || 50),
          redeemedCount: 0
        };
        students.value.unshift(newS);
        hourLogs.value.unshift({
          id: 'log_' + Date.now(),
          studentId: newS.id,
          studentName: newS.name,
          type: '新生建档入读',
          hours: +newS.remainHours,
          balanceAfter: newS.remainHours,
          reason: `首次建档初始课时 (备注: ${newS.notes || '新生入学'})`,
          operator: '陈老师',
          time: new Date().toLocaleString('zh-CN', { hour12: false })
        });
        showToast(`🎉 成功录入学员【${newS.name}】并赠送 ${newS.points} 新生积分！`);
      }
      saveData();
      showStudentModal.value = false;
      saveData();
    };

    const deleteStudent = (s) => {
      if (confirm(`确定要彻底删除学员【${s.name}】吗？\n建议优先使用「归档」功能，归档后可随时恢复。彻底删除将无法找回！`)) {
        students.value = students.value.filter(item => item.id !== s.id);
        if (profileStudent.value && profileStudent.value.id === s.id) {
          showStudentProfileModal.value = false;
        }
        saveData();
        showToast(`学员【${s.name}】已彻底删除`, 'info');
      }
    };

    const showClassModal = ref(false);
    const isEditClass = ref(false);
    const classForm = reactive({
      id: '',
      name: '',
      teacher: '陈老师',
      schedule: '每周六 09:30 - 11:00',
      classroom: '🍐 梨香一号画坊',
      capacity: 8,
      status: 'active',
      notes: ''
    });

    const openAddClass = () => {
      isEditClass.value = false;
      classForm.id = 'cls_' + Date.now();
      classForm.name = '';
      classForm.teacher = '陈老师';
      classForm.schedule = '每周六 09:30 - 11:00';
      classForm.classroom = '🍐 梨香一号画坊';
      classForm.capacity = 8;
      classForm.status = 'active';
      classForm.notes = '';
      showClassModal.value = true;
    };

    const openEditClass = (cls) => {
      isEditClass.value = true;
      Object.assign(classForm, JSON.parse(JSON.stringify(cls)));
      showClassModal.value = true;
    };

    const saveClass = () => {
      if (!classForm.name.trim()) {
        showToast('请输入班级名称', 'warning');
        return;
      }
      if (isEditClass.value) {
        const idx = classes.value.findIndex(c => c.id === classForm.id);
        if (idx !== -1) {
          classes.value[idx] = { ...classes.value[idx], ...classForm };
          showToast(`班级【${classForm.name}】档案已更新`);
        }
      } else {
        const newClass = { ...classForm, status: 'active', createdAt: new Date().toISOString().slice(0, 10) };
        classes.value.push(newClass);
        selectedRosterClassId.value = newClass.id;
        matrixClassId.value = newClass.id;
        showToast(`🎉 成功新建班级【${classForm.name}】`);
      }
      saveData();
      showClassModal.value = false;
      saveData();
    };

    const deleteClass = (cls) => {
      const studentCount = students.value.filter(s => s.classId === cls.id).length;
      if (studentCount > 0) {
        if (!confirm(`该班级当前还有 ${studentCount} 名学员，彻底删除将解除他们的班级归属！\n建议优先使用「归档」功能，确定要彻底删除吗？`)) {
          return;
        }
      } else {
        if (!confirm(`确定要彻底删除班级【${cls.name}】吗？`)) return;
      }
      classes.value = classes.value.filter(c => c.id !== cls.id);
      saveData();
      showToast(`班级【${cls.name}】已彻底删除`, 'info');
    };

    
    // ==========================================
    // 🌐 浏览器前进/后退与 URL Hash 路由同步 (防跳跃 · 安全路由)
    // ==========================================
    const isSyncingHash = ref(false);

    const syncStateFromHash = () => {
      isSyncingHash.value = true;
      const rawHash = window.location.hash || '';
      
      if (rawHash.startsWith('#student-')) {
        const sid = rawHash.replace('#student-', '');
        const stu = students.value.find(s => s.id === sid);
        if (stu) {
          profileStudent.value = stu;
          currentTab.value = 'profile';
        } else {
          profileStudent.value = null;
          currentTab.value = 'attendance';
          window.history.replaceState(null, '', '#attendance');
        }
      } else if (rawHash.startsWith('#class-')) {
        const cid = rawHash.replace('#class-', '');
        const cls = classes.value.find(c => c.id === cid);
        if (cls) {
          selectedClassDetail.value = cls;
          currentTab.value = 'class_detail';
        } else {
          selectedClassDetail.value = null;
          currentTab.value = 'students';
          window.history.replaceState(null, '', '#students');
        }
      } else if (rawHash === '#archive') {
        profileStudent.value = null;
        selectedClassDetail.value = null;
        currentTab.value = 'students';
        rosterSubTab.value = 'archive';
      } else if (rawHash === '#students-roster' || rawHash === '#students') {
        profileStudent.value = null;
        selectedClassDetail.value = null;
        currentTab.value = 'students';
        rosterSubTab.value = 'students';
      } else if (rawHash === '#students-classes') {
        profileStudent.value = null;
        selectedClassDetail.value = null;
        currentTab.value = 'students';
        rosterSubTab.value = 'classes';
      } else if (rawHash === '#ranking') {
        profileStudent.value = null;
        selectedClassDetail.value = null;
        currentTab.value = 'ranking';
      } else if (rawHash === '#records' || rawHash === '#finance') {
        profileStudent.value = null;
        selectedClassDetail.value = null;
        currentTab.value = 'records';
      } else {
        profileStudent.value = null;
        selectedClassDetail.value = null;
        currentTab.value = 'attendance';
      }
      setTimeout(() => { isSyncingHash.value = false; }, 50);
    };

    // 监听状态变化同步到 URL Hash (仅在非 profile 状态下保持主页干净)
    watch([currentTab, rosterSubTab, () => profileStudent.value?.id, () => selectedClassDetail.value?.id], () => {
      if (isSyncingHash.value) return;
      let targetHash = '#' + currentTab.value;
      if (currentTab.value === 'profile' && profileStudent.value) {
        targetHash = '#student-' + profileStudent.value.id;
      } else if (currentTab.value === 'class_detail' && selectedClassDetail.value) {
        targetHash = '#class-' + selectedClassDetail.value.id;
      } else if (currentTab.value === 'students') {
        if (rosterSubTab.value === 'archive') targetHash = '#archive';
        else if (rosterSubTab.value === 'students') targetHash = '#students-roster';
        else targetHash = '#students-classes';
      } else if (currentTab.value === 'records') {
        targetHash = '#finance';
      } else if (currentTab.value === 'attendance') {
        targetHash = '#attendance';
      }
      if (window.location.hash !== targetHash) {
        window.history.replaceState(null, '', targetHash);
      }
    });

    window.addEventListener('popstate', syncStateFromHash);
    window.addEventListener('hashchange', syncStateFromHash);

    onMounted(() => {
      applyTheme();
      loadData();
      syncStateFromHash();
      window.addEventListener('click', handleGlobalClick);
    });
</script>
