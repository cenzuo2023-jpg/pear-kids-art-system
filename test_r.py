import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()
output = []
for i in range(890, 920):
    output.append(f'{i}: {lines[i].strip()}')
with open('debug_roster.json', 'w', encoding='utf-8') as out:
    json.dump(output, out, ensure_ascii=False, indent=2)
