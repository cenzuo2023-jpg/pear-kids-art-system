with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

import re
text = re.sub(r'return list\.sort\(\(a, b\) => new Date\(b\.date\)\.getTime\(\) - new Date\(a\.date\)\.getTime\(\)\);', 
              r"return list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));", text)

text = re.sub(r'return hourLogs\.value\.filter\(l => l\.studentId === profileStudent\.value\.id\)\.sort\(\(a, b\) => new Date\(b\.time \|\| \'\'\)\.getTime\(\) - new Date\(a\.time \|\| \'\'\)\.getTime\(\)\);',
              r"return hourLogs.value.filter(l => l.studentId === profileStudent.value.id).sort((a, b) => (b.time || '').localeCompare(a.time || ''));", text)

text = re.sub(r'return pointLogs\.value\.filter\(l => l\.studentId === profileStudent\.value\.id\)\.sort\(\(a, b\) => new Date\(b\.time \|\| \'\'\)\.getTime\(\) - new Date\(a\.time \|\| \'\'\)\.getTime\(\)\);',
              r"return pointLogs.value.filter(l => l.studentId === profileStudent.value.id).sort((a, b) => (b.time || '').localeCompare(a.time || ''));", text)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
