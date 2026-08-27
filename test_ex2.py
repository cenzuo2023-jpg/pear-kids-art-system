import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m1 = re.search(r'const headers = \[\'学员姓名\'.*?\];', text, re.DOTALL)
m2 = re.search(r'const rowsHtml = finalAttList.*?暂无历史排课记录</td></tr>;', text, re.DOTALL)
m3 = re.search(r'<tr>\s*<th style="width:44px; text-align:center;">序号</th>.*?考勤备注与课堂表现</th>\s*</tr>', text, re.DOTALL)

out = {
  'csv': m1.group(0) if m1 else None,
  'rows': m2.group(0) if m2 else None,
  'pdf': m3.group(0) if m3 else None
}
with open('debug_export2.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
