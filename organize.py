import re, os

print('Organizando MATZON...\n')

with open('css/style.css', 'r') as f:
    css = f.read()
with open('js/app.js', 'r') as f:
    js_orig = f.read()
with open('index.html', 'r') as f:
    html = f.read()

SEP = re.compile(r'(/\*\s*={20,}.*?={20,}\s*\*/)', re.DOTALL)
parts = SEP.split(css)
sections = {}
i = 0
while i < len(parts):
    chunk = parts[i]
    if SEP.fullmatch(chunk.strip()):
        title = re.sub(r'[/\*=\n]', ' ', chunk).strip()
        content = parts[i+1] if i+1 < len(parts) else ''
        sections[title] = chunk + content
        i += 2
    else:
        i += 1

def get_css(*kws):
    r = []
    for kw in kws:
        for t,b in sections.items():
            if kw.upper() in t.upper():
                r.append(b.rstrip())
                break
    return '\n\n'.join(r)+'\n'

files = {
    'css/base.css':       ('VARIÁVEIS',),
    'css/layout.css':     ('HEADER','MENU LATERAL','FOOTER'),
    'css/components.css': ('SCHEDULE','BANNER','NEWS','MODAL'),
    'css/pages.css':      ('DASHBOARD','MERCHANDISE','NATIONS','PERFIL','COMUNIDADE'),
    'css/responsive.css': ('RESPONSIVE',),
}
for path, kws in files.items():
    c = get_css(*kws)
    open(path,'w').write(c)
    print('CSS:', path)

os.makedirs('js/modules', exist_ok=True)

m = re.search(r"document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{(.+)\}\s*\);", js_orig, re.DOTALL)
body = m.group(1)
after = js_orig[m.end():].strip()

JSEP = re.compile(r'\n\s*// ={30,}\n\s+// (.+?)\n\s+// ={30,}', re.MULTILINE)
pos = [(x.group(1).strip(), x.start(), x.end()) for x in JSEP.finditer(body)]
jss = {}
for i,(t,s,e) in enumerate(pos):
    nxt = pos[i+1][1] if i+1<len(pos) else len(body)
    jss[t] = body[e:nxt]

rk = next((t for t in jss if 'ROUTING' in t.upper()), None)
comm = ''
if rk:
    raw = jss[rk]
    cm = raw.find('// Comunidade')
    if cm >= 0:
        jss[rk] = raw[:cm].strip()
        comm = raw[cm:].strip()

def gj(*kws):
    r=[]
    for kw in kws:
        for t,c in jss.items():
            if kw.upper() in t.upper():
                r.append(c.strip())
                break
    return '\n\n'.join(r)

def wmod(path, name, resp, body2, extra=''):
    c=f"// MATZON - {name}\n// {resp}\n'use strict';\n\ndocument.addEventListener('DOMContentLoaded', () => {{\n\n{body2}\n{extra}\n}});\n"
    open(path,'w').write(c)
    print('JS:', path)

wmod('js/modules/ui.js','ui.js','Active states e scroll horizontal',gj('ACTIVE STATE'))

rb = '\n\n'.join(filter(None,[
    '// Header Scroll', gj('HEADER SCROLL'),
    '// Routing', gj('ROUTING'),
    '// Menu Hamburguer', gj('HAMBURGUER','HAMBÚRGUER'),
    '// Comunidade', comm,
]))
wmod('js/modules/router.js','router.js','Routing, hamburger, comunidade',rb)

wmod('js/modules/carousel.js','carousel.js','Todos os carrosseis',gj('BANNER CAROUSEL','SCHEDULE CAROUSEL','GENERIC CAROUSEL'))

wmod('js/modules/profile.js','profile.js','Perfil e barras de performance',gj('PERFIL'),
     "\n    window.MATZON = window.MATZON || {};\n    window.MATZON.animateProfileBars = typeof animateProfileBars === 'function' ? animateProfileBars : function(){};")

open('js/modules/modal.js','w').write(
    f"// MATZON - modal.js\n// Modal de detalhes do jogo\n'use strict';\n\ndocument.addEventListener('DOMContentLoaded', () => {{\n\n{gj('MODAL MATCH')}\n\n}});\n\n// Global\n{after}\n"
)
print('JS: js/modules/modal.js')

open('js/app.js','w').write(
    "// MATZON - app.js\n// Ponto de entrada. Modulos carregam-se automaticamente.\nwindow.MATZON = window.MATZON || {};\n"
)
print('JS: js/app.js')

html = html.replace(
    '<link rel="stylesheet" href="css/style.css">',
    '<link rel="stylesheet" href="css/base.css">\n    <link rel="stylesheet" href="css/layout.css">\n    <link rel="stylesheet" href="css/components.css">\n    <link rel="stylesheet" href="css/pages.css">\n    <link rel="stylesheet" href="css/responsive.css">'
)
html = html.replace(
    '<script src="js/app.js"></script>',
    '<script src="js/modules/ui.js"></script>\n    <script src="js/modules/router.js"></script>\n    <script src="js/modules/carousel.js"></script>\n    <script src="js/modules/profile.js"></script>\n    <script src="js/modules/modal.js"></script>\n    <script src="js/app.js"></script>'
)
open('index.html','w').write(html)
print('HTML: index.html actualizado')

print('\nConcluido!')
