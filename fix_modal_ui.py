import re

with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

replacement = r'''<!-- 精准起止日期选择 -->
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

        <div v-if="exportModalConfig.mode.startsWith('student')" class="pt-1">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">购课数量 (用于报表计算剩余课时)</label>
          <input v-model.number="exportModalConfig.purchaseQuantity" type="number" min="0"
            class="w-full px-3 py-2 nt-input font-mono text-sm" placeholder="请输入该区间对应的购课总量">
        </div>'''

text = re.sub(r'<!-- 精准起止日期选择 -->.*?</div>\s*</div>', replacement, text, flags=re.DOTALL)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
