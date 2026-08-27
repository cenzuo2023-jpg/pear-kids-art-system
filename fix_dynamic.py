import re

with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Replace rowsHtml
# Find `const rowsHtml = finalAttList.length > 0 ? ... : ...;`
def replace_rowsHtml(match):
    s = match.group(0)
    # Remove theme column
    s = re.sub(r'<td style="font-weight:700; color:#111827;">\$\{a\.theme\}</td>\n\s*', '', s)
    # Remove teacher column
    s = re.sub(r'<td style="text-align:center;">\$\{a\.teacher\}</td>\n\s*', '', s)
    # Change colspan
    s = s.replace('colspan="8"', 'colspan="6"')
    return s

text = re.sub(r'const rowsHtml = finalAttList\.length > 0 \? finalAttList\.map\(\(a, idx\) => \{.*?</tr>`;', replace_rowsHtml, text, flags=re.DOTALL)

# 2. Replace PDF Headers
def replace_pdf_headers(match):
    s = match.group(0)
    s = re.sub(r'<th>课程绘画主题</th>\n\s*', '', s)
    s = re.sub(r'<th style="width:68px; text-align:center;">主讲师</th>\n\s*', '', s)
    return s

text = re.sub(r'<tr>\s*<th style="width:44px; text-align:center;">序号</th>.*?考勤备注与课堂表现</th>\s*</tr>', replace_pdf_headers, text, flags=re.DOTALL)

# 3. Replace CSV
def replace_csv(match):
    s = match.group(0)
    # Remove headers
    s = s.replace(", '课程绘画主题'", "")
    s = s.replace(", '任课主讲老师'", "")
    # Remove row mapping
    s = re.sub(r'`"\$\{\(a\.theme \|\| \'\'\)\.replace\(/\"/g, \'\"\"\'\)\}"`,\n\s*', '', s)
    s = re.sub(r'`"\$\{\(a\.teacher \|\| \'陈老师\'\)\.replace\(/\"/g, \'\"\"\'\)\}"`,\n\s*', '', s)
    return s

text = re.sub(r'const headers = \[\'学员姓名\'.*?\];\s*const rows = finalAttList\.map\(a => \[.*?\]\);', replace_csv, text, flags=re.DOTALL)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
