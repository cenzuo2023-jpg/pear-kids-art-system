import re

with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Fix rowsHtml
old_rowsHtml = r'''      const rowsHtml = finalAttList.length > 0 ? finalAttList.map((a, idx) => {
        const badgeClass = a.status === '到课' ? 'badge-green' : a.status === '请假' || a.status === '未到' ? 'badge-yellow' : 'badge-purple';
        return `<tr>
          <td style="text-align:center; font-family:monospace; font-weight:600; color:#6b7280;">#${String(idx + 1).padStart(2, '0')}</td>
          <td style="font-family:monospace; font-weight:600; white-space:nowrap;">${a.date}</td>
          <td style="font-weight:700; color:#111827;">${a.theme}</td>
          <td>${a.className}</td>
          <td style="text-align:center;"><span class="badge ${badgeClass}">${a.status}</span></td>
          <td style="text-align:center; font-family:monospace; font-weight:700; color:${a.deductHours > 0 ? '#b91c1c' : '#4b5563'};">${a.deductHours > 0 ? '-' + a.deductHours + '节' : '0节'}</td>
          <td style="text-align:center;">${a.teacher}</td>
          <td style="color:#4b5563; font-size:12px;">${a.note || '-'}</td>
        </tr>`;
      }).join('') : `<tr><td colspan="8" style="text-align:center; padding:30px; color:#9ca3af;">暂无历史排课记录</td></tr>`;'''

new_rowsHtml = r'''      const rowsHtml = finalAttList.length > 0 ? finalAttList.map((a, idx) => {
        const badgeClass = a.status === '到课' ? 'badge-green' : a.status === '请假' || a.status === '未到' ? 'badge-yellow' : 'badge-purple';
        return `<tr>
          <td style="text-align:center; font-family:monospace; font-weight:600; color:#6b7280;">#${String(idx + 1).padStart(2, '0')}</td>
          <td style="font-family:monospace; font-weight:600; white-space:nowrap;">${a.date}</td>
          <td>${a.className}</td>
          <td style="text-align:center;"><span class="badge ${badgeClass}">${a.status}</span></td>
          <td style="text-align:center; font-family:monospace; font-weight:700; color:${a.deductHours > 0 ? '#b91c1c' : '#4b5563'};">${a.deductHours > 0 ? '-' + a.deductHours + '节' : '0节'}</td>
          <td style="color:#4b5563; font-size:12px;">${a.note || '-'}</td>
        </tr>`;
      }).join('') : `<tr><td colspan="6" style="text-align:center; padding:30px; color:#9ca3af;">暂无历史排课记录</td></tr>`;'''

# 2. Fix PDF Headers
old_pdf_headers = r'''          <tr>
            <th style="width:44px; text-align:center;">序号</th>
            <th style="width:90px;">上课日期</th>
            <th>课程绘画主题</th>
            <th style="width:110px;">所在班级</th>
            <th style="width:68px; text-align:center;">出勤状态</th>
            <th style="width:72px; text-align:center;">课时消课</th>
            <th style="width:68px; text-align:center;">主讲师</th>
            <th>考勤备注与课堂表现</th>
          </tr>'''

new_pdf_headers = r'''          <tr>
            <th style="width:44px; text-align:center;">序号</th>
            <th style="width:90px;">上课日期</th>
            <th style="width:110px;">所在班级</th>
            <th style="width:68px; text-align:center;">出勤状态</th>
            <th style="width:72px; text-align:center;">课时消课</th>
            <th>考勤备注与课堂表现</th>
          </tr>'''

# 3. Fix CSV Export
old_csv = r'''      const headers = ['学员姓名', '上课日期', '课程绘画主题', '所在班级', '出勤状态', '消课课时', '任课主讲老师', '出勤与请假备注说明'];
      const rows = finalAttList.map(a => [
        `"${stu.name.replace(/"/g, '""')}"`,
        `\t${a.date}`,
        `"${(a.theme || '').replace(/"/g, '""')}"`,
        `"${(a.className || '').replace(/"/g, '""')}"`,
        `"${a.status}"`,
        a.deductHours > 0 ? `-${a.deductHours} 节` : '0 节',
        `"${(a.teacher || '陈老师').replace(/"/g, '""')}"`,
        `"${(a.note || '').replace(/"/g, '""')}"`
      ]);'''

new_csv = r'''      const headers = ['学员姓名', '上课日期', '所在班级', '出勤状态', '消课课时', '出勤与请假备注说明'];
      const rows = finalAttList.map(a => [
        `"${stu.name.replace(/"/g, '""')}"`,
        `\t${a.date}`,
        `"${(a.className || '').replace(/"/g, '""')}"`,
        `"${a.status}"`,
        a.deductHours > 0 ? `-${a.deductHours} 节` : '0 节',
        `"${(a.note || '').replace(/"/g, '""')}"`
      ]);'''

text = text.replace(old_rowsHtml, new_rowsHtml)
text = text.replace(old_pdf_headers, new_pdf_headers)
text = text.replace(old_csv, new_csv)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
