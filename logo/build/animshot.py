from playwright.sync_api import sync_playwright
import sys
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for rm in ('no-preference','reduce'):
        pg=b.new_page(viewport={'width':1000,'height':640}, reduced_motion=rm)
        pg.goto('file:///workspace/showme-agency/logo/animated/demo.html')
        for t in ([150,450,750,1100,2000] if rm=='no-preference' else [100]):
            pg.wait_for_timeout(t - (0 if t==150 or rm=='reduce' else 0))
            pg.screenshot(path=f'/workspace/showme-agency/logo/build/anim_{rm}_{t}.png')
    b.close()
