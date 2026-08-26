/**
 * 想吃梨儿童美术 - 机构初始数据配置 (纯净空白版 · 准备录入真实数据)
 */

export const DEFAULT_INITIAL_DATA = {
  // 画室基本资料
  studioInfo: {
    name: "想吃梨儿童美术",
    teacher: "陈老师",
    slogan: "Contemporary Art for Young Creatives",
    phone: "",
    address: "",
    warningThreshold: 3 // 预警阈值 (剩余<=3节时黄色预警，<=0红色预警)
  },

  // 🌟 班级档案列表 (初始为空)
  classes: [],

  // 🌟 学员档案名册 (初始为空)
  students: [],

  // 🌟 考勤大表历史 (初始为空)
  attendanceHistory: [],

  // 🌟 课时流水总账 (初始为空)
  hourLogs: [],

  // 🌟 收费订单明细 (初始为空)
  paymentOrders: [],

  // 🌟 积分快捷奖励预设选项 (保留实用快捷模板)
  pointRewardOptions: [
    { id: 'opt_1', name: '课堂专注认真', points: 5, icon: '🌟', color: 'emerald' },
    { id: 'opt_2', name: '色彩创意出众', points: 10, icon: '🎨', color: 'purple' },
    { id: 'opt_3', name: '主动收拾画具', points: 5, icon: '🧹', color: 'blue' },
    { id: 'opt_4', name: '作品评为优秀', points: 15, icon: '🏆', color: 'amber' },
    { id: 'opt_5', name: '全勤积极打卡', points: 5, icon: '💯', color: 'emerald' },
    { id: 'opt_6', name: '互助友爱分享', points: 5, icon: '🤝', color: 'rose' }
  ],

  // 🌟 积分礼物兑换商场 (初始为空，可随时自定义添加)
  pointPrizes: [],

  // 🌟 积分变动与兑换明细流水 (初始为空)
  pointLogs: []
};
