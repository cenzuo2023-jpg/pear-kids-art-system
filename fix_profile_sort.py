import re

with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. profileStudentAttendanceList
replacement1 = r'''return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());'''
text = re.sub(r'return list;\s*\}\);', replacement1 + '\n    });', text, count=1)

# 2. profileStudentLogs
replacement2 = r'''return hourLogs.value.filter(l => l.studentId === profileStudent.value.id).sort((a, b) => new Date(b.time || '').getTime() - new Date(a.time || '').getTime());'''
text = re.sub(r'return hourLogs\.value\.filter\(l => l\.studentId === profileStudent\.value\.id\);', replacement2, text)

# 3. profileStudentPointLogs
replacement3 = r'''return pointLogs.value.filter(l => l.studentId === profileStudent.value.id).sort((a, b) => new Date(b.time || '').getTime() - new Date(a.time || '').getTime());'''
text = re.sub(r'return pointLogs\.value\.filter\(l => l\.studentId === profileStudent\.value\.id\);', replacement3, text)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
