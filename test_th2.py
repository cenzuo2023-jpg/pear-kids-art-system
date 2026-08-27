with open('src/App.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i in range(540, 560):
    if '<th' in lines[i]:
        print(f'{i}: {lines[i].strip()}')
