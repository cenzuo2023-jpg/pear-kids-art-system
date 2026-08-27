import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

import re

out = {}
m1 = re.search(r'const profileStudentAttendanceList = computed\(\(\) => \{(.*?)\}\);', text, re.DOTALL)
if m1: out['att'] = m1.group(1).strip()[-150:]

m2 = re.search(r'const profileStudentLogs = computed\(\(\) => \{(.*?)\}\);', text, re.DOTALL)
if m2: out['logs'] = m2.group(1).strip()[-150:]

m3 = re.search(r'const profileStudentPointLogs = computed\(\(\) => \{(.*?)\}\);', text, re.DOTALL)
if m3: out['points'] = m3.group(1).strip()[-150:]

with open('debug_sort2.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
