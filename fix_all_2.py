with open('src/App.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()

insertion = '''
<div v-if="isEditStudent" class="p-3 rounded-lg border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2">
  <div class="font-bold text-[11px] text-emerald-500">课时状态管理</div>
  <div>
    <label class="block text-black dark:text-stone-400 mb-1 font-semibold">当前剩余课时 (可手动校准)</label>
    <div class="flex items-center gap-2">
      <input v-model.number="studentForm.remainHours" type="number" class="flex-1 px-3 py-1.5 wf-input text-emerald-500 font-bold font-mono">
      <span class="text-xs text-stone-500 font-semibold">节</span>
    </div>
  </div>
</div>
'''

for i, line in enumerate(lines):
    if '学员绘画特点' in line:
        # line i is the label, line i-1 is '<div>', line i-2 is empty '\n', line i-3 is '</div>' (closing the v-if=!isEditStudent)
        # We will insert it at i-1
        lines.insert(i-1, insertion + '\n')
        break

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.writelines(lines)
