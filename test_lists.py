with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()
import re
matches = re.findall(r'const \w+Students = computed', text)
for m in matches:
    print(m)
matches2 = re.findall(r'const \w+List = computed', text)
for m in matches2:
    print(m)
