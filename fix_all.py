with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix 1: openRechargeModal -> openRecharge
text = text.replace('@click="openRechargeModal"', '@click="openRecharge"')

# Fix 2: add remainHours to student edit modal
insertion = '''
<div v-if="isEditStudent" class="p-3 rounded-lg border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2">
  <div class="font-bold text-[11px] text-emerald-500">课时状态管理</div>
  <div>
    <label class="block text-black dark:text-stone-400 mb-1 font-semibold">当前剩余课时 (可手动校准)</label>
    <div class="flex items-center gap-2">
      <input v-model.number="studentForm.remainHours" type="number" min="0" class="flex-1 px-3 py-1.5 wf-input text-emerald-500 font-bold font-mono">
      <span class="text-xs text-stone-500 font-semibold">节</span>
    </div>
  </div>
</div>
'''

# Find the exact string to replace
target = '''</div>

<div>
<label class="block text-black dark:text-stone-400 mb-1 font-semibold">学员绘画特点与习惯备注</label>'''

if target in text:
    text = text.replace(target, '</div>\n' + insertion + '\n<div>\n<label class="block text-black dark:text-stone-400 mb-1 font-semibold">学员绘画特点与习惯备注</label>')

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
