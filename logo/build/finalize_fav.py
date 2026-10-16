import os, io
from favicon import favicon
from make import OUT
from playwright.sync_api import sync_playwright
from PIL import Image
d = os.path.join(OUT, 'favicon'); os.makedirs(d, exist_ok=True)
tile = favicon('tile', pad=64*0.12); flat = favicon('flat')
open(os.path.join(d, 'favicon.svg'), 'w').write(tile)
open(os.path.join(d, 'favicon-flat.svg'), 'w').write(flat)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    full = favicon('tile', pad=64*0.16, rx=0)
    for name, svg0 in (('favicon', tile),):
        for sz in (16, 32, 48, 180, 512):
            svg = full if sz == 180 else svg0
            pg = b.new_page(viewport={'width': sz, 'height': sz})
            pg.set_content(f'<html><body style="margin:0;background:transparent">{svg.replace("<svg ", f"<svg width=\"{sz}\" height=\"{sz}\" ",1)}</body></html>')
            fn = {180: 'apple-touch-icon.png', 512: 'icon-512.png'}.get(sz, f'{name}-{sz}.png')
            pg.screenshot(path=os.path.join(d, fn), omit_background=True); pg.close()
    b.close()
ims = [Image.open(os.path.join(d, f'favicon-{s}.png')).convert('RGBA') for s in (16, 32, 48)]
ims[0].save(os.path.join(d, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)], append_images=ims[1:])
print(os.listdir(d))
