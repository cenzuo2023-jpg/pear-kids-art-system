with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()
print('v-for="s in students' in text)
print('v-for="stu in students' in text)
