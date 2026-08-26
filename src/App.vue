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
            <span class="text-[10px] text-stone-400 font-mono hidden md:inline">
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
            <span class="text-xs text-stone-400 font-bold uppercase tracking-wider">班级</span>
          </div>

          <div class="relative">
            <select v-model="matrixClassId" 
              class="appearance-none pl-4 pr-9 py-2 wf-select text-xs sm:text-sm font-bold cursor-pointer shadow-sm">
              <option v-for="c in activeClasses" :key="c.id" :value="c.id">
                🎨 {{ c.name }} ({{ activeStudents.filter(s => s.classId === c.id).length }}人)
              </option>
            </select>
            <i class="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none"></i>
          </div>

          <span class="text-xs text-stone-400 hidden lg:inline font-medium pl-2 border-l border-black/10 dark:border-white/10">
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
    <main class="flex-1 pb-16" @click="activeCellDropdownKey = null">
      
      <!-- ======================================================== -->
      <!-- TAB 1: 📝 二维考勤总大表 (极简线框 · 紧凑排版 · 顺畅横向滑动) -->
      <!-- ======================================================== -->
      <section v-if="currentTab === 'attendance'" class="w-full">
        
        <!-- 表格水平滚动容器 (支持多学员流畅横向滑动，前两列固定) -->
        <div class="overflow-x-auto max-h-[calc(100vh-160px)] w-full border-b border-black/10 dark:border-white/10" style="scrollbar-width: thin; background-color: var(--bg-page);">
          <table class="w-max min-w-full text-center text-xs border-collapse select-none" style="background-color: var(--bg-page); table-layout: fixed;">
            
            <!-- 表头 (紧凑高雅线框 · 课程与日期固定置顶与左置) -->
            <thead class="sticky top-0 z-30 shadow-sm border-b border-black/10 dark:border-white/15" style="background-color: var(--bg-surface);">
              <tr class="font-bold select-none">
                <!-- 01 课程主题 (固定左侧第1列 · 紧凑单行绝对不折行) -->
                <th class="py-2.5 pl-4 pr-3 text-left border-r border-black/[0.06] dark:border-white/10 min-w-[155px] w-[155px] whitespace-nowrap sticky left-0 z-30 shadow-sm" style="background-color: var(--bg-surface);">
                  <div class="flex items-center gap-1.5 whitespace-nowrap">
                    <span class="text-[10px] text-stone-400 font-mono font-normal">01</span>
                    <span class="text-xs font-black tracking-tight">课程主题</span>
                    <span class="text-[9px] text-stone-400 font-normal ml-0.5">✏️</span>
                  </div>
                </th>

                <!-- 02 上课日期 (固定左侧第2列 · 紧凑单行) -->
                <th class="py-2.5 px-3 text-left border-r border-black/[0.06] dark:border-white/10 min-w-[140px] w-[140px] whitespace-nowrap sticky left-[155px] z-30 shadow-sm" style="background-color: var(--bg-surface);">
                  <div class="flex items-center gap-1.5 whitespace-nowrap">
                    <span class="text-[10px] text-stone-400 font-mono font-normal">02</span>
                    <span class="text-xs font-black tracking-tight">上课日期</span>
                    <span class="text-[9px] text-stone-400 font-normal ml-0.5">📅</span>
                  </div>
                </th>
                
                <!-- 🌟 学员列 (紧凑优雅排版：#序号 + 姓名 + 剩余课时与积分微胶囊 · 宽度适中可横向平滑滚动) -->
                <th v-for="(stu, idx) in matrixStudents" :key="'name_' + stu.id" 
                  class="py-2 px-1.5 border-r border-black/[0.06] dark:border-white/10 min-w-[92px] w-[92px] whitespace-nowrap z-20" 
                  style="background-color: var(--bg-surface);">
                  
                  <div class="flex flex-col items-center justify-center gap-0.5">
                    <!-- 顶部紧凑序号与姓名 -->
                    <div @click="openStudentProfile(stu)" 
                      class="cursor-pointer group flex items-center justify-center gap-1 font-bold text-xs text-stone-900 dark:text-stone-100 hover:text-emerald-500 dark:hover:text-emerald-400 transition whitespace-nowrap" 
                      :title="'#' + (idx + 1) + ' ' + stu.name + ' (点击查看档案)'">
                      <span class="text-[9px] font-mono text-stone-400 font-normal">#{{ idx + 1 }}</span>
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
                <th class="py-2.5 px-2 w-16 min-w-[64px] text-center text-stone-400 text-xs font-normal sticky right-0 z-30 shadow-sm" style="background-color: var(--bg-surface);">
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
                      <i class="fa-regular fa-file-lines text-stone-400 text-[11px] flex-shrink-0"></i>
                      <span class="font-bold text-xs text-stone-900 dark:text-stone-100 group-hover:text-emerald-400 transition-colors truncate">{{ att.theme }}</span>
                    </div>
                    <i class="fa-solid fa-pen text-[9px] text-stone-400 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity flex-shrink-0"></i>
                  </div>
                </td>

                <!-- 🌟 上课日期 (固定左侧第2列 · 紧凑单行可直接点击修改) -->
                <td class="py-2 px-3 text-left border-r border-black/[0.06] dark:border-white/10 min-w-[140px] w-[140px] whitespace-nowrap sticky left-[155px] z-10 shadow-sm" style="background-color: var(--bg-surface);">
                  <div @click="openEditAttendanceRow(att)" 
                    class="cursor-pointer group flex items-center justify-between gap-1.5 py-1 px-1.5 -mx-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition whitespace-nowrap"
                    title="点击修改上课日期与课程主题">
                    <div class="flex items-center gap-1.5 truncate">
                      <i class="fa-regular fa-calendar text-stone-400 text-[11px] flex-shrink-0"></i>
                      <span class="font-mono text-xs text-stone-500 dark:text-stone-400 group-hover:text-emerald-400 transition-colors whitespace-nowrap">{{ att.date }}</span>
                    </div>
                    <i class="fa-solid fa-pen text-[9px] text-stone-400 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity flex-shrink-0"></i>
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
                    
                    <div class="px-2 py-1 text-[10px] text-stone-400 font-mono border-b border-black/10 dark:border-white/10 flex justify-between items-center">
                      <span>快速修改考勤</span>
                      <span class="font-bold text-emerald-400">{{ stu.name }}</span>
                    </div>

                    <button @click.stop="selectCellStatusFromDropdown(att, stu, '到课')"
                      class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-500/20 text-[#10E57A] transition"
                      :class="getStudentAttendanceCell(stu.id, att).status === '到课' ? 'bg-emerald-500/20 border border-emerald-500/40' : ''">
                      <span class="flex items-center gap-1.5"><span>🟢</span> 到课</span>
                      <span class="text-[10px] text-stone-400 font-mono">消课-1</span>
                    </button>

                    <button @click.stop="selectCellStatusFromDropdown(att, stu, '未到')"
                      class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-500/20 text-rose-400 transition"
                      :class="getStudentAttendanceCell(stu.id, att).status === '未到' || getStudentAttendanceCell(stu.id, att).status === '请假' ? 'bg-rose-500/20 border border-rose-500/40' : ''">
                      <span class="flex items-center gap-1.5"><span>🔴</span> 未到/请假</span>
                      <span class="text-[10px] text-stone-400 font-mono">不扣课</span>
                    </button>

                    <button @click.stop="selectCellStatusFromDropdown(att, stu, '放假')"
                      class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-500/20 text-purple-400 transition"
                      :class="getStudentAttendanceCell(stu.id, att).status === '放假' ? 'bg-purple-500/20 border border-purple-500/40' : ''">
                      <span class="flex items-center gap-1.5"><span>🟣</span> 全班放假</span>
                      <span class="text-[10px] text-stone-400">休假</span>
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
                      <i class="fa-solid fa-pen text-[10px] text-stone-400"></i>
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
                    class="text-stone-400 hover:text-emerald-400 p-1 transition text-xs"
                    title="修改课程主题与上课日期">
                    <i class="fa-solid fa-pen text-[11px]"></i>
                  </button>
                  <button @click="deleteMatrixRow(att)" 
                    class="text-stone-400 hover:text-rose-400 p-1 transition text-xs ml-0.5"
                    title="撤销/删除此节课 (自动退还消课)">
                    <i class="fa-regular fa-trash-can text-[11px]"></i>
                  </button>
                </td>

              </tr>

              <tr v-if="matrixAttendanceRecords.length === 0">
                <td :colspan="matrixStudents.length + 3" class="py-16 text-center text-stone-400 text-xs">
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
          <div class="text-xs text-stone-400 flex items-center gap-3">
            <span>全校在读：<strong>{{ kpiStats.totalStudents }}</strong> 人</span>
            <span>全校画币积分池：<strong class="text-amber-400 font-mono font-bold">{{ kpiStats.totalPoints }}</strong> 分</span>
          </div>
        </div>

        <!-- 视图 A: 📊 课时排行榜 -->
        <div v-if="rankingViewType === 'hours'" class="space-y-6">
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="wf-card p-5">
              <div class="text-xs text-stone-400 font-medium">在读小艺术家</div>
              <div class="text-3xl font-black mt-1">{{ kpiStats.totalStudents }} <span class="text-xs font-normal text-stone-400">人</span></div>
            </div>
            <div class="wf-card p-5">
              <div class="text-xs text-stone-400 font-medium">全校总剩余课时</div>
              <div class="text-3xl font-black text-emerald-400 mt-1">{{ kpiStats.totalHours }} <span class="text-xs font-normal text-stone-400">节</span></div>
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
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
                <input v-model="rankingSearchQuery" type="text" placeholder="搜索学员姓名或电话..."
                  class="w-full pl-9 pr-4 py-2 wf-input text-xs placeholder:text-stone-400">
              </div>

              <div class="relative">
                <select v-model="rankingClassFilter" class="appearance-none pl-4 pr-8 py-2 wf-select text-xs font-medium cursor-pointer">
                  <option value="all">🌈 全部班级</option>
                  <option v-for="c in activeClasses" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-[10px] pointer-events-none"></i>
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
                <tr class="border-b border-black/10 dark:border-white/10 text-stone-400" style="background-color: var(--bg-surface-subtle);">
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
                  <td class="py-3 px-4 font-mono font-bold text-stone-400 whitespace-nowrap">#{{ (idx + 1).toString().padStart(2, '0') }}</td>
                  <td class="py-3 px-4 font-bold cursor-pointer group whitespace-nowrap" @click="openStudentProfile(stu)">
                    <span class="group-hover:text-emerald-400 transition">{{ stu.name }} ↗</span>
                  </td>
                  <td class="py-3 px-4 text-stone-400 whitespace-nowrap">{{ getClassById(stu.classId).name }}</td>
                  <td class="py-3 px-4 font-bold font-mono text-sm whitespace-nowrap" :class="stu.remainHours <= 0 ? 'text-rose-400' : stu.remainHours <= 3 ? 'text-amber-400' : 'text-emerald-400'">
                    {{ stu.remainHours }} 节
                  </td>
                  <td class="py-3 px-4 whitespace-nowrap">
                    <button @click.stop="openIndividualPointModal(stu, 'add')" class="wf-badge-gold cursor-pointer hover:scale-105 active:scale-95 transition" :title="'点击变更【' + stu.name + '】积分'">
                      <span>⭐ {{ stu.points || 0 }}</span>
                      <span class="text-[9px] opacity-75 ml-0.5">▾</span>
                    </button>
                  </td>
                  <td class="py-3 px-4 font-mono text-stone-300 whitespace-nowrap">{{ stu.totalConsumed || 0 }} 节</td>
                  <td class="py-3 px-4 font-mono text-stone-400 whitespace-nowrap">{{ stu.parentName }} ({{ stu.parentPhone }})</td>
                  <td class="py-3 px-5 text-right space-x-2 whitespace-nowrap">
                    <button @click="openIndividualPointModal(stu, 'add')" class="text-xs text-amber-400 font-bold hover:underline">⭐ 变更积分</button>
                    <button @click="openRecharge(stu)" class="text-xs text-emerald-400 font-bold hover:underline">续费</button>
                    <button @click="openStudentProfile(stu)" class="text-xs text-stone-400 hover:text-emerald-400">档案 ↗</button>
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
                <div class="text-xs font-bold text-stone-400">🥈 荣耀亚军</div>
                <div class="text-base font-black mt-0.5">{{ pointsRankingList[1].name }} ({{ pointsRankingList[1].className }})</div>
                <div class="text-2xl font-black text-amber-400 mt-2 font-mono">
                  ⭐ {{ pointsRankingList[1].points }} <span class="text-xs text-stone-400 font-normal">可用画币</span>
                </div>
                <div class="text-xs text-stone-400 mt-1">累计获得: {{ pointsRankingList[1].totalPointsEarned }} 分</div>
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
                  ⭐ {{ pointsRankingList[0].points }} <span class="text-xs text-stone-400 font-normal">可用画币</span>
                </div>
                <div class="text-xs text-stone-300 mt-1">累计获得: {{ pointsRankingList[0].totalPointsEarned }} 分</div>
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
                  ⭐ {{ pointsRankingList[2].points }} <span class="text-xs text-stone-400 font-normal">可用画币</span>
                </div>
                <div class="text-xs text-stone-400 mt-1">累计获得: {{ pointsRankingList[2].totalPointsEarned }} 分</div>
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
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
                <input v-model="pointsSearchQuery" type="text" placeholder="搜索小画家姓名..."
                  class="w-full pl-9 pr-4 py-2 wf-input text-xs placeholder:text-stone-400">
              </div>

              <div class="relative">
                <select v-model="pointsClassFilter" class="appearance-none pl-4 pr-8 py-2 wf-select text-xs font-medium cursor-pointer">
                  <option value="all">🌈 全部班级</option>
                  <option v-for="c in activeClasses" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-[10px] pointer-events-none"></i>
              </div>

              <div class="relative">
                <select v-model="pointsRankingSort" class="appearance-none pl-4 pr-8 py-2 wf-select text-xs font-bold cursor-pointer">
                  <option value="points">⭐ 按当前可用积分</option>
                  <option value="total">🏆 按累计总获得积分</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-[10px] pointer-events-none"></i>
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
                <tr class="border-b border-black/10 dark:border-white/10 text-stone-400" style="background-color: var(--bg-surface-subtle);">
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
                    <span v-else-if="stu.rank === 2" class="text-stone-300 font-black">🥈 02</span>
                    <span v-else-if="stu.rank === 3" class="text-amber-600 font-black">🥉 03</span>
                    <span v-else class="text-stone-400">#{{ stu.rank.toString().padStart(2, '0') }}</span>
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
                        <div class="text-[10px] text-stone-400">{{ stu.age }}岁</div>
                      </div>
                    </div>
                  </td>

                  <td class="py-3.5 px-4">
                    <span class="text-xs text-stone-400 font-medium">{{ stu.className }}</span>
                  </td>

                  <td class="py-3.5 px-4">
                    <span class="font-black font-mono text-base text-amber-400">
                      ⭐ {{ stu.points || 0 }} <span class="text-xs font-normal text-stone-400">分</span>
                    </span>
                  </td>

                  <td class="py-3.5 px-4 font-mono text-stone-300 font-bold">
                    {{ stu.totalPointsEarned || 0 }} 分
                  </td>

                  <td class="py-3.5 px-4">
                    <span class="text-xs px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 font-medium">
                      🎁 {{ stu.redeemedCount || 0 }} 件
                    </span>
                  </td>

                  <td class="py-3.5 px-4 hidden md:table-cell text-xs text-stone-400 font-mono">
                    {{ stu.parentName }} ({{ stu.parentPhone }})
                  </td>

                  <td class="py-3.5 px-5 text-right space-x-2">
                    <button @click="openIndividualPointModal(stu, 'add')" class="wf-btn-primary text-xs py-1 px-3">
                      ⭐ 变更积分
                    </button>
                    <button @click="openIndividualPointModal(stu, 'redeem')" class="wf-btn-outline text-xs py-1 px-2.5 text-amber-400 border-amber-500/30">
                      🎁 兑换
                    </button>
                    <button @click="openStudentProfile(stu)" class="text-xs text-stone-400 hover:text-emerald-400 font-medium">
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
          
          <div class="flex items-center justify-between text-xs text-stone-400">
            <div>正常开班：<strong class="text-stone-200">{{ activeClasses.length }}</strong> 班 · 在读学员：<strong class="text-stone-200">{{ activeStudents.length }}</strong> 人</div>
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
                    <p class="text-xs text-stone-400 font-mono mt-1">
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
                      class="w-7 h-7 rounded-full border-2 border-[var(--bg-surface)] flex items-center justify-center font-mono text-[10px] font-bold text-stone-400"
                      style="background-color: var(--bg-surface-subtle);">
                      +{{ activeStudents.filter(s => s.classId === cls.id).length - 6 }}
                    </div>
                    <span v-if="activeStudents.filter(s => s.classId === cls.id).length === 0" class="text-xs text-stone-400 italic">
                      暂无在读学员
                    </span>
                  </div>

                  <span class="text-xs text-stone-400 font-medium">
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
                  <button @click="archiveClass(cls)" title="归档班级" class="wf-btn-outline text-xs p-1.5 text-stone-400 hover:text-amber-400">
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
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none"></i>
              </div>

              <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
                <input v-model="rosterStudentSearch" type="text" placeholder="搜索学员姓名/电话..."
                  class="w-48 sm:w-56 pl-9 pr-3 py-1.5 wf-input text-xs placeholder:text-stone-400">
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
                <tr class="border-b border-black/10 dark:border-white/10 text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
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
                  <td class="py-3 px-4 text-stone-400 whitespace-nowrap">
                    <span class="font-mono">{{ s.age }}</span>岁 · {{ s.gender }}
                  </td>

                  <!-- 所属班级 (单行高雅线框) -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    <span class="font-bold text-stone-300">{{ getClassById(s.classId).name }}</span>
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
                  <td class="py-3 px-4 font-mono text-stone-400 whitespace-nowrap">
                    <span class="text-stone-300 font-semibold">{{ s.parentName }}</span>
                    <span class="text-stone-500 ml-1">({{ s.parentPhone }})</span>
                  </td>

                  <!-- 备注 -->
                  <td class="py-3 px-4 text-stone-400 text-xs truncate max-w-xs" :title="s.notes || ''">
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
                    <button @click="openEditStudent(s)" class="px-2 py-1 rounded-lg text-xs text-stone-400 hover:text-stone-200 hover:bg-white/5 transition">
                      编辑
                    </button>
                    <button @click="archiveStudent(s)" title="归档该学员" class="px-2 py-1 rounded-lg text-xs text-stone-400 hover:text-amber-400 hover:bg-amber-500/10 transition">
                      归档
                    </button>
                    <button @click="deleteStudent(s)" class="px-2 py-1 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition">
                      删除
                    </button>
                  </td>

                </tr>

                <tr v-if="currentClassStudentsList.length === 0">
                  <td colspan="8" class="py-12 text-center text-stone-400 text-xs">
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
            <p class="text-xs text-stone-400">已结课班级与毕业学员档案安全存放，所有历史考勤、积分流水与账单永久留存，可随时一键恢复。</p>
          </div>

          <!-- 已归档班级 -->
          <div class="space-y-3">
            <h4 class="font-bold text-xs text-stone-400 uppercase tracking-wider">已归档结课班级 ({{ archivedClasses.length }})</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="cls in archivedClasses" :key="cls.id"
                class="wf-card p-4 flex items-center justify-between">
                <div>
                  <h5 class="font-bold text-sm line-through text-stone-400">{{ cls.name }}</h5>
                  <p class="text-xs text-stone-500 font-mono mt-0.5">归档时间: {{ cls.archivedAt }} · 老师: {{ cls.teacher }}</p>
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
              <div v-if="archivedClasses.length === 0" class="col-span-full py-6 text-center text-xs text-stone-400">
                暂无已归档班级
              </div>
            </div>
          </div>

          <!-- 已归档学员 -->
          <div class="space-y-3">
            <h4 class="font-bold text-xs text-stone-400 uppercase tracking-wider">已毕业/归档学员 ({{ archivedStudents.length }})</h4>
            <div class="overflow-x-auto w-full wf-card">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-black/10 dark:border-white/10 text-stone-400" style="background-color: var(--bg-surface-subtle);">
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
                    <td class="py-3 px-4 text-stone-400">{{ getClassById(stu.classId).name }}</td>
                    <td class="py-3 px-4 text-stone-400 font-mono">{{ stu.archivedAt || '-' }}</td>
                    <td class="py-3 px-4 font-mono">{{ stu.totalConsumed || 0 }} 节</td>
                    <td class="py-3 px-4 font-mono text-amber-400">⭐ {{ stu.totalPointsEarned || 0 }} 分</td>
                    <td class="py-3 px-4 text-stone-400 italic">{{ stu.notes || '-' }}</td>
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
                    <td colspan="7" class="py-6 text-center text-xs text-stone-400">
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
            <div class="text-xs text-stone-400 font-mono hidden sm:block">
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
              <p class="text-xs text-stone-400 flex items-center gap-2 flex-wrap">
                <span>时段：<strong class="text-stone-200">{{ selectedClassDetail.schedule }}</strong></span>
                <span>·</span>
                <span>画坊：{{ selectedClassDetail.classroom || '梨香画坊' }}</span>
                <span>·</span>
                <span>主讲老师：<strong class="text-stone-200">{{ selectedClassDetail.teacher }}</strong></span>
                <span v-if="selectedClassDetail.notes">·</span>
                <span v-if="selectedClassDetail.notes" class="italic text-stone-300">{{ selectedClassDetail.notes }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- 4 维班级指标卡 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-stone-400">班级在读人数</div>
            <div class="text-3xl font-black font-mono"
              :class="classDetailStats.studentCount >= classDetailStats.capacity ? 'text-amber-400' : 'text-emerald-400'">
              {{ classDetailStats.studentCount }} <span class="text-xs font-normal text-stone-400">/ {{ classDetailStats.capacity }} 人</span>
            </div>
            <div class="text-[11px] text-stone-400 font-mono">
              班级容量满载率：{{ ((classDetailStats.studentCount / classDetailStats.capacity) * 100).toFixed(0) }}%
            </div>
          </div>

          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-stone-400">本班累计消课</div>
            <div class="text-3xl font-black font-mono text-emerald-400">
              {{ classDetailStats.totalConsumed }} <span class="text-xs font-normal text-stone-400">节</span>
            </div>
            <div class="text-[11px] text-stone-400">
              已完成考勤：{{ classDetailStats.totalSessions }} 节课
            </div>
          </div>

          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-stone-400">班级平均出勤率</div>
            <div class="text-3xl font-black font-mono text-[#10E57A]">
              {{ classDetailStats.attendanceRate }}
            </div>
            <div class="text-[11px] text-stone-400 font-mono">
              全员到课情况良好
            </div>
          </div>

          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-stone-400">本班画币积分池</div>
            <div class="text-3xl font-black font-mono text-amber-400">
              ⭐ {{ classDetailStats.pointsPool }} <span class="text-xs font-normal text-stone-400">分</span>
            </div>
            <div class="text-[11px] text-stone-400">
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
                <tr class="border-b border-black/10 dark:border-white/10 text-stone-400" style="background-color: var(--bg-surface-subtle);">
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

                  <td class="py-3.5 px-4 text-stone-400 whitespace-nowrap">{{ stu.age }}岁 · {{ stu.gender }}</td>
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

                  <td class="py-3.5 px-4 font-mono text-stone-300 whitespace-nowrap">{{ stu.totalConsumed || 0 }} 节</td>
                  <td class="py-3.5 px-4 font-mono text-stone-400 whitespace-nowrap">{{ stu.parentName }} ({{ stu.parentPhone }})</td>
                  <td class="py-3.5 px-4 text-stone-400 text-xs italic">{{ stu.notes || '-' }}</td>
                  <td class="py-3.5 px-5 text-right space-x-2 whitespace-nowrap">
                    <button @click="openIndividualPointModal(stu, 'add')" class="text-xs text-amber-400 font-bold hover:underline">⭐ 变更积分</button>
                    <button @click="openRecharge(stu)" class="text-xs text-emerald-400 font-bold hover:underline">续费</button>
                    <button @click="openEditStudent(stu)" class="text-stone-400 hover:text-emerald-400">编辑</button>
                    <button @click="openStudentProfile(stu)" class="text-xs text-stone-400 hover:text-emerald-400">档案 ↗</button>
                  </td>
                </tr>

                <tr v-if="classDetailStudents.length === 0">
                  <td colspan="8" class="py-16 text-center text-stone-400 text-xs">
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
                <tr class="border-b border-black/10 dark:border-white/10 text-stone-400" style="background-color: var(--bg-surface-subtle);">
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
                  <td class="py-3.5 px-5 font-mono text-stone-400 whitespace-nowrap">{{ att.date }}</td>
                  <td class="py-3.5 px-4 font-black text-sm text-stone-100 whitespace-nowrap">{{ att.theme }}</td>
                  <td class="py-3.5 px-4 text-stone-400 whitespace-nowrap">{{ att.teacher }}</td>
                  <td class="py-3.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">{{ att.presentCount || 0 }} 人</td>
                  <td class="py-3.5 px-4 font-mono font-bold text-rose-400 whitespace-nowrap">{{ att.leaveCount || 0 }} 人</td>
                  <td class="py-3.5 px-4 font-mono font-bold text-purple-400 whitespace-nowrap">{{ att.holidayCount || 0 }} 人</td>
                  <td class="py-3.5 px-5 text-right whitespace-nowrap">
                    <button @click="goToAttendanceForClass(selectedClassDetail.id)" class="text-xs text-emerald-400 font-bold hover:underline mr-3">在大表查看</button>
                    <button @click="deleteMatrixRow(att)" class="text-stone-400 hover:text-rose-400 text-xs">撤销/删除</button>
                  </td>
                </tr>

                <tr v-if="classDetailAttendance.length === 0">
                  <td colspan="7" class="py-16 text-center text-stone-400 text-xs">
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
                <tr class="border-b border-black/10 dark:border-white/10 text-stone-400" style="background-color: var(--bg-surface-subtle);">
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
                  <td class="py-3.5 px-5 font-mono text-stone-400 whitespace-nowrap">{{ log.time }}</td>
                  <td class="py-3.5 px-4 font-bold whitespace-nowrap">{{ log.studentName }}</td>
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <span class="text-xs font-bold px-2.5 py-0.5 rounded-full inline-block"
                      :class="log.change > 0 ? 'wf-badge-green' : log.change < 0 ? 'wf-badge-red' : 'wf-badge-yellow'">
                      {{ log.type }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-mono font-bold whitespace-nowrap" :class="log.change > 0 ? 'text-[#10E57A]' : log.change < 0 ? 'text-rose-400' : 'text-stone-400'">
                    {{ log.change > 0 ? '+' + log.change : log.change === 0 ? '0' : log.change }} 节
                  </td>
                  <td class="py-3.5 px-4 font-bold font-mono text-stone-300 whitespace-nowrap">{{ log.balanceAfter }} 节</td>
                  <td class="py-3.5 px-5 text-stone-300">{{ log.relatedInfo }}</td>
                  <td class="py-3.5 px-4 text-stone-400 whitespace-nowrap">{{ log.operator || '陈老师' }}</td>
                </tr>

                <tr v-if="classDetailLogs.length === 0">
                  <td colspan="7" class="py-16 text-center text-stone-400 text-xs">
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
            <p class="text-xs text-stone-400 mt-0.5">实时基于具体考勤信息汇总周/月消课产值；收费充值与课消流水全链路留痕。</p>
          </div>

          <div class="flex items-center gap-2">
            <button @click="openRecharge(activeStudents[0] || {})" class="wf-btn-primary text-xs py-2 px-4 shadow-sm">
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
            <div class="text-xs text-stone-400 flex items-center justify-between">
              <span class="font-bold text-stone-300">📅 本月收费入账</span>
              <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15"
                :class="financeActiveKpi === 'month' ? 'bg-emerald-400 text-black font-black border-transparent' : 'text-stone-400 bg-white/5'">
                {{ financeActiveKpi === 'month' ? '已下钻 ▾' : '当月实收 ↗' }}
              </span>
            </div>
            <div class="text-3xl font-black font-mono text-emerald-400">
              ¥ {{ financeStats.monthIncome.toLocaleString() }}
            </div>
            <div class="text-[11px] text-stone-400 font-mono flex items-center justify-between pt-2 border-t border-black/[0.06] dark:border-white/10">
              <span>当月入账 {{ financeStats.monthOrderCount }} 笔</span>
              <span class="text-[10px] text-emerald-400 font-bold hover:underline">查看明细 ↗</span>
            </div>
          </div>

          <!-- 2. 本年累计营收 -->
          <div @click="selectFinanceKpi('year')"
            class="wf-card-interactive p-5 space-y-2 transition flex flex-col justify-between"
            :class="financeActiveKpi === 'year' ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30' : ''">
            <div class="text-xs text-stone-400 flex items-center justify-between">
              <span class="font-bold text-stone-300">📈 本年累计营收</span>
              <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15"
                :class="financeActiveKpi === 'year' ? 'bg-emerald-400 text-black font-black border-transparent' : 'text-stone-400 bg-white/5'">
                {{ financeActiveKpi === 'year' ? '已下钻 ▾' : '年度拆解 ↗' }}
              </span>
            </div>
            <div class="text-3xl font-black font-mono text-stone-100">
              ¥ {{ financeStats.yearIncome.toLocaleString() }}
            </div>
            <div class="text-[11px] text-stone-400 font-mono flex items-center justify-between pt-2 border-t border-black/[0.06] dark:border-white/10">
              <span>本年累计 {{ financeStats.yearOrderCount }} 笔订单</span>
              <span class="text-[10px] text-stone-300 font-bold hover:underline">月度趋势 ↗</span>
            </div>
          </div>

          <!-- 3. 机构累计总营收 -->
          <div @click="selectFinanceKpi('total')"
            class="wf-card-interactive p-5 space-y-2 transition flex flex-col justify-between"
            :class="financeActiveKpi === 'total' ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30' : ''">
            <div class="text-xs text-stone-400 flex items-center justify-between">
              <span class="font-bold text-stone-300">💎 机构累计总营收</span>
              <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15"
                :class="financeActiveKpi === 'total' ? 'bg-emerald-400 text-black font-black border-transparent' : 'text-stone-400 bg-white/5'">
                {{ financeActiveKpi === 'total' ? '已下钻 ▾' : '历史总额 ↗' }}
              </span>
            </div>
            <div class="text-3xl font-black font-mono text-stone-100">
              ¥ {{ financeStats.totalIncome.toLocaleString() }}
            </div>
            <div class="text-[11px] text-stone-400 font-mono flex items-center justify-between pt-2 border-t border-black/[0.06] dark:border-white/10">
              <span>全校总消课 {{ consumptionSummaryKPI.totalAllConsumed }} 节</span>
              <span class="text-[10px] text-stone-300 font-bold hover:underline">历史总账 ↗</span>
            </div>
          </div>

          <!-- 4. 待续费预估收入 -->
          <div @click="selectFinanceKpi('renewal')"
            class="wf-card-interactive p-5 space-y-2 transition flex flex-col justify-between"
            :class="financeSubTab === 'renewal' || financeActiveKpi === 'renewal' ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30' : ''">
            <div class="text-xs text-stone-400 flex items-center justify-between">
              <span class="font-bold text-stone-300">⏳ 待续费预估收入</span>
              <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15"
                :class="financeSubTab === 'renewal' || financeActiveKpi === 'renewal' ? 'bg-amber-400 text-black font-black border-transparent' : 'text-stone-400 bg-white/5'">
                {{ financeSubTab === 'renewal' || financeActiveKpi === 'renewal' ? '已展开 ▾' : '需提醒 ↗' }}
              </span>
            </div>
            <div class="text-3xl font-black font-mono text-amber-400">
              ¥ {{ financeStats.potentialRenewalIncome.toLocaleString() }}
            </div>
            <div class="text-[11px] text-stone-400 font-mono flex items-center justify-between pt-2 border-t border-black/[0.06] dark:border-white/10">
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
              <p class="text-xs text-stone-400 mt-0.5">点击下方任意月份卡片，可直接快速过滤查看该月份的所有入账订单。</p>
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
                <span class="text-[10px] text-stone-400 font-mono">{{ m.count }}笔</span>
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
              <p class="text-xs text-stone-400 mt-0.5">机构历年累计总收费、累计总消课课时与全校消课总产值沉淀。</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div v-for="y in yearlyRevenueHistory" :key="y.year"
              class="wf-card p-4 flex flex-col justify-between space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm font-mono text-stone-200">{{ y.year }} 年度</span>
                <span class="text-xs text-stone-400 font-mono">{{ y.count }} 笔订单</span>
              </div>
              <div class="text-2xl font-black font-mono text-emerald-400">
                ¥ {{ (y.total || 0).toLocaleString() }}
              </div>
              <div class="text-xs text-stone-400 font-mono flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10">
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
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
                <input v-model="financeSearchQuery" type="text" placeholder="搜索订单号 / 学员姓名 / 备注 / 经办人..."
                  class="w-full pl-9 pr-4 py-2 wf-input text-xs placeholder:text-stone-400">
              </div>

              <div class="relative">
                <select v-model="financePayMethodFilter" class="appearance-none pl-4 pr-8 py-2 wf-select text-xs font-bold cursor-pointer">
                  <option value="all">💳 全部支付方式</option>
                  <option value="微信支付">微信支付</option>
                  <option value="支付宝">支付宝</option>
                  <option value="现金">现金</option>
                  <option value="银行转账">银行转账</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-[10px] pointer-events-none"></i>
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

            <button @click="openRecharge(activeStudents[0] || {})" class="wf-btn-primary text-xs py-2 px-3.5 whitespace-nowrap">
              <i class="fa-solid fa-plus-circle text-xs mr-1"></i>
              <span>新收费录入</span>
            </button>
          </div>

          <!-- 收费订单明细大表 -->
          <div class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse select-none">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
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
                  <td class="py-3 px-4 font-mono text-stone-400 text-xs whitespace-nowrap">{{ order.id }}</td>
                  <td class="py-3 px-4 font-mono text-stone-400 text-xs whitespace-nowrap">{{ order.payDate }}</td>
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
                  <td class="py-3 px-4 text-stone-400 text-xs whitespace-nowrap">{{ order.operator || '陈老师' }}</td>
                  <td class="py-3 px-4 text-stone-300 text-xs">{{ order.remark || '-' }}</td>
                  <td class="py-3 px-4 text-right whitespace-nowrap">
                    <button @click="openReceiptModal(order)" class="wf-btn-outline text-xs py-1 px-2.5 text-emerald-400 border-emerald-500/30">
                      <i class="fa-solid fa-receipt mr-1"></i>
                      <span>电子收据</span>
                    </button>
                  </td>
                </tr>

                <tr v-if="filteredPaymentOrders.length === 0">
                  <td colspan="9" class="py-16 text-center text-stone-400 text-xs">
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
              <div class="text-xs text-stone-400 flex items-center justify-between">
                <span class="font-bold text-stone-300">📅 本周教学消课</span>
                <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15"
                  :class="consumptionPeriodType === 'week' ? 'bg-emerald-400 text-black font-black border-transparent' : 'text-stone-400 bg-white/5'">周度</span>
              </div>
              <div class="text-2xl font-black font-mono text-emerald-400">
                {{ consumptionSummaryKPI.thisWeekConsumed }} <span class="text-xs font-normal text-stone-400">节课时</span>
              </div>
              <div class="text-[11px] text-stone-400 flex items-center justify-between pt-1 border-t border-black/[0.06] dark:border-white/10">
                <span>完成 {{ consumptionSummaryKPI.thisWeekSessions }} 堂课</span>
                <span class="font-mono text-emerald-400 font-bold">出勤率 {{ consumptionSummaryKPI.thisWeekRate }}</span>
              </div>
            </div>

            <!-- 本月累计消课 -->
            <div @click="consumptionPeriodType = 'month'" class="wf-card-interactive p-4 space-y-1.5 transition flex flex-col justify-between"
              :class="consumptionPeriodType === 'month' ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30' : ''">
              <div class="text-xs text-stone-400 flex items-center justify-between">
                <span class="font-bold text-stone-300">🗓️ 本月累计消课</span>
                <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15"
                  :class="consumptionPeriodType === 'month' ? 'bg-emerald-400 text-black font-black border-transparent' : 'text-stone-400 bg-white/5'">月度</span>
              </div>
              <div class="text-2xl font-black font-mono text-emerald-400">
                {{ consumptionSummaryKPI.thisMonthConsumed }} <span class="text-xs font-normal text-stone-400">节课时</span>
              </div>
              <div class="text-[11px] text-stone-400 flex items-center justify-between pt-1 border-t border-black/[0.06] dark:border-white/10">
                <span>完成 {{ consumptionSummaryKPI.thisMonthSessions }} 堂课</span>
                <span class="font-mono text-emerald-400 font-bold">出勤率 {{ consumptionSummaryKPI.thisMonthRate }}</span>
              </div>
            </div>

            <!-- 当月消课教学价值 -->
            <div class="wf-card p-4 space-y-1.5 flex flex-col justify-between">
              <div class="text-xs text-stone-400 flex items-center justify-between">
                <span class="font-bold text-stone-300">💎 当月消课教学价值</span>
                <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15 text-stone-400 bg-white/5">产值折算</span>
              </div>
              <div class="text-2xl font-black font-mono text-amber-400">
                ¥ {{ consumptionSummaryKPI.thisMonthValue.toLocaleString() }}
              </div>
              <div class="text-[11px] text-stone-400 pt-1 border-t border-black/[0.06] dark:border-white/10 font-mono">
                按行业标准课消价值估算
              </div>
            </div>

            <!-- 机构累计总消课 -->
            <div class="wf-card p-4 space-y-1.5 flex flex-col justify-between">
              <div class="text-xs text-stone-400 flex items-center justify-between">
                <span class="font-bold text-stone-300">📈 机构累计总消课</span>
                <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-black/10 dark:border-white/15 text-stone-400 bg-white/5">总览</span>
              </div>
              <div class="text-2xl font-black font-mono text-stone-100">
                {{ consumptionSummaryKPI.totalAllConsumed }} <span class="text-xs font-normal text-stone-400">节</span>
              </div>
              <div class="text-[11px] text-stone-400 flex items-center justify-between pt-1 border-t border-black/[0.06] dark:border-white/10 font-mono">
                <span>总到课 {{ consumptionSummaryKPI.totalAllPresentCount }} 人次</span>
                <span class="text-stone-300">总出勤 {{ consumptionSummaryKPI.totalAllRate }}</span>
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
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-[10px] pointer-events-none"></i>
              </div>

              <div class="relative">
                <select v-model="consumptionSelectedMonth" class="appearance-none pl-4 pr-8 py-2 wf-select text-xs font-bold cursor-pointer font-mono">
                  <option v-for="m in availableMonths" :key="m" :value="m">{{ m }} 月度</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-[10px] pointer-events-none"></i>
              </div>
            </div>
          </div>

          <!-- 维度 1: 🗓️ 月度课消汇总明细 -->
          <div v-if="consumptionPeriodType === 'month'" class="space-y-4">
            <div class="overflow-x-auto w-full wf-card">
              <table class="w-full text-left text-xs sm:text-sm border-collapse select-none">
                <thead>
                  <tr class="border-b border-black/10 dark:border-white/10 text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
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
                      <td class="py-3 px-4 font-bold font-mono text-sm text-stone-100 flex items-center gap-2">
                        <i :class="m.expanded ? 'fa-chevron-down' : 'fa-chevron-right'" class="fa-solid text-[9px] text-stone-400"></i>
                        <span>{{ m.monthLabel }}</span>
                        <span v-if="m.monthKey === currentYearMonth" class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-normal">当月</span>
                      </td>
                      <td class="py-3 px-4 font-mono font-black text-sm text-emerald-400">
                        {{ m.consumedHours }} 节
                      </td>
                      <td class="py-3 px-4 font-mono text-stone-300">{{ m.sessionCount }} 堂</td>
                      <td class="py-3 px-4 font-mono text-stone-400">{{ m.totalHeadcount }} 人次</td>
                      <td class="py-3 px-4 font-mono text-[#10E57A] font-bold">{{ m.presentCount }} 人次</td>
                      <td class="py-3 px-4 font-mono text-rose-400">{{ m.leaveCount }} 人次</td>
                      <td class="py-3 px-4 font-mono font-bold text-stone-200">{{ m.attendanceRate }}</td>
                      <td class="py-3 px-4 font-mono font-black text-sm text-amber-400 text-right">
                        ¥ {{ (m.estimatedValue || 0).toLocaleString() }}
                      </td>
                    </tr>

                    <!-- 月度下各班级课消展开明细 -->
                    <tr v-if="m.expanded" class="bg-black/[0.03] dark:bg-white/[0.02]">
                      <td colspan="8" class="p-3 pl-8">
                        <div class="border-l-2 border-emerald-500/40 pl-3 space-y-1.5">
                          <div class="text-[11px] text-stone-400 font-bold mb-1">【{{ m.monthLabel }}】各班级具体消课明细：</div>
                          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            <div v-for="cItem in (m.sessions || [])" :key="cItem.id"
                              class="p-2.5 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-between text-xs" style="background-color: var(--bg-surface);">
                              <div>
                                <div class="font-bold text-stone-200">{{ cItem.theme }}</div>
                                <div class="text-[10px] text-stone-400 font-mono mt-0.5">{{ cItem.className }} · {{ cItem.date }}</div>
                              </div>
                              <div class="text-right font-mono">
                                <div class="font-bold text-emerald-400">{{ cItem.consumedHours }} 节</div>
                                <div class="text-[10px] text-stone-400">到课 {{ cItem.presentCount }} 人</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>

                  <tr v-if="monthlyConsumptionList.length === 0">
                    <td colspan="8" class="py-16 text-center text-stone-400 text-xs">
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
                  <tr class="border-b border-black/10 dark:border-white/10 text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
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
                      <td class="py-3 px-4 font-bold font-mono text-stone-100 flex items-center gap-2">
                        <i :class="w.expanded ? 'fa-chevron-down' : 'fa-chevron-right'" class="fa-solid text-[9px] text-stone-400"></i>
                        <span>{{ w.weekLabel }}</span>
                      </td>
                      <td class="py-3 px-4 font-mono font-black text-sm text-emerald-400">
                        {{ w.consumedHours }} 节
                      </td>
                      <td class="py-3 px-4 font-mono text-stone-300">{{ w.sessionCount }} 堂</td>
                      <td class="py-3 px-4 font-mono text-[#10E57A] font-bold">{{ w.presentCount }} 人次</td>
                      <td class="py-3 px-4 font-mono text-rose-400">{{ w.leaveCount }} 人次</td>
                      <td class="py-3 px-4 font-mono font-bold text-stone-200">{{ w.attendanceRate }}</td>
                      <td class="py-3 px-4 font-mono font-black text-sm text-amber-400 text-right">
                        ¥ {{ (w.estimatedValue || 0).toLocaleString() }}
                      </td>
                    </tr>

                    <!-- 周度下具体课次明细 -->
                    <tr v-if="w.expanded" class="bg-black/[0.03] dark:bg-white/[0.02]">
                      <td colspan="7" class="p-3 pl-8">
                        <div class="border-l-2 border-emerald-500/40 pl-3 space-y-1.5">
                          <div class="text-[11px] text-stone-400 font-bold mb-1">【{{ w.weekLabel }}】具体授课考勤明细：</div>
                          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            <div v-for="sess in (w.sessions || [])" :key="sess.id"
                              class="p-2.5 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-between text-xs" style="background-color: var(--bg-surface);">
                              <div>
                                <div class="font-bold text-stone-200 flex items-center gap-1">
                                  <span>{{ sess.theme }}</span>
                                  <span class="text-[10px] text-stone-400 font-normal">({{ sess.className }})</span>
                                </div>
                                <div class="text-[10px] text-stone-400 font-mono mt-0.5">{{ sess.date }} · {{ sess.teacher }}</div>
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
                    <td colspan="7" class="py-16 text-center text-stone-400 text-xs">
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
                  <tr class="border-b border-black/10 dark:border-white/10 text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
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
                    <td class="py-3 px-4 font-mono text-stone-400 text-xs whitespace-nowrap">{{ c.schedule }}</td>
                    <td class="py-3 px-4 text-stone-300 whitespace-nowrap">{{ c.teacher }}</td>
                    <td class="py-3 px-4 font-mono text-stone-300 whitespace-nowrap">{{ c.studentCount }} 人</td>
                    <td class="py-3 px-4 font-mono font-black text-sm text-emerald-400 whitespace-nowrap">
                      {{ c.totalConsumed }} 节
                    </td>
                    <td class="py-3 px-4 font-mono text-stone-300 whitespace-nowrap">{{ c.totalSessions }} 堂</td>
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
                  <tr class="border-b border-black/10 dark:border-white/10 text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
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
                    <td class="py-3 px-4 text-stone-400 whitespace-nowrap">{{ s.className }}</td>
                    <td class="py-3 px-4 font-mono font-black text-sm text-emerald-400 whitespace-nowrap">
                      {{ s.totalConsumed }} 节
                    </td>
                    <td class="py-3 px-4 font-mono font-bold text-stone-200 whitespace-nowrap">{{ s.presentCount }} 次</td>
                    <td class="py-3 px-4 font-mono font-bold text-rose-400 whitespace-nowrap">{{ s.leaveCount }} 次</td>
                    <td class="py-3 px-4 font-mono font-bold text-[#10E57A] whitespace-nowrap">{{ s.attendanceRate }}</td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      <span class="text-xs font-bold px-2.5 py-0.5 rounded border inline-block"
                        :class="s.leaveCount >= 2 ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'">
                        {{ s.statusTag }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right whitespace-nowrap">
                      <button @click="openStudentProfile(s)" class="text-xs text-stone-400 hover:text-emerald-400 font-medium">查看档案 ↗</button>
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
              <div class="text-xs text-stone-400 font-mono">
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
                <tr class="border-b border-black/10 dark:border-white/10 text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
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

                  <td class="py-3 px-4 text-stone-400 whitespace-nowrap">{{ stu.className }}</td>
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

                  <td class="py-3 px-4 font-mono text-stone-300 whitespace-nowrap">
                    {{ stu.parentName }} ({{ stu.parentPhone }})
                  </td>

                  <td class="py-3 px-4 text-stone-400 text-xs whitespace-nowrap">
                    {{ stu.suggestedPackage }}
                  </td>

                  <td class="py-3 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                    ¥ {{ stu.estimatedAmount.toLocaleString() }}
                  </td>

                  <td class="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                    <button @click="openRecharge(stu)" class="wf-btn-primary text-xs py-1 px-2.5">
                      <span>录入续费</span>
                    </button>
                    <button @click="openStudentProfile(stu)" class="text-xs text-stone-400 hover:text-emerald-400 font-medium">
                      档案 ↗
                    </button>
                  </td>
                </tr>

                <tr v-if="renewalWarningStudents.length === 0">
                  <td colspan="8" class="py-16 text-center text-stone-400 text-xs">
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
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
                <input v-model="recordsSearchQuery" type="text" placeholder="搜索学员姓名 / 课程主题 / 经办人..."
                  class="w-full pl-9 pr-4 py-2 wf-input text-xs placeholder:text-stone-400">
              </div>

              <div class="relative">
                <select v-model="recordsHourTypeFilter" class="appearance-none pl-4 pr-8 py-2 wf-select text-xs font-bold cursor-pointer">
                  <option value="all">⚡ 全部变动类型</option>
                  <option value="大表考勤消课">大表考勤消课</option>
                  <option value="补课单独消课">补课单独消课</option>
                  <option value="续费充值入账">续费充值入账</option>
                  <option value="考勤撤销返还">考勤撤销返还</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-[10px] pointer-events-none"></i>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse select-none">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
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
                  <td class="py-3 px-4 font-mono text-stone-400 text-xs whitespace-nowrap">{{ log.time }}</td>
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
                    :class="log.change > 0 ? 'text-[#10E57A]' : log.change < 0 ? 'text-rose-400' : 'text-stone-400'">
                    {{ log.change > 0 ? '+' + log.change : log.change === 0 ? '0' : log.change }} 节
                  </td>
                  <td class="py-3 px-4 font-mono font-bold text-stone-300 whitespace-nowrap">{{ log.balanceAfter }} 节</td>
                  <td class="py-3 px-4 text-stone-300 text-xs">{{ log.relatedInfo }}</td>
                  <td class="py-3 px-4 text-stone-400 text-xs whitespace-nowrap font-medium">{{ log.operator || '陈老师' }}</td>
                </tr>

                <tr v-if="filteredHourLogs.length === 0">
                  <td colspan="7" class="py-12 text-center text-stone-400 text-xs">
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
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
                <input v-model="recordsSearchQuery" type="text" placeholder="搜索学员姓名 / 原因 / 礼物名称..."
                  class="w-full pl-9 pr-4 py-2 wf-input text-xs placeholder:text-stone-400">
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
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-[10px] pointer-events-none"></i>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto w-full wf-card">
            <table class="w-full text-left text-xs sm:text-sm border-collapse select-none">
              <thead>
                <tr class="border-b border-black/10 dark:border-white/10 text-stone-400 font-bold" style="background-color: var(--bg-surface-subtle);">
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
                  <td class="py-3 px-4 font-mono text-stone-400 text-xs whitespace-nowrap">{{ plog.time }}</td>
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
                  <td class="py-3 px-4 text-stone-300 text-xs">{{ plog.reason }}</td>
                  <td class="py-3 px-4 text-stone-400 text-xs whitespace-nowrap font-medium">{{ plog.operator || '陈老师' }}</td>
                </tr>

                <tr v-if="filteredPointLogs.length === 0">
                  <td colspan="7" class="py-12 text-center text-stone-400 text-xs">
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
            <div class="text-xs text-stone-400 font-mono hidden sm:block">
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
              <p class="text-xs text-stone-400 flex items-center gap-2 flex-wrap">
                <span>班级：<strong class="text-stone-200">{{ getClassById(profileStudent.classId).name }}</strong></span>
                <span>·</span>
                <span>家长联系方式：<strong class="text-stone-200">{{ profileStudent.parentName }}</strong> ({{ profileStudent.parentPhone }})</span>
                <span v-if="profileStudent.notes">·</span>
                <span v-if="profileStudent.notes" class="italic text-stone-300">习惯备注：{{ profileStudent.notes }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- 4 维核心业务指标卡 (大号宽敞卡片) -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-stone-400">当前剩余课时</div>
            <div class="text-3xl font-black font-mono"
              :class="profileStudent.remainHours <= 0 ? 'text-rose-400' : profileStudent.remainHours <= 3 ? 'text-amber-400' : 'text-emerald-400'">
              {{ profileStudent.remainHours }} <span class="text-xs font-normal text-stone-400">节</span>
            </div>
            <div class="text-[11px] text-stone-400 font-mono">
              {{ profileStudent.remainHours <= 0 ? '已耗尽，需续费' : profileStudent.remainHours <= 3 ? '预警期，待提醒续费' : '课时充足' }}
            </div>
          </div>

          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-stone-400 items-center justify-between flex">
              <span>可用画币积分</span>
              <span @click="openIndividualPointModal(profileStudent, 'add')" class="text-[10px] text-amber-400 cursor-pointer hover:underline">变更 ✏️</span>
            </div>
            <div class="text-3xl font-black font-mono text-amber-400">
              ⭐ {{ profileStudent.points || 0 }} <span class="text-xs font-normal text-stone-400">分</span>
            </div>
            <div class="text-[11px] text-stone-400">
              累计总获得：{{ profileStudent.totalPointsEarned || 0 }} 分
            </div>
          </div>

          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-stone-400">出勤率统计</div>
            <div class="text-3xl font-black font-mono text-[#10E57A]">
              {{ profileStudentStats.attendanceRate }}
            </div>
            <div class="text-[11px] text-stone-400 font-mono">
              到课 {{ profileStudentStats.presentCount }} 节 · 请假未到 {{ profileStudentStats.leaveCount }} 节
            </div>
          </div>

          <div class="wf-card p-5 space-y-1">
            <div class="text-xs text-stone-400">累计消课与兑换</div>
            <div class="text-3xl font-black font-mono text-emerald-400">
              {{ profileStudent.totalConsumed || 0 }} <span class="text-xs font-normal text-stone-400">节</span>
            </div>
            <div class="text-[11px] text-stone-400">
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
                <tr class="border-b border-black/10 dark:border-white/10 text-stone-400" style="background-color: var(--bg-surface-subtle);">
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
                  <td class="py-3.5 px-5 font-mono text-stone-400 whitespace-nowrap">{{ att.date }}</td>
                  <td class="py-3.5 px-4 font-black text-sm text-stone-100 whitespace-nowrap">{{ att.theme }}</td>
                  <td class="py-3.5 px-4 text-stone-400 whitespace-nowrap">{{ att.className }}</td>
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <span class="text-xs font-bold px-2.5 py-0.5 rounded-full inline-block"
                      :class="att.status === '到课' ? 'wf-badge-green' : att.status === '未到' || att.status === '请假' ? 'wf-badge-red' : 'wf-badge-purple'">
                      {{ att.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-mono font-bold whitespace-nowrap" :class="att.deductHours > 0 ? 'text-rose-400' : 'text-stone-400'">
                    {{ att.deductHours > 0 ? '-' + att.deductHours + ' 节' : '0 节' }}
                  </td>
                  <td class="py-3.5 px-4 text-stone-400 whitespace-nowrap">{{ att.teacher }}</td>
                  <td class="py-3.5 px-5 text-stone-300">
                    {{ att.note || '-' }}
                  </td>
                </tr>

                <tr v-if="profileStudentAttendanceList.length === 0">
                  <td colspan="7" class="py-16 text-center text-stone-400 text-xs">
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
                <tr class="border-b border-black/10 dark:border-white/10 text-stone-400" style="background-color: var(--bg-surface-subtle);">
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
                  <td class="py-3.5 px-5 font-mono text-stone-400 whitespace-nowrap">{{ plog.time }}</td>
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
                  <td class="py-3.5 px-5 text-stone-300">{{ plog.reason }}</td>
                  <td class="py-3.5 px-4 text-stone-400 whitespace-nowrap">{{ plog.operator || '陈老师' }}</td>
                </tr>

                <tr v-if="profileStudentPointLogs.length === 0">
                  <td colspan="6" class="py-16 text-center text-stone-400 text-xs">
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
                <tr class="border-b border-black/10 dark:border-white/10 text-stone-400" style="background-color: var(--bg-surface-subtle);">
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
                  <td class="py-3.5 px-5 font-mono text-stone-400 whitespace-nowrap">{{ log.time }}</td>
                  <td class="py-3.5 px-4 font-bold whitespace-nowrap">
                    <span class="text-xs font-bold px-2.5 py-0.5 rounded-full inline-block"
                      :class="log.change > 0 ? 'wf-badge-green' : log.change < 0 ? 'wf-badge-red' : 'wf-badge-yellow'">
                      {{ log.type }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-mono font-bold whitespace-nowrap" :class="log.change > 0 ? 'text-[#10E57A]' : log.change < 0 ? 'text-rose-400' : 'text-stone-400'">
                    {{ log.change > 0 ? '+' + log.change : log.change === 0 ? '0' : log.change }} 节
                  </td>
                  <td class="py-3.5 px-4 font-bold font-mono text-stone-300 whitespace-nowrap">{{ log.balanceAfter }} 节</td>
                  <td class="py-3.5 px-5 text-stone-300">{{ log.relatedInfo }}</td>
                  <td class="py-3.5 px-4 text-stone-400 whitespace-nowrap">{{ log.operator || '陈老师' }}</td>
                </tr>

                <tr v-if="profileStudentLogs.length === 0">
                  <td colspan="6" class="py-16 text-center text-stone-400 text-xs">
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
          <button @click="showEditAttendanceModal = false" class="text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-stone-400 mb-1 font-semibold">课程绘画主题 *</label>
            <input v-model="editingAttendanceForm.theme" type="text" placeholder="例: 《梵高的星空》" class="w-full px-3 py-2 wf-input font-bold text-sm text-emerald-400">
          </div>

          <div>
            <label class="block text-stone-400 mb-1 font-semibold">上课日期 *</label>
            <input v-model="editingAttendanceForm.rawDate" type="date" class="w-full px-3 py-2 wf-input font-mono font-bold">
            <div class="text-[11px] text-stone-400 font-mono mt-1">
              保存后将格式化为：<strong class="text-emerald-400">{{ formatChineseDateWithWeekday(editingAttendanceForm.rawDate) }}</strong>
            </div>
          </div>

          <div>
            <label class="block text-stone-400 mb-1 font-semibold">任课主讲老师</label>
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
            <p class="text-xs text-stone-400 mt-0.5">
              正在操作学员：<strong class="text-emerald-400 font-bold text-sm">{{ individualPointForm.studentName }}</strong>
            </p>
          </div>
          <button @click="showIndividualPointModal = false" class="text-stone-400 hover:text-white p-1">
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

          <div class="text-xl font-mono font-bold text-stone-400">➔</div>

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
            :class="individualPointForm.actionType === 'add' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' : 'text-stone-400'"
            class="py-1.5 rounded-lg text-xs transition text-center">
            🟢 奖励加分
          </button>
          <button @click="individualPointForm.actionType = 'deduct'"
            :class="individualPointForm.actionType === 'deduct' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold' : 'text-stone-400'"
            class="py-1.5 rounded-lg text-xs transition text-center">
            🔴 扣除扣分
          </button>
          <button @click="individualPointForm.actionType = 'set'"
            :class="individualPointForm.actionType === 'set' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold' : 'text-stone-400'"
            class="py-1.5 rounded-lg text-xs transition text-center">
            ⚙️ 直接校准
          </button>
          <button @click="individualPointForm.actionType = 'redeem'"
            :class="individualPointForm.actionType === 'redeem' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold' : 'text-stone-400'"
            class="py-1.5 rounded-lg text-xs transition text-center">
            🎁 礼物兑换
          </button>
        </div>

        <!-- 内容区域 (根据不同模式呈现) -->
        <div class="space-y-3 overflow-y-auto flex-1 pr-1 text-xs">
          
          <!-- 模式 1: 🟢 奖励加分 (快捷预设按钮 + 自定义点数) -->
          <div v-if="individualPointForm.actionType === 'add'" class="space-y-3">
            <div>
              <label class="block text-stone-400 mb-1.5 font-semibold">快捷好习惯 / 表现奖励选项：</label>
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
                <label class="block text-stone-400 mb-1 font-semibold">奖励画币分值 (+)*</label>
                <input v-model.number="individualPointForm.points" type="number" min="1" max="1000"
                  class="w-full px-3 py-2 wf-input text-emerald-400 font-bold font-mono text-sm">
              </div>
              <div>
                <label class="block text-stone-400 mb-1 font-semibold">奖励原因说明 *</label>
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
                <label class="block text-stone-400 mb-1 font-semibold">扣除画币分值 (-)*</label>
                <input v-model.number="individualPointForm.points" type="number" min="1" :max="individualPointForm.currentPoints"
                  class="w-full px-3 py-2 wf-input text-rose-400 font-bold font-mono text-sm">
              </div>
              <div>
                <label class="block text-stone-400 mb-1 font-semibold">扣除原因说明 *</label>
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
                <label class="block text-stone-400 mb-1 font-semibold">校准后目标积分余额 *</label>
                <input v-model.number="individualPointForm.targetPoints" type="number" min="0" max="99999"
                  class="w-full px-3 py-2 wf-input text-blue-400 font-bold font-mono text-sm">
              </div>
              <div>
                <label class="block text-stone-400 mb-1 font-semibold">校准原因说明 *</label>
                <input v-model="individualPointForm.reason" type="text" placeholder="例: 期初画币盘点校准"
                  class="w-full px-3 py-2 wf-input">
              </div>
            </div>
          </div>

          <!-- 模式 4: 🎁 礼物兑换商场 -->
          <div v-if="individualPointForm.actionType === 'redeem'" class="space-y-3">
            <label class="block text-stone-400 mb-1 font-semibold">选择要兑换的精美画画礼物：</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div v-for="prize in pointPrizes" :key="prize.id"
                @click="individualPointForm.selectedPrize = prize; individualPointForm.reason = '兑换【' + prize.name + '】'"
                :class="individualPointForm.selectedPrize?.id === prize.id ? 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400' : individualPointForm.currentPoints < prize.cost ? 'opacity-50' : ''"
                class="wf-prize-card">
                <div class="text-2xl">{{ prize.icon }}</div>
                <div class="flex-1">
                  <div class="font-bold text-xs">{{ prize.name }}</div>
                  <div class="text-[10px] text-stone-400 mt-0.5">{{ prize.desc }}</div>
                  <div class="flex items-center justify-between mt-1.5">
                    <span class="font-mono font-black text-amber-400 text-xs">⭐ {{ prize.cost }} 积分</span>
                    <span class="text-[10px] text-stone-400 font-mono">库存 {{ prize.stock }}</span>
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
              <p class="text-xs text-stone-400 font-mono mt-0.5">凭据单号：{{ selectedReceiptOrder.id }}</p>
            </div>
          </div>
          <button @click="showReceiptModal = false" class="text-stone-400 hover:text-white p-1">
            <i class="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        <div class="space-y-4 text-xs">
          
          <div class="grid grid-cols-2 gap-4 p-4 rounded-xl border border-black/10 dark:border-white/10" style="background-color: var(--bg-surface-subtle);">
            <div>
              <span class="text-stone-400 block mb-1">交费学员</span>
              <strong class="text-base font-black text-stone-100">{{ selectedReceiptOrder.studentName }}</strong>
            </div>
            <div>
              <span class="text-stone-400 block mb-1">缴费实收金额</span>
              <strong class="text-xl font-black font-mono text-emerald-400">¥ {{ (selectedReceiptOrder.amount || 0).toLocaleString() }}</strong>
            </div>
          </div>

          <div class="space-y-2 border-b border-black/10 dark:border-white/10 pb-4">
            <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
              <span class="text-stone-400">充值课时数</span>
              <span class="font-mono font-bold">{{ selectedReceiptOrder.hoursBought }} 节</span>
            </div>
            <div v-if="selectedReceiptOrder.hoursGift > 0" class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
              <span class="text-stone-400">机构赠送课时</span>
              <span class="font-mono font-bold text-amber-400">+{{ selectedReceiptOrder.hoursGift }} 节</span>
            </div>
            <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
              <span class="text-stone-400">支付结算方式</span>
              <span class="font-bold">{{ selectedReceiptOrder.payMethod }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
              <span class="text-stone-400">经办老师</span>
              <span>{{ selectedReceiptOrder.operator || '陈老师' }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
              <span class="text-stone-400">交费日期</span>
              <span class="font-mono">{{ selectedReceiptOrder.payDate }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-stone-400">备注说明</span>
              <span class="text-stone-300">{{ selectedReceiptOrder.remark || '正常续费充值' }}</span>
            </div>
          </div>

          <div class="text-[11px] text-stone-400 italic text-center">
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
          <button @click="showAddMatrixRowModal = false" class="text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-stone-400 mb-1 font-semibold">上课班级</label>
            <input type="text" :value="getClassById(matrixClassId).name" disabled class="w-full px-3 py-2 opacity-75 border border-black/10 dark:border-white/10 rounded-lg">
          </div>

          <div>
            <label class="block text-stone-400 mb-1 font-semibold">课程绘画主题 *</label>
            <input v-model="newMatrixRowForm.theme" type="text" placeholder="例：《梵高的向日葵》" class="w-full px-3 py-2 wf-input font-bold">
          </div>

          <div>
            <label class="block text-stone-400 mb-1 font-semibold">上课日期 *</label>
            <input v-model="newMatrixRowForm.date" type="date" class="w-full px-3 py-2 wf-input font-mono">
          </div>

          <div>
            <label class="block text-stone-400 mb-1 font-semibold">默认全员初始出勤状态</label>
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
          <button @click="showAdhocAttendanceModal = false" class="text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-stone-400 mb-1 font-semibold">选择学员 *</label>
            <select v-model="adhocForm.studentId" class="w-full px-3 py-2 wf-select font-bold">
              <option value="">[请选择要补课的学员]</option>
              <option v-for="s in activeStudents" :key="s.id" :value="s.id">{{ s.name }} (余{{ s.remainHours }}节 · {{ getClassById(s.classId).name }})</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">补课日期 *</label>
              <input v-model="adhocForm.date" type="date" class="w-full px-3 py-2 wf-input">
            </div>

            <div>
              <label class="block text-stone-400 mb-1 font-semibold">出勤状态</label>
              <select v-model="adhocForm.status" class="w-full px-3 py-2 wf-select font-bold">
                <option value="到课">🟢 补课到课 (消课)</option>
                <option value="请假">🔴 请假 (不扣课)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">扣减课时数</label>
              <input v-model.number="adhocForm.deductHours" type="number" min="0" max="10" 
                :disabled="adhocForm.status === '请假'"
                class="w-full px-3 py-2 wf-input text-emerald-400 font-bold">
            </div>

            <div>
              <label class="block text-stone-400 mb-1 font-semibold">临时参加班级</label>
              <select v-model="adhocForm.targetClassId" class="w-full px-3 py-2 wf-select">
                <option value="">[单独补课/加练]</option>
                <option v-for="c in activeClasses" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-stone-400 mb-1 font-semibold">课题名称</label>
            <input v-model="adhocForm.theme" type="text" placeholder="例：《水彩写生特训》" class="w-full px-3 py-2 wf-input">
          </div>

          <div>
            <label class="block text-stone-400 mb-1 font-semibold">具体上课原因备注 *</label>
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
      <div class="wf-card p-6 max-w-md w-full space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <h3 class="font-bold text-base">学员续费充值</h3>
          <button @click="showRechargeModal = false" class="text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-stone-400 mb-1 font-semibold">充值学员</label>
            <input type="text" :value="rechargeForm.studentName" disabled class="w-full px-3 py-2 opacity-75 border border-black/10 dark:border-white/10 rounded-lg font-bold">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">充值课时数</label>
              <input v-model.number="rechargeForm.hoursBought" type="number" class="w-full px-3 py-2 wf-input text-emerald-400 font-bold">
            </div>
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">赠送课时</label>
              <input v-model.number="rechargeForm.hoursGift" type="number" class="w-full px-3 py-2 wf-input">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">实收金额 (元)</label>
              <input v-model.number="rechargeForm.amount" type="number" class="w-full px-3 py-2 wf-input text-emerald-400 font-bold">
            </div>
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">支付方式</label>
              <select v-model="rechargeForm.payMethod" class="w-full px-3 py-2 wf-select">
                <option>微信支付</option>
                <option>支付宝</option>
                <option>现金</option>
                <option>银行转账</option>
              </select>
            </div>
          </div>

          <div class="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-center justify-between">
            <span>🎁 充值将赠送画币积分：</span>
            <strong class="font-mono">+{{ (rechargeForm.hoursBought || 0) + (rechargeForm.hoursGift || 0) }} 分</strong>
          </div>

          <div>
            <label class="block text-stone-400 mb-1 font-semibold">缴费说明备注</label>
            <input v-model="rechargeForm.remark" type="text" placeholder="例: 续费48课时大课包" class="w-full px-3 py-2 wf-input">
          </div>
        </div>

        <div class="pt-2 flex gap-2">
          <button @click="showRechargeModal = false" class="wf-btn-outline flex-1 py-2 justify-center">取消</button>
          <button @click="submitRecharge" class="wf-btn-primary flex-1 py-2 justify-center">确认入账</button>
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
          <button @click="showStudentModal = false" class="text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">姓名 *</label>
              <input v-model="studentForm.name" type="text" placeholder="例: 张小梨" class="w-full px-3 py-2 wf-input font-bold">
            </div>
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">性别</label>
              <select v-model="studentForm.gender" class="w-full px-3 py-2 wf-select">
                <option>女</option>
                <option>男</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">年龄 (岁)</label>
              <input v-model.number="studentForm.age" type="number" min="2" max="18" class="w-full px-3 py-2 wf-input">
            </div>
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">所在班级 *</label>
              <select v-model="studentForm.classId" class="w-full px-3 py-2 wf-select font-bold">
                <option v-for="c in activeClasses" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">家长姓名</label>
              <input v-model="studentForm.parentName" type="text" placeholder="例: 张妈妈" class="w-full px-3 py-2 wf-input">
            </div>
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">家长联系电话 *</label>
              <input v-model="studentForm.parentPhone" type="text" placeholder="例: 13900000000" class="w-full px-3 py-2 wf-input font-mono">
            </div>
          </div>

          <div v-if="!isEditStudent" class="p-3 rounded-lg border border-black/10 dark:border-white/10 space-y-2" style="background-color: var(--bg-surface-subtle);">
            <div class="font-bold text-[11px] text-emerald-400">初始课时与赠送画币</div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-stone-400 mb-1 font-semibold">初始购买课时</label>
                <input v-model.number="studentForm.initialHours" type="number" min="0" class="w-full px-3 py-1.5 wf-input text-emerald-400 font-bold">
              </div>
              <div>
                <label class="block text-stone-400 mb-1 font-semibold">新生赠送画币</label>
                <input v-model.number="studentForm.initialPoints" type="number" min="0" class="w-full px-3 py-1.5 wf-input text-amber-400 font-bold font-mono">
              </div>
            </div>
          </div>

          <div>
            <label class="block text-stone-400 mb-1 font-semibold">学员绘画特点与习惯备注</label>
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
          <button @click="showClassModal = false" class="text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-stone-400 mb-1 font-semibold">班级名称 *</label>
            <input v-model="classForm.name" type="text" placeholder="例: 周六上午 · 启蒙感官探索A班 (3-5岁)" class="w-full px-3 py-2 wf-input font-bold">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">任课主讲老师 *</label>
              <input v-model="classForm.teacher" type="text" placeholder="例: 陈老师" class="w-full px-3 py-2 wf-input">
            </div>
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">班级满额人数</label>
              <input v-model.number="classForm.capacity" type="number" min="1" max="30" class="w-full px-3 py-2 wf-input font-mono font-bold">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">授课画坊教室</label>
              <input v-model="classForm.classroom" type="text" placeholder="例: 梨香一号画坊" class="w-full px-3 py-2 wf-input">
            </div>
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">上课常规时段 *</label>
              <input v-model="classForm.schedule" type="text" placeholder="例: 每周六 09:30 - 11:00" class="w-full px-3 py-2 wf-input">
            </div>
          </div>

          <div>
            <label class="block text-stone-400 mb-1 font-semibold">教学大纲方向与备注</label>
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
          <button @click="showCellEditModal = false" class="text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <span class="text-stone-400">学员：</span>
            <strong class="text-emerald-400 font-bold text-sm">{{ editingCell.studentName }}</strong>
          </div>

          <div>
            <label class="block text-stone-400 mb-1 font-semibold">填写课堂表现或请假原因备注</label>
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
          <button @click="showBatchPointModal = false" class="text-stone-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-stone-400 mb-1 font-semibold">奖励班级</label>
            <input type="text" :value="getClassById(batchPointForm.classId || matrixClassId).name" disabled class="w-full px-3 py-2 opacity-75 border border-black/10 dark:border-white/10 rounded-lg font-bold">
          </div>

          <div>
            <label class="block text-stone-400 mb-1.5 font-semibold">快捷奖励理由：</label>
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
              <label class="block text-stone-400 mb-1 font-semibold">每人奖励画币 (+)*</label>
              <input v-model.number="batchPointForm.points" type="number" min="1" max="1000"
                class="w-full px-3 py-2 wf-input text-amber-400 font-bold font-mono">
            </div>
            <div>
              <label class="block text-stone-400 mb-1 font-semibold">集体奖励说明 *</label>
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
    // Tab 3 子视图：classes (班级管理) | students (学员名册) | archive (归档中心)
    const rosterSubTab = ref('classes');
    // Tab 2 排行榜子视图：hours (课时排行榜) | points (积分光荣榜)
    const rankingViewType = ref('hours');

    const isDarkMode = ref(true);

    // 核心数据
    const studioInfo = ref(DEFAULT_DEFAULT_INITIAL_DATA.studioInfo);
    const classes = ref(DEFAULT_DEFAULT_INITIAL_DATA.classes);
    const students = ref(DEFAULT_DEFAULT_INITIAL_DATA.students);
    const attendanceHistory = ref(DEFAULT_DEFAULT_INITIAL_DATA.attendanceHistory);
    const hourLogs = ref(DEFAULT_DEFAULT_INITIAL_DATA.hourLogs);
    const paymentOrders = ref(DEFAULT_DEFAULT_INITIAL_DATA.paymentOrders);

    // 🌟 积分系统数据
    const pointRewardOptions = ref(DEFAULT_DEFAULT_INITIAL_DATA.pointRewardOptions || []);
    const pointPrizes = ref(DEFAULT_DEFAULT_INITIAL_DATA.pointPrizes || []);
    const pointLogs = ref(DEFAULT_DEFAULT_INITIAL_DATA.pointLogs || []);

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

    
const loadData = async () => {
  try {
    const [
      { data: studio },
      { data: cls },
      { data: stu },
      { data: att },
      { data: fin },
      { data: prz },
      { data: plog },
      { data: popt }
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

    if (!studio || studio.length === 0) {
      console.log('Database empty, seeding default data...');
      // Seed data
      await supabase.from('studio_info').insert([{ id: '00000000-0000-0000-0000-000000000000', ...DEFAULT_INITIAL_DATA.studioInfo }]);
      await supabase.from('classes').insert(DEFAULT_INITIAL_DATA.classes.map(c => ({...c, created_at: c.createdAt || new Date().toISOString(), archived_at: c.archivedAt || null})));
      
      const stus = DEFAULT_INITIAL_DATA.students.map(s => {
          return {
              id: s.id, name: s.name, gender: s.gender, age: s.age, class_id: s.classId, parent_name: s.parentName,
              parent_phone: s.parentPhone, remain_hours: s.remainHours, total_purchased: s.totalPurchased,
              total_consumed: s.totalConsumed, points: s.points, total_points_earned: s.totalPointsEarned,
              redeemed_count: s.redeemedCount, status: s.status, join_date: s.joinDate, notes: s.notes
          }
      });
      await supabase.from('students').insert(stus);
      
      if (DEFAULT_INITIAL_DATA.attendanceHistory) await supabase.from('attendance_records').insert(DEFAULT_INITIAL_DATA.attendanceHistory.map(a => ({date: a.date, theme: a.theme, class_id: a.classId, details: a.details})));
      if (DEFAULT_INITIAL_DATA.financeLogs) await supabase.from('finance_logs').insert(DEFAULT_INITIAL_DATA.financeLogs.map(f => ({id: f.id, type: f.type, date: f.date, amount: f.amount, student_id: f.studentId, student_name: f.studentName, description: f.description, hours: f.hours, operator: f.operator})));
      if (DEFAULT_INITIAL_DATA.pointPrizes) await supabase.from('point_prizes').insert(DEFAULT_INITIAL_DATA.pointPrizes.map(p => ({id: p.id, name: p.name, cost: p.cost, stock: p.stock, icon: p.icon, desc_text: p.desc})));
      if (DEFAULT_INITIAL_DATA.pointRewardOptions) await supabase.from('point_reward_options').insert(DEFAULT_INITIAL_DATA.pointRewardOptions);
      if (DEFAULT_INITIAL_DATA.pointLogs) await supabase.from('point_logs').insert(DEFAULT_INITIAL_DATA.pointLogs.map(p => ({id: p.id, student_id: p.studentId, student_name: p.studentName, type: p.type, points: p.points, balance_after: p.balanceAfter, reason: p.reason, operator: p.operator, time: p.time})));
      
      alert('初始化数据已成功写入数据库！请刷新页面。');
      window.location.reload();
      return;
    }

    studioInfo.value = studio[0] || DEFAULT_INITIAL_DATA.studioInfo;
    
    // Map back from snake_case to camelCase for the frontend UI logic
    classes.value = cls.map(c => ({...c, createdAt: c.created_at, archivedAt: c.archived_at}));
    students.value = stu.map(s => ({
        ...s, classId: s.class_id, parentName: s.parent_name, parentPhone: s.parent_phone, remainHours: s.remain_hours,
        totalPurchased: s.total_purchased, totalConsumed: s.total_consumed, totalPointsEarned: s.total_points_earned,
        redeemedCount: s.redeemed_count, joinDate: s.join_date
    }));
    attendanceHistory.value = att.map(a => ({id: a.id, date: a.date, theme: a.theme, classId: a.class_id, details: a.details}));
    financeLogs.value = fin.map(f => ({id: f.id, type: f.type, date: f.date, amount: f.amount, studentId: f.student_id, studentName: f.student_name, description: f.description, hours: f.hours, operator: f.operator}));
    pointPrizes.value = prz.map(p => ({id: p.id, name: p.name, cost: p.cost, stock: p.stock, icon: p.icon, desc: p.desc_text}));
    pointLogs.value = plog.map(p => ({id: p.id, studentId: p.student_id, studentName: p.student_name, type: p.type, points: p.points, balanceAfter: p.balance_after, reason: p.reason, operator: p.operator, time: p.time}));
    pointRewardOptions.value = popt;

  } catch (e) {
    console.error('加载数据库失败:', e);
    alert('连接数据库失败，已降级为本地缓存模式。');
    // Fallback to local storage logic here if needed...
  }
};


    
let saveTimeout = null;
const saveData = () => {
  // Debounce to prevent spamming the database
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      await supabase.from('studio_info').upsert([{ id: studioInfo.value.id || '00000000-0000-0000-0000-000000000000', ...studioInfo.value }]);
      
      // mapped back to snake_case for DB
      const clsDb = classes.value.map(c => ({id: c.id, name: c.name, teacher: c.teacher, schedule: c.schedule, classroom: c.classroom, capacity: c.capacity, status: c.status, created_at: c.createdAt || new Date().toISOString(), archived_at: c.archivedAt, notes: c.notes}));
      if(clsDb.length) await supabase.from('classes').upsert(clsDb);
      
      const stuDb = students.value.map(s => ({id: s.id, name: s.name, gender: s.gender, age: s.age, class_id: s.classId, parent_name: s.parentName, parent_phone: s.parentPhone, remain_hours: s.remainHours, total_purchased: s.totalPurchased, total_consumed: s.totalConsumed, points: s.points, total_points_earned: s.totalPointsEarned, redeemed_count: s.redeemedCount, status: s.status, join_date: s.joinDate, notes: s.notes}));
      if(stuDb.length) await supabase.from('students').upsert(stuDb);

      const attDb = attendanceHistory.value.map(a => ({id: a.id, date: a.date, theme: a.theme, class_id: a.classId, details: a.details}));
      if(attDb.length) await supabase.from('attendance_records').upsert(attDb);

      const finDb = financeLogs.value.map(f => ({id: f.id, type: f.type, date: f.date, amount: f.amount, student_id: f.studentId, student_name: f.studentName, description: f.description, hours: f.hours, operator: f.operator}));
      if(finDb.length) await supabase.from('finance_logs').upsert(finDb);

      const przDb = pointPrizes.value.map(p => ({id: p.id, name: p.name, cost: p.cost, stock: p.stock, icon: p.icon, desc_text: p.desc}));
      if(przDb.length) await supabase.from('point_prizes').upsert(przDb);

      const poptDb = pointRewardOptions.value.map(p => ({id: p.id, name: p.name, points: p.points, icon: p.icon, color: p.color}));
      if(poptDb.length) await supabase.from('point_reward_options').upsert(poptDb);

      const plogDb = pointLogs.value.map(p => ({id: p.id, student_id: p.studentId, student_name: p.studentName, type: p.type, points: p.points, balance_after: p.balanceAfter, reason: p.reason, operator: p.operator, time: p.time}));
      if(plogDb.length) await supabase.from('point_logs').upsert(plogDb);

      console.log('✅ Synchronized with Supabase DB');
    } catch (e) {
      console.error('❌ Failed to sync to Supabase:', e);
    }
  }, 1000);
};

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    };

    watch([classes, students, attendanceHistory, hourLogs, paymentOrders, pointRewardOptions, pointPrizes, pointLogs, studioInfo], () => {
      saveData();
    }, { deep: true });

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

      
</script>
