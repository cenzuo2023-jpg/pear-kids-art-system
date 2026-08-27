import re

with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

replacement = r'''return list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    });'''

text = re.sub(r'return list;\s*\}\);\s*const profileStudentStats = computed', replacement + '\n\n    const profileStudentStats = computed', text)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
