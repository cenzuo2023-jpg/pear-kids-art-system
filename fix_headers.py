import re

with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

replacement_hours = r'''<!-- 剩余课时 -->
<span class="px-1.5 py-0.5 rounded font-bold font-mono text-stone-500 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px]">
  余{{ stu.remainHours }}
</span>'''
text = re.sub(r'<!-- 剩余课时 -->\s*<span :class="stu\.remainHours[^>]+>\s*余\{\{ stu\.remainHours \}\}\s*</span>', replacement_hours, text)

replacement_points = r'''<!-- 画币积分 -->
<button @click.stop="openIndividualPointModal(stu, 'add')"
        class="px-1.5 py-0.5 rounded font-bold font-mono text-stone-500 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 transition cursor-pointer flex items-center gap-0.5 text-[11px]"
        :title="'点击为【' + stu.name + '】变更积分'">
  <i class="fa-solid fa-star text-stone-400 text-[10px]"></i>
  <span>{{ stu.points || 0 }}</span>
</button>'''
text = re.sub(r'<!-- 画币积分 -->\s*<button @click\.stop="openIndividualPointModal[^>]+>\s*<span>[^<]+</span>\s*<span>\{\{ stu\.points \|\| 0 \}\}</span>\s*</button>', replacement_points, text)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
