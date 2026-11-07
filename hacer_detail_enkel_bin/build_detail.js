// Enkel Bin 색상별 상세페이지 이미지 생성 (포토샵 없이 HTML -> JPG). 사용: node build_detail.js
// 결과: detail_pages/<색상>/section_NN.jpg (아임웹에 순서대로 업로드) + detail_pages/<색상>_full.jpg (전체 한 장)
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const R = __dirname;
const man = JSON.parse(fs.readFileSync(path.join(R, 'manifest.json'), 'utf8'));
const f = p => 'file://' + path.join(R, p);

const SIZES = [
  { k: 'S', name: '스몰', l: '6.6', dim: '너비 17.3 × 높이 36 × 깊이 26.7cm', w: '2.5', note: '자리를 많이 차지하지 않아 좁은 공간의 일상 쓰레기를 모으기에 알맞습니다.' },
  { k: 'M', name: '미디엄', l: '19', dim: '너비 21 × 높이 50 × 깊이 39cm', w: '6.4', note: '가정에서 기본으로 쓰기 좋은 크기. 두 개 이상 나란히 세우면 분리배출 코너가 됩니다.' },
  { k: 'L', name: '라지', l: '40', dim: '너비 32.5 × 높이 65.2 × 깊이 40.9cm', w: '12.1', note: '하루치 분리배출을 넉넉하게 받아내며, 세탁 바구니로도 쓸 수 있습니다.' },
];
const COLORS = {
  black: { ko: '블랙', en: 'Black', accent: '#1f1f21', tile: '#e3dfd8', sku: { S: '1104270232', M: '1104266998', L: '1104270233' },
    head: ['선만 남기고 색은 지운 블랙,', '타원형 분리수거 빈'],
    color: '블랙은 뚜껑과 몸체가 만드는 타원 실루엣이 가장 또렷하게 드러나는 색입니다. 현관이나 복도 벽면에 두 개를 나란히 세우면 분리수거 코너가 하나의 오브제처럼 정돈됩니다.' },
  cashmere: { ko: '캐시미어', en: 'Cashmere', accent: '#9a8560', tile: '#55504a', sku: { S: '1104270231', M: '1104266981', L: '1104270234' },
    head: ['벽과 타일 사이에 가라앉는 캐시미어,', '타원형 분리수거 빈'],
    color: '캐시미어는 크림에 가까운 밝은 베이지입니다. 밝은 색이라 쓰레기통의 존재감이 줄어들고, 두 개를 나란히 놓아도 공간이 무겁게 보이지 않습니다.' },
  dark_chocolate: { ko: '다크 초콜릿', en: 'Dark Chocolate', accent: '#4a3328', tile: '#e6dfd4', sku: { S: '1104274200', M: '1104274201', L: '1104274199' },
    head: ['깊은 브라운으로 차분하게 앉는,', '타원형 분리수거 빈'],
    color: '다크 초콜릿은 블랙보다 한 톤 부드러운 깊은 갈색입니다. 원목 가구나 테라코타 타일처럼 따뜻한 소재 옆에서 튀지 않고 자리를 잡습니다.' },
};
const BODY = "엔켈은 덴마크어로 '단순하다'는 뜻입니다. 이름처럼 군더더기 없는 타원형 몸체를 파우더 코팅한 스틸로 만들었고, 안쪽에는 손잡이가 달린 분리형 속통이 들어 있습니다. 쓰레기통은 비우고 씻는 일이 번거로우면 자꾸 미루게 되는 물건인데, 엔켈 빈은 속통만 들어내 헹구면 되도록 만들어 관리 부담을 덜었습니다.";
const CLOSE = "매일 가장 자주 여닫는 물건일수록, 비우고 씻는 수고는 적고 오래 봐도 질리지 않아야 합니다. 엔켈 빈은 그 두 가지를 타원 하나로 정리한 분리수거 빈입니다.";

function page(key) {
  const c = COLORS[key], m = man[key];
  const life1 = m.life[0], life2 = m.life[1] || m.life[0], same = !m.life[1];
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1000px;font-family:'Noto Sans KR',sans-serif;color:#222;background:#f7f5f1;word-break:keep-all}
section{width:1000px;position:relative;overflow:hidden}
.en{font-family:'Cormorant Garamond',serif}
.tag{display:inline-block;background:${c.accent};color:#fff;font-weight:500;font-size:30px;padding:11px 20px;line-height:1;letter-spacing:.04em}
/* 1 hero */
#s1{height:1250px;background:url('${f(life1)}') center ${same ? '40%' : '45%'}/cover}
#s1::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,0) 22%,rgba(0,0,0,0) 48%,rgba(0,0,0,.72))}
#s1 .logo{position:absolute;z-index:2;left:60px;top:52px;font-size:58px;color:#fff;line-height:1}
#s1 .t{position:absolute;z-index:2;left:60px;right:60px;bottom:90px;color:#fff;text-shadow:0 2px 14px rgba(0,0,0,.4)}
#s1 .name{font-size:26px;font-weight:500;margin:26px 0 18px;opacity:.95}
#s1 h1{font-size:60px;font-weight:900;line-height:1.25;letter-spacing:-.03em}
/* 2 intro */
#s2{padding:130px 80px;text-align:center;background:#f7f5f1}
#s2 .big{font-size:110px;color:${c.accent};line-height:1;margin-bottom:10px}
#s2 .sm{font-size:22px;color:#777;letter-spacing:.3em;margin-bottom:56px}
#s2 p{font-size:28px;line-height:1.85;font-weight:400;color:#333}
/* 3 features */
#s3{background:${c.tile};padding:100px 60px 110px;text-align:center}
#s3 .cut{height:760px;display:flex;justify-content:center;align-items:flex-end;margin-bottom:70px}
#s3 .cut img{height:100%;filter:drop-shadow(0 24px 24px rgba(0,0,0,.18))}
.feat{display:flex;gap:20px}
.feat div{flex:1;background:${key==='cashmere'?'rgba(255,255,255,.08)':'rgba(255,255,255,.55)'};padding:36px 20px;border-top:3px solid ${c.accent === '#1f1f21' ? '#1f1f21' : c.accent}}
.feat b{display:block;font-size:26px;font-weight:700;margin-bottom:14px;color:${key==='cashmere'?'#fff':'#222'}}
.feat span{font-size:21px;line-height:1.6;color:${key==='cashmere'?'#e5ded0':'#555'}}
/* 4 color */
#s4{background:#fff}
#s4 .ph{height:900px;${same ? `background:${c.tile};display:flex;align-items:flex-end;justify-content:center;padding:60px 0 70px` : `background:url('${f(life2)}') center 55%/cover no-repeat`}}
#s4 .ph img{height:100%;filter:drop-shadow(0 24px 24px rgba(0,0,0,.18))}
#s4 .tx{padding:90px 80px 100px;text-align:center}
#s4 .lab{font-size:24px;letter-spacing:.25em;color:${c.accent === '#1f1f21' ? '#555' : c.accent};margin-bottom:26px}
#s4 p{font-size:28px;line-height:1.85;color:#333}
/* 5 size cards */
#s5{background:#f7f5f1;padding:110px 60px}
#s5 h2{font-size:44px;font-weight:900;text-align:center;letter-spacing:-.02em;margin-bottom:18px}
#s5 .lead{text-align:center;font-size:23px;color:#666;margin-bottom:70px}
.card{display:flex;background:#fff;margin-bottom:24px;min-height:520px}
.card .im{width:400px;background:${c.tile};display:flex;align-items:flex-end;justify-content:center;padding:40px 30px 44px}
.card .im img{max-width:100%;object-fit:contain;filter:drop-shadow(0 16px 16px rgba(0,0,0,.2))}
.card .in{flex:1;padding:44px 40px}
.card .nm{font-size:40px;font-weight:900;letter-spacing:-.02em}
.card .nm small{font-size:24px;font-weight:500;color:#888;margin-left:10px}
.card .nt{font-size:20px;line-height:1.55;color:#666;margin:14px 0 26px}
.card dl{display:grid;grid-template-columns:110px 1fr;row-gap:12px;font-size:20px;line-height:1.5;border-top:1px solid #ddd;padding-top:22px}
.card dt{color:#888}.card dd{color:#222}
/* 6 chart */
#s6{background:#fff;padding:100px 60px;text-align:center}
#s6 h2{font-size:40px;font-weight:900;margin-bottom:40px;letter-spacing:-.02em}
#s6 img{width:880px}
/* 7 notes + close */
#s7{background:${c.accent};color:#fff;padding:110px 80px 100px;text-align:center}
#s7 .nt{font-size:22px;line-height:1.8;opacity:.9;margin-bottom:64px;text-align:left;border-top:1px solid rgba(255,255,255,.35);border-bottom:1px solid rgba(255,255,255,.35);padding:34px 0}
#s7 .nt b{display:block;font-size:24px;margin-bottom:10px}
#s7 p{font-size:30px;line-height:1.75;font-weight:500;margin-bottom:70px}
#s7 .lg{font-size:70px;line-height:1}#s7 .br{font-size:18px;letter-spacing:.3em;margin-top:14px;opacity:.8}
</style></head><body>
<section id="s1"><div class="logo en">hacer</div><div class="t"><span class="tag">FERM LIVING</span><div class="name">엔켈 빈 · ${c.ko} / Enkel Bin · ${c.en}</div><h1>${c.head.join('<br>')}</h1></div></section>
<section id="s2"><div class="big en">Enkel</div><div class="sm">SIMPLE · 단순하다</div><p>${BODY}</p></section>
<section id="s3"><div class="cut"><img src="${f(m.open.M)}"></div>
  <div class="feat"><div><b>분리형 속통</b><span>속통만 들어내<br>뜨거운 물로 헹굽니다</span></div><div><b>재활용 플라스틱 100%</b><span>속통에는 금속 손잡이가<br>달려 있습니다</span></div><div><b>등록 디자인</b><span>Registered design<br>으로 보호받는 형태</span></div></div></section>
<section id="s4"><div class="ph">${same ? `<img src="${f(m.open.L)}">` : ''}</div><div class="tx"><div class="lab en">${c.en.toUpperCase()}</div><p>${c.color}</p></div></section>
<section id="s5"><h2>사이즈를 고르세요</h2><div class="lead">같은 디자인, 세 가지 크기(실제 높이 비율) — 놓을 자리의 너비와 높이를 먼저 확인해 주세요</div>
${SIZES.map(s => `<div class="card"><div class="im"><img src="${f(m.closed[s.k])}" style="height:${{S:238,M:330,L:430}[s.k]}px"></div><div class="in"><div class="nm">${s.name}<small>${s.l}L</small></div><div class="nt">${s.note}</div><dl><dt>품번</dt><dd>${c.sku[s.k]}</dd><dt>크기</dt><dd>${s.dim}</dd><dt>용량</dt><dd>${s.l}L (분리형 속통 포함)</dd><dt>무게</dt><dd>${s.w}kg</dd><dt>색상</dt><dd>${c.ko} (${c.en})</dd><dt>소재</dt><dd>파우더 코팅 스틸, 재활용 플라스틱 속통, 금속 손잡이</dd></dl></div></div>`).join('')}</section>
<section id="s6"><h2>사이즈 비교</h2><img src="${f(m.chart)}"></section>
<section id="s7"><div class="nt"><b>사용 안내</b>뚜껑은 힌지로 열리고, 속통은 금속 손잡이를 잡고 들어 올립니다. 속통을 분리해 뜨거운 물로 안팎을 헹궈 주세요. 식기세척기는 사용할 수 없습니다. 크기에 따라 무게가 2.5kg에서 12.1kg까지 차이가 납니다.</div>
<p>${CLOSE}</p><div class="lg en">hacer</div><div class="br en">FERM LIVING · ENKEL BIN</div></section>
</body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const outRoot = path.join(R, 'detail_pages'); fs.mkdirSync(outRoot, { recursive: true });
  for (const key of Object.keys(COLORS)) {
    const dir = path.join(outRoot, `${Object.keys(COLORS).indexOf(key) + 1}_${key}`); fs.mkdirSync(dir, { recursive: true });
    const tmp = path.join(R, `.tmp_${key}.html`); fs.writeFileSync(tmp, page(key));
    const pg = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
    await pg.goto('file://' + tmp, { waitUntil: 'networkidle' });
    await pg.evaluate(() => document.fonts.ready);
    for (let i = 1; i <= 7; i++) await pg.locator('#s' + i).screenshot({ path: path.join(dir, `section_0${i}.jpg`), type: 'jpeg', quality: 90 });
    await pg.screenshot({ path: path.join(outRoot, `${path.basename(dir)}_full.jpg`), type: 'jpeg', quality: 88, fullPage: true });
    fs.unlinkSync(tmp); await pg.close(); console.log('done', key);
  }
  await browser.close();
})();
