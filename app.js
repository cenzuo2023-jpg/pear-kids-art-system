/**
 * 想吃梨儿童美术 - 核心教务逻辑控制器 (app.js)
 * 主理人：陈老师
 * 结构保持经典的 4 大业务功能区：
 * 1. 📝 二维考勤大表 (attendance - 支持单元格考勤与快捷积分奖励)
 * 2. 📊 课时与积分光荣排行榜 (ranking - 支持课时排行与小艺术家积分荣耀榜自由切换)
 * 3. 🎨 班级与学员系统 (students - 含班级管理/学员名册/归档中心/个人档案中心)
 * 4. 🧾 财务与积分流水 (records)
 * 🌟 核心升级：学员积分系统、快捷选项奖励、礼物兑换商场与积分排行榜
 */

const { createApp, ref, computed, reactive, onMounted, watch } = Vue;

const app = createApp({
  setup() {
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

    const loadData = () => {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme) {
        isDarkMode.value = (savedTheme === 'dark');
      }
      applyTheme();

      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.studioInfo) studioInfo.value = parsed.studioInfo;
          if (parsed.classes && Array.isArray(parsed.classes)) classes.value = parsed.classes;
          if (parsed.students && Array.isArray(parsed.students)) {
            // 兼容性：确保所有学员都有积分属性
            students.value = parsed.students.map(s => ({
              ...s,
              points: s.points !== undefined ? Number(s.points) : 100,
              totalPointsEarned: s.totalPointsEarned !== undefined ? Number(s.totalPointsEarned) : 100,
              redeemedCount: s.redeemedCount !== undefined ? Number(s.redeemedCount) : 0
            }));
          }
          if (parsed.attendanceHistory && Array.isArray(parsed.attendanceHistory)) attendanceHistory.value = parsed.attendanceHistory;
          if (parsed.hourLogs && Array.isArray(parsed.hourLogs)) hourLogs.value = parsed.hourLogs;
          if (parsed.paymentOrders && Array.isArray(parsed.paymentOrders)) paymentOrders.value = parsed.paymentOrders;
          if (parsed.pointRewardOptions && Array.isArray(parsed.pointRewardOptions)) {
            pointRewardOptions.value = parsed.pointRewardOptions;
          } else {
            pointRewardOptions.value = DEFAULT_INITIAL_DATA.pointRewardOptions;
          }
          if (parsed.pointPrizes && Array.isArray(parsed.pointPrizes)) {
            pointPrizes.value = parsed.pointPrizes;
          } else {
            pointPrizes.value = DEFAULT_INITIAL_DATA.pointPrizes;
          }
          if (parsed.pointLogs && Array.isArray(parsed.pointLogs)) {
            pointLogs.value = parsed.pointLogs;
          } else {
            pointLogs.value = DEFAULT_INITIAL_DATA.pointLogs;
          }
        } else {
          // 首次默认值初始化
          students.value = DEFAULT_INITIAL_DATA.students;
          pointRewardOptions.value = DEFAULT_INITIAL_DATA.pointRewardOptions;
          pointPrizes.value = DEFAULT_INITIAL_DATA.pointPrizes;
          pointLogs.value = DEFAULT_INITIAL_DATA.pointLogs;
        }

        // 确保 matrixClassId 指向有效开班
        const available = activeClasses.value;
        if (!matrixClassId.value || !available.some(c => c.id === matrixClassId.value)) {
          matrixClassId.value = available[0]?.id || classes.value[0]?.id || '';
        }
      } catch (err) {
        console.error('加载本地数据失败:', err);
      }
    };

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
    const matrixClassId = ref(activeClasses.value[0]?.id || classes.value[0]?.id || '');

    const matrixStudents = computed(() => {
      if (!matrixClassId.value) return [];
      return activeStudents.value.filter(s => s.classId === matrixClassId.value);
    });

    const matrixAttendanceRecords = computed(() => {
      if (!matrixClassId.value) return [];
      return attendanceHistory.value.filter(a => a.classId === matrixClassId.value);
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
      return 'text-stone-400 text-xs';
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
    // 12. 续费充值
    // ==========================================
    const showRechargeModal = ref(false);
    const rechargeForm = reactive({
      studentId: '',
      studentName: '',
      hoursBought: 48,
      hoursGift: 0,
      amount: 4800,
      payMethod: '微信支付',
      payDate: new Date().toISOString().slice(0, 10),
      operator: '陈老师',
      remark: '续报大课包'
    });

    const openRecharge = (student) => {
      rechargeForm.studentId = student.id;
      rechargeForm.studentName = student.name;
      rechargeForm.hoursBought = 48;
      rechargeForm.hoursGift = 0;
      rechargeForm.amount = 4800;
      rechargeForm.payMethod = '微信支付';
      rechargeForm.payDate = new Date().toISOString().slice(0, 10);
      rechargeForm.operator = '陈老师';
      rechargeForm.remark = '常规续费充值';
      showRechargeModal.value = true;
    };

    const submitRecharge = () => {
      const addHours = Number(rechargeForm.hoursBought || 0) + Number(rechargeForm.hoursGift || 0);
      if (addHours <= 0) {
        showToast('充值课时数需大于0', 'warning');
        return;
      }
      const s = students.value.find(stu => stu.id === rechargeForm.studentId);
      if (!s) return;

      const nowStr = new Date().toLocaleString('zh-CN', { hour12: false });
      s.remainHours = Number(s.remainHours) + addHours;
      s.totalPurchased = Number(s.totalPurchased || 0) + addHours;

      // 充值赠送专属积分奖励 (每充值1节赠送1分)
      const bonusPoints = addHours;
      s.points = Number(s.points || 0) + bonusPoints;
      s.totalPointsEarned = Number(s.totalPointsEarned || 0) + bonusPoints;

      pointLogs.value.unshift({
        id: 'plog_' + Date.now(),
        studentId: s.id,
        studentName: s.name,
        type: '续费赠送积分',
        points: +bonusPoints,
        balanceAfter: s.points,
        reason: `续费 ${addHours} 课时赠送画币积分`,
        operator: rechargeForm.operator,
        time: nowStr
      });

      const noteText = rechargeForm.remark ? ` (备注: ${rechargeForm.remark})` : '';

      paymentOrders.value.unshift({
        id: 'pay_' + Date.now(),
        studentId: s.id,
        studentName: s.name,
        amount: Number(rechargeForm.amount || 0),
        hoursBought: Number(rechargeForm.hoursBought || 0),
        hoursGift: Number(rechargeForm.hoursGift || 0),
        totalHours: addHours,
        payDate: rechargeForm.payDate,
        payMethod: rechargeForm.payMethod,
        operator: rechargeForm.operator,
        remark: rechargeForm.remark
      });

      hourLogs.value.unshift({
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        studentId: s.id,
        studentName: s.name,
        type: '续费充值',
        change: +addHours,
        balanceAfter: s.remainHours,
        relatedInfo: `${rechargeForm.payMethod} ¥${rechargeForm.amount} (+${addHours}课时)${noteText}`,
        operator: rechargeForm.operator,
        time: nowStr
      });

      saveData();
      showRechargeModal.value = false;
      showToast(`🎉 充值成功！【${s.name}】增加 ${addHours} 课时与 +${bonusPoints} 积分，当前剩余 ${s.remainHours} 节`);
    };

    // ==========================================
    // 13. 学员与班级新建/编辑
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

    onMounted(() => {
      loadData();
      window.addEventListener('click', handleGlobalClick);
    });

    return {
      currentTab,
      rosterSubTab,
      rankingViewType,
      isDarkMode,
      toggleTheme,
      studioInfo,
      classes,
      students,
      activeClasses,
      archivedClasses,
      activeStudents,
      archivedStudents,
      attendanceHistory,
      hourLogs,
      paymentOrders,
      toast,
      showToast,

      exportDataJSON,
      importDataJSON,

      kpiStats,
      getClassById,
      getHourStatus,

      // 🌟 专属个人积分变更系统
      pointRewardOptions,
      pointPrizes,
      pointLogs,
      showIndividualPointModal,
      individualPointForm,
      openIndividualPointModal,
      calculatedNewPoints,
      submitIndividualPointChange,
      openPointReward,
      openPointRedeem,
      openBatchPointReward,
      onSelectRewardOption,

      pointsRankingSort,
      pointsClassFilter,
      pointsSearchQuery,
      pointsRankingList,
      exportPointsRankingCSV,

      // 💰 财务与收费管理中心
      financeSubTab,
      financeSearchQuery,
      financePayMethodFilter,
      financeActiveKpi,
      selectedBreakdownYM,
      selectFinanceKpi,
      resetFinanceFilter,
      filterByYM,
      financeStats,
      monthlyRevenueBreakdown,
      annualRevenueBreakdown,
      // 📊 教学课消统计
      consumptionPeriodType,
      consumptionClassFilter,
      selectedConsumptionPeriod,
      consumptionSummaryKPI,
      weeklyConsumptionList,
      monthlyConsumptionList,
      classConsumptionAnalytics,
      studentConsumptionRanking,
      exportConsumptionReportCSV,

      // 💳 财务订单与待续费预警
      renewalWarningStudents,
      exportRenewalWarningsCSV,
      filteredPaymentOrders,
      exportPaymentOrdersCSV,
      selectedReceiptOrder,
      showReceiptModal,
      openReceiptModal,

      // 🏫 班级专属二级管理主页
      selectedClassDetail,
      classDetailSubTab,
      openClassDetail,
      closeClassDetail,
      classDetailStudents,
      classDetailAttendance,
      classDetailLogs,
      classDetailStats,

      // 🧾 财务与积分流水
      recordsSubTab,
      recordsSearchQuery,
      recordsHourTypeFilter,
      recordsPointTypeFilter,
      filteredHourLogs,
      filteredPointLogs,
      exportHourLogsCSV,
      exportPointLogsCSV,

      // 🌟 学员专属个人档案中心 (独立全屏页面)
      showStudentProfileModal,
      profileStudent,
      profilePreviousTab,
      profileSubTab,
      openStudentProfile,
      closeStudentProfile,
      profileStudentAttendanceList,
      profileStudentStats,
      profileStudentLogs,
      profileStudentPointLogs,
      exportStudentAttendanceCSV,

      // 考勤大表
      matrixClassId,
      matrixStudents,
      matrixAttendanceRecords,
      getStudentAttendanceCell,
      getMatrixCellClass,
      activeCellDropdownKey,
      toggleCellDropdown,
      selectCellStatusFromDropdown,
      openNoteFromDropdown,
      showCellEditModal,
      editingCell,
      openCellEdit,
      submitCellEdit,
      
      // 课程主题与日期编辑
      showEditAttendanceModal,
      editingAttendanceForm,
      openEditAttendanceRow,
      submitEditAttendanceRow,
      formatChineseDateWithWeekday,
      dateToISO,

      inlineNewRow,
      submitInlineNewRow,
      showAddMatrixRowModal,
      newMatrixRowForm,
      openAddMatrixRow,
      submitAddMatrixRow,
      deleteMatrixRow,
      exportAttendanceMatrixCSV,

      // 课时排行榜
      rankingSearchQuery,
      rankingClassFilter,
      rankingHourFilter,
      rankingSortOrder,
      rankingList,
      exportRankingCSV,

      // 班级与学员名册
      selectedRosterClassId,
      rosterStudentSearch,
      currentClassStudentsList,
      goToAttendanceForClass,
      archiveClass,
      unarchiveClass,
      archiveStudent,
      unarchiveStudent,

      // 智能搜索与补课
      showAdhocAttendanceModal,
      adhocStudentSearch,
      adhocClassFilter,
      selectedAdhocStudent,
      filteredAdhocStudents,
      adhocForm,
      openAdhocAttendanceModal,
      submitAdhocAttendance,

      // 导出
      exportStudentAttendanceCSV,
      exportClassAttendanceCSV,

      // 充值
      showRechargeModal,
      rechargeForm,
      openRecharge,
      submitRecharge,

      // 学员与班级表单
      showStudentModal,
      isEditStudent,
      studentForm,
      openAddStudent,
      openEditStudent,
      saveStudent,
      submitStudent: saveStudent,
      deleteStudent,

      showClassModal,
      isEditClass,
      classForm,
      openAddClass,
      openEditClass,
      saveClass,
      submitClass: saveClass,
      deleteClass,

      // 全班集体奖积分
      showBatchPointModal,
      batchPointForm,
      submitBatchPointReward,

      // 排行榜列表别名
      rankingFilteredStudents: rankingList
    };
  }
});

app.mount('#app');
