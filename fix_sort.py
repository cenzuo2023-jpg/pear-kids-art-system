import re

with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update activeStudents
active_replacement = '''const activeStudents = computed(() => {
  return students.value
    .filter(s => s.status !== '已归档')
    .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'zh-Hans-CN'));
});'''
text = re.sub(r'const activeStudents = computed\(\(\) => \{\s*return students\.value\.filter\(s => s\.status !== \'[^\']+\'\);\s*\}\);', active_replacement, text)

# 2. Update archivedStudents
archived_replacement = '''const archivedStudents = computed(() => {
  return students.value
    .filter(s => s.status === '已归档')
    .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'zh-Hans-CN'));
});'''
text = re.sub(r'const archivedStudents = computed\(\(\) => \{\s*return students\.value\.filter\(s => s\.status === \'[^\']+\'\);\s*\}\);', archived_replacement, text)

# 3. Remove sort from pointsRankingList
points_sort_pattern = r'list\.sort\(\(a, b\) => \{\s*if \(pointsRankingSort\.value === \'total\'\) \{\s*return Number\(b\.totalPointsEarned \|\| 0\) - Number\(a\.totalPointsEarned \|\| 0\);\s*\}\s*return Number\(b\.points \|\| 0\) - Number\(a\.points \|\| 0\);\s*\}\);'
text = re.sub(points_sort_pattern, '', text)

# 4. Remove sort from rankingList
ranking_sort_pattern = r'list\.sort\(\(a, b\) => \{\s*const diff = Number\(a\.remainHours\) - Number\(b\.remainHours\);\s*return rankingSortOrder\.value === \'asc\' \? diff : -diff;\s*\}\);'
text = re.sub(ranking_sort_pattern, '', text)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
