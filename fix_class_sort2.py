import re

with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

replacement = '''const getClassSortValue = (name) => {
  if (!name) return '8_9999_';
  let day = 8;
  const weekMap = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 7, '天': 7 };
  const dayMatch = name.match(/周([一二三四五六日天])/);
  if (dayMatch) {
    day = weekMap[dayMatch[1]];
  }
  
  let timeVal = '9999';
  const timeMatch = name.match(/(\\d{1,2})[:：]?(\\d{2})/);
  if (timeMatch) {
    let h = parseInt(timeMatch[1], 10);
    let m = parseInt(timeMatch[2], 10);
    timeVal = (h < 10 ? '0' + h : h) + '' + (m < 10 ? '0' + m : m);
  }
  
  return \\_\_\\;
};

const activeClasses = computed(() => {
  return classes.value
    .filter(c => c.status !== 'archived')
    .sort((a, b) => getClassSortValue(a.name).localeCompare(getClassSortValue(b.name), 'zh-Hans-CN'));
});

const archivedClasses = computed(() => {
  return classes.value
    .filter(c => c.status === 'archived')
    .sort((a, b) => getClassSortValue(a.name).localeCompare(getClassSortValue(b.name), 'zh-Hans-CN'));
});'''

text = re.sub(r'const activeClasses = computed\(\(\) => \{\s*return classes\.value\.filter\(c => c\.status !== \'archived\'\);\s*\}\);\s*const archivedClasses = computed\(\(\) => \{\s*return classes\.value\.filter\(c => c\.status === \'archived\'\);\s*\}\);', replacement, text)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
