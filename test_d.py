with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()
import json
import re
match = re.search(r'classes:\s*\[(.*?)\]', text, re.DOTALL)
if match:
    print(match.group(1)[:1000])
