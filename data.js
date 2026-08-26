/**
 * 想吃梨儿童美术 - 机构初始示范数据 (含班级管理、归档系统与积分荣耀兑换系统)
 * 梨子品牌专属色调 · 沉浸式极简美育教务
 */

const DEFAULT_INITIAL_DATA = {
  // 画室基本资料
  studioInfo: {
    name: "想吃梨儿童美术",
    teacher: "陈老师",
    slogan: "Contemporary Art for Young Creatives",
    phone: "138-8888-6666",
    address: "杭州市西湖区文创艺术园区 🍐 梨香画坊",
    warningThreshold: 3 // 预警阈值 (剩余<=3节时黄色预警，<=0红色预警)
  },

  // 🌟 班级档案列表 (含 active 正常开班 / archived 已结课归档)
  classes: [
    {
      id: "cls_101",
      name: "周六上午 · 启蒙感官探索A班 (3-5岁)",
      teacher: "陈老师",
      schedule: "每周六 09:30 - 11:00",
      classroom: "🍐 梨香一号画坊",
      capacity: 8,
      status: "active",
      createdAt: "2025-01-01",
      notes: "综合材料拼贴、低幼触觉与色彩感知启蒙"
    },
    {
      id: "cls_102",
      name: "周六下午 · 少儿当代水彩班 (6-8岁)",
      teacher: "陈老师",
      schedule: "每周六 14:00 - 15:30",
      classroom: "🍐 水彩阳光画廊",
      capacity: 8,
      status: "active",
      createdAt: "2025-01-01",
      notes: "水彩水粉技法、大师画风赏析与色彩表达"
    },
    {
      id: "cls_103",
      name: "周日上午 · 综合媒介创作特训班 (9-12岁)",
      teacher: "陈老师",
      schedule: "每周日 10:00 - 12:00",
      classroom: "🍐 媒介创新工坊",
      capacity: 6,
      status: "active",
      createdAt: "2025-01-01",
      notes: "立体造型、版画与跨界装置艺术创作"
    },
    {
      id: "cls_archived_1",
      name: "2025暑期 · 创意泥塑与陶艺集训班 (已结业)",
      teacher: "陈老师",
      schedule: "每周二/四 14:00 - 16:00",
      classroom: "🍐 陶艺手作坊",
      capacity: 8,
      status: "archived",
      createdAt: "2025-07-01",
      archivedAt: "2025-08-31",
      notes: "暑期特别集训班，课程已全部圆满完成结业"
    }
  ],

  // 🌟 学员档案名册 (含积分点数 points 与累计积分 totalPointsEarned)
  students: [
    {
      id: "stu_01",
      name: "张瑞希",
      gender: "女",
      age: 4,
      classId: "cls_101",
      parentName: "张妈妈",
      parentPhone: "13912345601",
      remainHours: 0,
      totalPurchased: 48,
      totalConsumed: 48,
      points: 135,
      totalPointsEarned: 185,
      redeemedCount: 1,
      status: "在读",
      joinDate: "2024-03-01",
      notes: "色彩感觉好，喜欢大画幅泼彩"
    },
    {
      id: "stu_02",
      name: "梅依朵",
      gender: "女",
      age: 4,
      classId: "cls_101",
      parentName: "梅爸爸",
      parentPhone: "13912345602",
      remainHours: 2,
      totalPurchased: 48,
      totalConsumed: 46,
      points: 160,
      totalPointsEarned: 160,
      redeemedCount: 0,
      status: "在读",
      joinDate: "2024-03-15",
      notes: "动手能力强，专注度高"
    },
    {
      id: "stu_03",
      name: "叶琪乐",
      gender: "男",
      age: 5,
      classId: "cls_101",
      parentName: "叶妈妈",
      parentPhone: "13912345603",
      remainHours: 3,
      totalPurchased: 48,
      totalConsumed: 45,
      points: 120,
      totalPointsEarned: 170,
      redeemedCount: 1,
      status: "在读",
      joinDate: "2024-04-01",
      notes: "想象力丰富，喜欢几何结构"
    },
    {
      id: "stu_04",
      name: "查昕妍",
      gender: "女",
      age: 4,
      classId: "cls_101",
      parentName: "查妈妈",
      parentPhone: "13912345604",
      remainHours: 8,
      totalPurchased: 48,
      totalConsumed: 40,
      points: 110,
      totalPointsEarned: 110,
      redeemedCount: 0,
      status: "在读",
      joinDate: "2024-04-10",
      notes: "喜欢调配马卡龙色系"
    },
    {
      id: "stu_05",
      name: "李瑾瑜",
      gender: "女",
      age: 5,
      classId: "cls_101",
      parentName: "李爸爸",
      parentPhone: "13912345605",
      remainHours: 16,
      totalPurchased: 48,
      totalConsumed: 32,
      points: 195,
      totalPointsEarned: 195,
      redeemedCount: 0,
      status: "在读",
      joinDate: "2024-05-01",
      notes: "对植物与自然界纹理很敏锐"
    },
    {
      id: "stu_06",
      name: "陈念涵",
      gender: "女",
      age: 5,
      classId: "cls_101",
      parentName: "陈妈妈",
      parentPhone: "13912345606",
      remainHours: 1,
      totalPurchased: 48,
      totalConsumed: 47,
      points: 140,
      totalPointsEarned: 190,
      redeemedCount: 1,
      status: "在读",
      joinDate: "2024-03-01",
      notes: "临期急需续费提醒"
    },
    {
      id: "stu_07",
      name: "查依诺",
      gender: "女",
      age: 4,
      classId: "cls_101",
      parentName: "查爸爸",
      parentPhone: "13912345607",
      remainHours: 12,
      totalPurchased: 48,
      totalConsumed: 36,
      points: 95,
      totalPointsEarned: 95,
      redeemedCount: 0,
      status: "在读",
      joinDate: "2024-05-15",
      notes: "喜欢撕纸拼贴画"
    },
    {
      id: "stu_08",
      name: "刘子嘉",
      gender: "男",
      age: 5,
      classId: "cls_101",
      parentName: "刘妈妈",
      parentPhone: "13912345608",
      remainHours: 20,
      totalPurchased: 48,
      totalConsumed: 28,
      points: 85,
      totalPointsEarned: 85,
      redeemedCount: 0,
      status: "在读",
      joinDate: "2024-06-01",
      notes: "表现欲强，画风豪放"
    },
    {
      id: "stu_09",
      name: "王梓萌",
      gender: "女",
      age: 7,
      classId: "cls_102",
      parentName: "王妈妈",
      parentPhone: "13912345609",
      remainHours: 18,
      totalPurchased: 48,
      totalConsumed: 30,
      points: 175,
      totalPointsEarned: 175,
      redeemedCount: 0,
      status: "在读",
      joinDate: "2024-03-10",
      notes: "水彩湿画法掌握优秀"
    },
    {
      id: "stu_10",
      name: "赵宇轩",
      gender: "男",
      age: 8,
      classId: "cls_102",
      parentName: "赵爸爸",
      parentPhone: "13912345610",
      remainHours: 0,
      totalPurchased: 48,
      totalConsumed: 48,
      points: 210,
      totalPointsEarned: 210,
      redeemedCount: 0,
      status: "在读",
      joinDate: "2024-02-20",
      notes: "课时已耗尽，已通知家长续费"
    },
    {
      id: "stu_archived_1",
      name: "林小舟",
      gender: "男",
      age: 6,
      classId: "cls_archived_1",
      parentName: "林妈妈",
      parentPhone: "13912345699",
      remainHours: 0,
      totalPurchased: 24,
      totalConsumed: 24,
      points: 60,
      totalPointsEarned: 110,
      redeemedCount: 1,
      status: "已归档",
      joinDate: "2025-07-01",
      archivedAt: "2025-08-31",
      notes: "暑期陶艺班结业，已毕业归档"
    }
  ],

  // 🌟 积分快捷奖励预设选项 (方便像点考勤一样一键奖励)
  pointRewardOptions: [
    { id: 'opt_1', name: '课堂专注认真', points: 5, icon: '🌟', color: 'emerald' },
    { id: 'opt_2', name: '色彩创意出众', points: 10, icon: '🎨', color: 'purple' },
    { id: 'opt_3', name: '主动收拾画具', points: 5, icon: '🧹', color: 'blue' },
    { id: 'opt_4', name: '作品评为优秀', points: 15, icon: '🏆', color: 'amber' },
    { id: 'opt_5', name: '全勤积极打卡', points: 5, icon: '💯', color: 'emerald' },
    { id: 'opt_6', name: '互助友爱分享', points: 5, icon: '🤝', color: 'rose' }
  ],

  // 🌟 积分礼物兑换商场 (奖品目录)
  pointPrizes: [
    { id: 'prz_1', name: '专业高品质油画棒礼盒 (24色)', cost: 100, stock: 12, icon: '🖍️', desc: '细腻软糯，专业重彩油画棒' },
    { id: 'prz_2', name: '梦幻纯棉水彩画本 (A4加厚)', cost: 60, stock: 20, icon: '📖', desc: '300g纯棉水彩纸，显色透亮' },
    { id: 'prz_3', name: '小艺术家尼龙画笔6支套装', cost: 50, stock: 15, icon: '🖌️', desc: '勾线、平头、圆头齐全' },
    { id: 'prz_4', name: '🍐 想吃梨定制可爱帆布画袋', cost: 80, stock: 8, icon: '👜', desc: '耐磨厚实，装画板画具超便携' },
    { id: 'prz_5', name: '超轻彩泥粘土创作盲盒', cost: 40, stock: 25, icon: '🎁', desc: '安全无毒不粘手手作泥' },
    { id: 'prz_6', name: '课后美味冰淇淋甜品券', cost: 20, stock: 50, icon: '🍦', desc: '课后甜蜜能量补给' }
  ],

  // 🌟 积分变动与兑换明细流水
  pointLogs: [
    {
      id: "plog_01",
      studentId: "stu_01",
      studentName: "张瑞希",
      type: "礼物兑换",
      points: -50,
      balanceAfter: 135,
      reason: "兑换【小艺术家尼龙画笔6支套装】",
      operator: "陈老师",
      time: "2025-03-08 12:00"
    },
    {
      id: "plog_02",
      studentId: "stu_03",
      studentName: "叶琪乐",
      type: "礼物兑换",
      points: -50,
      balanceAfter: 120,
      reason: "兑换【小艺术家尼龙画笔6支套装】",
      operator: "陈老师",
      time: "2025-03-01 12:00"
    },
    {
      id: "plog_03",
      studentId: "stu_05",
      studentName: "李瑾瑜",
      type: "课堂奖励",
      points: +15,
      balanceAfter: 195,
      reason: "🏆 作品评为优秀",
      operator: "陈老师",
      time: "2025-03-08 11:30"
    },
    {
      id: "plog_04",
      studentId: "stu_10",
      studentName: "赵宇轩",
      type: "课堂奖励",
      points: +10,
      balanceAfter: 210,
      reason: "🎨 色彩创意出众",
      operator: "陈老师",
      time: "2025-03-08 11:30"
    }
  ],

  // 🌟 二维考勤历史记录
  attendanceHistory: [
    {
      id: "att_202608_02",
      classId: "cls_101",
      className: "周六上午 · 启蒙感官探索A班 (3-5岁)",
      date: "2026年8月22日 星期六",
      teacher: "陈老师",
      theme: "星空遐想",
      presentCount: 7,
      leaveCount: 1,
      holidayCount: 0,
      details: [
        { studentId: "stu_01", studentName: "张瑞希", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_02", studentName: "梅依朵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_03", studentName: "叶琪乐", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_04", studentName: "查昕妍", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_05", studentName: "李瑾瑜", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_06", studentName: "陈念涵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_07", studentName: "查依诺", status: "未到", deductHours: 0, note: "生病请假" },
        { studentId: "stu_08", studentName: "刘子嘉", status: "到课", deductHours: 1, note: "" }
      ],
      createdAt: "2026-08-22 11:30:00"
    },
    {
      id: "att_202608_01",
      classId: "cls_102",
      className: "周六下午 · 少儿当代水彩班 (6-8岁)",
      date: "2026年8月22日 星期六",
      teacher: "陈老师",
      theme: "莫奈花园水彩",
      presentCount: 2,
      leaveCount: 0,
      holidayCount: 0,
      details: [
        { studentId: "stu_09", studentName: "王梓萌", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_10", studentName: "赵宇轩", status: "到课", deductHours: 1, note: "" }
      ],
      createdAt: "2026-08-22 16:00:00"
    },
    {
      id: "att_202608_03",
      classId: "cls_101",
      className: "周六上午 · 启蒙感官探索A班 (3-5岁)",
      date: "2026年8月15日 星期六",
      teacher: "陈老师",
      theme: "陶土与色彩",
      presentCount: 8,
      leaveCount: 0,
      holidayCount: 0,
      details: [
        { studentId: "stu_01", studentName: "张瑞希", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_02", studentName: "梅依朵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_03", studentName: "叶琪乐", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_04", studentName: "查昕妍", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_05", studentName: "李瑾瑜", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_06", studentName: "陈念涵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_07", studentName: "查依诺", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_08", studentName: "刘子嘉", status: "到课", deductHours: 1, note: "" }
      ],
      createdAt: "2026-08-15 11:30:00"
    },
    {
      id: "att_202608_04",
      classId: "cls_102",
      className: "周六下午 · 少儿当代水彩班 (6-8岁)",
      date: "2026年8月15日 星期六",
      teacher: "陈老师",
      theme: "水彩植物肌理",
      presentCount: 2,
      leaveCount: 0,
      holidayCount: 0,
      details: [
        { studentId: "stu_09", studentName: "王梓萌", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_10", studentName: "赵宇轩", status: "到课", deductHours: 1, note: "" }
      ],
      createdAt: "2026-08-15 16:00:00"
    },
    {
      id: "att_202608_05",
      classId: "cls_101",
      className: "周六上午 · 启蒙感官探索A班 (3-5岁)",
      date: "2026年8月08日 星期六",
      teacher: "陈老师",
      theme: "几何狂想曲",
      presentCount: 7,
      leaveCount: 1,
      holidayCount: 0,
      details: [
        { studentId: "stu_01", studentName: "张瑞希", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_02", studentName: "梅依朵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_03", studentName: "叶琪乐", status: "未到", deductHours: 0, note: "外出旅游" },
        { studentId: "stu_04", studentName: "查昕妍", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_05", studentName: "李瑾瑜", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_06", studentName: "陈念涵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_07", studentName: "查依诺", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_08", studentName: "刘子嘉", status: "到课", deductHours: 1, note: "" }
      ],
      createdAt: "2026-08-08 11:30:00"
    },
    {
      id: "att_202607_01",
      classId: "cls_101",
      className: "周六上午 · 启蒙感官探索A班 (3-5岁)",
      date: "2026年7月25日 星期六",
      teacher: "陈老师",
      theme: "夏日清凉冷饮手作",
      presentCount: 8,
      leaveCount: 0,
      holidayCount: 0,
      details: [
        { studentId: "stu_01", studentName: "张瑞希", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_02", studentName: "梅依朵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_03", studentName: "叶琪乐", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_04", studentName: "查昕妍", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_05", studentName: "李瑾瑜", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_06", studentName: "陈念涵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_07", studentName: "查依诺", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_08", studentName: "刘子嘉", status: "到课", deductHours: 1, note: "" }
      ],
      createdAt: "2026-07-25 11:30:00"
    },
    {
      id: "att_202607_02",
      classId: "cls_101",
      className: "周六上午 · 启蒙感官探索A班 (3-5岁)",
      date: "2026年7月18日 星期六",
      teacher: "陈老师",
      theme: "海底奇遇记",
      presentCount: 7,
      leaveCount: 1,
      holidayCount: 0,
      details: [
        { studentId: "stu_01", studentName: "张瑞希", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_02", studentName: "梅依朵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_03", studentName: "叶琪乐", status: "未到", deductHours: 0, note: "补课冲突" },
        { studentId: "stu_04", studentName: "查昕妍", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_05", studentName: "李瑾瑜", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_06", studentName: "陈念涵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_07", studentName: "查依诺", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_08", studentName: "刘子嘉", status: "到课", deductHours: 1, note: "" }
      ],
      createdAt: "2026-07-18 11:30:00"
    },
    {
      id: "att_01",
      classId: "cls_101",
      className: "周六上午 · 启蒙感官探索A班 (3-5岁)",
      date: "2025年3月8日 星期六",
      teacher: "陈老师",
      theme: "点彩画",
      presentCount: 5,
      leaveCount: 3,
      holidayCount: 0,
      details: [
        { studentId: "stu_01", studentName: "张瑞希", status: "未到", deductHours: 0, note: "发烧请假" },
        { studentId: "stu_02", studentName: "梅依朵", status: "未到", deductHours: 0, note: "外出旅游" },
        { studentId: "stu_03", studentName: "叶琪乐", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_04", studentName: "查昕妍", status: "未到", deductHours: 0, note: "家中有事" },
        { studentId: "stu_05", studentName: "李瑾瑜", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_06", studentName: "陈念涵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_07", studentName: "查依诺", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_08", studentName: "刘子嘉", status: "到课", deductHours: 1, note: "" }
      ],
      createdAt: "2025-03-08 11:30:00"
    },
    {
      id: "att_02",
      classId: "cls_101",
      className: "周六上午 · 启蒙感官探索A班 (3-5岁)",
      date: "2025年3月1日 星期六",
      teacher: "陈老师",
      theme: "达利",
      presentCount: 6,
      leaveCount: 2,
      holidayCount: 0,
      details: [
        { studentId: "stu_01", studentName: "张瑞希", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_02", studentName: "梅依朵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_03", studentName: "叶琪乐", status: "未到", deductHours: 0, note: "感冒" },
        { studentId: "stu_04", studentName: "查昕妍", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_05", studentName: "李瑾瑜", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_06", studentName: "陈念涵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_07", studentName: "查依诺", status: "未到", deductHours: 0, note: "请假" },
        { studentId: "stu_08", studentName: "刘子嘉", status: "到课", deductHours: 1, note: "" }
      ],
      createdAt: "2025-03-01 11:30:00"
    },
    {
      id: "att_03",
      classId: "cls_101",
      className: "周六上午 · 启蒙感官探索A班 (3-5岁)",
      date: "2025年2月22日 星期六",
      teacher: "陈老师",
      theme: "和平鸽",
      presentCount: 7,
      leaveCount: 1,
      holidayCount: 0,
      details: [
        { studentId: "stu_01", studentName: "张瑞希", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_02", studentName: "梅依朵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_03", studentName: "叶琪乐", status: "未到", deductHours: 0, note: "回老家" },
        { studentId: "stu_04", studentName: "查昕妍", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_05", studentName: "李瑾瑜", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_06", studentName: "陈念涵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_07", studentName: "查依诺", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_08", studentName: "刘子嘉", status: "到课", deductHours: 1, note: "" }
      ],
      createdAt: "2025-02-22 11:30:00"
    },
    {
      id: "att_04",
      classId: "cls_101",
      className: "周六上午 · 启蒙感官探索A班 (3-5岁)",
      date: "2025年2月15日 星期六",
      teacher: "陈老师",
      theme: "浪花",
      presentCount: 7,
      leaveCount: 1,
      holidayCount: 0,
      details: [
        { studentId: "stu_01", studentName: "张瑞希", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_02", studentName: "梅依朵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_03", studentName: "叶琪乐", status: "未到", deductHours: 0, note: "补习冲突" },
        { studentId: "stu_04", studentName: "查昕妍", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_05", studentName: "李瑾瑜", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_06", studentName: "陈念涵", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_07", studentName: "查依诺", status: "到课", deductHours: 1, note: "" },
        { studentId: "stu_08", studentName: "刘子嘉", status: "到课", deductHours: 1, note: "" }
      ],
      createdAt: "2025-02-15 11:30:00"
    }
  ],

  // 课时变动流水
  hourLogs: [
    {
      id: "log_101",
      studentId: "stu_01",
      studentName: "张瑞希",
      type: "大表考勤消课",
      change: -1,
      balanceAfter: 0,
      relatedInfo: "2025-03-01 考勤《达利》到课",
      operator: "陈老师",
      time: "2025-03-01 11:30"
    },
    {
      id: "log_102",
      studentId: "stu_02",
      studentName: "梅依朵",
      type: "大表考勤消课",
      change: -1,
      balanceAfter: 2,
      relatedInfo: "2025-03-01 考勤《达利》到课",
      operator: "陈老师",
      time: "2025-03-01 11:30"
    },
    {
      id: "log_103",
      studentId: "stu_06",
      studentName: "陈念涵",
      type: "大表考勤消课",
      change: -1,
      balanceAfter: 1,
      relatedInfo: "2025-03-08 考勤《点彩画》到课",
      operator: "陈老师",
      time: "2025-03-08 11:30"
    }
  ],

  // 财务缴费收费订单总账
  paymentOrders: [
    {
      id: "ord_202608_01",
      studentId: "stu_01",
      studentName: "张瑞希",
      amount: 4800,
      hoursBought: 48,
      hoursGift: 2,
      totalHours: 50,
      payDate: "2026-08-15 10:30",
      payMethod: "微信支付",
      operator: "陈老师",
      remark: "续费48课时大课包（赠2课时+50积分）"
    },
    {
      id: "ord_202608_02",
      studentId: "stu_02",
      studentName: "梅依朵",
      amount: 4800,
      hoursBought: 48,
      hoursGift: 0,
      totalHours: 48,
      payDate: "2026-08-01 15:20",
      payMethod: "支付宝",
      operator: "陈老师",
      remark: "老学员早鸟续费充值"
    },
    {
      id: "ord_202607_01",
      studentId: "stu_05",
      studentName: "李瑾瑜",
      amount: 4800,
      hoursBought: 48,
      hoursGift: 2,
      totalHours: 50,
      payDate: "2026-07-20 11:00",
      payMethod: "微信支付",
      operator: "陈老师",
      remark: "暑期续课包"
    },
    {
      id: "ord_202606_01",
      studentId: "stu_08",
      studentName: "刘子嘉",
      amount: 2800,
      hoursBought: 24,
      hoursGift: 0,
      totalHours: 24,
      payDate: "2026-06-10 14:00",
      payMethod: "微信支付",
      operator: "陈老师",
      remark: "新生报读基础课包"
    },
    {
      id: "ord_202605_01",
      studentId: "stu_09",
      studentName: "王梓萌",
      amount: 4800,
      hoursBought: 48,
      hoursGift: 0,
      totalHours: 48,
      payDate: "2026-05-18 16:30",
      payMethod: "微信支付",
      operator: "陈老师",
      remark: "水彩进阶课包充值"
    },
    {
      id: "ord_202604_01",
      studentId: "stu_04",
      studentName: "查昕妍",
      amount: 4800,
      hoursBought: 48,
      hoursGift: 0,
      totalHours: 48,
      payDate: "2026-04-12 10:00",
      payMethod: "银行转账",
      operator: "陈老师",
      remark: "春季常规课包"
    },
    {
      id: "ord_202603_01",
      studentId: "stu_07",
      studentName: "查依诺",
      amount: 4800,
      hoursBought: 48,
      hoursGift: 4,
      totalHours: 52,
      payDate: "2026-03-05 14:30",
      payMethod: "微信支付",
      operator: "陈老师",
      remark: "春季开学特惠包（赠4课时）"
    },
    {
      id: "ord_202512_01",
      studentId: "stu_03",
      studentName: "叶琪乐",
      amount: 4800,
      hoursBought: 48,
      hoursGift: 0,
      totalHours: 48,
      payDate: "2025-12-05 09:30",
      payMethod: "支付宝",
      operator: "陈老师",
      remark: "跨年续费特惠"
    },
    {
      id: "ord_202510_01",
      studentId: "stu_06",
      studentName: "陈念涵",
      amount: 4800,
      hoursBought: 48,
      hoursGift: 2,
      totalHours: 50,
      payDate: "2025-10-18 15:00",
      payMethod: "现金",
      operator: "陈老师",
      remark: "秋季老带新优惠充值"
    },
    {
      id: "ord_202507_01",
      studentId: "stu_10",
      studentName: "赵宇轩",
      amount: 2800,
      hoursBought: 24,
      hoursGift: 0,
      totalHours: 24,
      payDate: "2025-07-08 11:20",
      payMethod: "微信支付",
      operator: "陈老师",
      remark: "暑期入门体验课包"
    }
  ]
};
