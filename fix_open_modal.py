import re

with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

replacement = r'''exportModalConfig.endDate = '';
  
  if (exportModalConfig.targetStudent) {
    const s = exportModalConfig.targetStudent;
    exportModalConfig.purchaseQuantity = s.totalPurchased || (Number(s.remainHours || 0) + Number(s.totalConsumed || 0)) || 0;
  } else {
    exportModalConfig.purchaseQuantity = 0;
  }'''
text = re.sub(r'exportModalConfig\.endDate = \'\';', replacement, text)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
