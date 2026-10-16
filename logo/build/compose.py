import os, math
from make import *
from textpath import glyph_runs, text_path

TAG_PRIMARY = ['TECHNOLOGY', 'AUTOMATION', 'DIGITAL GROWTH']
TAG_ORIGINAL = ['TECHNOLOGY', 'SECURITY', 'DIGITAL GROWTH']

THEMES = {
    'color':   dict(show=NAVY, me=('#0b5ee0', '#1aaef6'), sub=NAVY, tag=NAVY, dot='#1673e8', rule=('#1e88e5',), sym='color'),
    'reverse': dict(show='#ffffff', me=('#3c9cff', '#52d6ff'), sub='#e6ecf5', tag='#c9d4e4', dot='#3fb0ff', rule=('#3fa2f5',), sym='reverse'),
    'navy':    dict(show=NAVY, me=None, sub=NAVY, tag=NAVY, dot=NAVY, rule=(NAVY,), sym='mono', mono=NAVY),
    'white':   dict(show='#ffffff', me=None, sub='#ffffff', tag='#ffffff', dot='#ffffff', rule=('#ffffff',), sym='mono', mono='#ffffff'),
}

def wordmark(cx, base, size, theme, idp, align='center', x0=None):
    """'Show' + 'Me' outlines. Returns (defs, svg, (x0, x1))."""
    runs, adv = glyph_runs('ShowMe', 'Montserrat', 800, size, -0.02, 0, 0)
    x = cx - adv/2 if align == 'center' else x0
    runs, adv = glyph_runs('ShowMe', 'Montserrat', 800, size, -0.02, x, base)
    show = ''.join(d for ch, d in runs[:4]); me = ''.join(d for ch, d in runs[4:])
    defs = ''
    if theme['me']:
        # gradient across "Me" (from its left foot to its top right)
        mx0 = x + adv*0.585; mx1 = x + adv
        defs = lingrad(f'{idp}me', mx0, base, mx1, base - size*0.74, [S(0, theme['me'][0]), S(1, theme['me'][1])])
        mefill = f'url(#{idp}me)'
    else:
        mefill = theme['show']
    svg = f'<g class="wordmark"><path class="show" d="{show}" fill="{theme["show"]}"/><path class="me" d="{me}" fill="{mefill}"/></g>'
    return defs, svg, (x, x + adv)

def line_text(text, cx, base, size, tracking, weight, fill, align='center', x0=None, cls=None):
    _, adv, _b = text_path(text, 'Montserrat', weight, size, tracking)
    x = cx - adv/2 if align == 'center' else x0
    d, adv, b = text_path(text, 'Montserrat', weight, size, tracking, x, base)
    c = f' class="{cls}"' if cls else ''
    return f'<path{c} d="{d}" fill="{fill}"/>', adv

def tagline(words, x0, x1, base, size, theme):
    tr = 0.1; weight = 600
    advs = [text_path(w, 'Montserrat', weight, size, tr)[1] for w in words]
    dot_r = size*0.19; dot_gap = size*0.95; rule_gap = size*0.9
    inner = sum(advs) + (len(words)-1)*(2*dot_gap)
    cx = (x0+x1)/2
    x = cx - inner/2
    out = []; capmid = base - size*0.355
    for i, (w, a) in enumerate(zip(words, advs)):
        out.append(line_text(w, 0, base, size, tr, weight, theme['tag'], 'left', x)[0])
        x += a
        if i < len(words)-1:
            out.append(f'<circle cx="{f(x+dot_gap)}" cy="{f(capmid)}" r="{f(dot_r)}" fill="{theme["dot"]}"/>')
            x += 2*dot_gap
    lx0 = cx - inner/2 - rule_gap; lx1 = cx + inner/2 + rule_gap
    h = size*0.1
    out.append(f'<rect x="{f(x0)}" y="{f(capmid-h/2)}" width="{f(lx0-x0)}" height="{f(h)}" fill="{theme["rule"][0]}"/>')
    out.append(f'<rect x="{f(lx1)}" y="{f(capmid-h/2)}" width="{f(x1-lx1)}" height="{f(h)}" fill="{theme["rule"][0]}"/>')
    return '<g class="tagline">' + ''.join(out) + '</g>'

def sym(theme, idp, squares=True, which=None):
    if theme['sym'] == 'mono':
        return '', symbol_mono(theme['mono'], squares=squares, which=which)
    return symbol_color(idp, theme['sym'], slot_fill='#ffffff' if theme['sym'] == 'reverse' else None, squares=squares, which=which)

def doc(vb, defs, body, title, bg=None):
    x, y, w, h = vb
    bgr = f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="{bg}"/>' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{f(x)} {f(y)} {f(w)} {f(h)}" role="img" aria-labelledby="t">'
            f'<title id="t">{title}</title><defs>{defs}</defs>{bgr}{body}</svg>\n')

def stacked(theme_name='color', tag=TAG_PRIMARY, idp='s', bg=None, artboard=None):
    th = THEMES[theme_name]
    d1, b1 = sym(th, idp)
    d2, wm, (x0, x1) = wordmark(627, 958, 256, th, idp)
    sub, _ = line_text('DIGITAL AGENCY', 627, 1033, 64, 0.38, 560, th['sub'], cls='sub')
    body = b1 + wm + sub
    bottom = 1035
    if tag:
        body += tagline(tag, x0 + 6, x1 - 6, 1107, 32, th); bottom = 1110
    pad = 44
    left = min(x0, 375) - pad; top = 114 - pad
    vb = (left, top, (1254 - left) - left, bottom + pad - top)
    if artboard: vb = artboard
    title = 'ShowMe Digital Agency' + (' — ' + ' · '.join(w.title() for w in tag) if tag else '')
    return doc(vb, d1 + d2, body, title, bg)

# ---- horizontal lockup (symbol left, wordmark right) ----
HZ_SQUARES = [0, 1, 2, 3]   # the two smallest squares drop out at header sizes

def horizontal(theme_name='color', idp='h', squares=True, bg=None):
    th = THEMES[theme_name]
    which = HZ_SQUARES
    sx0, sy0, sx1, sy1 = symbol_bounds(squares, which)
    d1, b1 = sym(th, idp, squares, which)
    sh = sy1 - sy0
    size = sh * 0.62
    gap = sh * 0.12
    tx = sx1 + gap
    base = sy0 + sh*0.60
    d2, wm, (x0, x1) = wordmark(0, base, size, th, idp, 'left', tx)
    subsize = size*0.31
    sub, sw = line_text('DIGITAL AGENCY', 0, base + size*0.47, subsize, 0.16, 650, th['sub'], 'left', x0 + size*0.02, cls='sub')
    right = max(x1, x0 + sw)
    pad = sh*0.06
    vb = (sx0 - pad, sy0 - pad, right - sx0 + 2*pad, sh + 2*pad)
    return doc(vb, d1 + d2, b1 + wm + sub, 'ShowMe Digital Agency', bg)

def symbol_doc(theme_name='color', idp='y', squares=True, bg=None):
    th = THEMES[theme_name]
    sx0, sy0, sx1, sy1 = symbol_bounds(squares)
    d1, b1 = sym(th, idp, squares)
    pad = 16
    w = sx1-sx0; h = sy1-sy0; side = max(w, h) + 2*pad
    vb = ((sx0+sx1)/2 - side/2, (sy0+sy1)/2 - side/2, side, side)
    return doc(vb, d1, b1, 'ShowMe', bg)

if __name__ == '__main__':
    O = OUT
    files = {
        'showme-logo-stacked.svg': stacked('color', TAG_PRIMARY, 'a'),
        'showme-logo-stacked-tagline-original.svg': stacked('color', TAG_ORIGINAL, 'b'),
        'showme-logo-stacked-no-tagline.svg': stacked('color', None, 'c'),
        'showme-logo-stacked-reversed.svg': stacked('reverse', TAG_PRIMARY, 'd'),
        'showme-logo-stacked-reversed-no-tagline.svg': stacked('reverse', None, 'e'),
        'showme-logo-stacked-mono-navy.svg': stacked('navy', TAG_PRIMARY, 'f'),
        'showme-logo-stacked-mono-white.svg': stacked('white', TAG_PRIMARY, 'g'),
        'showme-logo-horizontal.svg': horizontal('color', 'h'),
        'showme-logo-horizontal-reversed.svg': horizontal('reverse', 'i'),
        'showme-logo-horizontal-mono-navy.svg': horizontal('navy', 'j'),
        'showme-logo-horizontal-mono-white.svg': horizontal('white', 'k'),
        'showme-symbol.svg': symbol_doc('color', 'l'),
        'showme-symbol-reversed.svg': symbol_doc('reverse', 'm'),
        'showme-symbol-mono-navy.svg': symbol_doc('navy', 'n'),
        'showme-symbol-mono-white.svg': symbol_doc('white', 'o'),
    }
    for name, s in files.items():
        open(os.path.join(O, name), 'w').write(s)
    print('wrote', len(files))
