"""ShowMe logo rebuild: generates all SVG variants from one parametric construction.
Construction (local frame, rotated TH degrees): two identical hooks (arm + half-ring bowl + leg with round end),
the second rotated 180 degrees and nested in the first; the white S is the uniform gap G between them.
"""
import math, os, re
import numpy as np
from shapely.geometry import Polygon, Point, box
from shapely.ops import unary_union
from shapely import affinity
from textpath import glyph_runs, text_path

OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# ---- core construction (reference-pixel units; fitted to Josh's PNG, then rounded) ----
TH, OX, OY = 24.0, 628.0, 455.0
W, G, P = 104.0, 28.0, 80.0
RI = W/2 + G          # 80  inner bowl radius
RO = RI + W           # 184 outer bowl radius
Q = (W + G)/2         # 66  half the arm-to-arm pitch
LA_TOP, LA_BOT, PHI = 92.0, 170.0, 115.0

NAVY = '#0b1b33'

def f(v):
    s = ('%.2f' % v).rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s

def hook_d(La, phi=PHI, w=W, g=G, p=P):
    ri = w/2 + g; ro = ri + w; q = (w+g)/2; cy = -q
    a = math.radians(phi)
    pv = cy - (ri+ro)/2
    ut = La + ((cy-ro) - pv)/math.tan(a)
    ub = La + ((cy-ri) - pv)/math.tan(a)
    r2 = w/2
    return (f'M{f(ut)} {f(cy-ro)}H{f(-p)}A{f(ro)} {f(ro)} 0 0 0 {f(-p)} {f(cy+ro)}'
            f'H{f(p)}A{f(r2)} {f(r2)} 0 0 0 {f(p)} {f(cy+ri)}H{f(-p)}'
            f'A{f(ri)} {f(ri)} 0 0 1 {f(-p)} {f(cy-ri)}H{f(ub)}Z')

def hook_poly(La, phi=PHI, w=W, g=G, p=P, res=96):
    ri = w/2 + g; ro = ri + w; q = (w+g)/2; cy = -q
    arm = box(-p, cy-ro, La+3*w, cy-ri)
    ring = Point(-p, cy).buffer(ro, res).difference(Point(-p, cy).buffer(ri, res))
    bowl = ring.intersection(box(-p-2*ro, cy-2*ro, -p, cy+2*ro))
    leg = box(-p, cy+ri, p, cy+ro); cap = Point(p, q).buffer(w/2, res)
    a = math.radians(phi); d = np.array([math.cos(a), math.sin(a)]); n = np.array([d[1], -d[0]])
    if n[0] < 0: n = -n
    Pp = np.array([La, cy-(ri+ro)/2]); big = 5000
    arm = arm.intersection(Polygon([Pp+d*big, Pp+d*big-n*big, Pp-d*big-n*big, Pp-d*big]))
    return unary_union([arm, bowl, leg, cap])

def to_global(geom, rot180=False, th=TH, ox=OX, oy=OY):
    if rot180: geom = affinity.rotate(geom, 180, origin=(0, 0))
    return affinity.translate(affinity.rotate(geom, th, origin=(0, 0)), ox, oy)

def poly_d(geom):
    polys = [geom] if geom.geom_type == 'Polygon' else list(geom.geoms)
    out = []
    for pg in polys:
        for ring in [pg.exterior, *pg.interiors]:
            c = list(ring.coords)[:-1]
            out.append('M' + 'L'.join(f'{f(x)} {f(y)}' for x, y in c) + 'Z')
    return ''.join(out)

def slot_geom(w=W, g=G, p=P, la_top=LA_TOP, la_bot=LA_BOT, th=TH, ox=OX, oy=OY):
    a = to_global(hook_poly(la_top, w=w, g=g, p=p), False, th, ox, oy)
    b = to_global(hook_poly(la_bot, w=w, g=g, p=p), True, th, ox, oy)
    hooks = unary_union([a, b])
    hull = hooks.buffer(g*0.8, 64).buffer(-g*0.8, 64)
    slot = hull.difference(hooks)
    # dilate under the hooks slightly (no hairline seams) but stay inside the outer silhouette
    return slot.buffer(1.5, 32).intersection(hull.buffer(-2.5, 32)).simplify(0.15)

# ---- pixel squares (12-unit grid, flat colours) ----
SQUARES = [  # x, y, size, colour (sizes 60/48/24 = 5/4/2 units of a 12-unit grid)
    (816, 306, 60, '#0a3d8f'),
    (876, 222, 60, '#0b7fe8'),
    (888, 162, 48, '#12acf7'),
    (804, 186, 48, '#0b2f6b'),
    (972, 114, 24, '#22c3f6'),
    (948, 198, 24, '#18b6f6'),
]

SQUARES_ON_NAVY = {'#0a3d8f': '#1d63d6', '#0b2f6b': '#2f6fd8'}

def squares_svg(fill=None, which=None, on_navy=False):
    out = []
    for i, (x, y, s, c) in enumerate(SQUARES):
        if which is not None and i not in which: continue
        if on_navy: c = SQUARES_ON_NAVY.get(c, c)
        out.append(f'<rect class="px px{i}" x="{f(x)}" y="{f(y)}" width="{f(s)}" height="{f(s)}" rx="{f(s*0.06)}" fill="{fill or c}"/>')
    return ''.join(out)

# ---- symbol renderers ----
def lingrad(id_, x1, y1, x2, y2, stops, extra=''):
    st = ''.join(f'<stop offset="{f(o)}" stop-color="{c}"' + (f' stop-opacity="{f(a)}"' if a != 1 else '') + '/>' for o, c, a in stops)
    return f'<linearGradient id="{id_}" gradientUnits="userSpaceOnUse" x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}"{extra}>{st}</linearGradient>'

def radgrad(id_, cx, cy, r, stops):
    st = ''.join(f'<stop offset="{f(o)}" stop-color="{c}"' + (f' stop-opacity="{f(a)}"' if a != 1 else '') + '/>' for o, c, a in stops)
    return f'<radialGradient id="{id_}" gradientUnits="userSpaceOnUse" cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}">{st}</radialGradient>'

def S(o, c, a=1): return (o, c, a)

PALETTE = {
    'color': [
        dict(base=[S(0, '#3ad0fb'), S(.10, '#17acf8'), S(.283, '#0a84f1'), S(.5, '#0a5fd6'), S(.717, '#083a8a'), S(1, '#0a3f96')],
             cres=('#031540', '#0a3a8e'), leg=('#27dbf8', 1.0), arm=('#0a63dc', .5, 1.0), rim=None),
        dict(base=[S(0, '#0a2560'), S(.283, '#0c3a8a'), S(.5, '#062a6c'), S(.717, '#0b58cc'), S(1, '#0a50c0')],
             cres=('#020b28', '#06286e'), leg=('#0a2c74', .9), arm=None, rim='#2fd2fb', strip='#22b4fa'),
    ],
    'reverse': [
        dict(base=[S(0, '#4cd8ff'), S(.10, '#25b6fb'), S(.283, '#1192f4'), S(.5, '#1474e6'), S(.717, '#1152b8'), S(1, '#1256bd')],
             cres=('#0a2a6e', '#1450b0'), leg=('#44e2fa', 1.0), arm=('#0f6fe4', .4, 1.0), rim=None),
        dict(base=[S(0, '#1a52b8'), S(.283, '#2068d4'), S(.5, '#0e3a8a'), S(.717, '#1a78ea'), S(1, '#176fe2')],
             cres=('#0a2a6e', '#1048a8'), leg=('#1a4fb0', .8), arm=None, rim='#55dcff', strip='#4ccdfd'),
    ],
}

def crescent_d(k=None):
    """Inner-wall crescent of a bowl: between the inner arc (RI) and a circle through the inner arc's ends."""
    k = W*0.84 if k is None else k
    cy = -Q
    d = (RI**2 - (RI+k)**2) / (2*(RI+k))   # centre offset (negative = further left)
    R2 = RI + k + d
    return (f'M{f(-P)} {f(cy-RI)}A{f(R2)} {f(R2)} 0 1 0 {f(-P)} {f(cy+RI)}'
            f'A{f(RI)} {f(RI)} 0 0 1 {f(-P)} {f(cy-RI)}Z')

def symbol_color(idp, mode='color', slot_fill=None, squares=True, which=None):
    pals = PALETTE[mode]
    cy = -Q
    defs = []; body = []
    tr = f'translate({f(OX)} {f(OY)}) rotate({f(TH)})'
    for k, (La, rot) in enumerate(((LA_TOP, 0), (LA_BOT, 180))):
        pal = pals[k]; hid = f'{idp}h{k}'
        defs.append(f'<path id="{hid}" d="{hook_d(La)}"/>')
        defs.append(f'<clipPath id="{hid}c"><use href="#{hid}"/></clipPath>')
        defs.append(lingrad(f'{hid}g', 0, cy-RO, 0, cy+RO, pal['base']))
        lc, la = pal['leg']
        defs.append(lingrad(f'{hid}l', -P, 0, P+W/2, 0, [S(0, lc, 0), S(1, lc, la)]))
        if pal['arm']:
            ac, aa, cover = pal['arm']
            defs.append(lingrad(f'{hid}a', 0, 0, La+W*0.4, 0, [S(0, ac, 0), S(1, ac, aa)]))
        if pal.get('strip'):
            defs.append(lingrad(f'{hid}s', -P, 0, -P+90, 0, [S(0, pal['strip'], 0), S(1, pal['strip'], 1)]))
        if pal['rim']:
            # thin specular rim on the outer edge of the bowl, strongest where the band turns away from the arm
            defs.append(lingrad(f'{hid}rg', -P, cy-RO, -P-RO, cy, [S(0, pal['rim'], 0), S(.45, pal['rim'], .95), S(1, pal['rim'], 0)]))
        c0, c1 = pal['cres']
        defs.append(lingrad(f'{hid}w', 0, cy-RI, 0, cy+RI, [S(0, c0), S(.55, c0), S(1, c1)]))
        g = [f'<use href="#{hid}" fill="url(#{hid}g)"/>',
             f'<g clip-path="url(#{hid}c)">',
             f'<rect x="{f(-P)}" y="{f(cy+RI-1)}" width="{f(2*P+W/2+2)}" height="{f(W+2)}" fill="url(#{hid}l)"/>',
             (f'<rect x="{f(-P)}" y="{f(cy-RO-1)}" width="{f(La+W*1.5+P)}" height="{f(W+1)}" fill="url(#{hid}a)"/>' if pal['arm'] else ''),
             (f'<rect x="{f(-P)}" y="{f(cy-RI-W*0.17)}" width="{f(La+W*1.5+P)}" height="{f(W*0.17+1)}" fill="url(#{hid}s)"/>' if pal.get('strip') else ''),
             (f'<path d="M{f(-P+40)} {f(cy-RO+5)}H{f(-P)}A{f(RO-5)} {f(RO-5)} 0 0 0 {f(-P-RO+5)} {f(cy)}" fill="none" stroke="url(#{hid}rg)" stroke-width="10"/>' if pal['rim'] else ''),
             '</g>',
             f'<path d="{crescent_d()}" fill="url(#{hid}w)"/>']
        rot_s = ' rotate(180)' if rot else ''
        body.append(f'<g class="hook hook{k}" transform="{tr}{rot_s}"><g class="slide">' + ''.join(g) + '</g></g>')
    slot = f'<path class="slot" d="{poly_d(slot_geom())}" fill="{slot_fill}"/>' if slot_fill else ''
    px = f'<g class="pixels">{squares_svg(None, which, mode == "reverse")}</g>' if squares else ''
    return ''.join(defs), slot + ''.join(body) + px

def symbol_mono(fill, slot_fill=None, squares=True, which=None):
    tr = f'translate({f(OX)} {f(OY)}) rotate({f(TH)})'
    slot = f'<path class="slot" d="{poly_d(slot_geom())}" fill="{slot_fill}"/>' if slot_fill else ''
    s = (slot + f'<g fill="{fill}"><g class="hook hook0" transform="{tr}"><path class="slide" d="{hook_d(LA_TOP)}"/></g>'
         f'<g class="hook hook1" transform="{tr} rotate(180)"><path class="slide" d="{hook_d(LA_BOT)}"/></g></g>')
    if squares: s += f'<g class="pixels">{squares_svg(fill, which)}</g>'
    return s

def symbol_bounds(squares=True, which=None):
    a = to_global(hook_poly(LA_TOP)); b = to_global(hook_poly(LA_BOT), True)
    x0, y0, x1, y1 = unary_union([a, b]).bounds
    if squares:
        for i, (x, y, s, _) in enumerate(SQUARES):
            if which is not None and i not in which: continue
            x0, y0, x1, y1 = min(x0, x), min(y0, y), max(x1, x+s), max(y1, y+s)
    return x0, y0, x1, y1

if __name__ == '__main__':
    print(symbol_bounds(), symbol_bounds(False))
