import re

with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace calculations
calc_replacement = r'''const presentCount = finalAttList.filter(a => a.status === '到课').length;
      const leaveCount = finalAttList.filter(a => a.status === '未到' || a.status === '请假').length;
      const totalLessons = presentCount + leaveCount;
      const rate = totalLessons > 0 ? ((presentCount / totalLessons) * 100).toFixed(0) + '%' : '100%';
      const todayStr = new Date().toISOString().slice(0, 10);
      
      const calculatedConsumed = finalAttList.filter(a => a.status === '到课').reduce((sum, a) => sum + (Number(a.deductHours) || 0), 0);
      const customPurchased = Number(exportModalConfig.purchaseQuantity) || 0;
      const customRemaining = customPurchased - calculatedConsumed;'''

text = re.sub(r'const presentCount = finalAttList\.filter\(a => a\.status === \'到课\'\)\.length;.*?const todayStr = new Date\(\)\.toISOString\(\)\.slice\(0, 10\);', calc_replacement, text, flags=re.DOTALL)

# Replace HTML
html_replacement = r'''<!-- 4 维核心课时统计 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="label">累计购课总量</div>
        <div class="value"> <span style="font-size:12px; font-weight:normal;">节</span></div>
      </div>
      <div class="stat-card">
        <div class="label">累计出勤消课</div>
        <div class="value"> <span style="font-size:12px; font-weight:normal;">节</span></div>
      </div>
      <div class="stat-card green">
        <div class="label">当前剩余课时</div>
        <div class="value"> <span style="font-size:12px; font-weight:normal;">节</span></div>
      </div>
      <div class="stat-card amber">
        <div class="label">历史出勤率 / 画币</div>
        <div class="value" style="font-size:18px;"> <span style="font-size:12px; color:#b45309;">(⭐️)</span></div>
      </div>
    </div>'''

text = re.sub(r'<!-- 4 维核心课时统计 -->.*?</div>\s*</div>\s*</div>', html_replacement, text, flags=re.DOTALL)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
