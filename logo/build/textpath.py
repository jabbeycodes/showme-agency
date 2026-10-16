import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
import subprocess, functools

@functools.lru_cache(None)
def _face(family):
    path = subprocess.check_output(['fc-match', '-f', '%{file}', family+':style=Regular']).decode()
    if 'Italic' in path:
        raise SystemExit('italic picked for '+family)
    blob = hb.Blob.from_file_path(path)
    return hb.Face(blob)

def text_path(text, family, weight=700, size=100, tracking=0.0, x=0, y=0, features=None):
    """Return (d, advance_width_px, bounds) for text set at baseline (x,y). tracking in em."""
    face = _face(family)
    font = hb.Font(face)
    try:
        font.set_variations({'wght': weight})
    except Exception:
        pass
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(font, buf, features or {'kern': True, 'liga': True})
    upem = face.upem
    s = size / upem
    pen = SVGPathPen(None, ntos=lambda v: ('%.2f' % v).rstrip('0').rstrip('.'))
    bp = BoundsPen(None)
    cx = 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        gx = x + (cx + pos.x_offset) * s
        gy = y - pos.y_offset * s
        t = (s, 0, 0, -s, gx, gy)
        font.draw_glyph_with_pen(info.codepoint, TransformPen(pen, t))
        font.draw_glyph_with_pen(info.codepoint, TransformPen(bp, t))
        cx += pos.x_advance + tracking * upem
    adv = (cx - tracking * upem) * s
    return pen.getCommands(), adv, bp.bounds

def glyph_advances(text, family, weight=700, size=100, tracking=0.0):
    face = _face(family); font = hb.Font(face)
    font.set_variations({'wght': weight})
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(font, buf, {'kern': True})
    s = size / face.upem
    return [(p.x_advance + tracking*face.upem)*s for p in buf.glyph_positions]

if __name__ == '__main__':
    d, w, b = text_path('ShowMe', 'Manrope', 800, 100)
    print(w, b, d[:80])

def glyph_runs(text, family, weight=700, size=100, tracking=0.0, x=0, y=0):
    """Per-character outlines: list of (char, d) plus total advance."""
    face = _face(family); font = hb.Font(face)
    font.set_variations({'wght': weight})
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(font, buf, {'kern': True, 'liga': False})
    s = size / face.upem; cx = 0; out = []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        pen = SVGPathPen(None, ntos=lambda v: ('%.2f' % v).rstrip('0').rstrip('.'))
        font.draw_glyph_with_pen(info.codepoint, TransformPen(pen, (s,0,0,-s, x+(cx+pos.x_offset)*s, y-pos.y_offset*s)))
        out.append((text[info.cluster], pen.getCommands()))
        cx += pos.x_advance + tracking*face.upem
    return out, (cx - tracking*face.upem)*s
