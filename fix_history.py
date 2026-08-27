import json
with open('src/App.vue', 'r', encoding='utf-8') as f:
    text = f.read()

import re
old_watch = r'''if (window.location.hash !== targetHash) {
        window.history.replaceState(null, '', targetHash);
      }
    });'''

new_watch = r'''if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
    });'''

text = text.replace(old_watch, new_watch)

with open('src/App.vue', 'w', encoding='utf-8') as f:
    f.write(text)
