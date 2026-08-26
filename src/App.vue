<template>
<div id="app" v-cloak class="min-h-screen flex flex-col justify-between">
    
    <!-- ============================================================ -->
    <!-- 1. 🌟 固定通栏顶栏 (极简纯粹设计 · 四大核心Tab · 最高置顶 z-50) -->
    <!-- ============================================================ -->
    <header class="sticky top-0 z-50 border-b border-black/[0.08] dark:border-white/10 w-full transition-colors"
      style="background-color: var(--bg-surface);">
      <div class="w-full px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        <!-- 品牌标识 (🍐 徽标 + 想吃梨儿童美术) -->
        <div class="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0" @click="currentTab = 'attendance'">
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
        <nav class="hidden md:flex items-center wf-pill-container">
          
          <button @click="currentTab = 'attendance'"
            :class="currentTab === 'attendance' ? 'active' : ''"
            class="wf-pill-btn">
            <span>考勤大表</span>
          </button>

          <button @click="currentTab = 'ranking'"
            :class="currentTab === 'ranking' ? 'active' : ''"
            class="wf-pill-btn">
            <span>课时积分</span>
          </button>

          <button @click="currentTab = 'students'"
            :class="currentTab === 'students' || currentTab === 'class_detail' ? 'active' : ''"
            class="wf-pill-btn">
            <span>班级学员</span>
          </button>

          <button @click="currentTab = 'records'"
            :class="currentTab === 'records' ? 'active' : ''"
            class="wf-pill-btn">
            <span>财务中心</span>
          </button>

        </nav>

        <!-- 右侧工具栏 -->
        <div class="flex items-center gap-2">
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
      <div class="md:hidden flex px-3 pb-2 pt-1 border-t border-black/[0.04] dark:border-white/[0.08]">
        <div class="grid grid-cols-4 gap-1 w-full text-center">
          <button @click="currentTab = 'attendance'"
            :class="currentTab === 'attendance' ? 'active' : ''"
            class="wf-pill-btn justify-center py-2 text-xs font-bold truncate">
            <span>考勤大表</span>
          </button>
          <button @click="currentTab = 'ranking'"
            :class="currentTab === 'ranking' ? 'active' : ''"
            class="wf-pill-btn justify-center py-2 text-xs font-bold truncate">
            <span>课时积分</span>
          </button>
          <button @click="currentTab = 'students'"
            :class="currentTab === 'students' || currentTab === 'class_detail' ? 'active' : ''"
            class="wf-pill-btn justify-center py-2 text-xs font-bold truncate">
            <span>班级学员</span>
          </button>
          <button @click="currentTab = 'records'"
            :class="currentTab === 'records' ? 'active' : ''"
            class="wf-pill-btn justify-center py-2 text-xs font-bold truncate">
            <span>财务中心</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ============================================================ -->
    <!-- 2. 🌟 固定通栏考勤工具条 (仅在 Tab 1 考勤大表显示 · 置顶 z-40) -->
    <!-- ============================================================ -->
    <div v-if="currentTab === 'attendance'" class="sticky top-16 sm:top-20 z-40 w-full border-b border-black/[0.06] dark:border-white/[0.08] py-3.5 px-4 sm:px-6 transition-colors shadow-sm"
      style="background-color: var(--bg-surface);">
      <div class="w-full flex items-center justify-between gap-6">
        
        <!-- 左侧：班级快速下拉切换器 -->
        <div class="flex items-center gap-3.5">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#10E57A]"></span>
            <span class="text-xs text-black dark:text-stone-400 font-bold uppercase tracking-wider">班级</span>
          </div>

          <div class="relative">
            <select v-model="matrixClassId" 
              class="appearance-none pl-4 pr-9 py-2 wf-select text-xs sm:text-sm font-bold cursor-pointer shadow-sm">
              <option v-for="c in activeClasses" :key="c.id" :value="c.id">
                🎨 {{ c.name }} ({{ activeStudents.filter(s => s.classId === c.id).length }}人)
              </option>
            </select>
            <i class="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-xs pointer-events-none"></i>
          </div>

          <span class="text-xs text-black dark:text-stone-400 hidden lg:inline font-medium pl-2 border-l border-black/10 dark:border-white/10">
            任课：<strong>{{ getClassById(matrixClassId).teacher }}</strong> · {{ getClassById(matrixClassId).schedule }}
          </span>
        </div>

        <!-- 右侧：精简有力的线框操作按钮组 -->
        <div class="flex items-center gap-2.5 flex-shrink-0">
          
          <!-- 🌟 全班一键奖积分 -->
          <button @click="openBatchPointReward(matrixClassId)" class="wf-btn-outline text-amber-400 border-amber-500/30 hover:border-amber-400 whitespace-nowrap">
            <i class="fa-solid fa-star text-amber-400"></i>
            <span>全班奖积分</span>
          </button>

          <!-- 新增考勤 -->
          <button @click="openAddMatrixRow" class="wf-btn-primary whitespace-nowrap">
            <i class="fa-solid fa-plus-circle text-sm"></i>
            <span>新增考勤</span>
          </button>

          <!-- 补录考勤 -->
          <button @click="openAdhocAttendanceModal('')" class="wf-btn-outline whitespace-nowrap">
            <i class="fa-solid fa-user-clock text-emerald-400"></i>
            <span>补考勤</span>
          </button>

          <!-- 导出大表 -->
          <button @click="exportAttendanceMatrixCSV(matrixClassId)" class="wf-btn-outline whitespace-nowrap text-emerald-400 border-emerald-500/30 hover:border-emerald-400">
            <i class="fa-solid fa-file-csv"></i>
            <span>导出大表</span>
          </button>

        </div>

      </div>
    </div>

    <!-- ============================================================ -->
    <!-- 主要内容区域 -->
    <!-- ============================================================ -->
    <main class="flex-1 pb-0" @click="activeCellDropdownKey = null">
      
      <!-- ======================================================== -->
      <!-- TAB 1: 📝 二维考勤总大表 (极简线框 · 紧凑排版 · 顺畅横向滑动) -->
      <!-- ======================================================== -->
      <section v-if="currentTab === 'attendance'" class="w-full">
        
        <!-- 表格水平滚动容器 (支持多学员流畅横向滑动，前两列固定) -->
        <div class="overflow-x-auto h-[calc(100vh-130px)] overflow-y-auto w-full border-b border-black/10 dark:border-white/10" style="scrollbar-width: thin; background-color: var(--bg-page);">
          <table class="w-max min-w-full text-center text-xs border-collapse select-none" style="background-color: var(--bg-page); table-layout: fixed;">
            
            <!-- 表头 (紧凑高雅线框 · 课程与日期固定置顶与左置) -->
            <thead class="sticky top-0 z-30 shadow-sm border-b border-black/10 dark:border-white/15" style="background-color: var(--bg-surface);">
              <tr class="font-bold select-none">
                <!-- 01 课程主题 (固定左侧第1列 · 紧凑单行绝对不折行) -->
                <th class="py-2.5 pl-4 pr-3 text-left border-r border-black/[0.06] dark:border-white/10 min-w-[155px] w-[155px] whitespace-nowrap sticky left-0 z-30 shadow-sm" style="background-color: var(--bg-surface);">
                  <div class="flex items-center gap-1.5 whitespace-nowrap">
                    <span class="text-[10px] text-black dark:text-stone-400 font-mono font-normal">01</span>
                    <span class="text-xs font-black tracking-tight">课程主题</span>
                    <span class="text-[9px] text-black dark:text-stone-400 font-normal ml-0.5">✏️</span>
                  </div>
                </th>

                <!-- 02 上课日期 (固定左侧第2列 · 紧凑单行) -->
                <th class="py-2.5 px-3 text-left border-r border-black/[0.06] dark:border-white/10 min-w-[140px] w-[140px] whitespace-nowrap sticky left-[155px] z-30 shadow-sm" style="background-color: var(--bg-surface);">
                  <div class="flex items-center gap-1.5 whitespace-nowrap cursor-pointer group hover:text-emerald-500 transition" @click="attendanceSortOrder = attendanceSortOrder === 'desc' ? 'asc' : 'desc'" title="点击切换时间排序">
                    <span class="text-[10px] text-black dark:text-stone-400 font-mono font-normal">02</span>
                    <span class="text-xs font-black tracking-tight">上课日期</span>
                    <i class="fa-solid fa-sort text-[10px] opacity-40 group-hover:opacity-100 transition" :class="attendanceSortOrder === 'desc' ? 'fa-sort-down text-emerald-500 opacity-100' : 'fa-sort-up text-emerald-500 opacity-100'"></i>
                    <span class="text-[9px] text-black dark:text-stone-400 font-normal ml-0.5">📅</span>
                  </div>
                </th>
                
                <!-- 🌟 学员列 (紧凑优雅排版：#序号 + 姓名 + 剩余课时与积分微胶囊 · 宽度适中可横向平滑滚动) -->
                <th v-for="(stu, idx) in matrixStudents" :key="'name_' + stu.id" 
                  class="py-2 px-1.5 border-r border-black/[0.06] dark:border-white/10 min-w-[92px] w-[92px] whitespace-nowrap z-20" 
                  style="background-color: var(--bg-surface);">
                  
                  <div class="flex flex-col items-center justify-center gap-0.5">
                    <!-- 顶部紧凑序号与姓名 -->
                    <div @click="openStudentProfile(stu)" 
                      class="cursor-pointer group flex items-center justify-center gap-1 font-bold text-xs text-stone-900 dark:text-black dark:text-stone-100 hover:text-emerald-500 dark:hover:text-emerald-400 transition whitespace-nowrap" 
                      :title="'#' + (idx + 1) + ' ' + stu.name + ' (点击查看档案)'">
                      <span class="text-[9px] font-mono text-black dark:text-stone-400 font-normal">#{{ idx + 1 }}</span>
                      <span>{{ stu.name }}</span>
                    </div>
                    
                    <!-- 底部微型状态胶囊群 (紧密横排) -->
                    <div class="flex items-center justify-center gap-1 font-mono text-[9px] leading-none whitespace-nowrap mt-0.5">
                      <!-- 剩余课时 -->
                      <span :class="stu.remainHours <= 0 ? 'text-rose-500 bg-rose-500/10 border-rose-500/30' : stu.remainHours <= 3 ? 'text-amber-500 bg-amber-500/10 border-amber-500/30' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'"
                        class="px-1 py-0.5 rounded border font-bold">
                        余{{ stu.remainHours }}
                      </span>

                      <!-- 画币积分 -->
                      <button @click.stop="openIndividualPointModal(stu, 'add')" 
                        class="px-1 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-500 hover:border-amber-400 transition cursor-pointer font-bold flex items-center gap-0.5" 
                        :title="'点击为【' + stu.name + '】变更积分'">
                        <span>⭐</span>
                        <span>{{ stu.points || 0 }}</span>
                      </button>
                    </div>
                  </div>

                </th>

                <!-- 操作列 (固定右侧) -->
                <th class="py-2.5 px-2 w-16 min-w-[64px] text-center text-black dark:text-stone-400 text-xs font-normal sticky right-0 z-30 shadow-sm" style="background-color: var(--bg-surface);">
                  操作
                </th>
              </tr>
            </thead>

            <!-- 矩阵数据行 -->
            <tbody class="divide-y divide-black/[0.06] dark:divide-white/10" style="background-color: var(--bg-page);">
              <!-- 历史考勤数据行 -->
              <tr v-for="att in matrixAttendanceRecords" :key="att.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
                
                <!-- 🌟 课程主题 (固定左侧第1列 · 紧凑单行可直接点击修改) -->
                <td class="py-2 pl-4 pr-3 text-left border-r border-black/[0.06] dark:border-white/10 min-w-[155px] w-[155px] whitespace-nowrap sticky left-0 z-10 shadow-sm" style="background-color: var(--bg-surface);">
                  <div @click="openEditAttendanceRow(att)" 
                    class="cursor-pointer group flex items-center justify-between gap-1.5 py-1 px-1.5 -mx-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition whitespace-nowrap"
                    title="点击修改课程主题与上课日期">
                    <div class="flex items-center gap-1.5 truncate max-w-[125px]">
                      <i class="fa-regular fa-file-lines text-black dark:text-stone-400 text-[11px] flex-shrink-0"></i>
                      <span class="font-bold text-xs text-stone-900 dark:text-black dark:text-stone-100 group-hover:text-emerald-400 transition-colors truncate">{{ att.theme }}</span>
                    </div>
                    <i class="fa-solid fa-pen text-[9px] text-black dark:text-stone-400 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity flex-shrink-0"></i>
                  </div>
                </td>

                <!-- 🌟 上课日期 (固定左侧第2列 · 紧凑单行可直接点击修改) -->
                <td class="py-2 px-3 text-left border-r border-black/[0.06] dark:border-white/10 min-w-[140px] w-[140px] whitespace-nowrap sticky left-[155px] z-10 shadow-sm" style="background-color: var(--bg-surface);">
                  <div @click="openEditAttendanceRow(att)" 
                    class="cursor-pointer group flex items-center justify-between gap-1.5 py-1 px-1.5 -mx-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition whitespace-nowrap"
                    title="点击修改上课日期与课程主题">
                    <div class="flex items-center gap-1.5 truncate">
                      <i class="fa-regular fa-calendar text-black dark:text-stone-400 text-[11px] flex-shrink-0"></i>
                      <span class="font-mono text-xs text-black dark:text-stone-400 dark:text-black dark:text-stone-400 group-hover:text-emerald-400 transition-colors whitespace-nowrap">{{ att.date }}</span>
                    </div>
                    <i class="fa-solid fa-pen text-[9px] text-black dark:text-stone-400 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity flex-shrink-0"></i>
                  </div>
                </td>

                <!-- 🌟 考勤状态单元格 (紧凑居中 · 无悬浮黄点干扰 · 点击弹出极简下拉修改) -->
                <td v-for="stu in matrixStudents" :key="stu.id" 
                  class="py-1 px-1 border-r border-black/[0.06] dark:border-white/10 relative transition-all text-center min-w-[92px] w-[92px]">
                  
                  <div @click.stop="toggleCellDropdown(att.id, stu.id, $event)" 
                    class="cursor-pointer py-1 px-1.5 rounded-lg font-bold text-xs inline-flex items-center justify-center gap-1 min-w-[68px] transition select-none hover:scale-105 active:scale-95 shadow-sm"
                    :class="getMatrixCellClass(getStudentAttendanceCell(stu.id, att).status)"
                    :title="'点击修改【' + stu.name + '】出勤状态' + (getStudentAttendanceCell(stu.id, att).note ? ' (备注: ' + getStudentAttendanceCell(stu.id, att).note + ')' : '')">
                    
                    <span>{{ getStudentAttendanceCell(stu.id, att).status }}</span>
                    <i class="fa-solid fa-chevron-down text-[7px] opacity-60"></i>
                  </div>

                  <!-- 🌟 交互式快速浮层操作菜单 (Popover) -->
                  <div v-if="activeCellDropdownKey === (att.id + '_' + stu.id)" 
                    class="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-1 w-48 p-2 rounded-xl border border-black/15 dark:border-white/20 shadow-2xl space-y-1 text-left backdrop-blur-xl"
                    style="background-color: var(--bg-surface);">
                    
                    <div class="px-2 py-1 text-[10px] text-black dark:text-stone-400 font-mono border-b border-black/10 dark:border-white/10 flex justify-between items-center">
                      <span>快速修改考勤</span>
                      <span class="font-bold text-emerald-400">{{ stu.name }}</span>
                    </div>

                    <button @click.stop="selectCellStatusFromDropdown(att, stu, '到课')"
                      class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-500/20 text-[#10E57A] transition"
                      :class="getStudentAttendanceCell(stu.id, att).status === '到课' ? 'bg-emerald-500/20 border border-emerald-500/40' : ''">
                      <span class="flex items-center gap-1.5"><span>🟢</span> 到课</span>
                      <span class="text-[10px] text-black dark:text-stone-400 font-mono">消课-1</span>
                    </button>

                    <button @click.stop="selectCellStatusFromDropdown(att, stu, '未到')"
                      class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-500/20 text-rose-400 transition"
                      :class="getStudentAttendanceCell(stu.id, att).status === '未到' || getStudentAttendanceCell(stu.id, att).status === '请假' ? 'bg-rose-500/20 border border-rose-500/40' : ''">
                      <span class="flex items-center gap-1.5"><span>🔴</span> 未到/请假</span>
                      <span class="text-[10px] text-black dark:text-stone-400 font-mono">不扣课</span>
                    </button>

                    <button @click.stop="selectCellStatusFromDropdown(att, stu, '放假')"
                      class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-500/20 text-purple-400 transition"
                      :class="getStudentAttendanceCell(stu.id, att).status === '放假' ? 'bg-purple-500/20 border border-purple-500/40' : ''">
                      <span class="flex items-center gap-1.5"><span>🟣</span> 全班放假</span>
                      <span class="text-[10px] text-black dark:text-stone-400">休假</span>
                    </button>

                    <div class="border-t border-black/10 dark:border-white/10 my-1"></div>

                    <!-- 🌟 变更该学员积分 -->
                    <button @click.stop="openIndividualPointModal(stu, 'add'); activeCellDropdownKey = null" 
                      class="w-full flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-amber-400 hover:bg-amber-500/10 font-bold transition">
                      <i class="fa-solid fa-star text-[10px]"></i>
                      <span>变更【{{ stu.name }}】积分</span>
                    </button>

                    <button @click.stop="openNoteFromDropdown(att, stu)" 
                      class="w-full flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs hover:bg-black/5 dark:hover:bg-white/10 transition">
                      <i class="fa-solid fa-pen text-[10px] text-black dark:text-stone-400"></i>
                      <span>填写 / 修改备注</span>
                    </button>

                    <button @click.stop="openStudentProfile(stu); activeCellDropdownKey = null" 
                      class="w-full flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/10 font-bold transition">
                      <i class="fa-solid fa-id-card text-[10px]"></i>
                      <span>查看个人档案 ↗</span>
                    </button>

                  </div>

                </td>

                <!-- 操作列 (固定右侧 · 紧凑居中) -->
                <td class="py-1 px-2 w-16 min-w-[64px] text-center whitespace-nowrap sticky right-0 z-10 shadow-sm" style="background-color: var(--bg-surface);">
                  <button @click="openEditAttendanceRow(att)" 
                    class="text-black dark:text-stone-400 hover:text-emerald-400 p-1 transition text-xs"
                    title="修改课程主题与上课日期">
                    <i class="fa-solid fa-pen text-[11px]"></i>
                  </button>
                  <button @click="deleteMatrixRow(att)" 
                    class="text-black dark:text-stone-400 hover:text-rose-400 p-1 transition text-xs ml-0.5"
                    title="撤销/删除此节课 (自动退还消课)">
                    <i class="fa-regular fa-trash-can text-[11px]"></i>
                  </button>
                </td>

              </tr>

              <tr v-if="matrixAttendanceRecords.length === 0">
                <td :colspan="matrixStudents.length + 3" class="py-16 text-center text-black dark:text-stone-400 text-xs">
                  该班级暂无考勤历史，点击右上角【➕ 新增考勤】即可快速记录新课考勤
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
          
          <div class="flex items-center justify-between gap-4 pb-2 border-b border-black/10 dark:border-white/10">
            <div class="flex items-center gap-3 flex-wrap">
              <div class="relative">
                <select v-model="selectedRosterClassId" 
                  class="appearance-none pl-4 pr-8 py-2 wf-select text-xs font-bold cursor-pointer">
                  <option value="all">🌈 全部在读小画家 ({{ activeStudents.length }}人)</option>
                  <option v-for="c in activeClasses" :key="c.id" :value="c.id">
                    🎨 {{ c.name }} ({{ activeStudents.filter(s => s.classId === c.id).length }}人)
                  </option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-xs pointer-events-none"></i>
              </div>

              <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-xs"></i>
                <input v-model="rosterStudentSearch" type="text" placeholder="搜索学员姓名/电话..."
                  class="w-48 sm:w-56 pl-9 pr-3 py-1.5 wf-input text-xs placeholder:text-black dark:text-stone-400">
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button @click="openAddStudent(selectedRosterClassId)" class="wf-btn-primary text-xs">
                <i class="fa-solid fa-user-plus text-xs"></i>
                <span>录入新学员</span>
              </button>
              <button @click="exportClassAttendanceCSV(selectedRosterClassId)" class="wf-btn-outline text-xs text-emerald-400 border-emerald-500/30">
                <i class="fa-solid fa-file-csv"></i>
                <span>导出名单</span>
              </button>
            </div>
          </div>

          <div class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse select-none">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[130px]">学员姓名</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">年龄/性别</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[180px]">所属班级</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[95px]">剩余课时</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[110px]">画币积分</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[160px]">家长联系方式</th>
                  <th class="py-3.5 px-4 min-w-[140px]">备注</th>
                  <th class="py-3.5 px-5 text-right whitespace-nowrap min-w-[190px]">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                <tr v-for="s in currentClassStudentsList" :key="s.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                  
                  <!-- 🌟 学员姓名 (绝不折行 · 头像与姓名优雅横排) -->
                  <td class="py-3 px-4 font-bold cursor-pointer group whitespace-nowrap" @click="openStudentProfile(s)" title="点击查看个人详细档案">
                    <div class="flex items-center gap-2.5 whitespace-nowrap">
                      <div class="w-7 h-7 rounded-lg border border-black/10 dark:border-white/20 flex items-center justify-center font-bold text-xs group-hover:border-emerald-400 transition flex-shrink-0" style="background-color: var(--bg-surface-hover);">
                        {{ s.name.charAt(0) }}
                      </div>
                      <span class="group-hover:text-emerald-400 transition-colors flex items-center gap-1 font-black text-sm whitespace-nowrap">
                        <span>{{ s.name }}</span>
                        <i class="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity flex-shrink-0"></i>
                      </span>
                    </div>
                  </td>

                  <!-- 年龄/性别 (单行) -->
                  <td class="py-3 px-4 text-black dark:text-stone-400 whitespace-nowrap">
                    <span class="font-mono">{{ s.age }}</span>岁 · {{ s.gender }}
                  </td>

                  <!-- 所属班级 (单行高雅线框) -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    <span class="font-bold text-black dark:text-stone-300">{{ getClassById(s.classId).name }}</span>
                  </td>

                  <!-- 剩余课时 (精致线框胶囊) -->
                  <td class="py-3 px-4 whitespace-nowrap font-mono font-bold">
                    <span :class="s.remainHours <= 0 ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' : s.remainHours <= 3 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-[#10E57A] bg-emerald-500/10 border-emerald-500/30'"
                      class="px-2 py-0.5 rounded border text-xs inline-block">
                      余 {{ s.remainHours }} 节
                    </span>
                  </td>

                  <!-- 🌟 画币积分 (高雅单行药丸徽标，绝不折行) -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    <button @click.stop="openIndividualPointModal(s, 'add')" 
                      class="wf-badge-gold cursor-pointer hover:scale-105 active:scale-95 transition"
                      :title="'点击变更【' + s.name + '】积分'">
                      <span>⭐ {{ s.points || 0 }}</span>
                      <span class="text-[9px] opacity-75 ml-0.5">▾</span>
                    </button>
                  </td>

                  <!-- 家长联系方式 -->
                  <td class="py-3 px-4 font-mono text-black dark:text-stone-400 whitespace-nowrap">
                    <span class="text-black dark:text-stone-300 font-semibold">{{ s.parentName }}</span>
                    <span class="text-black dark:text-stone-400 ml-1">({{ s.parentPhone }})</span>
                  </td>

                  <!-- 备注 -->
                  <td class="py-3 px-4 text-black dark:text-stone-400 text-xs truncate max-w-xs" :title="s.notes || ''">
                    {{ s.notes || '-' }}
                  </td>

                  <!-- 快捷操作栏 (紧凑优雅单行按钮群，绝不折行) -->
                  <td class="py-3 px-5 text-right whitespace-nowrap space-x-1.5">
                    <button @click="openIndividualPointModal(s, 'add')" title="为学员变更积分" class="px-2 py-1 rounded-lg text-xs text-amber-400 hover:bg-amber-500/10 font-bold transition">
                      ⭐ 积分
                    </button>
                    <button @click="openRecharge(s)" class="px-2 py-1 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/10 font-bold transition">
                      续费
                    </button>
                    <button @click="openEditStudent(s)" class="px-2 py-1 rounded-lg text-xs text-black dark:text-stone-400 hover:text-black dark:text-stone-200 hover:bg-white/5 transition">
                      编辑
                    </button>
                    <button @click="archiveStudent(s)" title="归档该学员" class="px-2 py-1 rounded-lg text-xs text-black dark:text-stone-400 hover:text-amber-400 hover:bg-amber-500/10 transition">
                      归档
                    </button>
                    <button @click="deleteStudent(s)" class="px-2 py-1 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition">
                      删除
                    </button>
                  </td>

                </tr>

                <tr v-if="currentClassStudentsList.length === 0">
                  <td colspan="8" class="py-12 text-center text-black dark:text-stone-400 text-xs">
                    未找到在读学员，点击上方【录入新学员】添加
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
      <section v-if="currentTab === 'records'" class="max-w-[1600px] mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        <!-- 顶部通栏标题与全局概览 -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-black/10 dark:border-white/10 flex-wrap">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg sm:text-xl font-bold">财务与课消管理中心</h2>
              <span v-if="financeActiveKpi !== 'all'" @click="resetFinanceFilter"
                class="cursor-pointer text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition flex items-center gap-1">
                <span>正在下钻筛选</span>
                <i class="fa-solid fa-xmark text-[9px]"></i>
              </span>
            </div>
            <p class="text-xs text-black dark:text-stone-400 mt-0.5">实时基于具体考勤信息汇总周/月消课产值；收费充值与课消流水全链路留痕。</p>
          </div>

          <div class="flex items-center gap-2">
            <button @click="openRecharge({})" class="wf-btn-primary text-xs py-2 px-4 shadow-sm">
              <i class="fa-solid fa-plus-circle text-sm mr-1"></i>
              <span>录入学员收费充值</span>
            </button>
          </div>
        </div>

        <!-- 🌟 4 维核心财务 KPI 统计卡片 (统一标准高雅线框 · 纯粹协调) -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <!-- 1. 本月收费入账 -->
          <div @click="selectFinanceKpi('month')"
            class="wf-card-interactive p-5 space-y-2 transition flex flex-col justify-between"
            :class="financeActiveKpi === 'month' ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30' : ''">
            <div class="text-xs text-black dark:text-stone-400 flex items-center justify-between">
              <span class="font-bold text-black dark:text-stone-300">📅 本月收费入账</span>
              <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15"
                :class="financeActiveKpi === 'month' ? 'bg-emerald-400 text-black font-black border-transparent' : 'text-black dark:text-stone-400 bg-white/5'">
                {{ financeActiveKpi === 'month' ? '已下钻 ▾' : '当月实收 ↗' }}
              </span>
            </div>
            <div class="text-3xl font-black font-mono text-emerald-400">
              ¥ {{ financeStats.monthIncome.toLocaleString() }}
            </div>
            <div class="text-[11px] text-black dark:text-stone-400 font-mono flex items-center justify-between pt-2 border-t border-black/[0.06] dark:border-white/10">
              <span>当月入账 {{ financeStats.monthOrderCount }} 笔</span>
              <span class="text-[10px] text-emerald-400 font-bold hover:underline">查看明细 ↗</span>
            </div>
          </div>

          <!-- 2. 本年累计营收 -->
          <div @click="selectFinanceKpi('year')"
            class="wf-card-interactive p-5 space-y-2 transition flex flex-col justify-between"
            :class="financeActiveKpi === 'year' ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30' : ''">
            <div class="text-xs text-black dark:text-stone-400 flex items-center justify-between">
              <span class="font-bold text-black dark:text-stone-300">📈 本年累计营收</span>
              <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15"
                :class="financeActiveKpi === 'year' ? 'bg-emerald-400 text-black font-black border-transparent' : 'text-black dark:text-stone-400 bg-white/5'">
                {{ financeActiveKpi === 'year' ? '已下钻 ▾' : '年度拆解 ↗' }}
              </span>
            </div>
            <div class="text-3xl font-black font-mono text-black dark:text-stone-100">
              ¥ {{ financeStats.yearIncome.toLocaleString() }}
            </div>
            <div class="text-[11px] text-black dark:text-stone-400 font-mono flex items-center justify-between pt-2 border-t border-black/[0.06] dark:border-white/10">
              <span>本年累计 {{ financeStats.yearOrderCount }} 笔订单</span>
              <span class="text-[10px] text-black dark:text-stone-300 font-bold hover:underline">月度趋势 ↗</span>
            </div>
          </div>

          <!-- 3. 机构累计总营收 -->
          <div @click="selectFinanceKpi('total')"
            class="wf-card-interactive p-5 space-y-2 transition flex flex-col justify-between"
            :class="financeActiveKpi === 'total' ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30' : ''">
            <div class="text-xs text-black dark:text-stone-400 flex items-center justify-between">
              <span class="font-bold text-black dark:text-stone-300">💎 机构累计总营收</span>
              <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15"
                :class="financeActiveKpi === 'total' ? 'bg-emerald-400 text-black font-black border-transparent' : 'text-black dark:text-stone-400 bg-white/5'">
                {{ financeActiveKpi === 'total' ? '已下钻 ▾' : '历史总额 ↗' }}
              </span>
            </div>
            <div class="text-3xl font-black font-mono text-black dark:text-stone-100">
              ¥ {{ financeStats.totalIncome.toLocaleString() }}
            </div>
            <div class="text-[11px] text-black dark:text-stone-400 font-mono flex items-center justify-between pt-2 border-t border-black/[0.06] dark:border-white/10">
              <span>全校总消课 {{ consumptionSummaryKPI.totalAllConsumed }} 节</span>
              <span class="text-[10px] text-black dark:text-stone-300 font-bold hover:underline">历史总账 ↗</span>
            </div>
          </div>

          <!-- 4. 待续费预估收入 -->
          <div @click="selectFinanceKpi('renewal')"
            class="wf-card-interactive p-5 space-y-2 transition flex flex-col justify-between"
            :class="financeSubTab === 'renewal' || financeActiveKpi === 'renewal' ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30' : ''">
            <div class="text-xs text-black dark:text-stone-400 flex items-center justify-between">
              <span class="font-bold text-black dark:text-stone-300">⏳ 待续费预估收入</span>
              <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15"
                :class="financeSubTab === 'renewal' || financeActiveKpi === 'renewal' ? 'bg-amber-400 text-black font-black border-transparent' : 'text-black dark:text-stone-400 bg-white/5'">
                {{ financeSubTab === 'renewal' || financeActiveKpi === 'renewal' ? '已展开 ▾' : '需提醒 ↗' }}
              </span>
            </div>
            <div class="text-3xl font-black font-mono text-amber-400">
              ¥ {{ financeStats.potentialRenewalIncome.toLocaleString() }}
            </div>
            <div class="text-[11px] text-black dark:text-stone-400 font-mono flex items-center justify-between pt-2 border-t border-black/[0.06] dark:border-white/10">
              <span>共有 <strong class="text-amber-400">{{ financeStats.warningCount }}</strong> 位学员待续费</span>
              <span class="text-[10px] text-amber-400 font-bold hover:underline">查看名单 ↗</span>
            </div>
          </div>

        </div>

        <!-- 🌟 2级下钻展示区 A: 本年度各月度营收趋势卡片流 -->
        <div v-if="financeActiveKpi === 'year'" class="wf-card p-5 space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 class="font-bold text-sm flex items-center gap-2">
                <i class="fa-solid fa-chart-simple text-emerald-400"></i>
                <span>{{ financeStats.currentYear }} 年度月度营收与收费进度拆解</span>
              </h4>
              <p class="text-xs text-black dark:text-stone-400 mt-0.5">点击下方任意月份卡片，可直接快速过滤查看该月份的所有入账订单。</p>
            </div>

            <button @click="selectedBreakdownYM = ''" class="wf-btn-outline text-xs py-1 px-2.5">
              <span>显示全年全部订单</span>
            </button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div v-for="m in monthlyRevenueBreakdown" :key="m.ym"
              @click="filterByYM(m.ym)"
              :class="selectedBreakdownYM === m.ym ? 'border-emerald-400 bg-emerald-500/20 ring-1 ring-emerald-400' : 'hover:border-emerald-500/40'"
              class="wf-card p-3 cursor-pointer transition flex flex-col justify-between space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs font-mono">{{ m.ym }}</span>
                <span class="text-[10px] text-black dark:text-stone-400 font-mono">{{ m.count }}笔</span>
              </div>
              <div class="text-lg font-black font-mono text-emerald-400">
                ¥{{ (m.total || 0).toLocaleString() }}
              </div>
              <div class="w-full bg-black/20 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div class="bg-emerald-400 h-full rounded-full" :style="{ width: m.percent + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 🌟 2级下钻展示区 B: 历年年度对比总账 -->
        <div v-if="financeActiveKpi === 'total'" class="wf-card p-5 space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 class="font-bold text-sm flex items-center gap-2">
                <i class="fa-solid fa-gem text-amber-400"></i>
                <span>机构历年累计营收资产总账 ({{ yearlyRevenueHistory.length }} 年统计)</span>
              </h4>
              <p class="text-xs text-black dark:text-stone-400 mt-0.5">机构历年累计总收费、累计总消课课时与全校消课总产值沉淀。</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div v-for="y in yearlyRevenueHistory" :key="y.year"
              class="wf-card p-4 flex flex-col justify-between space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm font-mono text-black dark:text-stone-200">{{ y.year }} 年度</span>
                <span class="text-xs text-black dark:text-stone-400 font-mono">{{ y.count }} 笔订单</span>
              </div>
              <div class="text-2xl font-black font-mono text-emerald-400">
                ¥ {{ (y.total || 0).toLocaleString() }}
              </div>
              <div class="text-xs text-black dark:text-stone-400 font-mono flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10">
                <span>充值总课时: {{ y.hours }} 节</span>
                <span class="text-emerald-400">稳健增长</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 🌟 5 大财务子导航胶囊 (统一规范线框 · 纯粹协调) -->
        <div class="flex items-center justify-between gap-4 pb-2 border-b border-black/10 dark:border-white/10 flex-wrap">
          
          <div class="flex items-center gap-2 wf-pill-container">
            <!-- 1. 收费明细 -->
            <button @click="financeSubTab = 'orders'"
              :class="financeSubTab === 'orders' ? 'active' : ''"
              class="wf-pill-btn">
              <span>💳 学员收费明细 ({{ filteredPaymentOrders.length }}笔)</span>
            </button>

            <!-- 2. 教学课消统计 -->
            <button @click="financeSubTab = 'consumption'"
              :class="financeSubTab === 'consumption' ? 'active' : ''"
              class="wf-pill-btn">
              <span>📊 教学课消统计 (周/月/班级)</span>
            </button>

            <!-- 3. 待续费预警 -->
            <button @click="financeSubTab = 'renewal'"
              :class="financeSubTab === 'renewal' ? 'active' : ''"
              class="wf-pill-btn">
              <span>⏳ 待续费预警 ({{ renewalWarningStudents.length }}人)</span>
            </button>

            <!-- 4. 课时流水 -->
            <button @click="financeSubTab = 'hours'"
              :class="financeSubTab === 'hours' ? 'active' : ''"
              class="wf-pill-btn">
              <span>🧾 课时流水总账 ({{ hourLogs.length }}条)</span>
            </button>

            <!-- 5. 积分流水 -->
            <button @click="financeSubTab = 'points'"
              :class="financeSubTab === 'points' ? 'active' : ''"
              class="wf-pill-btn">
              <span>⭐ 积分礼物流水 ({{ pointLogs.length }}条)</span>
            </button>
          </div>

          <!-- 对应 Tab 导出入口 -->
          <div class="flex items-center gap-2">
            <button v-if="financeSubTab === 'orders'" @click="exportPaymentOrdersCSV" class="wf-btn-outline text-xs text-emerald-400 border-emerald-500/30">
              <i class="fa-solid fa-file-csv mr-1"></i>
              <span>导出收费明细 CSV</span>
            </button>
            <button v-if="financeSubTab === 'consumption'" @click="exportConsumptionReportCSV" class="wf-btn-outline text-xs text-emerald-400 border-emerald-500/30">
              <i class="fa-solid fa-file-csv mr-1"></i>
              <span>导出课消统计报表 CSV</span>
            </button>
            <button v-if="financeSubTab === 'renewal'" @click="exportRenewalWarningsCSV" class="wf-btn-outline text-xs text-amber-400 border-amber-500/30">
              <i class="fa-solid fa-file-csv mr-1"></i>
              <span>导出待续费清单 CSV</span>
            </button>
            <button v-if="financeSubTab === 'hours'" @click="exportHourLogsCSV" class="wf-btn-outline text-xs text-emerald-400 border-emerald-500/30">
              <i class="fa-solid fa-file-csv mr-1"></i>
              <span>导出课时流水 CSV</span>
            </button>
            <button v-if="financeSubTab === 'points'" @click="exportPointLogsCSV" class="wf-btn-outline text-xs text-amber-400 border-amber-500/30">
              <i class="fa-solid fa-file-csv mr-1"></i>
              <span>导出积分流水 CSV</span>
            </button>
          </div>

        </div>

        <!-- ======================================================== -->
        <!-- 🌟 子视图 1: 💳 学员收费明细 (订单总账) -->
        <!-- ======================================================== -->
        <div v-if="financeSubTab === 'orders'" class="space-y-4">
          
          <!-- 统一筛选控制栏 -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div class="flex items-center gap-3 flex-1 max-w-2xl flex-wrap">
              <div class="relative flex-1 min-w-[220px]">
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-xs"></i>
                <input v-model="financeSearchQuery" type="text" placeholder="搜索订单号 / 学员姓名 / 备注 / 经办人..."
                  class="w-full pl-9 pr-4 py-2 wf-input text-xs placeholder:text-black dark:text-stone-400">
              </div>

              <div class="relative">
                <select v-model="financePayMethodFilter" class="appearance-none pl-4 pr-8 py-2 wf-select text-xs font-bold cursor-pointer">
                  <option value="all">💳 全部支付方式</option>
                  <option value="微信支付">微信支付</option>
                  <option value="支付宝">支付宝</option>
                  <option value="现金">现金</option>
                  <option value="银行转账">银行转账</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-[10px] pointer-events-none"></i>
              </div>

              <!-- 当月/月份快速下钻标签 -->
              <span v-if="financeActiveKpi === 'month'" class="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span>📅 仅显示本月</span>
                <i @click="resetFinanceFilter" class="fa-solid fa-xmark cursor-pointer hover:text-white" title="清除筛选"></i>
              </span>

              <span v-if="selectedBreakdownYM" class="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span>月份: {{ selectedBreakdownYM }}</span>
                <i @click="selectedBreakdownYM = ''" class="fa-solid fa-xmark cursor-pointer hover:text-white" title="清除月份筛选"></i>
              </span>
            </div>

            <button @click="openRecharge({})" class="wf-btn-primary text-xs py-2 px-3.5 whitespace-nowrap">
              <i class="fa-solid fa-plus-circle text-xs mr-1"></i>
              <span>新收费录入</span>
            </button>
          </div>

          <!-- 收费订单明细大表 -->
          <div class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse select-none">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[130px]">订单编号</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[100px]">缴费时间</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[100px]">学员姓名</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[110px]">实收金额</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[100px]">充值课时</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[100px]">支付方式</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">经办老师</th>
                  <th class="py-3.5 px-4 min-w-[140px]">收费说明与备注</th>
                  <th class="py-3.5 px-4 text-right whitespace-nowrap min-w-[90px]">凭据</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                <tr v-for="order in filteredPaymentOrders" :key="order.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                  <td class="py-3 px-4 font-mono text-black dark:text-stone-400 text-xs whitespace-nowrap">{{ order.id }}</td>
                  <td class="py-3 px-4 font-mono text-black dark:text-stone-400 text-xs whitespace-nowrap">{{ order.payDate }}</td>
                  <td class="py-3 px-4 font-bold whitespace-nowrap">
                    <span @click="openStudentProfile(students.find(s => s.name === order.studentName) || { name: order.studentName })" 
                      class="cursor-pointer hover:text-emerald-400 transition" title="点击查看个人档案">
                      {{ order.studentName }} ↗
                    </span>
                  </td>
                  <td class="py-3 px-4 font-mono font-black text-sm text-emerald-400 whitespace-nowrap">
                    ¥ {{ (order.amount || 0).toLocaleString() }}
                  </td>
                  <td class="py-3 px-4 font-mono font-bold whitespace-nowrap">
                    <span>{{ order.hoursBought }} 节</span>
                    <span v-if="order.hoursGift > 0" class="text-amber-400 text-xs ml-1 font-normal">(赠{{ order.hoursGift }})</span>
                  </td>
                  <td class="py-3 px-4 whitespace-nowrap">
                    <span class="text-xs font-bold px-2 py-0.5 rounded border inline-block font-mono"
                      :class="order.payMethod === '微信支付' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : order.payMethod === '支付宝' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'">
                      {{ order.payMethod || '微信支付' }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-black dark:text-stone-400 text-xs whitespace-nowrap">{{ order.operator || '陈老师' }}</td>
                  <td class="py-3 px-4 text-black dark:text-stone-300 text-xs">{{ order.remark || '-' }}</td>
                  <td class="py-3 px-4 text-right whitespace-nowrap">
                    <button @click="openReceiptModal(order)" class="wf-btn-outline text-xs py-1 px-2.5 text-emerald-400 border-emerald-500/30">
                      <i class="fa-solid fa-receipt mr-1"></i>
                      <span>电子收据</span>
                    </button>
                  </td>
                </tr>

                <tr v-if="filteredPaymentOrders.length === 0">
                  <td colspan="9" class="py-16 text-center text-black dark:text-stone-400 text-xs">
                    未检索到符合条件的学员缴费收费订单，点击上方【清除筛选】或切换月份
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <!-- ======================================================== -->
        <!-- 🌟 子视图 2: 📊 教学课消统计 (周/月/班级具体考勤课消) -->
        <!-- ======================================================== -->
        <div v-if="financeSubTab === 'consumption'" class="space-y-6">
          
          <!-- 4 维课消看板 KPI (统一标准卡片排版) -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <!-- 本周教学消课 -->
            <div @click="consumptionPeriodType = 'week'" class="wf-card-interactive p-4 space-y-1.5 transition flex flex-col justify-between"
              :class="consumptionPeriodType === 'week' ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30' : ''">
              <div class="text-xs text-black dark:text-stone-400 flex items-center justify-between">
                <span class="font-bold text-black dark:text-stone-300">📅 本周教学消课</span>
                <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15"
                  :class="consumptionPeriodType === 'week' ? 'bg-emerald-400 text-black font-black border-transparent' : 'text-black dark:text-stone-400 bg-white/5'">周度</span>
              </div>
              <div class="text-2xl font-black font-mono text-emerald-400">
                {{ consumptionSummaryKPI.thisWeekConsumed }} <span class="text-xs font-normal text-black dark:text-stone-400">节课时</span>
              </div>
              <div class="text-[11px] text-black dark:text-stone-400 flex items-center justify-between pt-1 border-t border-black/[0.06] dark:border-white/10">
                <span>完成 {{ consumptionSummaryKPI.thisWeekSessions }} 堂课</span>
                <span class="font-mono text-emerald-400 font-bold">出勤率 {{ consumptionSummaryKPI.thisWeekRate }}</span>
              </div>
            </div>

            <!-- 本月累计消课 -->
            <div @click="consumptionPeriodType = 'month'" class="wf-card-interactive p-4 space-y-1.5 transition flex flex-col justify-between"
              :class="consumptionPeriodType === 'month' ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30' : ''">
              <div class="text-xs text-black dark:text-stone-400 flex items-center justify-between">
                <span class="font-bold text-black dark:text-stone-300">🗓️ 本月累计消课</span>
                <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15"
                  :class="consumptionPeriodType === 'month' ? 'bg-emerald-400 text-black font-black border-transparent' : 'text-black dark:text-stone-400 bg-white/5'">月度</span>
              </div>
              <div class="text-2xl font-black font-mono text-emerald-400">
                {{ consumptionSummaryKPI.thisMonthConsumed }} <span class="text-xs font-normal text-black dark:text-stone-400">节课时</span>
              </div>
              <div class="text-[11px] text-black dark:text-stone-400 flex items-center justify-between pt-1 border-t border-black/[0.06] dark:border-white/10">
                <span>完成 {{ consumptionSummaryKPI.thisMonthSessions }} 堂课</span>
                <span class="font-mono text-emerald-400 font-bold">出勤率 {{ consumptionSummaryKPI.thisMonthRate }}</span>
              </div>
            </div>

            <!-- 当月消课教学价值 -->
            <div class="wf-card p-4 space-y-1.5 flex flex-col justify-between">
              <div class="text-xs text-black dark:text-stone-400 flex items-center justify-between">
                <span class="font-bold text-black dark:text-stone-300">💎 当月消课教学价值</span>
                <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15 text-black dark:text-stone-400 bg-white/5">产值折算</span>
              </div>
              <div class="text-2xl font-black font-mono text-amber-400">
                ¥ {{ consumptionSummaryKPI.thisMonthValue.toLocaleString() }}
              </div>
              <div class="text-[11px] text-black dark:text-stone-400 pt-1 border-t border-black/[0.06] dark:border-white/10 font-mono">
                按行业标准课消价值估算
              </div>
            </div>

            <!-- 机构累计总消课 -->
            <div class="wf-card p-4 space-y-1.5 flex flex-col justify-between">
              <div class="text-xs text-black dark:text-stone-400 flex items-center justify-between">
                <span class="font-bold text-black dark:text-stone-300">📈 机构累计总消课</span>
                <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15 text-black dark:text-stone-400 bg-white/5">总览</span>
              </div>
              <div class="text-2xl font-black font-mono text-black dark:text-stone-100">
                {{ consumptionSummaryKPI.totalAllConsumed }} <span class="text-xs font-normal text-black dark:text-stone-400">节</span>
              </div>
              <div class="text-[11px] text-black dark:text-stone-400 flex items-center justify-between pt-1 border-t border-black/[0.06] dark:border-white/10 font-mono">
                <span>总到课 {{ consumptionSummaryKPI.totalAllPresentCount }} 人次</span>
                <span class="text-black dark:text-stone-300">总出勤 {{ consumptionSummaryKPI.totalAllRate }}</span>
              </div>
            </div>

          </div>

          <!-- 4 大课消下钻分析维度切换子药丸 (统一标准 wf-pill) -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/10 dark:border-white/10 flex-wrap">
            <div class="flex items-center gap-2 wf-pill-container">
              <button @click="consumptionPeriodType = 'month'"
                :class="consumptionPeriodType === 'month' ? 'active' : ''"
                class="wf-pill-btn">
                <span>🗓️ 按月度统计 ({{ monthlyConsumptionList.length }}个月)</span>
              </button>

              <button @click="consumptionPeriodType = 'week'"
                :class="consumptionPeriodType === 'week' ? 'active' : ''"
                class="wf-pill-btn">
                <span>📅 按周度统计 ({{ weeklyConsumptionList.length }}周)</span>
              </button>

              <button @click="consumptionPeriodType = 'class'"
                :class="consumptionPeriodType === 'class' ? 'active' : ''"
                class="wf-pill-btn">
                <span>🎨 按班级横向汇总</span>
              </button>

              <button @click="consumptionPeriodType = 'student'"
                :class="consumptionPeriodType === 'student' ? 'active' : ''"
                class="wf-pill-btn">
                <span>👶 学员个人消课总榜</span>
              </button>
            </div>

            <!-- 月份与班级组合筛选 (统一标准 wf-select) -->
            <div class="flex items-center gap-2 flex-wrap">
              <div class="relative">
                <select v-model="consumptionClassFilter" class="appearance-none pl-4 pr-8 py-2 wf-select text-xs font-bold cursor-pointer">
                  <option value="all">🌈 全部班级课消</option>
                  <option v-for="c in activeClasses" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-[10px] pointer-events-none"></i>
              </div>

              <div class="relative">
                <select v-model="consumptionSelectedMonth" class="appearance-none pl-4 pr-8 py-2 wf-select text-xs font-bold cursor-pointer font-mono">
                  <option v-for="m in availableMonths" :key="m" :value="m">{{ m }} 月度</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-[10px] pointer-events-none"></i>
              </div>
            </div>
          </div>

          <!-- 维度 1: 🗓️ 月度课消汇总明细 -->
          <div v-if="consumptionPeriodType === 'month'" class="space-y-4">
            <div class="overflow-x-auto w-full wf-card">
              <table class="w-full text-left text-xs sm:text-sm border-collapse select-none">
                <thead>
                  <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[120px]">统计月份</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[100px]">总消课课时</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">授课堂数</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">应到人次</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">实到人次</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">请假人次</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">月度出勤率</th>
                    <th class="py-3.5 px-4 text-right whitespace-nowrap min-w-[100px]">折算教学产值</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                  <template v-for="m in monthlyConsumptionList" :key="m.monthKey">
                    <tr class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition cursor-pointer" @click="m.expanded = !m.expanded">
                      <td class="py-3 px-4 font-bold font-mono text-sm text-black dark:text-stone-100 flex items-center gap-2">
                        <i :class="m.expanded ? 'fa-chevron-down' : 'fa-chevron-right'" class="fa-solid text-[9px] text-black dark:text-stone-400"></i>
                        <span>{{ m.monthLabel }}</span>
                        <span v-if="m.monthKey === currentYearMonth" class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-normal">当月</span>
                      </td>
                      <td class="py-3 px-4 font-mono font-black text-sm text-emerald-400">
                        {{ m.consumedHours }} 节
                      </td>
                      <td class="py-3 px-4 font-mono text-black dark:text-stone-300">{{ m.sessionCount }} 堂</td>
                      <td class="py-3 px-4 font-mono text-black dark:text-stone-400">{{ m.totalHeadcount }} 人次</td>
                      <td class="py-3 px-4 font-mono text-[#10E57A] font-bold">{{ m.presentCount }} 人次</td>
                      <td class="py-3 px-4 font-mono text-rose-400">{{ m.leaveCount }} 人次</td>
                      <td class="py-3 px-4 font-mono font-bold text-black dark:text-stone-200">{{ m.attendanceRate }}</td>
                      <td class="py-3 px-4 font-mono font-black text-sm text-amber-400 text-right">
                        ¥ {{ (m.estimatedValue || 0).toLocaleString() }}
                      </td>
                    </tr>

                    <!-- 月度下各班级课消展开明细 -->
                    <tr v-if="m.expanded" class="bg-black/[0.03] dark:bg-white/[0.02]">
                      <td colspan="8" class="p-3 pl-8">
                        <div class="border-l-2 border-emerald-500/40 pl-3 space-y-1.5">
                          <div class="text-[11px] text-black dark:text-stone-400 font-bold mb-1">【{{ m.monthLabel }}】各班级具体消课明细：</div>
                          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            <div v-for="cItem in (m.sessions || [])" :key="cItem.id"
                              class="p-2.5 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-between text-xs" style="background-color: var(--bg-surface);">
                              <div>
                                <div class="font-bold text-black dark:text-stone-200">{{ cItem.theme }}</div>
                                <div class="text-[10px] text-black dark:text-stone-400 font-mono mt-0.5">{{ cItem.className }} · {{ cItem.date }}</div>
                              </div>
                              <div class="text-right font-mono">
                                <div class="font-bold text-emerald-400">{{ cItem.consumedHours }} 节</div>
                                <div class="text-[10px] text-black dark:text-stone-400">到课 {{ cItem.presentCount }} 人</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>

                  <tr v-if="monthlyConsumptionList.length === 0">
                    <td colspan="8" class="py-16 text-center text-black dark:text-stone-400 text-xs">
                      暂无符合条件的月度课消考勤数据
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 维度 2: 📅 周度课消汇总明细 -->
          <div v-if="consumptionPeriodType === 'week'" class="space-y-4">
            <div class="overflow-x-auto w-full wf-card">
              <table class="w-full text-left text-xs sm:text-sm border-collapse select-none">
                <thead>
                  <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[160px]">周度区间</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[100px]">周消课课时</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">排课堂数</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">实到人次</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">请假人次</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">周出勤率</th>
                    <th class="py-3.5 px-4 text-right whitespace-nowrap min-w-[100px]">周产值估算</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                  <template v-for="w in weeklyConsumptionList" :key="w.weekKey">
                    <tr class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition cursor-pointer" @click="w.expanded = !w.expanded">
                      <td class="py-3 px-4 font-bold font-mono text-black dark:text-stone-100 flex items-center gap-2">
                        <i :class="w.expanded ? 'fa-chevron-down' : 'fa-chevron-right'" class="fa-solid text-[9px] text-black dark:text-stone-400"></i>
                        <span>{{ w.weekLabel }}</span>
                      </td>
                      <td class="py-3 px-4 font-mono font-black text-sm text-emerald-400">
                        {{ w.consumedHours }} 节
                      </td>
                      <td class="py-3 px-4 font-mono text-black dark:text-stone-300">{{ w.sessionCount }} 堂</td>
                      <td class="py-3 px-4 font-mono text-[#10E57A] font-bold">{{ w.presentCount }} 人次</td>
                      <td class="py-3 px-4 font-mono text-rose-400">{{ w.leaveCount }} 人次</td>
                      <td class="py-3 px-4 font-mono font-bold text-black dark:text-stone-200">{{ w.attendanceRate }}</td>
                      <td class="py-3 px-4 font-mono font-black text-sm text-amber-400 text-right">
                        ¥ {{ (w.estimatedValue || 0).toLocaleString() }}
                      </td>
                    </tr>

                    <!-- 周度下具体课次明细 -->
                    <tr v-if="w.expanded" class="bg-black/[0.03] dark:bg-white/[0.02]">
                      <td colspan="7" class="p-3 pl-8">
                        <div class="border-l-2 border-emerald-500/40 pl-3 space-y-1.5">
                          <div class="text-[11px] text-black dark:text-stone-400 font-bold mb-1">【{{ w.weekLabel }}】具体授课考勤明细：</div>
                          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            <div v-for="sess in (w.sessions || [])" :key="sess.id"
                              class="p-2.5 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-between text-xs" style="background-color: var(--bg-surface);">
                              <div>
                                <div class="font-bold text-black dark:text-stone-200 flex items-center gap-1">
                                  <span>{{ sess.theme }}</span>
                                  <span class="text-[10px] text-black dark:text-stone-400 font-normal">({{ sess.className }})</span>
                                </div>
                                <div class="text-[10px] text-black dark:text-stone-400 font-mono mt-0.5">{{ sess.date }} · {{ sess.teacher }}</div>
                              </div>
                              <div class="text-right font-mono">
                                <div class="font-bold text-emerald-400">{{ sess.consumedHours }} 节 (到课{{ sess.presentCount }}人)</div>
                                <div v-if="sess.absentCount > 0" class="text-[10px] text-rose-400">{{ sess.absentCount }} 人请假</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>

                  <tr v-if="weeklyConsumptionList.length === 0">
                    <td colspan="7" class="py-16 text-center text-black dark:text-stone-400 text-xs">
                      暂无符合条件的周度课消数据
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 维度 3: 🎨 班级横向消课汇总明细 -->
          <div v-if="consumptionPeriodType === 'class'" class="space-y-4">
            <div class="overflow-x-auto w-full wf-card">
              <table class="w-full text-left text-xs sm:text-sm border-collapse select-none">
                <thead>
                  <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[180px]">班级名称</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[120px]">上课时段</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[80px]">任课老师</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">在读人数</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[100px]">累计总消课</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">完成课次</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">出勤率</th>
                    <th class="py-3.5 px-4 text-right whitespace-nowrap min-w-[110px]">估算教学产值</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                  <tr v-for="c in classConsumptionAnalytics" :key="c.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                    <td class="py-3 px-4 font-bold whitespace-nowrap">
                      <span @click="openClassDetail(c)" class="cursor-pointer hover:text-emerald-400 transition flex items-center gap-1" title="进入该班级二级主页">
                        <span>{{ c.name }}</span>
                        <i class="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-0 group-hover:opacity-100 text-emerald-400"></i>
                      </span>
                    </td>
                    <td class="py-3 px-4 font-mono text-black dark:text-stone-400 text-xs whitespace-nowrap">{{ c.schedule }}</td>
                    <td class="py-3 px-4 text-black dark:text-stone-300 whitespace-nowrap">{{ c.teacher }}</td>
                    <td class="py-3 px-4 font-mono text-black dark:text-stone-300 whitespace-nowrap">{{ c.studentCount }} 人</td>
                    <td class="py-3 px-4 font-mono font-black text-sm text-emerald-400 whitespace-nowrap">
                      {{ c.totalConsumed }} 节
                    </td>
                    <td class="py-3 px-4 font-mono text-black dark:text-stone-300 whitespace-nowrap">{{ c.totalSessions }} 堂</td>
                    <td class="py-3 px-4 font-mono font-bold text-[#10E57A] whitespace-nowrap">{{ c.attendanceRate }}</td>
                    <td class="py-3 px-4 font-mono font-black text-sm text-amber-400 text-right whitespace-nowrap">
                      ¥ {{ (c.estimatedValue || 0).toLocaleString() }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 维度 4: 👶 学员个人消课总榜 -->
          <div v-if="consumptionPeriodType === 'student'" class="space-y-4">
            <div class="overflow-x-auto w-full wf-card">
              <table class="w-full text-left text-xs sm:text-sm border-collapse select-none">
                <thead>
                  <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[120px]">学员姓名</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[180px]">所在班级</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[100px]">累计消课</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[80px]">到课次数</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[80px]">请假次数</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">个人出勤率</th>
                    <th class="py-3.5 px-4 whitespace-nowrap min-w-[100px]">出勤表现</th>
                    <th class="py-3.5 px-4 text-right whitespace-nowrap min-w-[100px]">快捷操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                  <tr v-for="s in studentConsumptionRanking" :key="s.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                    <td class="py-3 px-4 font-bold cursor-pointer group whitespace-nowrap" @click="openStudentProfile(s)">
                      <span class="group-hover:text-emerald-400 transition">{{ s.name }} ↗</span>
                    </td>
                    <td class="py-3 px-4 text-black dark:text-stone-400 whitespace-nowrap">{{ s.className }}</td>
                    <td class="py-3 px-4 font-mono font-black text-sm text-emerald-400 whitespace-nowrap">
                      {{ s.totalConsumed }} 节
                    </td>
                    <td class="py-3 px-4 font-mono font-bold text-black dark:text-stone-200 whitespace-nowrap">{{ s.presentCount }} 次</td>
                    <td class="py-3 px-4 font-mono font-bold text-rose-400 whitespace-nowrap">{{ s.leaveCount }} 次</td>
                    <td class="py-3 px-4 font-mono font-bold text-[#10E57A] whitespace-nowrap">{{ s.attendanceRate }}</td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      <span class="text-xs font-bold px-2.5 py-0.5 rounded border inline-block"
                        :class="s.leaveCount >= 2 ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'">
                        {{ s.statusTag }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right whitespace-nowrap">
                      <button @click="openStudentProfile(s)" class="text-xs text-black dark:text-stone-400 hover:text-emerald-400 font-medium">查看档案 ↗</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- ======================================================== -->
        <!-- 🌟 子视图 3: ⏳ 待续费预警学员清单 (统一规范高雅线框结构) -->
        <!-- ======================================================== -->
        <div v-if="financeSubTab === 'renewal'" class="space-y-4">
          
          <!-- 统一筛选与概览栏 -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div class="flex items-center gap-3">
              <div class="text-xs text-black dark:text-stone-400 font-mono">
                待续费预警共 <strong class="text-amber-400 font-bold text-sm">{{ renewalWarningStudents.length }}</strong> 人 · 预估待入账 <strong class="text-emerald-400 font-bold text-sm">¥{{ (financeStats.potentialRenewalIncome || 0).toLocaleString() }}</strong>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button @click="exportRenewalWarningsCSV" class="wf-btn-outline text-xs text-amber-400 border-amber-500/30">
                <i class="fa-solid fa-file-csv mr-1"></i>
                <span>导出待续费清单 CSV</span>
              </button>
            </div>
          </div>

          <div class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse select-none">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[120px]">学员姓名</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[180px]">所在班级</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">剩余课时</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">预警状态</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[150px]">家长联系方式</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[130px]">推荐续费课包</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[110px]">预估续费金额</th>
                  <th class="py-3.5 px-4 text-right whitespace-nowrap min-w-[130px]">快捷操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                <tr v-for="stu in renewalWarningStudents" :key="stu.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                  <td class="py-3 px-4 font-bold cursor-pointer group whitespace-nowrap" @click="openStudentProfile(stu)" title="点击查看档案">
                    <div class="flex items-center gap-2 whitespace-nowrap">
                      <div class="w-6 h-6 rounded-md border border-black/10 dark:border-white/20 flex items-center justify-center font-bold text-xs group-hover:border-emerald-400 transition" style="background-color: var(--bg-surface-hover);">
                        {{ stu.name.charAt(0) }}
                      </div>
                      <span class="group-hover:text-emerald-400 transition flex items-center gap-1 font-bold">
                        <span>{{ stu.name }}</span>
                        <i class="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-0 group-hover:opacity-100 text-emerald-400"></i>
                      </span>
                    </div>
                  </td>

                  <td class="py-3 px-4 text-black dark:text-stone-400 whitespace-nowrap">{{ stu.className }}</td>
                  <td class="py-3 px-4 font-black font-mono text-sm whitespace-nowrap"
                    :class="stu.remainHours <= 0 ? 'text-rose-400' : 'text-amber-400'">
                    {{ stu.remainHours }} 节
                  </td>

                  <td class="py-3 px-4 whitespace-nowrap">
                    <span class="text-xs font-bold px-2 py-0.5 rounded border inline-block"
                      :class="stu.remainHours <= 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'">
                      {{ stu.urgencyText }}
                    </span>
                  </td>

                  <td class="py-3 px-4 font-mono text-black dark:text-stone-300 whitespace-nowrap">
                    {{ stu.parentName }} ({{ stu.parentPhone }})
                  </td>

                  <td class="py-3 px-4 text-black dark:text-stone-400 text-xs whitespace-nowrap">
                    {{ stu.suggestedPackage }}
                  </td>

                  <td class="py-3 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                    ¥ {{ stu.estimatedAmount.toLocaleString() }}
                  </td>

                  <td class="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                    <button @click="openRecharge(stu)" class="wf-btn-primary text-xs py-1 px-2.5">
                      <span>录入续费</span>
                    </button>
                    <button @click="openStudentProfile(stu)" class="text-xs text-black dark:text-stone-400 hover:text-emerald-400 font-medium">
                      档案 ↗
                    </button>
                  </td>
                </tr>

                <tr v-if="renewalWarningStudents.length === 0">
                  <td colspan="8" class="py-16 text-center text-black dark:text-stone-400 text-xs">
                    太棒了！当前全校所有在读学员课时充足，暂无临期或耗尽学员。
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <!-- ======================================================== -->
        <!-- 🌟 子视图 4: 🧾 课时消课变动总账 -->
        <!-- ======================================================== -->
        <div v-if="financeSubTab === 'hours'" class="space-y-4">
          
          <!-- 统一筛选控制栏 -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div class="flex items-center gap-3 flex-1 max-w-xl">
              <div class="relative flex-1 min-w-[200px]">
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-xs"></i>
                <input v-model="recordsSearchQuery" type="text" placeholder="搜索学员姓名 / 课程主题 / 经办人..."
                  class="w-full pl-9 pr-4 py-2 wf-input text-xs placeholder:text-black dark:text-stone-400">
              </div>

              <div class="relative">
                <select v-model="recordsHourTypeFilter" class="appearance-none pl-4 pr-8 py-2 wf-select text-xs font-bold cursor-pointer">
                  <option value="all">⚡ 全部变动类型</option>
                  <option value="大表考勤消课">大表考勤消课</option>
                  <option value="补课单独消课">补课单独消课</option>
                  <option value="续费充值入账">续费充值入账</option>
                  <option value="考勤撤销返还">考勤撤销返还</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-[10px] pointer-events-none"></i>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse select-none">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[130px]">记账时间</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[100px]">学员姓名</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[110px]">变动类型</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">课时变动</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">变动后结余</th>
                  <th class="py-3.5 px-4 min-w-[150px]">详细业务说明</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">经办老师</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                <tr v-for="log in filteredHourLogs" :key="log.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                  <td class="py-3 px-4 font-mono text-black dark:text-stone-400 text-xs whitespace-nowrap">{{ log.time }}</td>
                  <td class="py-3 px-4 font-bold whitespace-nowrap">
                    <span @click="openStudentProfile(students.find(s => s.name === log.studentName) || { name: log.studentName })" 
                      class="cursor-pointer hover:text-emerald-400 transition" title="点击查看档案">
                      {{ log.studentName }} ↗
                    </span>
                  </td>
                  <td class="py-3 px-4 whitespace-nowrap">
                    <span class="text-xs font-bold px-2 py-0.5 rounded border inline-block"
                      :class="log.change > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : log.change < 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'">
                      {{ log.type }}
                    </span>
                  </td>
                  <td class="py-3 px-4 font-mono font-black text-sm whitespace-nowrap"
                    :class="log.change > 0 ? 'text-[#10E57A]' : log.change < 0 ? 'text-rose-400' : 'text-black dark:text-stone-400'">
                    {{ log.change > 0 ? '+' + log.change : log.change === 0 ? '0' : log.change }} 节
                  </td>
                  <td class="py-3 px-4 font-mono font-bold text-black dark:text-stone-300 whitespace-nowrap">{{ log.balanceAfter }} 节</td>
                  <td class="py-3 px-4 text-black dark:text-stone-300 text-xs">{{ log.relatedInfo }}</td>
                  <td class="py-3 px-4 text-black dark:text-stone-400 text-xs whitespace-nowrap font-medium">{{ log.operator || '陈老师' }}</td>
                </tr>

                <tr v-if="filteredHourLogs.length === 0">
                  <td colspan="7" class="py-12 text-center text-black dark:text-stone-400 text-xs">
                    未检索到符合条件的课时流水记录
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <!-- ======================================================== -->
        <!-- 🌟 子视图 5: ⭐ 积分奖励与礼物流水 -->
        <!-- ======================================================== -->
        <div v-if="financeSubTab === 'points'" class="space-y-4">
          
          <!-- 统一筛选控制栏 -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div class="flex items-center gap-3 flex-1 max-w-xl">
              <div class="relative flex-1 min-w-[200px]">
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-xs"></i>
                <input v-model="recordsSearchQuery" type="text" placeholder="搜索学员姓名 / 原因 / 礼物名称..."
                  class="w-full pl-9 pr-4 py-2 wf-input text-xs placeholder:text-black dark:text-stone-400">
              </div>

              <div class="relative">
                <select v-model="recordsPointTypeFilter" class="appearance-none pl-4 pr-8 py-2 wf-select text-xs font-bold cursor-pointer">
                  <option value="all">⭐ 全部变动类型</option>
                  <option value="个人积分奖励">个人积分奖励</option>
                  <option value="全班积分奖励">全班积分奖励</option>
                  <option value="积分违纪扣除">积分违纪扣除</option>
                  <option value="积分直接校准">积分直接校准</option>
                  <option value="礼物兑换">礼物兑换</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-black dark:text-stone-400 text-[10px] pointer-events-none"></i>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse select-none">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-black dark:text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[130px]">记账时间</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[100px]">学员姓名</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[110px]">变动类型</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">画币变动</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">变动后可用</th>
                  <th class="py-3.5 px-4 min-w-[150px]">奖励原因与礼物明细</th>
                  <th class="py-3.5 px-4 whitespace-nowrap min-w-[90px]">经办老师</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/[0.06] dark:divide-white/10">
                <tr v-for="plog in filteredPointLogs" :key="plog.id" class="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                  <td class="py-3 px-4 font-mono text-black dark:text-stone-400 text-xs whitespace-nowrap">{{ plog.time }}</td>
                  <td class="py-3 px-4 font-bold whitespace-nowrap">
                    <span @click="openStudentProfile(students.find(s => s.name === plog.studentName) || { name: plog.studentName })" 
                      class="cursor-pointer hover:text-emerald-400 transition" title="点击查看档案">
                      {{ plog.studentName }} ↗
                    </span>
                  </td>
                  <td class="py-3 px-4 whitespace-nowrap">
                    <span class="text-xs font-bold px-2 py-0.5 rounded border inline-block"
                      :class="plog.points > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'">
                      {{ plog.type }}
                    </span>
                  </td>
                  <td class="py-3 px-4 font-mono font-black text-sm whitespace-nowrap"
                    :class="plog.points > 0 ? 'text-amber-400' : 'text-purple-400'">
                    {{ plog.points > 0 ? '+' + plog.points : plog.points }} 分
                  </td>
                  <td class="py-3 px-4 font-mono font-bold text-amber-300 whitespace-nowrap">
                    ⭐ {{ plog.balanceAfter }} 分
                  </td>
                  <td class="py-3 px-4 text-black dark:text-stone-300 text-xs">{{ plog.reason }}</td>
                  <td class="py-3 px-4 text-black dark:text-stone-400 text-xs whitespace-nowrap font-medium">{{ plog.operator || '陈老师' }}</td>
                </tr>

                <tr v-if="filteredPointLogs.length === 0">
                  <td colspan="7" class="py-12 text-center text-black dark:text-stone-400 text-xs">
                    未检索到符合条件的积分流水记录
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

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
            <button @click="exportStudentAttendanceCSV(profileStudent)" class="wf-btn-outline text-xs py-1.5 px-2.5 text-emerald-400" title="导出个人考勤档案 CSV">
              <i class="fa-solid fa-file-csv"></i>
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

          <button v-if="profileSubTab === 'attendance'" @click="exportStudentAttendanceCSV(profileStudent)" class="wf-btn-outline text-xs text-emerald-400 border-emerald-500/30">
            <i class="fa-solid fa-file-csv mr-1"></i>
            <span>导出个人考勤表 CSV</span>
          </button>
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
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">上课日期 *</label>
            <input v-model="editingAttendanceForm.rawDate" type="date" class="w-full px-3 py-2 wf-input font-mono font-bold">
            <div class="text-[11px] text-black dark:text-stone-400 font-mono mt-1">
              保存后将格式化为：<strong class="text-emerald-400">{{ formatChineseDateWithWeekday(editingAttendanceForm.rawDate) }}</strong>
            </div>
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
    <div v-if="showReceiptModal && selectedReceiptOrder" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
      <div class="wf-card p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
        
        <div class="flex items-start justify-between border-b border-black/10 dark:border-white/10 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl">
              🍐
            </div>
            <div>
              <h3 class="font-black text-base">想吃梨儿童美术 · 学员缴费电子收据</h3>
              <p class="text-xs text-black dark:text-stone-400 font-mono mt-0.5">凭据单号：{{ selectedReceiptOrder.id }}</p>
            </div>
          </div>
          <button @click="showReceiptModal = false" class="text-black dark:text-stone-400 hover:text-white p-1">
            <i class="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        <div class="space-y-4 text-xs">
          
          <div class="grid grid-cols-2 gap-4 p-4 rounded-xl border border-black/10 dark:border-white/10" style="background-color: var(--bg-surface-subtle);">
            <div>
              <span class="text-black dark:text-stone-400 block mb-1">交费学员</span>
              <strong class="text-base font-black text-black dark:text-stone-100">{{ selectedReceiptOrder.studentName }}</strong>
            </div>
            <div>
              <span class="text-black dark:text-stone-400 block mb-1">缴费实收金额</span>
              <strong class="text-xl font-black font-mono text-emerald-400">¥ {{ (selectedReceiptOrder.amount || 0).toLocaleString() }}</strong>
            </div>
          </div>

          <div class="space-y-2 border-b border-black/10 dark:border-white/10 pb-4">
            <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
              <span class="text-black dark:text-stone-400">充值课时数</span>
              <span class="font-mono font-bold">{{ selectedReceiptOrder.hoursBought }} 节</span>
            </div>
            <div v-if="selectedReceiptOrder.hoursGift > 0" class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
              <span class="text-black dark:text-stone-400">机构赠送课时</span>
              <span class="font-mono font-bold text-amber-400">+{{ selectedReceiptOrder.hoursGift }} 节</span>
            </div>
            <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
              <span class="text-black dark:text-stone-400">支付结算方式</span>
              <span class="font-bold">{{ selectedReceiptOrder.payMethod }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
              <span class="text-black dark:text-stone-400">经办老师</span>
              <span>{{ selectedReceiptOrder.operator || '陈老师' }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
              <span class="text-black dark:text-stone-400">交费日期</span>
              <span class="font-mono">{{ selectedReceiptOrder.payDate }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-black dark:text-stone-400">备注说明</span>
              <span class="text-black dark:text-stone-300">{{ selectedReceiptOrder.remark || '正常续费充值' }}</span>
            </div>
          </div>

          <div class="text-[11px] text-black dark:text-stone-400 italic text-center">
            本收据由【想吃梨儿童美术教务系统】自动记账生成，所有消课与积分明细均可随时在线核验。
          </div>

        </div>

        <div class="pt-2 flex gap-3">
          <button @click="showReceiptModal = false" class="wf-btn-outline flex-1 py-2 justify-center">
            关闭凭据
          </button>
          <button onclick="window.print()" class="wf-btn-primary flex-1 py-2 justify-center">
            <i class="fa-solid fa-print mr-1.5"></i>
            <span>打印 / 存为 PDF</span>
          </button>
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
    <div v-if="showRechargeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="wf-card p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
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
    <div v-if="showCellEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="wf-card p-6 max-w-sm w-full space-y-4 shadow-2xl">
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
            <label class="block text-black dark:text-stone-400 mb-1 font-semibold">填写课堂表现或请假原因备注</label>
            <textarea v-model="editingCell.note" rows="3" placeholder="例: 表现非常积极，色彩搭配有创意..." class="w-full px-3 py-2 wf-input"></textarea>
          </div>
        </div>

        <div class="pt-2 flex gap-2">
          <button @click="showCellEditModal = false" class="wf-btn-outline flex-1 py-2 justify-center">取消</button>
          <button @click="submitCellEdit" class="wf-btn-primary flex-1 py-2 justify-center">保存备注</button>
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
    // Supabase 云端同步与 LocalStorage 降级双缓冲机制
    // ----------------------------------------------------
    const syncStatus = ref('connected'); // 'connected' | 'syncing' | 'offline'

    const loadData = async () => {
      // 1. 先从本地缓存极速渲染
      try {
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          studioInfo.value = parsed.studioInfo || DEFAULT_INITIAL_DATA.studioInfo;
          classes.value = parsed.classes || DEFAULT_INITIAL_DATA.classes;
          students.value = parsed.students || DEFAULT_INITIAL_DATA.students;
          attendanceHistory.value = parsed.attendanceHistory || DEFAULT_INITIAL_DATA.attendanceHistory || [];
          hourLogs.value = parsed.hourLogs || DEFAULT_INITIAL_DATA.hourLogs || [];
          paymentOrders.value = parsed.paymentOrders || DEFAULT_INITIAL_DATA.paymentOrders || [];
          pointRewardOptions.value = parsed.pointRewardOptions || DEFAULT_INITIAL_DATA.pointRewardOptions || [];
          pointPrizes.value = parsed.pointPrizes || DEFAULT_INITIAL_DATA.pointPrizes || [];
          pointLogs.value = parsed.pointLogs || DEFAULT_INITIAL_DATA.pointLogs || [];
        } else {
          studioInfo.value = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DATA.studioInfo));
          classes.value = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DATA.classes));
          students.value = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DATA.students));
          attendanceHistory.value = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DATA.attendanceHistory || []));
          hourLogs.value = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DATA.hourLogs || []));
          paymentOrders.value = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DATA.paymentOrders || []));
          pointRewardOptions.value = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DATA.pointRewardOptions || []));
          pointPrizes.value = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DATA.pointPrizes || []));
          pointLogs.value = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DATA.pointLogs || []));
        }
      } catch (err) {
        console.warn('本地缓存解析失败，加载初始默认数据', err);
      }

      // 2. 从 Supabase 云端拉取最新数据
      if (!supabase) return;
      try {
        syncStatus.value = 'syncing';
        const [
          { data: studio, error: errStudio },
          { data: cls, error: errCls },
          { data: stu, error: errStu },
          { data: att, error: errAtt },
          { data: fin, error: errFin },
          { data: prz, error: errPrz },
          { data: plog, error: errPlog },
          { data: popt, error: errPopt }
        ] = await Promise.all([
          supabase.from('studio_info').select('*'),
          supabase.from('classes').select('*'),
          supabase.from('students').select('*'),
          supabase.from('attendance_records').select('*'),
          supabase.from('finance_logs').select('*'),
          supabase.from('point_prizes').select('*'),
          supabase.from('point_logs').select('*'),
          supabase.from('point_reward_options').select('*')
        ]);

        // 如果数据库完全为空，执行首次自动种子数据注入
        if (!studio || studio.length === 0) {
          console.log('初始化空白画室基本资料...');
          await supabase.from('studio_info').insert([{ id: '00000000-0000-0000-0000-000000000000', ...DEFAULT_INITIAL_DATA.studioInfo }]);
          if (DEFAULT_INITIAL_DATA.pointRewardOptions?.length) {
            await supabase.from('point_reward_options').upsert(DEFAULT_INITIAL_DATA.pointRewardOptions);
          }
          syncStatus.value = 'connected';
          return;
        }

        // 映射云端字段到前端响应式变量
        if (studio && studio.length > 0) studioInfo.value = studio[0];
        if (cls && cls.length > 0) {
          classes.value = cls.map(c => ({ ...c, createdAt: c.created_at, archivedAt: c.archived_at }));
          nextTick(() => {
            if (activeClasses.value.length > 0) {
              const isValid = activeClasses.value.some(c => c.id === matrixClassId.value);
              if (!isValid) {
                matrixClassId.value = activeClasses.value[0].id;
              }
            }
          });
        }
        if (stu && stu.length > 0) students.value = stu.map(s => ({
          ...s, classId: s.class_id, parentName: s.parent_name, parentPhone: s.parent_phone, remainHours: s.remain_hours,
          totalPurchased: s.total_purchased, totalConsumed: s.total_consumed, totalPointsEarned: s.total_points_earned,
          redeemedCount: s.redeemed_count, joinDate: s.join_date
        }));
        if (att) attendanceHistory.value = att.map(a => ({ id: a.id, date: a.date, theme: a.theme, classId: a.class_id, details: a.details }));
        if (fin) {
          hourLogs.value = fin.filter(f => f.type === '课时扣除' || f.type === '撤销返还').map(f => ({
            id: f.id, studentId: f.student_id, studentName: f.student_name, type: f.type, hours: f.hours, balanceAfter: f.amount, reason: f.description, operator: f.operator, time: f.date
          }));
          paymentOrders.value = fin.filter(f => f.type !== '课时扣除' && f.type !== '撤销返还').map(f => ({
            id: f.id, orderNo: f.id, studentId: f.student_id, studentName: f.student_name, type: f.type, amount: f.amount, hours: f.hours, date: f.date, operator: f.operator
          }));
        }
        if (prz && prz.length > 0) pointPrizes.value = prz.map(p => ({ id: p.id, name: p.name, cost: p.cost, stock: p.stock, icon: p.icon, desc: p.desc_text }));
        if (plog && plog.length > 0) pointLogs.value = plog.map(p => ({ id: p.id, studentId: p.student_id, studentName: p.student_name, type: p.type, points: p.points, balanceAfter: p.balance_after, reason: p.reason, operator: p.operator, time: p.time }));
        if (popt && popt.length > 0) pointRewardOptions.value = popt;

        syncStatus.value = 'connected';
        // 同步覆盖本地快照
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          studioInfo: studioInfo.value,
          classes: classes.value,
          students: students.value,
          attendanceHistory: attendanceHistory.value,
          hourLogs: hourLogs.value,
          paymentOrders: paymentOrders.value,
          pointRewardOptions: pointRewardOptions.value,
          pointPrizes: pointPrizes.value,
          pointLogs: pointLogs.value
        }));
      } catch (err) {
        console.error('从 Supabase 同步数据失败:', err);
        syncStatus.value = 'offline';
      }
    };

    let saveTimer = null;
    const saveData = () => {
      const payload = {
        studioInfo: studioInfo.value,
        classes: classes.value,
        students: students.value,
        attendanceHistory: attendanceHistory.value,
        hourLogs: hourLogs.value,
        paymentOrders: paymentOrders.value,
        pointRewardOptions: pointRewardOptions.value,
        pointPrizes: pointPrizes.value,
        pointLogs: pointLogs.value
      };
      // 立即写入本地缓存保证流畅
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      // 防抖写入 Supabase
      if (!supabase) return;
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(async () => {
        try {
          syncStatus.value = 'syncing';
          await supabase.from('studio_info').upsert([{ id: studioInfo.value.id || '00000000-0000-0000-0000-000000000000', ...studioInfo.value }]);
          const clsDb = classes.value.map(c => ({ id: c.id, name: c.name, teacher: c.teacher, schedule: c.schedule, classroom: c.classroom, capacity: c.capacity, status: c.status, created_at: c.createdAt || new Date().toISOString(), archived_at: c.archivedAt, notes: c.notes }));
          if (clsDb.length) await supabase.from('classes').upsert(clsDb);
          const stuDb = students.value.map(s => ({ id: s.id, name: s.name, gender: s.gender, age: s.age, class_id: s.classId, parent_name: s.parentName, parent_phone: s.parentPhone, remain_hours: s.remainHours, total_purchased: s.totalPurchased, total_consumed: s.totalConsumed, points: s.points, total_points_earned: s.totalPointsEarned, redeemed_count: s.redeemedCount, status: s.status, join_date: s.joinDate, notes: s.notes }));
          if (stuDb.length) await supabase.from('students').upsert(stuDb);
          const attDb = attendanceHistory.value.map(a => ({ id: a.id, date: a.date, theme: a.theme, class_id: a.classId, details: a.details }));
          if (attDb.length) await supabase.from('attendance_records').upsert(attDb);
          const finDb = [
            ...hourLogs.value.map(h => ({ id: h.id, type: h.type, date: h.time, amount: h.balanceAfter, student_id: h.studentId, student_name: h.studentName, description: h.reason, hours: h.hours, operator: h.operator })),
            ...paymentOrders.value.map(p => ({ id: p.id, type: p.type, date: p.date, amount: p.amount, student_id: p.studentId, student_name: p.studentName, description: '', hours: p.hours, operator: p.operator }))
          ];
          if (finDb.length) await supabase.from('finance_logs').upsert(finDb);
          const przDb = pointPrizes.value.map(p => ({ id: p.id, name: p.name, cost: p.cost, stock: p.stock, icon: p.icon, desc_text: p.desc }));
          if (przDb.length) await supabase.from('point_prizes').upsert(przDb);
          const poptDb = pointRewardOptions.value.map(p => ({ id: p.id, name: p.name, points: p.points, icon: p.icon, color: p.color }));
          if (poptDb.length) await supabase.from('point_reward_options').upsert(poptDb);
          const plogDb = pointLogs.value.map(p => ({ id: p.id, student_id: p.studentId, student_name: p.studentName, type: p.type, points: p.points, balance_after: p.balanceAfter, reason: p.reason, operator: p.operator, time: p.time }));
          if (plogDb.length) await supabase.from('point_logs').upsert(plogDb);
          syncStatus.value = 'connected';
        } catch (err) {
          console.error('异步写入 Supabase 失败:', err);
          syncStatus.value = 'offline';
        }
      }, 800);
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
    const financeSubTab = ref('orders'); // 'orders' (收费订单) | 'hours' (消课流水) | 'points' (积分流水) | 'renewal' (待续费预警)
    const financeSearchQuery = ref('');
    const financePayMethodFilter = ref('all');
    const financeActiveKpi = ref('all'); // 'all' | 'month' | 'year' | 'total' | 'renewal'
    const selectedBreakdownYM = ref(''); // e.g. '2026-08'

    const selectFinanceKpi = (kpiType) => {
      if (kpiType === 'renewal') {
        financeActiveKpi.value = 'renewal';
        financeSubTab.value = 'renewal';
        return;
      }
      
      if (financeActiveKpi.value === kpiType) {
        financeActiveKpi.value = 'all';
        selectedBreakdownYM.value = '';
      } else {
        financeActiveKpi.value = kpiType;
        selectedBreakdownYM.value = '';
        financeSubTab.value = 'orders';
      }
    };

    const resetFinanceFilter = () => {
      financeActiveKpi.value = 'all';
      selectedBreakdownYM.value = '';
      financePayMethodFilter.value = 'all';
      financeSearchQuery.value = '';
    };

    const filterByYM = (ym) => {
      if (selectedBreakdownYM.value === ym) {
        selectedBreakdownYM.value = '';
      } else {
        selectedBreakdownYM.value = ym;
        financeSubTab.value = 'orders';
      }
    };

    const financeStats = computed(() => {
      const now = new Date();
      const currentYear = `${now.getFullYear()}`;
      const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const orders = paymentOrders.value || [];
      
      let monthIncome = 0;
      let monthOrderCount = 0;
      let yearIncome = 0;
      let yearOrderCount = 0;
      let totalIncome = 0;

      orders.forEach(o => {
        const amt = Number(o.amount || 0);
        totalIncome += amt;
        const d = o.payDate || '';
        if (d.startsWith(currentYearMonth) || d.includes(currentYearMonth)) {
          monthIncome += amt;
          monthOrderCount++;
        }
        if (d.startsWith(currentYear) || d.includes(currentYear)) {
          yearIncome += amt;
          yearOrderCount++;
        }
      });

      // 预警续费预估 (剩余课时 <= 3 节的学员数 * 4800元/标准包)
      const warningStudents = activeStudents.value.filter(s => Number(s.remainHours || 0) <= 3);
      const potentialRenewalIncome = warningStudents.length * 4800;

      return {
        currentYear,
        currentYearMonth,
        monthIncome,
        monthOrderCount,
        yearIncome,
        yearOrderCount,
        totalIncome,
        totalOrdersCount: orders.length,
        potentialRenewalIncome,
        warningCount: warningStudents.length,
        depletedCount: activeStudents.value.filter(s => Number(s.remainHours || 0) <= 0).length
      };
    });

    // 本年度月度营收明细分析
    const monthlyRevenueBreakdown = computed(() => {
      const orders = paymentOrders.value || [];
      const map = {};
      orders.forEach(o => {
        const ym = (o.payDate || '').substring(0, 7) || '其他';
        if (!map[ym]) {
          map[ym] = { ym, total: 0, count: 0, hours: 0 };
        }
        map[ym].total += Number(o.amount || 0);
        map[ym].count += 1;
        map[ym].hours += Number(o.totalHours || o.hoursBought || 0);
      });

      const list = Object.values(map).sort((a, b) => b.ym.localeCompare(a.ym));
      const grandTotal = list.reduce((sum, item) => sum + item.total, 0) || 1;
      return list.map(item => ({
        ...item,
        percent: Math.round((item.total / grandTotal) * 100)
      }));
    });

    // 历年年度营收汇总
    const annualRevenueBreakdown = computed(() => {
      const orders = paymentOrders.value || [];
      const map = {};
      orders.forEach(o => {
        const y = (o.payDate || '').substring(0, 4) || '其他';
        if (!map[y]) {
          map[y] = { year: y, total: 0, count: 0, hours: 0 };
        }
        map[y].total += Number(o.amount || 0);
        map[y].count += 1;
        map[y].hours += Number(o.totalHours || o.hoursBought || 0);
      });

      const list = Object.values(map).sort((a, b) => b.year.localeCompare(a.year));
      const grandTotal = list.reduce((sum, item) => sum + item.total, 0) || 1;
      return list.map(item => ({
        ...item,
        percent: Math.round((item.total / grandTotal) * 100)
      }));
    });

    // 待续费预警学员清单
    const renewalWarningStudents = computed(() => {
      return activeStudents.value
        .filter(s => Number(s.remainHours || 0) <= 3)
        .map(s => {
          const cls = getClassById(s.classId);
          const isDepleted = Number(s.remainHours || 0) <= 0;
          return {
            ...s,
            className: cls.name,
            urgencyText: isDepleted ? '已耗尽停课' : '临期预警 (1~3节)',
            urgencyLevel: isDepleted ? 'danger' : 'warning',
            suggestedPackage: '48课时精品包 (¥4,800)',
            estimatedAmount: 4800
          };
        })
        .sort((a, b) => Number(a.remainHours || 0) - Number(b.remainHours || 0));
    });

    const exportRenewalWarningsCSV = () => {
      const data = renewalWarningStudents.value;
      if (!data.length) {
        showToast('暂无待续费预警学员', 'warning');
        return;
      }
      const headers = ['学员姓名', '所在班级', '剩余课时', '预警状态', '家长姓名', '联系电话', '建议续费课包', '预估金额(元)', '学员备注'];
      const rows = data.map(s => [
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.className.replace(/"/g, '""')}"`,
        s.remainHours,
        s.urgencyText,
        `"${(s.parentName || '').replace(/"/g, '""')}"`,
        `\t${s.parentPhone || ''}`,
        `"${s.suggestedPackage}"`,
        s.estimatedAmount,
        `"${(s.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `想吃梨_待续费学员预警明细_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('🍐 待续费预警名单已成功导出！');
    };

    // ==========================================
    // 5.2 📊 教学课消深度统计系统 (周消课 / 月消课 / 班级消课 / 出勤率 / 教学产值)
    // ==========================================
    const consumptionPeriodType = ref('month'); // 'month' (月度课消) | 'week' (周度课消) | 'class' (班级课消) | 'student' (学员消课榜)
    const consumptionClassFilter = ref('all');
    const selectedConsumptionPeriod = ref(''); // 点击特定周/月展开明细

    // 辅助解析日期
    const parseRecordDate = (dateStr) => {
      if (!dateStr) return { year: 2026, month: '08', day: '01', ym: '2026-08', dateObj: new Date() };
      const m = String(dateStr).match(/(\d{4})[年/-](\d{1,2})[月/-](\d{1,2})/);
      if (m) {
        const y = Number(m[1]);
        const mo = String(m[2]).padStart(2, '0');
        const d = String(m[3]).padStart(2, '0');
        return {
          year: y,
          month: mo,
          day: d,
          ym: `${y}-${mo}`,
          dateObj: new Date(y, Number(mo) - 1, Number(d))
        };
      }
      return { year: 2026, month: '08', day: '01', ym: '2026-08', dateObj: new Date() };
    };

    // 获取周次与周起止日期
    const getWeekKeyAndLabel = (dateObj) => {
      const d = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
      const year = d.getUTCFullYear();

      const monday = new Date(dateObj);
      const currentDay = monday.getDay() || 7;
      monday.setDate(monday.getDate() - currentDay + 1);
      const sunday = new Date(monday);
      sunday.setDate(sunday.getDate() + 6);

      const formatMD = (dt) => `${String(dt.getMonth() + 1).padStart(2, '0')}/${String(dt.getDate()).padStart(2, '0')}`;
      const weekKey = `${year}-W${String(weekNo).padStart(2, '0')}`;
      const weekLabel = `${year}年 第${weekNo}周 (${formatMD(monday)} ~ ${formatMD(sunday)})`;

      return { weekKey, weekNo, year, weekLabel, mondayStr: formatMD(monday), sundayStr: formatMD(sunday) };
    };

    // 全校总体课消 KPI 统计
    const consumptionSummaryKPI = computed(() => {
      const now = new Date();
      const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const currentWeekInfo = getWeekKeyAndLabel(now);

      const records = attendanceHistory.value || [];
      let thisWeekConsumed = 0;
      let thisWeekSessions = 0;
      let thisWeekPresent = 0;
      let thisWeekTotal = 0;

      let thisMonthConsumed = 0;
      let thisMonthSessions = 0;
      let thisMonthPresent = 0;
      let thisMonthTotal = 0;

      let thisYearConsumed = 0;
      let totalAllConsumed = 0;
      let totalAllPresent = 0;
      let totalAllHeadcount = 0;

      records.forEach(rec => {
        const pDate = parseRecordDate(rec.date);
        const wInfo = getWeekKeyAndLabel(pDate.dateObj);

        let sessionConsumed = 0;
        let sessionPresent = 0;
        let sessionHeadcount = (rec.details || []).length;

        (rec.details || []).forEach(d => {
          if (d.status === '到课') {
            sessionConsumed += Number(d.deductHours !== undefined ? d.deductHours : 1);
            sessionPresent += 1;
          }
        });

        totalAllConsumed += sessionConsumed;
        totalAllPresent += sessionPresent;
        totalAllHeadcount += sessionHeadcount;

        if (pDate.year === now.getFullYear()) {
          thisYearConsumed += sessionConsumed;
        }

        if (pDate.ym === currentYM) {
          thisMonthConsumed += sessionConsumed;
          thisMonthSessions += 1;
          thisMonthPresent += sessionPresent;
          thisMonthTotal += sessionHeadcount;
        }

        if (wInfo.weekKey === currentWeekInfo.weekKey) {
          thisWeekConsumed += sessionConsumed;
          thisWeekSessions += 1;
          thisWeekPresent += sessionPresent;
          thisWeekTotal += sessionHeadcount;
        }
      });

      if (thisMonthConsumed === 0 && records.length > 0) {
        const latestDate = parseRecordDate(records[0].date);
        const latestYM = latestDate.ym;
        records.filter(r => parseRecordDate(r.date).ym === latestYM).forEach(r => {
          (r.details || []).forEach(d => {
            if (d.status === '到课') {
              thisMonthConsumed += Number(d.deductHours || 1);
              thisMonthPresent += 1;
            }
          });
          thisMonthSessions++;
          thisMonthTotal += (r.details || []).length;
        });
      }

      if (thisWeekConsumed === 0 && records.length > 0) {
        const latestDate = parseRecordDate(records[0].date);
        const latestW = getWeekKeyAndLabel(latestDate.dateObj).weekKey;
        records.filter(r => getWeekKeyAndLabel(parseRecordDate(r.date).dateObj).weekKey === latestW).forEach(r => {
          (r.details || []).forEach(d => {
            if (d.status === '到课') {
              thisWeekConsumed += Number(d.deductHours || 1);
              thisWeekPresent += 1;
            }
          });
          thisWeekSessions++;
          thisWeekTotal += (r.details || []).length;
        });
      }

      const thisWeekRate = thisWeekTotal > 0 ? `${Math.round((thisWeekPresent / thisWeekTotal) * 100)}%` : '100%';
      const thisMonthRate = thisMonthTotal > 0 ? `${Math.round((thisMonthPresent / thisMonthTotal) * 100)}%` : '100%';
      const allRate = totalAllHeadcount > 0 ? `${Math.round((totalAllPresent / totalAllHeadcount) * 100)}%` : '96%';

      return {
        thisWeekConsumed,
        thisWeekSessions,
        thisWeekPresent,
        thisWeekRate,
        thisMonthConsumed,
        thisMonthSessions,
        thisMonthPresent,
        thisMonthRate,
        thisMonthValue: thisMonthConsumed * 100,
        thisYearConsumed,
        totalAllConsumed,
        totalAllPresent,
        allRate
      };
    });

    // 1. 周消课统计明细列表 (按周汇总考勤)
    const weeklyConsumptionList = computed(() => {
      const records = attendanceHistory.value || [];
      const map = {};

      records.forEach(rec => {
        if (consumptionClassFilter.value !== 'all' && rec.classId !== consumptionClassFilter.value) {
          return;
        }

        const pDate = parseRecordDate(rec.date);
        const wInfo = getWeekKeyAndLabel(pDate.dateObj);
        const key = wInfo.weekKey;

        if (!map[key]) {
          map[key] = {
            weekKey: key,
            weekLabel: wInfo.weekLabel,
            year: wInfo.year,
            weekNo: wInfo.weekNo,
            sessionCount: 0,
            consumedHours: 0,
            presentCount: 0,
            leaveCount: 0,
            holidayCount: 0,
            totalHeadcount: 0,
            sessions: []
          };
        }

        let sessionConsumed = 0;
        let pCnt = 0;
        let lCnt = 0;
        let hCnt = 0;

        (rec.details || []).forEach(d => {
          if (d.status === '到课') {
            sessionConsumed += Number(d.deductHours !== undefined ? d.deductHours : 1);
            pCnt++;
          } else if (d.status === '未到' || d.status === '请假') {
            lCnt++;
          } else if (d.status === '放假') {
            hCnt++;
          }
        });

        map[key].sessionCount += 1;
        map[key].consumedHours += sessionConsumed;
        map[key].presentCount += pCnt;
        map[key].leaveCount += lCnt;
        map[key].holidayCount += hCnt;
        map[key].totalHeadcount += (rec.details || []).length;
        map[key].sessions.push({
          ...rec,
          sessionConsumed
        });
      });

      return Object.values(map)
        .map(item => ({
          ...item,
          attendanceRate: item.totalHeadcount > 0 ? `${Math.round((item.presentCount / item.totalHeadcount) * 100)}%` : '0%',
          estimatedValue: item.consumedHours * 100
        }))
        .sort((a, b) => b.weekKey.localeCompare(a.weekKey));
    });

    // 2. 月度消课统计明细列表 (按月汇总考勤)
    const monthlyConsumptionList = computed(() => {
      const records = attendanceHistory.value || [];
      const map = {};

      records.forEach(rec => {
        if (consumptionClassFilter.value !== 'all' && rec.classId !== consumptionClassFilter.value) {
          return;
        }

        const pDate = parseRecordDate(rec.date);
        const ym = pDate.ym;

        if (!map[ym]) {
          map[ym] = {
            monthKey: ym,
            monthLabel: `${pDate.year}年${Number(pDate.month)}月`,
            year: pDate.year,
            sessionCount: 0,
            consumedHours: 0,
            presentCount: 0,
            leaveCount: 0,
            holidayCount: 0,
            totalHeadcount: 0,
            classesMap: {},
            sessions: []
          };
        }

        let sessionConsumed = 0;
        let pCnt = 0;
        let lCnt = 0;
        let hCnt = 0;

        (rec.details || []).forEach(d => {
          if (d.status === '到课') {
            sessionConsumed += Number(d.deductHours !== undefined ? d.deductHours : 1);
            pCnt++;
          } else if (d.status === '未到' || d.status === '请假') {
            lCnt++;
          } else if (d.status === '放假') {
            hCnt++;
          }
        });

        map[ym].sessionCount += 1;
        map[ym].consumedHours += sessionConsumed;
        map[ym].presentCount += pCnt;
        map[ym].leaveCount += lCnt;
        map[ym].holidayCount += hCnt;
        map[ym].totalHeadcount += (rec.details || []).length;
        map[ym].sessions.push({
          ...rec,
          sessionConsumed
        });

        if (!map[ym].classesMap[rec.classId]) {
          map[ym].classesMap[rec.classId] = {
            className: rec.className || getClassById(rec.classId).name,
            sessions: 0,
            consumed: 0
          };
        }
        map[ym].classesMap[rec.classId].sessions += 1;
        map[ym].classesMap[rec.classId].consumed += sessionConsumed;
      });

      return Object.values(map)
        .map(item => ({
          ...item,
          attendanceRate: item.totalHeadcount > 0 ? `${Math.round((item.presentCount / item.totalHeadcount) * 100)}%` : '0%',
          estimatedValue: item.consumedHours * 100,
          classesList: Object.values(item.classesMap)
        }))
        .sort((a, b) => b.monthKey.localeCompare(a.monthKey));
    });

    // 3. 班级消课排行与交付统计
    const classConsumptionAnalytics = computed(() => {
      const clsList = activeClasses.value;
      const records = attendanceHistory.value || [];

      return clsList.map(cls => {
        const clsRecords = records.filter(r => r.classId === cls.id);
        const stuList = activeStudents.value.filter(s => s.classId === cls.id);

        let totalConsumed = 0;
        let totalPresent = 0;
        let totalHeadcount = 0;

        clsRecords.forEach(r => {
          (r.details || []).forEach(d => {
            if (d.status === '到课') {
              totalConsumed += Number(d.deductHours || 1);
              totalPresent += 1;
            }
          });
          totalHeadcount += (r.details || []).length;
        });

        const attendanceRate = totalHeadcount > 0 ? `${Math.round((totalPresent / totalHeadcount) * 100)}%` : '100%';

        return {
          ...cls,
          studentCount: stuList.length,
          capacity: cls.capacity || 8,
          totalSessions: clsRecords.length,
          totalConsumed,
          attendanceRate,
          estimatedValue: totalConsumed * 100
        };
      });
    });

    // 4. 学员消课与出勤率活跃度排行榜
    const studentConsumptionRanking = computed(() => {
      const stuList = activeStudents.value;
      const records = attendanceHistory.value || [];

      return stuList.map(stu => {
        const cls = getClassById(stu.classId);
        let presentCount = 0;
        let leaveCount = 0;
        let totalConsumed = 0;

        records.forEach(r => {
          const detail = (r.details || []).find(d => d.studentId === stu.id);
          if (detail) {
            if (detail.status === '到课') {
              presentCount++;
              totalConsumed += Number(detail.deductHours || 1);
            } else if (detail.status === '未到' || detail.status === '请假') {
              leaveCount++;
            }
          }
        });

        const totalTimes = presentCount + leaveCount;
        const rate = totalTimes > 0 ? `${Math.round((presentCount / totalTimes) * 100)}%` : '100%';

        return {
          ...stu,
          className: cls.name,
          presentCount,
          leaveCount,
          totalConsumed,
          attendanceRate: rate,
          statusTag: leaveCount >= 2 ? '请假偏多待跟进' : '出勤优良'
        };
      }).sort((a, b) => b.totalConsumed - a.totalConsumed);
    });

    // 导出消课综合统计报表 CSV
    const exportConsumptionReportCSV = () => {
      const months = monthlyConsumptionList.value;
      if (!months.length) {
        showToast('暂无消课考勤统计数据可导出', 'warning');
        return;
      }

      const headers = ['统计月份', '完成上课课次数', '消课总课时(节)', '到课人次', '请假人次', '月度出勤率', '折合教学消课产值(元)'];
      const rows = months.map(m => [
        `\t${m.monthLabel}`,
        m.sessionCount,
        m.consumedHours,
        m.presentCount,
        m.leaveCount,
        m.attendanceRate,
        m.estimatedValue
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `想吃梨_月度教学课消统计报表_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('🍐 月度教学课消统计报表已成功导出！');
    };

    const filteredPaymentOrders = computed(() => {
      let list = [...paymentOrders.value];

      // KPI 点击下钻筛选
      if (selectedBreakdownYM.value) {
        list = list.filter(o => (o.payDate || '').startsWith(selectedBreakdownYM.value));
      } else if (financeActiveKpi.value === 'month') {
        const ym = financeStats.value.currentYearMonth;
        list = list.filter(o => (o.payDate || '').startsWith(ym));
      } else if (financeActiveKpi.value === 'year') {
        const y = financeStats.value.currentYear;
        list = list.filter(o => (o.payDate || '').startsWith(y));
      }

      if (financePayMethodFilter.value !== 'all') {
        list = list.filter(o => o.payMethod === financePayMethodFilter.value);
      }
      if (financeSearchQuery.value.trim()) {
        const q = financeSearchQuery.value.trim().toLowerCase();
        list = list.filter(o =>
          (o.studentName && o.studentName.toLowerCase().includes(q)) ||
          (o.id && o.id.toLowerCase().includes(q)) ||
          (o.remark && o.remark.toLowerCase().includes(q)) ||
          (o.operator && o.operator.toLowerCase().includes(q))
        );
      }
      return list;
    });

    const exportPaymentOrdersCSV = () => {
      const data = filteredPaymentOrders.value;
      if (!data.length) {
        showToast('暂无收费订单可导出', 'warning');
        return;
      }
      const headers = ['订单编号', '缴费日期', '学员姓名', '实收金额(元)', '购买课时', '赠送课时', '合计课时', '支付方式', '经办人', '备注说明'];
      const rows = data.map(o => [
        `\t${o.id || ''}`,
        `\t${o.payDate || ''}`,
        `"${(o.studentName || '').replace(/"/g, '""')}"`,
        o.amount || 0,
        o.hoursBought || 0,
        o.hoursGift || 0,
        o.totalHours || (o.hoursBought + (o.hoursGift || 0)),
        `"${(o.payMethod || '').replace(/"/g, '""')}"`,
        `"${(o.operator || '陈老师').replace(/"/g, '""')}"`,
        `"${(o.remark || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `想吃梨_学员收费充值订单总账_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('🍐 学员收费订单已成功导出！');
    };

    const selectedReceiptOrder = ref(null);
    const showReceiptModal = ref(false);
    const openReceiptModal = (order) => {
      selectedReceiptOrder.value = order;
      showReceiptModal.value = true;
    };

    // ==========================================
    // 5.2 🏫 班级专属二级管理独立主页
    // ==========================================
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

    const exportStudentAttendanceCSV = (student) => {
      const targetStudent = student || profileStudent.value;
      if (!targetStudent) return;
      const stu = targetStudent;
      const logs = hourLogs.value.filter(l => l.studentId === stu.id);
      
      const headers = ['学员姓名', '家长电话', '所属班级', '变动类型', '课时变动', '结余课时', '考勤/缴费说明与备注', '经办老师', '时间记录'];
      const rows = logs.map(l => [
        `"${stu.name.replace(/"/g, '""')}"`,
        `\t${stu.parentPhone || ''}`,
        `"${getClassById(stu.classId).name.replace(/"/g, '""')}"`,
        l.type,
        l.change > 0 ? `+${l.change}` : l.change,
        `${l.balanceAfter} 节`,
        `"${(l.relatedInfo || '').replace(/"/g, '""')}"`,
        l.operator || '陈老师',
        l.time
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `想吃梨_【${stu.name}】个人考勤成长总账_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`🍐 【${stu.name}】个人考勤档案已成功导出！`);
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

    const matrixAttendanceRecords = computed(() => {
      if (!matrixClassId.value) return [];
      let records = attendanceHistory.value.filter(a => (a.classId === matrixClassId.value || a.class_id === matrixClassId.value));
      return records.sort((a, b) => {
        const tA = new Date(a.date).getTime() || 0;
        const tB = new Date(b.date).getTime() || 0;
        return attendanceSortOrder.value === 'desc' ? tB - tA : tA - tB;
      });
    });

    const getStudentAttendanceCell = (studentId, attendanceRecord) => {
      if (!attendanceRecord || !attendanceRecord.details) {
        return { status: '--', note: '', deductHours: 0 };
      }
      const item = attendanceRecord.details.find(d => d.studentId === studentId);
      if (!item) {
        return { status: '--', note: '', deductHours: 0 };
      }
      return {
        status: item.status,
        note: item.note || item.reason || '',
        deductHours: item.deductHours || 0
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
      return 'text-black dark:text-stone-400 text-xs';
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

    const toggleCellDropdown = (attId, stuId, event) => {
      if (event) event.stopPropagation();
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
      const iso = dateToISO(att.date);
      editingAttendanceForm.id = att.id;
      editingAttendanceForm.classId = att.classId;
      editingAttendanceForm.theme = att.theme;
      editingAttendanceForm.rawDate = iso;
      editingAttendanceForm.date = att.date;
      editingAttendanceForm.teacher = att.teacher || getClassById(att.classId).teacher || '陈老师';
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
      const newFormattedDate = formatChineseDateWithWeekday(editingAttendanceForm.rawDate);

      att.theme = newTheme;
      att.date = newFormattedDate;
      att.teacher = editingAttendanceForm.teacher || '陈老师';

      // 联动更新关联流水文本说明
      hourLogs.value.forEach(l => {
        if (l.relatedInfo && (l.relatedInfo.includes(oldTheme) || l.relatedInfo.includes(oldDate))) {
          l.relatedInfo = l.relatedInfo.replace(oldTheme, newTheme).replace(oldDate, newFormattedDate);
        }
      });

      saveData();
      showEditAttendanceModal.value = false;
      showToast(`🍐 已成功更新课程《${newTheme}》与上课日期为 ${newFormattedDate}！`);
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
          change: +1,
          balanceAfter: student.remainHours,
          relatedInfo: `大表修改：${attendanceRecord.date}《${attendanceRecord.theme}》改为「${newStatus}」退还课时`,
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
          change: -1,
          balanceAfter: student.remainHours,
          relatedInfo: `大表点名：${attendanceRecord.date}《${attendanceRecord.theme}》到课${noteDesc}`,
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
            change: -1,
            balanceAfter: s.remainHours,
            relatedInfo: `${dateText} ${cls.name}《${themeText}》表格考勤到课`,
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
    };

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
              change: +d.deductHours,
              balanceAfter: s.remainHours,
              relatedInfo: `撤销 ${att.date} ${att.className} 考勤`,
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

    const exportAttendanceMatrixCSV = (classId) => {
      const targetId = classId || matrixClassId.value;
      const cls = getClassById(targetId);
      const stuList = activeStudents.value.filter(s => s.classId === targetId);
      const attList = attendanceHistory.value.filter(a => a.classId === targetId);

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
          status,
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

    const currentClassStudentsList = computed(() => {
      let list = [...activeStudents.value];
      if (selectedRosterClassId.value !== 'all') {
        list = list.filter(s => s.classId === selectedRosterClassId.value);
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
      if (confirm(`确定要归档学员【${stu.name}】吗？\n归档后该学员将从日常在读名册移至归档中心，保留所有历史考勤与流水记录。`)) {
        stu.status = '已归档';
        stu.archivedAt = new Date().toISOString().slice(0, 10);
        hourLogs.value.unshift({
          id: 'log_' + Date.now(),
          studentId: stu.id,
          studentName: stu.name,
          type: '学员结课归档',
          change: 0,
          balanceAfter: stu.remainHours,
          relatedInfo: `学员档案已归档保存 (结余积分: ${stu.points || 0}分)`,
          operator: '陈老师',
          time: new Date().toLocaleString('zh-CN', { hour12: false })
        });
        saveData();
        showToast(`📦 学员【${stu.name}】已归档`);
      }
    };

    const unarchiveStudent = (stu) => {
      stu.status = '在读';
      delete stu.archivedAt;
      hourLogs.value.unshift({
        id: 'log_' + Date.now(),
        studentId: stu.id,
        studentName: stu.name,
        type: '学员恢复在读',
        change: 0,
        balanceAfter: stu.remainHours,
        relatedInfo: `学员从归档库恢复为在读状态`,
        operator: '陈老师',
        time: new Date().toLocaleString('zh-CN', { hour12: false })
      });
      saveData();
      showToast(`🔄 学员【${stu.name}】已恢复为在读状态！`);
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
          change: -deduct,
          balanceAfter: s.remainHours,
          relatedInfo: `${adhocForm.date} 临时考勤《${adhocForm.theme}》${reasonRemark}`,
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
          change: +addHours,
          balanceAfter: targetStudent.remainHours,
          relatedInfo: `${rechargeForm.payMethod} ¥${rechargeForm.amount} (+${addHours}课时) (备注: ${rechargeForm.remark || '新生首次报名'})`,
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
          change: +addHours,
          balanceAfter: targetStudent.remainHours,
          relatedInfo: `${rechargeForm.payMethod} ¥${rechargeForm.amount} (+${addHours}课时)${noteText}`,
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
        totalHours: addHours,
        payDate: rechargeForm.payDate,
        payMethod: rechargeForm.payMethod,
        operator: rechargeForm.operator,
        remark: rechargeForm.remark
      });

      saveData();
      showRechargeModal.value = false;
      showToast(`🎉 ${rechargeMode.value === 'new' ? '新生建档入账成功' : '续费充值成功'}！【${targetStudent.name}】增加 ${addHours} 课时，当前剩余 ${targetStudent.remainHours} 节`);
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
              change: diff,
              balanceAfter: Number(studentForm.remainHours),
              relatedInfo: `修改档案课时 (备注: ${studentForm.notes || '无备注'})`,
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
          change: +newS.remainHours,
          balanceAfter: newS.remainHours,
          relatedInfo: `首次建档初始课时 (备注: ${newS.notes || '新生入学'})`,
          operator: '陈老师',
          time: new Date().toLocaleString('zh-CN', { hour12: false })
        });
        showToast(`🎉 成功录入学员【${newS.name}】并赠送 ${newS.points} 新生积分！`);
      }
      saveData();
      showStudentModal.value = false;
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
    // 🌐 浏览器前进/后退与 URL Hash 路由同步
    // ==========================================
    const isSyncingHash = ref(false);

    const syncStateFromHash = () => {
      isSyncingHash.value = true;
      const hash = window.location.hash || '#attendance';
      
      if (hash.startsWith('#student-')) {
        const sid = hash.replace('#student-', '');
        const stu = students.value.find(s => s.id === sid);
        if (stu) {
          profileStudent.value = stu;
          currentTab.value = 'students';
        }
      } else if (hash.startsWith('#class-')) {
        const cid = hash.replace('#class-', '');
        const cls = classes.value.find(c => c.id === cid);
        if (cls) {
          selectedClassDetail.value = cls;
          currentTab.value = 'students';
        }
      } else if (hash === '#archive') {
        profileStudent.value = null;
        selectedClassDetail.value = null;
        currentTab.value = 'students';
        rosterSubTab.value = 'archive';
      } else if (hash === '#students-roster' || hash === '#students') {
        profileStudent.value = null;
        selectedClassDetail.value = null;
        currentTab.value = 'students';
        rosterSubTab.value = 'students';
      } else if (hash === '#students-classes') {
        profileStudent.value = null;
        selectedClassDetail.value = null;
        currentTab.value = 'students';
        rosterSubTab.value = 'classes';
      } else if (hash === '#ranking') {
        profileStudent.value = null;
        selectedClassDetail.value = null;
        currentTab.value = 'ranking';
      } else if (hash === '#records' || hash === '#finance') {
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

    // 监听状态变化同步到 URL Hash
    watch([currentTab, rosterSubTab, () => profileStudent.value?.id, () => selectedClassDetail.value?.id], () => {
      if (isSyncingHash.value) return;
      let targetHash = '#' + currentTab.value;
      if (profileStudent.value) {
        targetHash = '#student-' + profileStudent.value.id;
      } else if (selectedClassDetail.value) {
        targetHash = '#class-' + selectedClassDetail.value.id;
      } else if (currentTab.value === 'students') {
        if (rosterSubTab.value === 'archive') targetHash = '#archive';
        else if (rosterSubTab.value === 'students') targetHash = '#students-roster';
        else targetHash = '#students-classes';
      } else if (currentTab.value === 'records') {
        targetHash = '#finance';
      }
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
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
