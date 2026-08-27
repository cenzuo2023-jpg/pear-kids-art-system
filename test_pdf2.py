import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()
output = []
for i in range(4890, 5200):
    if i < len(lines):
        if '累计购课' in lines[i] or '累计出勤' in lines[i] or '出勤消课' in lines[i]:
            for j in range(i-5, i+5):
                output.append(f'{j}: {lines[j].strip()}')
with open('debug_pdf2.json', 'w', encoding='utf-8') as out:
    json.dump(output, out, ensure_ascii=False, indent=2)
