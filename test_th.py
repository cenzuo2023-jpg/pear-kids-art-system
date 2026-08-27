with open('src/App.vue', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if '剩余课时' in line and '↕' in line:
            print(f'{i}: {line.strip()}')
