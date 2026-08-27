import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()
output = []
for i, line in enumerate(lines):
    if '购课总量' in line or '累计出勤' in line or '剩余课时' in line:
        for j in range(i-2, i+10):
            output.append(f'{j}: {lines[j].strip()}')
        break
with open('debug_pdf.json', 'w', encoding='utf-8') as out:
    json.dump(output, out, ensure_ascii=False, indent=2)
