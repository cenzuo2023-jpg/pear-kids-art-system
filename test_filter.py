with open('src/App.vue', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if 'const filteredActiveStudents' in line or 'const filteredStudents' in line:
            print(f'{i}: {line.strip()}')
