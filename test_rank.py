with open('src/App.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'const rankingList = computed' in line:
        for j in range(i, i+30):
            print(f'{j}: {lines[j].strip()}')
        break
