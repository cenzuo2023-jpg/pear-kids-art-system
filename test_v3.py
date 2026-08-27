import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()
output = []
for i, line in enumerate(lines):
    if 'const rowsHtml =' in line:
        for j in range(i, i+15):
            output.append(f'{j}: {lines[j].strip()}')
with open('debug_verify3.json', 'w', encoding='utf-8') as out:
    json.dump(output, out, ensure_ascii=False, indent=2)
