from make import *
import math
from shapely.geometry import Point

def fav_geom(w, g, p, la_t, la_b, th, phi=115):
    a = hook_poly(la_t, phi, w, g, p); b = affinity.rotate(hook_poly(la_b, phi, w, g, p), 180, origin=(0, 0))
    a = affinity.rotate(a, th, origin=(0, 0)); b = affinity.rotate(b, th, origin=(0, 0))
    return a, b

def favicon(variant='tile', w=10.0, g=5.0, p=6.0, la_t=7.0, la_b=11.0, th=22.0, box=64, pad=None, square=False, rx=0.22):
    """variant: 'tile' (navy rounded square, light S) or 'flat' (transparent, navy+blue S)."""
    a, b = fav_geom(w, g, p, la_t, la_b, th)
    x0, y0, x1, y1 = unary_union([a, b]).bounds
    pad = pad if pad is not None else (box*0.14 if variant == 'tile' else box*0.03)
    sc = (box - 2*pad) / max(x1-x0, y1-y0)
    cx, cy = (x0+x1)/2, (y0+y1)/2
    tr = f'translate({f(box/2)} {f(box/2)}) scale({f(sc)}) translate({f(-cx)} {f(-cy)}) rotate({f(th)})'
    if variant == 'tile':
        top, bot, bg = '#2fb2ff', '#ffffff', NAVY
    else:
        top, bot, bg = '#1388f2', NAVY, None
    ri = w/2+g
    body = ''
    if bg:
        body += f'<rect width="{box}" height="{box}" rx="{f(box*rx)}" fill="{bg}"/>'
    body += (f'<g transform="{tr}"><path d="{hook_d(la_t, 115, w, g, p)}" fill="{top}"/>'
             f'<path transform="rotate(180)" d="{hook_d(la_b, 115, w, g, p)}" fill="{bot}"/></g>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {box} {box}"><title>ShowMe</title>{body}</svg>\n'

if __name__ == '__main__':
    import sys
    open('fav_tile.svg', 'w').write(favicon('tile'))
    open('fav_flat.svg', 'w').write(favicon('flat'))
