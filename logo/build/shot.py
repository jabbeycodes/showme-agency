import sys
from playwright.sync_api import sync_playwright
def shot(html, png, w, h, scale=1, full=False):
    with sync_playwright() as p:
        b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg=b.new_page(viewport={'width':w,'height':h}, device_scale_factor=scale)
        pg.goto('file://'+html); pg.wait_for_timeout(300)
        pg.screenshot(path=png, full_page=full); b.close()
if __name__=='__main__':
    shot(sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), float(sys.argv[5]) if len(sys.argv)>5 else 1, True)
