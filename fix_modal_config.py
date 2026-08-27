import re

with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

replacement1 = r'''const exportModalConfig = reactive({
      mode: 'student',
      title: '',
      targetStudent: null,
      targetClassId: '',
      presetRange: 'all',
      startDate: '',
      endDate: '',
      purchaseQuantity: 0
    });'''
text = re.sub(r'const exportModalConfig = reactive\(\{.*?endDate: \'\'\s*\}\);', replacement1, text, flags=re.DOTALL)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
