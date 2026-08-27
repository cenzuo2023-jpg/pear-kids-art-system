import json
import re

with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

m1 = re.search(r'<tr>\s*<th style="width:44px; text-align:center;">序号</th>.*?考勤备注与课堂表现</th>\s*</tr>', text, re.DOTALL)
m2 = re.search(r'const rowsHtml = finalAttList.*?</tr>;', text, re.DOTALL)

out = {
  'pdf_headers': m1.group(0) if m1 else None,
  'rows_html': m2.group(0) if m2 else None
}
with open('debug_verify2.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
