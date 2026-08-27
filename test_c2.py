with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()
import json
import re
output = []
for m in re.finditer(r'const \w+Classes = computed', text):
    output.append(m.group(0))
with open('debug_classes2.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)
