import os, base64
from make import *
from compose import *
B = os.path.join(OUT, 'boards'); os.makedirs(B, exist_ok=True)
# construction diagram (local frame drawn in global coords)
def construction():
    tr = f'translate({f(OX)} {f(OY)}) rotate({f(TH)})'
    cy = -Q
    guides = ''.join(f'<line x1="-420" x2="420" y1="{f(v)}" y2="{f(v)}"/>' for v in
                     (-Q-RO, -Q-RI, Q-RO, Q-RI, -Q+RI, -Q+RO, Q+RI, Q+RO))
    circ = (f'<circle cx="{f(-P)}" cy="{f(-Q)}" r="{f(RO)}"/><circle cx="{f(-P)}" cy="{f(-Q)}" r="{f(RI)}"/>'
            f'<circle cx="{f(P)}" cy="{f(Q)}" r="{f(RO)}"/><circle cx="{f(P)}" cy="{f(Q)}" r="{f(RI)}"/>'
            f'<circle cx="{f(-P)}" cy="{f(-Q)}" r="6" fill="#0b7fe8" stroke="none"/><circle cx="{f(P)}" cy="{f(Q)}" r="6" fill="#0b7fe8" stroke="none"/>')
    hooks = (f'<path d="{hook_d(LA_TOP)}" fill="#e8f0fa" stroke="#0b1b33" stroke-width="3"/>'
             f'<path transform="rotate(180)" d="{hook_d(LA_BOT)}" fill="#cfe0f6" stroke="#0b1b33" stroke-width="3"/>')
    grid = ''.join(f'<rect x="{x}" y="{y}" width="{s}" height="{s}" fill="none" stroke="#0b7fe8" stroke-width="2"/>' for x, y, s, c in SQUARES)
    pg = ''.join(f'<line x1="{x}" x2="{x}" y1="96" y2="380" />' for x in range(780, 1000, 12)) + ''.join(f'<line y1="{y}" y2="{y}" x1="768" x2="1000"/>' for y in range(96, 384, 12))
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="330 70 700 700"><g stroke="#e3e9f2" stroke-width="1">{pg}</g>'
            f'<g transform="{tr}"><g stroke="#9fb4d3" stroke-width="1.5" stroke-dasharray="6 6" fill="none">{guides}{circ}</g>{hooks}</g>{grid}</svg>')
open(os.path.join(OUT, 'build', 'construction.svg'), 'w').write(construction())

CSS = '''body{margin:0;font-family:"Inter",system-ui,sans-serif;color:#0b1b33;background:#f4f6f9}
.lbl{font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#4b5563}
.card{background:#fff;border:1px solid #dfe5ee;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative}
.card.dark{background:#0b1b33;border-color:#0b1b33}.card .lbl{position:absolute;left:18px;top:14px}.card.dark .lbl{color:#b4c0d3}
h1{font-size:26px;margin:0;letter-spacing:-.01em}'''

def board1():
    open(os.path.join(OUT, 'build', 'stacked-ref-artboard.svg'), 'w').write(stacked('color', TAG_ORIGINAL, 'r', artboard=(0, 0, 1254, 1254)))
    ref = 'file://' + os.path.join(OUT, 'reference.png')
    html = f'''<html><head><style>{CSS}
.wrap{{padding:36px 40px;box-sizing:border-box;width:1600px;height:1000px;display:grid;grid-template-columns:560px 560px 360px;grid-template-rows:auto 1fr;gap:20px}}
.head{{grid-column:1/4;display:flex;justify-content:space-between;align-items:baseline}}
ul{{margin:8px 0 0;padding-left:18px;font-size:14px;line-height:1.55;color:#1f2937}}</style></head><body><div class="wrap">
<div class="head"><h1>ShowMe logo · reference vs vector rebuild</h1><span class="lbl">Exploration · not live</span></div>
<div class="card"><span class="lbl">Josh's reference (PNG)</span><img src="{ref}" style="width:530px;height:530px;object-fit:contain;margin-top:20px"></div>
<div class="card"><span class="lbl">Rebuild (SVG) · same tagline for comparison</span><img src="stacked-ref-artboard.svg" style="width:530px;height:530px;margin-top:20px"></div>
<div style="display:flex;flex-direction:column;gap:20px">
<div class="card" style="height:400px"><span class="lbl">Construction</span><img src="../build/construction.svg" style="width:330px;margin-top:28px"></div>
<div class="card" style="flex:1;align-items:flex-start;justify-content:flex-start;padding:18px 20px"><span class="lbl" style="position:static">What changed</span><ul>
<li>Two identical hooks, one turned 180°, with one even gap: that gap is the white S</li>
<li>Every curve is a true arc; all four bands are the same width and run parallel</li>
<li>Both cut ends at the same angle</li>
<li>Pixel squares on a 12-unit grid in 3 sizes</li>
<li>Shading cut to one crisp fold per bowl plus a soft glow</li>
<li>Montserrat ExtraBold wordmark turned into outlines</li></ul></div></div>
</div></body></html>'''
    open(os.path.join(OUT, 'build', 'board1.html'), 'w').write(html)

def board2():
    tab = lambda dark: f'''<div style="display:flex;align-items:center;gap:8px;background:{'#202124' if dark else '#dee1e6'};padding:6px 8px 0;border-radius:8px 8px 0 0;width:200px">
<div style="display:flex;align-items:center;gap:8px;background:{'#35363a' if dark else '#fff'};color:{'#e8eaed' if dark else '#202124'};font:12px system-ui;padding:7px 10px;border-radius:8px 8px 0 0;width:170px">
<img src="../favicon/favicon.svg" width="16" height="16">ShowMe Digital Agency</div></div>'''
    nav = ''.join(f'<span style="padding:0 12px;font-weight:550;font-size:15.2px">{t}</span>' for t in ['Solutions ▾', 'Industries ▾', 'How we work', 'Insights', 'Free Assessment', 'Company ▾'])
    header = f'''<div style="background:#fff;border:1px solid #dfe5ee;border-radius:12px;overflow:hidden">
<div style="display:flex;align-items:center;gap:24px;min-height:72px;padding:0 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;color:#0b1b33;border-bottom:1px solid #dfe5ee">
<img src="../showme-logo-horizontal.svg" style="height:48px"><div style="margin-left:auto;display:flex;align-items:center">{nav}</div>
<span style="background:#0a58a8;color:#fff;font-weight:600;font-size:15px;padding:11px 18px;border-radius:6px">Book a call</span></div>
<div style="background:#0b1b33;color:#e6ecf5;padding:54px 28px 50px;font-family:-apple-system,'Segoe UI',Arial,sans-serif">
<div style="font-size:44px;font-weight:700;letter-spacing:-.02em;line-height:1.15;max-width:820px;color:#fff">Technology That Runs Your Business.<br>Solutions That Power Its Growth.</div></div></div>'''
    fav = ''.join(f'<div style="display:flex;flex-direction:column;align-items:center;gap:6px"><img src="../favicon/{src}" width="{s}" height="{s}"><span style="font-size:11px;color:#4b5563">{s}px</span></div>'
                  for src in ('favicon.svg', 'favicon-flat.svg') for s in (16, 32, 64))
    html = f'''<html><head><style>{CSS}
.wrap{{padding:36px 40px;width:1600px;box-sizing:border-box;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}}
.full{{grid-column:1/4}} .sq{{height:470px}} .sq img{{width:400px;height:400px;object-fit:contain;margin-top:18px}}
.hz{{height:190px}} .hz img{{height:92px;margin-top:14px}}</style></head><body><div class="wrap">
<div class="full" style="display:flex;justify-content:space-between;align-items:baseline"><h1>ShowMe logo · all variants</h1><span class="lbl">Exploration · not live</span></div>
<div class="full"><div class="lbl" style="margin-bottom:8px">Site header mockup (lockup at 48px in a copy of the site's 72px header)</div>{header}</div>
<div class="card sq"><span class="lbl">Stacked · primary tagline</span><img src="../showme-logo-stacked.svg"></div>
<div class="card sq"><span class="lbl">Stacked · Josh's original tagline</span><img src="../showme-logo-stacked-tagline-original.svg"></div>
<div class="card sq"><span class="lbl">Stacked · no tagline</span><img src="../showme-logo-stacked-no-tagline.svg"></div>
<div class="card sq dark"><span class="lbl">Reversed on navy</span><img src="../showme-logo-stacked-reversed.svg"></div>
<div class="card sq"><span class="lbl">Single colour · navy</span><img src="../showme-logo-stacked-mono-navy.svg"></div>
<div class="card sq dark"><span class="lbl">Single colour · white</span><img src="../showme-logo-stacked-mono-white.svg"></div>
<div class="card hz"><span class="lbl">Horizontal</span><img src="../showme-logo-horizontal.svg"></div>
<div class="card hz dark"><span class="lbl">Horizontal · reversed</span><img src="../showme-logo-horizontal-reversed.svg"></div>
<div class="card hz"><span class="lbl">Horizontal · single colour</span><img src="../showme-logo-horizontal-mono-navy.svg"></div>
<div class="card" style="height:300px"><span class="lbl">Symbol</span><img src="../showme-symbol.svg" style="width:230px;margin-top:20px"></div>
<div class="card dark" style="height:300px"><span class="lbl">Symbol · reversed</span><img src="../showme-symbol-reversed.svg" style="width:230px;margin-top:20px"></div>
<div class="card" style="height:300px;gap:18px"><span class="lbl">Favicon · actual size</span>
<div style="display:flex;align-items:flex-end;gap:16px;margin-top:26px">{fav}</div>
<div style="display:flex;gap:10px;transform:scale(.95)">{tab(False)}{tab(True)}</div></div>
</div></body></html>'''
    open(os.path.join(OUT, 'build', 'board2.html'), 'w').write(html)

if __name__ == '__main__':
    board1(); board2()
    from shot import shot
    shot(os.path.join(OUT, 'build', 'board1.html'), os.path.join(B, 'board-reference-vs-rebuild.png'), 1600, 1000)
    shot(os.path.join(OUT, 'build', 'board2.html'), os.path.join(B, 'board-variants.png'), 1600, 1000, 1, True)
    print('boards ok')
