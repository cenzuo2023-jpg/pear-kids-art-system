import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    output = []
    for i, line in enumerate(f):
        if 'c.name' in line:
            output.append(f'{i}: {line.strip()}')
with open('debug_name.json', 'w', encoding='utf-8') as out:
    json.dump(output, out, ensure_ascii=False, indent=2)
