with open('src/App.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if i == 1451 and line.strip() == '</div>':
        continue
    new_lines.append(line)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
