
with open('src/App.vue', 'r', encoding='utf-8') as f:
    content = f.read()

import re
# Fix hourLogs creation
content = re.sub(
    r'change: diff,\s*balanceAfter: Number\(studentForm\.remainHours\),\s*relatedInfo:',
    r'hours: diff,
              balanceAfter: Number(studentForm.remainHours),
              reason:',
    content
)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(content)
