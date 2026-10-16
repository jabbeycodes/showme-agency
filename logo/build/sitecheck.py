import sys, json
from playwright.sync_api import sync_playwright
BASE = sys.argv[1]; OUTD = sys.argv[2]; tag = sys.argv[3] if len(sys.argv) > 3 else 'local'
res = {}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    # desktop
    pg = b.new_page(viewport={'width': 1440, 'height': 900})
    pg.goto(BASE + '/?region=us', wait_until='networkidle'); pg.wait_for_timeout(2200)
    pg.screenshot(path=f'{OUTD}/{tag}-desktop-header-hero.png')
    res['desktop_logo_box'] = pg.eval_on_selector('.topbar .brand-logo', 'e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}')
    res['desktop_nav_gap'] = pg.evaluate('''()=>{const a=document.querySelector('.topbar .brand').getBoundingClientRect();const n=document.querySelector('.nav-links').getBoundingClientRect();return n.left-a.right}''')
    res['aria'] = pg.eval_on_selector('.topbar .brand', 'e=>e.getAttribute("aria-label")')
    res['anim'] = pg.eval_on_selector('.topbar .brand-logo .slide', 'e=>getComputedStyle(e).animationName')
    pg.evaluate('window.scrollTo(0, document.body.scrollHeight)'); pg.wait_for_timeout(400)
    pg.locator('.site-footer').screenshot(path=f'{OUTD}/{tag}-footer.png')
    res['footer_anim'] = pg.eval_on_selector('.site-footer .brand-logo .slide', 'e=>getComputedStyle(e).animationName')
    # CLS
    pg2 = b.new_page(viewport={'width': 1440, 'height': 900})
    pg2.add_init_script('window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries()){if(!e.hadRecentInput)window.__cls+=e.value}}).observe({type:"layout-shift",buffered:true});')
    pg2.goto(BASE + '/?region=us', wait_until='networkidle'); pg2.wait_for_timeout(2500)
    res['cls_desktop'] = pg2.evaluate('window.__cls')
    # mobile
    m = b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    m.add_init_script('window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries()){if(!e.hadRecentInput)window.__cls+=e.value}}).observe({type:"layout-shift",buffered:true});')
    m.goto(BASE + '/?region=us', wait_until='networkidle'); m.wait_for_timeout(2200)
    m.screenshot(path=f'{OUTD}/{tag}-mobile-header.png', clip={'x': 0, 'y': 0, 'width': 390, 'height': 300})
    res['cls_mobile'] = m.evaluate('window.__cls')
    res['mobile'] = m.evaluate('''()=>{const a=document.querySelector('.topbar .brand-logo').getBoundingClientRect();const t=document.querySelector('.nav-toggle').getBoundingClientRect();return {logo:[a.x,a.width,a.height],toggle:[t.x,t.width],gap:t.left-a.right,scrollW:document.documentElement.scrollWidth}}''')
    # reduced motion
    r = b.new_page(viewport={'width': 1440, 'height': 900}, reduced_motion='reduce')
    r.goto(BASE + '/?region=us'); r.wait_for_timeout(120)
    res['reduced_anim'] = r.eval_on_selector('.topbar .brand-logo .slide', 'e=>getComputedStyle(e).animationName')
    r.screenshot(path=f'{OUTD}/{tag}-reduced-motion-120ms.png', clip={'x': 0, 'y': 0, 'width': 720, 'height': 120})
    # favicon
    for f in ('/favicon.svg', '/favicon.ico', '/apple-touch-icon.png', '/icon-192.png', '/icon-512.png', '/icon-512-maskable.png', '/og-image.png', '/site.webmanifest'):
        resp = r.request.get(BASE + f); res[f] = [resp.status, resp.headers.get('content-type'), len(resp.body())]
    # animation frames
    fr = b.new_page(viewport={'width': 600, 'height': 120}, device_scale_factor=2)
    fr.goto(BASE + '/?region=us', wait_until='commit')
    fr.wait_for_selector('.topbar .brand-logo')
    frames = []
    import time
    t0 = time.time()
    for i in range(36):
        fn = f'/tmp/fr{i:02d}.png'
        fr.screenshot(path=fn, clip={'x': 0, 'y': 0, 'width': 330, 'height': 80}); frames.append(fn)
        fr.wait_for_timeout(40)
    res['frames_s'] = round(time.time() - t0, 2)
    b.close()
print(json.dumps(res, indent=1))
