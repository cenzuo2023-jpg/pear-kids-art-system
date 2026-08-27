import re

with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace HTML
html_replacement = r'''<!-- 4 维核心课时统计 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="label">累计购课总量</div>
        <div class="value">${customPurchased} <span style="font-size:12px; font-weight:normal;">节</span></div>
      </div>
      <div class="stat-card">
        <div class="label">累计出勤消课</div>
        <div class="value">${calculatedConsumed} <span style="font-size:12px; font-weight:normal;">节</span></div>
      </div>
      <div class="stat-card green">
        <div class="label">当前剩余课时</div>
        <div class="value">${customRemaining} <span style="font-size:12px; font-weight:normal;">节</span></div>
      </div>
      <div class="stat-card amber">
        <div class="label">历史出勤率 / 画币</div>
        <div class="value" style="font-size:18px;">${rate} <span style="font-size:12px; color:#b45309;">(⭐️${stu.points || 0})</span></div>
      </div>
    </div>'''

text = re.sub(r'<!-- 4 维核心课时统计 -->.*?</div>\s*</div>\s*</div>', html_replacement, text, flags=re.DOTALL)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
