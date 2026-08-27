from html.parser import HTMLParser

class DivParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []
        
    def handle_starttag(self, tag, attrs):
        if tag in ['div', 'section', 'template', 'button', 'span', 'tr', 'td', 'th', 'table', 'thead', 'tbody', 'ul', 'li']:
            self.stack.append((tag, self.getpos()))
            
    def handle_endtag(self, tag):
        if tag in ['div', 'section', 'template', 'button', 'span', 'tr', 'td', 'th', 'table', 'thead', 'tbody', 'ul', 'li']:
            if not self.stack:
                self.errors.append(f'Extra </{tag}> at {self.getpos()}')
                return
            top_tag, top_pos = self.stack[-1]
            if top_tag == tag:
                self.stack.pop()
            else:
                self.errors.append(f'Mismatched tag: expected </{top_tag}> from {top_pos}, but got </{tag}> at {self.getpos()}')
                # Try to recover by popping until we find it
                found = False
                for i in range(len(self.stack)-1, -1, -1):
                    if self.stack[i][0] == tag:
                        self.stack = self.stack[:i]
                        found = True
                        break
                if not found:
                    pass

parser = DivParser()
with open('src/App.vue', 'r', encoding='utf-8') as f:
    parser.feed(f.read())

for err in parser.errors:
    print(err)
for unclosed in parser.stack:
    print(f'Unclosed <{unclosed[0]}> at {unclosed[1]}')
