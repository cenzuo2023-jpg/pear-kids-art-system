import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m1 = re.search(r'const sync.*?\=.*?\{.*?\}', text, re.DOTALL)
m2 = re.search(r'const API_URL = .*?;', text)

out = {
  'sync': m1.group(0)[:500] if m1 else None,
  'api': m2.group(0) if m2 else None
}
with open('debug_api.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
