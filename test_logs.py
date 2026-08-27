import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m1 = re.search(r'hourLogs: \[.*?\]', text, re.DOTALL)
m2 = re.search(r'pointLogs: \[.*?\]', text, re.DOTALL)

print(m1.group(0)[:300] if m1 else 'No hourLogs')
print('---')
print(m2.group(0)[:300] if m2 else 'No pointLogs')
