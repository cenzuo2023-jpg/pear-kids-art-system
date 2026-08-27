with open('src/App.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i in range(253, 275):
    if '<td' in lines[i] or '<div class="flex items-center gap-1.5 truncate' in lines[i]:
        print(f'{i}: {lines[i].strip()}')
