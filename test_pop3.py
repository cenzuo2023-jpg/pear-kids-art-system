import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()
output = []
for i in range(6456, 6490):
    if i < len(lines):
        output.append(f'{i}: {lines[i].strip()}')
with open('debug_popstate3.json', 'w', encoding='utf-8') as out:
    json.dump(output, out, ensure_ascii=False, indent=2)
