import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m1 = re.search(r'const rowsHtml = .*?</tr>;', text, re.DOTALL)
m2 = re.search(r'<table class="table">.*?</tr>\s*</thead>', text, re.DOTALL)
m3 = re.search(r'const headers = \[.*?\];', text, re.DOTALL)
m4 = re.search(r'const csvContent = \[.*?\]\.join\(\'\\n\'\);', text, re.DOTALL)

out = {
  'rowsHtml': m1.group(0) if m1 else None,
  'tableHeaders': m2.group(0) if m2 else None,
  'csvHeaders': m3.group(0) if m3 else None,
  'csvContent': m4.group(0) if m4 else None
}
with open('debug_export.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
