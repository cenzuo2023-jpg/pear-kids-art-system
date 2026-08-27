import re

with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

replacement_roster_points = r'''<!-- 画币积分 -->
<td class="py-3 px-3 whitespace-nowrap">
  <button @click.stop="openIndividualPointModal(s, 'add')"
          class="text-stone-500 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 transition px-2 py-0.5 rounded cursor-pointer font-bold inline-flex items-center gap-1 text-sm"
          :title="'点击为【' + s.name + '】变更积分'">
    <i class="fa-solid fa-star text-stone-400 text-xs"></i>
    <span>{{ s.points || 0 }}</span>
  </button>
</td>'''

text = re.sub(r'<!-- 画币积分 -->\s*<td class="py-3 px-3 whitespace-nowrap">\s*<button @click\.stop="openIndividualPointModal[^>]+>\s*<span>.*?</span>\s*<span class="text-\[9px\] opacity-60 ml-0\.5">.*?</span>\s*</button>\s*</td>', replacement_roster_points, text, flags=re.DOTALL)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
