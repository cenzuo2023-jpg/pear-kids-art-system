import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'const loadData =.*?const debounceSave =', text, re.DOTALL)
if m:
    with open('debug_load.json', 'w', encoding='utf-8') as out:
        json.dump(m.group(0), out, ensure_ascii=False, indent=2)
