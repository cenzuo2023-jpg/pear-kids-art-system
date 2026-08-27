with open('src/App.vue', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if 'c.name' in line and '人' in line:
            print(f'{i}: {line.strip()}')
