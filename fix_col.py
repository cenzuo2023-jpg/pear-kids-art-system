with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('colspan="8" style="text-align:center; padding:30px; color:#9ca3af;">暂无考勤历史记录', 'colspan="6" style="text-align:center; padding:30px; color:#9ca3af;">暂无考勤历史记录')

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
