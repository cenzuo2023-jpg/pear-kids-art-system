with open('src/App.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if 1916 <= i <= 1919:
        continue
    new_lines.append(line)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
