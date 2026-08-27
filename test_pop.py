import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()
output = []
for i, line in enumerate(lines):
    if 'popstate' in line or 'location.hash' in line:
        for j in range(max(0, i-5), min(len(lines), i+15)):
            output.append(f'{j}: {lines[j].strip()}')
        break
with open('debug_popstate.json', 'w', encoding='utf-8') as out:
    json.dump(output, out, ensure_ascii=False, indent=2)
