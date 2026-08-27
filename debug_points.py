import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m2 = re.search(r'<!-- 画币积分 -->\s*<td.*?</td>', text, re.DOTALL)
if m2:
    print(m2.group(0))
