with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()
import json
import re
output = []
for i, line in enumerate(text.split('\n')):
    if 'v-for="cls in classes' in line or 'v-for="c in classes' in line:
        output.append(f'{i}: {line.strip()}')
with open('debug_classes.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)
