with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('style="width: max-content; min-width: 100%; border-spacing: 0; background-color: var(--bg-page);">', 'style="width: max-content; border-spacing: 0; background-color: var(--bg-page);">')
with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
