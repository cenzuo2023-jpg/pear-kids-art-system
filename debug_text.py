import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m1 = re.search(r'<!-- 剩余课时 -->.*?</span>', text, re.DOTALL)
if m1:
    print(m1.group(0))

print('-----')

m2 = re.search(r'<!-- 画币积分 -->.*?</button>', text, re.DOTALL)
if m2:
    print(m2.group(0))
