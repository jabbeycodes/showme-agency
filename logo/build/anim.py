import os, re
from compose import *
CSS = """
/* ShowMe logo motion: the two ribbon halves glide along their fold line and lock together,
   the pixel squares assemble, then the wordmark settles in. ~1.6s total, runs once. */
.sm-anim .slide{animation:sm-glide 1s cubic-bezier(.16,.84,.24,1) both}
.sm-anim .hook1 .slide{animation-delay:.08s}
.sm-anim .px{transform-box:fill-box;transform-origin:50% 50%;animation:sm-px .55s cubic-bezier(.2,.9,.25,1.15) both}
.sm-anim .px0{animation-delay:.62s}.sm-anim .px1{animation-delay:.70s}.sm-anim .px3{animation-delay:.76s}
.sm-anim .px2{animation-delay:.82s}.sm-anim .px5{animation-delay:.90s}.sm-anim .px4{animation-delay:.98s}
.sm-anim .wordmark,.sm-anim .sub,.sm-anim .tagline{animation:sm-rise .7s cubic-bezier(.2,.7,.2,1) both}
.sm-anim .wordmark{animation-delay:.55s}.sm-anim .sub{animation-delay:.72s}.sm-anim .tagline{animation-delay:.85s}

.sm-anim .slot{animation:sm-fade .35s .8s both}
@keyframes sm-fade{0%{opacity:0}100%{opacity:1}}
@keyframes sm-glide{0%{transform:translate(-210px,0);opacity:0}35%{opacity:1}100%{transform:none;opacity:1}}
@keyframes sm-px{0%{transform:translate(-46px,46px) scale(.2);opacity:0}100%{transform:none;opacity:1}}
@keyframes sm-rise{0%{transform:translateY(18px);opacity:0}100%{transform:none;opacity:1}}
@media (prefers-reduced-motion:reduce){.sm-anim *{animation:none!important}}
"""
def animate(svg):
    svg = svg.replace('<svg ', '<svg class="sm-anim" ', 1)
    return svg.replace('<defs>', f'<style>{CSS}</style><defs>', 1)

if __name__ == '__main__':
    d = os.path.join(OUT, 'animated'); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'showme-logo-animated-stacked.svg'), 'w').write(animate(stacked('color', TAG_PRIMARY, 'A')))
    open(os.path.join(d, 'showme-logo-animated-stacked-no-tagline.svg'), 'w').write(animate(stacked('color', None, 'B')))
    open(os.path.join(d, 'showme-logo-animated-horizontal.svg'), 'w').write(animate(horizontal('color', 'C')))
    open(os.path.join(d, 'showme-logo-animated-reversed.svg'), 'w').write(animate(stacked('reverse', TAG_PRIMARY, 'D')))
    open(os.path.join(d, 'showme-logo-motion.css'), 'w').write(CSS.strip()+'\n')
    inline = animate(horizontal('color', 'E'))
    demo = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><title>ShowMe logo motion demo</title>
<style>body{{margin:0;font-family:system-ui,sans-serif;color:#0b1b33}}header{{display:flex;align-items:center;gap:24px;height:72px;padding:0 32px;border-bottom:1px solid #dfe5ee}}
header .brand svg{{height:44px;width:auto;display:block}}section{{display:grid;grid-template-columns:1fr 1fr;gap:0}}section div{{display:flex;align-items:center;justify-content:center;height:560px}}
.dark{{background:#0b1b33}}button{{margin:16px 32px;font:inherit;padding:8px 14px;border-radius:6px;border:1px solid #c3ccd9;background:#fff;cursor:pointer}}</style></head>
<body><header><a class="brand" href="#" aria-label="ShowMe Digital Agency home">{inline}</a><nav>Solutions · Industries · How we work · Insights</nav></header>
<button onclick="document.querySelectorAll('img,.brand').forEach(e=>{{const c=e.cloneNode(true);e.replaceWith(c)}})">Replay</button>
<section><div><img src="showme-logo-animated-stacked.svg" width="480" alt="ShowMe Digital Agency"></div>
<div class="dark"><img src="showme-logo-animated-reversed.svg" width="480" alt="ShowMe Digital Agency"></div></section>
<p style="padding:0 32px">With "reduce motion" switched on in the OS, every element appears in its final state immediately.</p></body></html>'''
    open(os.path.join(d, 'demo.html'), 'w').write(demo)
    print('ok')
