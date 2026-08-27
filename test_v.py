import json
import re

with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

out = {
  'theme_count': text.count('课程绘画主题'),
  'teacher_count': text.count('主讲师'),
  'colspan_8': 'colspan="8"' in text,
  'colspan_6': 'colspan="6"' in text,
}
m = re.search(r'const headers = \[\'学员姓名\'.*?\];', text, re.DOTALL)
if m:
    out['csv_headers'] = m.group(0)

with open('debug_verify.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
