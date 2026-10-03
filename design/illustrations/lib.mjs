// Brand illustration kit: device mockups + abstract UI, rendered with Playwright.
export const C = { ink:'#10243f', ink2:'#173657', coral:'#f2654b', mint:'#24bda4', gold:'#eeb43f', paper:'#fffaf4', night:'#07111f', wa:'#25d366', line:'#e9e1d6', muted:'#8a97a8' };

export const css = `
*{box-sizing:border-box;margin:0;padding:0}
body{width:1600px;height:1000px;overflow:hidden;font-family:'Public Sans',sans-serif;color:${C.ink}}
.bg{position:absolute;inset:0;background:radial-gradient(900px 700px at 85% 10%,rgba(242,101,75,.38),transparent 60%),radial-gradient(800px 700px at 5% 100%,rgba(36,189,164,.30),transparent 60%),radial-gradient(600px 500px at 40% 40%,rgba(238,180,63,.10),transparent 70%),linear-gradient(160deg,#0d2038,#07111f 70%)}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,250,244,.09) 1.4px,transparent 1.6px);background-size:34px 34px;mask-image:linear-gradient(120deg,transparent 10%,#000 60%)}
.ring{position:absolute;border-radius:50%;border:2px solid rgba(255,250,244,.08)}
.abs{position:absolute}
.laptop .scr{background:#0a0f18;border-radius:22px 22px 0 0;padding:16px 16px 18px;box-shadow:0 40px 90px rgba(0,0,0,.5)}
.laptop .scr>div{background:${C.paper};border-radius:8px;overflow:hidden;height:100%;position:relative}
.laptop .base{height:26px;background:linear-gradient(#d9dee6,#9aa4b2);border-radius:0 0 26px 26px;margin:0 -60px;position:relative}
.laptop .base:after{content:'';position:absolute;left:50%;top:0;width:180px;height:10px;transform:translateX(-50%);background:#7f8a99;border-radius:0 0 12px 12px}
.phone{background:#0a0f18;border-radius:54px;padding:14px;box-shadow:0 40px 80px rgba(0,0,0,.55),inset 0 0 0 2px #2a3442}
.phone>div{background:${C.paper};border-radius:42px;overflow:hidden;height:100%;position:relative}
.phone .notch{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:96px;height:26px;background:#0a0f18;border-radius:20px;z-index:3}
.card{background:${C.paper};border-radius:22px;box-shadow:0 30px 60px rgba(0,0,0,.4);padding:22px}
.dark{background:#0f2440;color:${C.paper};border:1px solid rgba(255,250,244,.12)}
.sk{height:12px;border-radius:8px;background:#e5ddd1}
.row{display:flex;align-items:center;gap:12px}
.col{display:flex;flex-direction:column;gap:10px}
.pill{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:999px;font:700 17px 'Public Sans';white-space:nowrap}
.btn{border-radius:14px;padding:14px 18px;font:800 17px 'Public Sans';text-align:center;color:#fff}
.lbl{font:800 13px 'Public Sans';letter-spacing:.14em;text-transform:uppercase;color:${C.muted}}
.big{font:800 34px 'Archivo';letter-spacing:-.01em}
.mid{font:700 22px 'Archivo'}
.ic{display:inline-flex;align-items:center;justify-content:center;border-radius:14px;flex:none}
.bubble{max-width:78%;padding:12px 16px;border-radius:18px;font:500 16px/1.35 'Public Sans'}
.in{background:#fff;border:1px solid ${C.line};align-self:flex-start;border-bottom-left-radius:6px}
.out{background:#dff6ee;align-self:flex-end;border-bottom-right-radius:6px}
`;

export const sk = (w, c = '#e5ddd1', h = 12) => `<div class="sk" style="width:${w};background:${c};height:${h}px"></div>`;
export const lines = (ws, c) => `<div class="col" style="gap:9px">${ws.map(w => sk(w, c)).join('')}</div>`;
export const pos = (x, y, w, h, inner, extra = '') => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;${h ? `height:${h}px;` : ''}${extra}">${inner}</div>`;
export const laptop = (x, y, w, h, screen) => pos(x, y, w, null, `<div class="laptop"><div class="scr" style="height:${h}px"><div>${screen}</div></div><div class="base"></div></div>`);
export const phone = (x, y, w, h, screen, rot = 0) => pos(x, y, w, h, `<div class="phone" style="height:${h}px"><div><span class="notch"></span>${screen}</div></div>`, rot ? `transform:rotate(${rot}deg)` : '');
export const card = (x, y, w, inner, extra = '', cls = '') => pos(x, y, w, null, `<div class="card ${cls}" style="${extra}">${inner}</div>`);
export const ic = (svg, bg, size = 48, color = '#fff') => `<span class="ic" style="width:${size}px;height:${size}px;background:${bg};color:${color}">${svg}</span>`;
export const pill = (t, bg, fg = '#fff') => `<span class="pill" style="background:${bg};color:${fg}">${t}</span>`;
export const btn = (t, bg, fg = '#fff') => `<div class="btn" style="background:${bg};color:${fg}">${t}</div>`;
export const browserBar = (accent = C.coral) => `<div class="row" style="padding:14px 18px;border-bottom:1px solid ${C.line};background:#fff"><span style="width:12px;height:12px;border-radius:50%;background:${C.coral}"></span><span style="width:12px;height:12px;border-radius:50%;background:${C.gold}"></span><span style="width:12px;height:12px;border-radius:50%;background:${C.mint}"></span><div style="flex:1;margin-left:16px;height:22px;border-radius:11px;background:#f1ebe2"></div></div>`;
export const nav = (accent = C.coral) => `<div class="row" style="justify-content:space-between;padding:18px 26px"><div class="row" style="gap:10px"><span style="width:26px;height:26px;border-radius:8px;background:${C.ink}"></span>${sk('70px', C.ink, 12)}</div><div class="row" style="gap:18px">${sk('46px')}${sk('46px')}${sk('46px')}<span style="width:84px;height:30px;border-radius:10px;background:${accent}"></span></div></div>`;
export const phoneTop = (title, bg = '#0f5e54') => `<div class="row" style="background:${bg};color:#fff;padding:52px 20px 16px;gap:12px"><span style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.25)"></span><div class="col" style="gap:6px"><b style="font:700 18px 'Public Sans'">${title}</b>${sk('70px', 'rgba(255,255,255,.4)', 8)}</div></div>`;
export const scene = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="bg"></div><div class="dots"></div><div class="ring" style="width:900px;height:900px;right:-300px;top:-380px"></div><div class="ring" style="width:600px;height:600px;left:-260px;bottom:-320px"></div>${body}</body></html>`;

// ---- SVG primitives ----
const s = (vb, inner, w = '100%', h = '100%') => `<svg viewBox="${vb}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
export const I = {
  check: `<svg viewBox="0 0 24 24" width="60%" height="60%" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
  star: `<svg viewBox="0 0 24 24" width="60%" height="60%" fill="currentColor"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" width="60%" height="60%" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>`,
  cross: `<svg viewBox="0 0 24 24" width="60%" height="60%" fill="currentColor"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/></svg>`,
  cap: `<svg viewBox="0 0 24 24" width="64%" height="64%" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.9V17h2V9zM5 13.2v4L12 21l7-3.8v-4L12 17z"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" width="60%" height="60%" fill="currentColor"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" width="62%" height="62%" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>`,
  plane: `<svg viewBox="0 0 24 24" width="60%" height="60%" fill="currentColor"><path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-6z"/></svg>`,
  note: `<svg viewBox="0 0 24 24" width="58%" height="58%" fill="currentColor"><path d="M9 18.5A2.5 2.5 0 1 1 7 16V5l12-2v11.5A2.5 2.5 0 1 1 17 12V7.2l-8 1.4z"/></svg>`,
  ring: `<svg viewBox="0 0 24 24" width="62%" height="62%" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="15" r="6"/><path d="M9 5l3-3 3 3-3 4z" fill="currentColor"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" width="58%" height="58%" fill="currentColor"><path d="M7 8V7a5 5 0 0 1 10 0v1h3l-1 13H5L4 8zm2 0h6V7a3 3 0 0 0-6 0z"/></svg>`,
  brief: `<svg viewBox="0 0 24 24" width="60%" height="60%" fill="currentColor"><path d="M9 4h6a2 2 0 0 1 2 2v1h4v12H3V7h4V6a2 2 0 0 1 2-2zm0 3h6V6H9z"/></svg>`,
  doc: `<svg viewBox="0 0 24 24" width="56%" height="56%" fill="currentColor"><path d="M6 2h8l5 5v15H6zm7 1.5V8h4.5zM8.5 12h8v1.6h-8zm0 3.5h8v1.6h-8z"/></svg>`,
  cloud: `<svg viewBox="0 0 24 24" width="62%" height="62%" fill="currentColor"><path d="M7 19a5 5 0 0 1-.6-10A6.5 6.5 0 0 1 19 9.6 4.7 4.7 0 0 1 18 19z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" width="58%" height="58%" fill="currentColor"><path d="M3 5h18v14H3zm2 2.4V17h14V7.4l-7 5z"/></svg>`,
  gear: `<svg viewBox="0 0 24 24" width="60%" height="60%" fill="currentColor"><path d="M10.5 2h3l.5 2.6 2 .9 2.2-1.5 2.1 2.1-1.5 2.2.9 2 2.6.5v3l-2.6.5-.9 2 1.5 2.2-2.1 2.1-2.2-1.5-2 .9-.5 2.6h-3l-.5-2.6-2-.9-2.2 1.5-2.1-2.1 1.5-2.2-.9-2L2 13.5v-3l2.6-.5.9-2L4 5.8l2.1-2.1 2.2 1.5 2-.9zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>`,
  code: `<svg viewBox="0 0 24 24" width="62%" height="62%" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" width="62%" height="62%" fill="currentColor"><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2zM19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9z"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" width="58%" height="58%" fill="currentColor"><path d="M12 3c5 0 9 3.6 9 8s-4 8-9 8c-1.1 0-2.2-.2-3.2-.5L4 20l1.3-3.7A7.6 7.6 0 0 1 3 11c0-4.4 4-8 9-8z"/></svg>`,
  cal: `<svg viewBox="0 0 24 24" width="58%" height="58%" fill="currentColor"><path d="M7 2h2v2h6V2h2v2h4v17H3V4h4zm-2 7v10h14V9z"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" width="58%" height="58%" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" width="58%" height="58%" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" width="56%" height="56%" fill="currentColor"><path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 3v13h10V5z"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" width="58%" height="58%" fill="currentColor"><path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5zm-1.2 13.6l6-6-1.4-1.4-4.6 4.6-2.2-2.2-1.4 1.4z"/></svg>`,
  play: `<svg viewBox="0 0 24 24" width="50%" height="50%" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>`,
  users: `<svg viewBox="0 0 24 24" width="62%" height="62%" fill="currentColor"><circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.8"/><path d="M2 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5zM16.5 13.5c3 0 5.5 2 5.5 5.5h-4.6"/></svg>`
};
export const plate = (a = C.coral, b = C.gold, c = C.mint) => s('0 0 200 140', `<rect width="200" height="140" fill="#f6e7d6"/><circle cx="100" cy="74" r="58" fill="#fff"/><circle cx="100" cy="74" r="44" fill="#f8f2ea"/><ellipse cx="88" cy="70" rx="26" ry="20" fill="${a}"/><circle cx="116" cy="62" r="13" fill="${b}"/><ellipse cx="112" cy="90" rx="17" ry="9" fill="${c}"/><circle cx="80" cy="64" r="4" fill="#fff" opacity=".6"/><rect x="164" y="20" width="6" height="100" rx="3" fill="#d8c7b2"/><rect x="28" y="20" width="6" height="100" rx="3" fill="#d8c7b2"/>`);
export const house = (sky = '#ffd9c9', wall = '#fffaf4', roof = C.coral, accent = C.mint) => s('0 0 200 140', `<rect width="200" height="140" fill="${sky}"/><circle cx="160" cy="34" r="16" fill="${C.gold}" opacity=".9"/><rect y="112" width="200" height="28" fill="${accent}" opacity=".55"/><rect x="40" y="62" width="120" height="56" fill="${wall}"/><path d="M30 66l70-40 70 40z" fill="${roof}"/><rect x="88" y="84" width="24" height="34" fill="${C.ink}"/><rect x="52" y="76" width="24" height="18" fill="#bfe7df"/><rect x="124" y="76" width="24" height="18" fill="#bfe7df"/><circle cx="22" cy="104" r="14" fill="${accent}"/><circle cx="182" cy="100" r="16" fill="${accent}"/>`);
export const tower = (sky = '#cfeee7') => s('0 0 200 140', `<rect width="200" height="140" fill="${sky}"/><rect x="30" y="40" width="44" height="100" fill="${C.ink}"/><rect x="82" y="18" width="50" height="122" fill="${C.ink2}"/><rect x="140" y="56" width="40" height="84" fill="${C.ink}"/>${Array.from({length:18},(_,i)=>`<rect x="${88+(i%3)*14}" y="${28+Math.floor(i/3)*16}" width="8" height="8" fill="${i%4?C.gold:C.paper}" opacity=".85"/>`).join('')}${Array.from({length:10},(_,i)=>`<rect x="${36+(i%2)*18}" y="${50+Math.floor(i/2)*16}" width="10" height="8" fill="${C.paper}" opacity=".6"/>`).join('')}`);
export const garment = (bg, col, kind = 'tee') => s('0 0 200 200', `<rect width="200" height="200" fill="${bg}"/>${kind === 'tee' ? `<path d="M70 40l-36 20 14 30 16-8v78h72V82l16 8 14-30-36-20c-4 12-16 18-30 18s-26-6-30-18z" fill="${col}"/>` : kind === 'dress' ? `<path d="M84 34h32l-4 30 34 104H54l34-104z" fill="${col}"/><path d="M88 64h24" stroke="#fff" stroke-width="4" opacity=".5"/>` : `<path d="M60 70h80l10 100H50z" fill="${col}"/><path d="M78 70a22 22 0 0 1 44 0" fill="none" stroke="${col}" stroke-width="8"/>`}`);
export const room = () => s('0 0 200 140', `<rect width="200" height="140" fill="#fde6c8"/><rect x="120" y="20" width="56" height="44" rx="4" fill="#9ad9cd"/><circle cx="160" cy="34" r="8" fill="${C.gold}"/><path d="M120 64l18-16 12 10 10-8 16 14z" fill="${C.mint}"/><rect x="20" y="70" width="140" height="44" rx="8" fill="#fff"/><rect x="20" y="62" width="44" height="22" rx="8" fill="${C.coral}"/><rect x="66" y="62" width="44" height="22" rx="8" fill="${C.gold}"/><rect x="20" y="104" width="140" height="12" fill="${C.ink}"/><rect y="118" width="200" height="22" fill="#e9cfa8"/>`);
export const beach = () => s('0 0 200 140', `<rect width="200" height="140" fill="#bfe7f0"/><circle cx="150" cy="40" r="20" fill="${C.gold}"/><rect y="80" width="200" height="30" fill="#3fb6c8"/><rect y="104" width="200" height="36" fill="#f6dcae"/><path d="M40 104c2-30 8-48 22-60" stroke="#7a5230" stroke-width="5" fill="none"/><path d="M62 44c-16-6-30 0-36 8 12-4 24-2 36-8zM62 44c4-14 18-20 30-18-12 4-22 10-30 18zM62 44c14-4 28 2 32 12-10-6-22-8-32-12z" fill="${C.mint}"/>`);
export const mapTile = (pins = [[60,50,C.coral],[130,80,C.mint],[100,40,C.gold]]) => s('0 0 200 140', `<rect width="200" height="140" fill="#eaf3ee"/><path d="M0 100L200 60M40 0l40 140M0 30h200M150 0l-20 140" stroke="#fff" stroke-width="10"/><path d="M0 100L200 60M40 0l40 140" stroke="#f7d79a" stroke-width="5"/><rect x="100" y="94" width="60" height="34" rx="6" fill="#cfe7dc"/><rect x="10" y="40" width="30" height="40" rx="6" fill="#cfe7dc"/>${pins.map(([x,y,c])=>`<path transform="translate(${x-12} ${y-30})" d="M12 0a12 12 0 0 0-12 12c0 9 12 22 12 22s12-13 12-22A12 12 0 0 0 12 0z" fill="${c}"/><circle cx="${x}" cy="${y-18}" r="4.5" fill="#fff"/>`).join('')}`);
export const bars = (vals, cols, h = 120, w = 18, gap = 10) => `<div class="row" style="align-items:flex-end;gap:${gap}px;height:${h}px">${vals.map((v,i)=>`<div style="width:${w}px;height:${v}%;border-radius:6px 6px 2px 2px;background:${cols[i%cols.length]}"></div>`).join('')}</div>`;
export const spark = (pts, color, w = 260, h = 90, fill = true) => { const max = Math.max(...pts), min = Math.min(...pts); const xy = pts.map((p,i)=>[i*(w/(pts.length-1)), h-8-((p-min)/(max-min||1))*(h-16)]); const d = xy.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' '); return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${fill?`<path d="${d} L${w} ${h} L0 ${h}Z" fill="${color}" opacity=".15"/>`:''}<path d="${d}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${xy.at(-1)[0]-3}" cy="${xy.at(-1)[1]}" r="7" fill="${color}" stroke="#fff" stroke-width="3"/></svg>`; };
export const donut = (pct, color, size = 110, track = '#efe7dc') => `<svg width="${size}" height="${size}" viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9" fill="none" stroke="${track}" stroke-width="6"/><circle cx="21" cy="21" r="15.9" fill="none" stroke="${color}" stroke-width="6" stroke-dasharray="${pct} ${100-pct}" stroke-dashoffset="25" stroke-linecap="round"/></svg>`;
export const avatar = (c1, c2, size = 44) => `<span style="flex:none;width:${size}px;height:${size}px;border-radius:50%;background:linear-gradient(135deg,${c1},${c2})"></span>`;
export const stars = (n = 5, size = 20) => `<span class="row" style="gap:2px;color:${C.gold}">${Array.from({length:n},()=>`<span style="width:${size}px;height:${size}px;display:inline-flex">${I.star.replace('60%','100%').replace('60%','100%')}</span>`).join('')}</span>`;
export const calGrid = (hi = [9, 10, 16], accent = C.mint, cell = 34) => `<div style="display:grid;grid-template-columns:repeat(7,${cell}px);gap:6px">${Array.from({length:28},(_,i)=>`<div style="height:${cell}px;border-radius:8px;background:${hi.includes(i)?accent:(i%7>4?'#f1ebe2':'#fff')};border:1px solid ${C.line}"></div>`).join('')}</div>`;
export const node = (icon, bg, label, w = 260, dark = false) => `<div class="card row ${dark?'dark':''}" style="padding:16px 18px;width:${w}px;gap:14px;border-radius:18px">${ic(icon, bg, 46)}<div class="col" style="gap:7px;flex:1"><b style="font:700 17px 'Public Sans'">${label}</b>${sk('70%', dark?'rgba(255,250,244,.2)':'#e5ddd1', 9)}</div></div>`;
export const connector = (x1, y1, x2, y2, color = 'rgba(255,250,244,.45)') => `<svg class="abs" style="left:0;top:0;overflow:visible" width="1600" height="1000"><path d="M${x1} ${y1} C ${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="8 8"/><circle cx="${x2}" cy="${y2}" r="6" fill="${color}"/></svg>`;
