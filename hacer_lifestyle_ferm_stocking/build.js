// Ferm Living Vari Quilted Christmas Stocking 라이프스타일 배너 (PC 1920x850 / 모바일 750x1000)
// 사용: node build.js   (원본 사진: src/lifestyle.jpg → pc_photo.jpg / mobile_photo.jpg 로 미리 크롭됨)
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const root = __dirname;
const C = {
  tag: 'FERM LIVING',
  head: ['벨벳 퀼팅으로 만든', '크리스마스 스타킹'],
  sub: '오가닉 코튼 벨벳에 손맛이 남는 누빔',
  cta: 'VIEW COLLECTION',
  accent: '#b5654a',
};
const SIZES = { pc: { w: 1920, h: 850 }, mobile: { w: 750, h: 1000 } };
const photoOnly = process.argv.includes('--clean'); // 글자 없는 사진 버전

function html(mode) {
  const { w, h } = SIZES[mode], pc = mode === 'pc';
  const photo = path.join(root, `${mode}_photo.jpg`);
  const text = photoOnly ? '' : `
<div class="logo">hacer</div>
<div class="txt"><div class="tag">${C.tag}</div><h1>${C.head.join('<br>')}</h1><div class="sub">${C.sub}</div><div class="cta">${C.cta} →</div></div>`;
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{word-break:keep-all;width:${w}px;height:${h}px;overflow:hidden;position:relative;font-family:'Noto Sans KR',sans-serif;color:#fff;background:#7a7671}
${pc ? `
.ph{position:absolute;left:760px;top:0;width:1160px;height:850px;background:url('file://${photo}') no-repeat}
.fade{position:absolute;left:0;top:0;width:1060px;height:850px;background:linear-gradient(90deg,#6c6823 0,#6c6823 0),linear-gradient(90deg,#6b6762 0%,#6b6762 72%,rgba(107,103,98,0) 100%)}
.fade{background:linear-gradient(90deg,#6b6762 0%,#6b6762 71%,rgba(107,103,98,0) 100%)}
.logo{left:150px;top:56px;font-size:60px}
.txt{left:150px;top:300px;width:620px}
.tag{font-size:42px;padding:12px 22px;margin-bottom:34px}
h1{font-size:60px;margin-bottom:22px}
.sub{font-size:26px;margin-bottom:38px;max-width:520px}
.cta{font-size:19px}
` : `
.ph{position:absolute;inset:0;background:url('file://${photo}') no-repeat}
.fade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.18) 0%,rgba(0,0,0,0) 22%,rgba(0,0,0,0) 52%,rgba(0,0,0,.66) 100%)}
.logo{left:50px;top:44px;font-size:54px}
.txt{left:50px;right:50px;bottom:80px}
.tag{font-size:28px;padding:10px 18px;margin-bottom:24px}
h1{font-size:50px;margin-bottom:16px}
.sub{font-size:23px;margin-bottom:26px}
.cta{font-size:17px}
`}
${photoOnly ? '.fade{display:none}' : ''}
.logo{position:absolute;z-index:3;font-family:'Cormorant Garamond',serif;font-weight:500;line-height:1;text-shadow:0 1px 10px rgba(0,0,0,.25)}
.txt{position:absolute;z-index:3;text-shadow:0 2px 14px rgba(0,0,0,.35)}
.tag{display:inline-block;background:${C.accent};font-weight:500;letter-spacing:.04em;line-height:1;text-shadow:none}
h1{font-weight:900;line-height:1.24;letter-spacing:-.03em}
.sub{font-weight:700;color:rgba(255,255,255,.92);line-height:1.5}
.cta{display:inline-block;font-family:'Cormorant Garamond',serif;font-weight:600;letter-spacing:.22em;border-bottom:1.5px solid #fff;padding-bottom:5px}
</style></head><body>
<div class="ph"></div><div class="fade"></div>${text}
</body></html>`;
}
(async () => {
  const browser = await chromium.launch();
  for (const mode of ['pc', 'mobile']) {
    const { w, h } = SIZES[mode];
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const tmp = path.join(root, `.tmp_${mode}.html`);
    fs.writeFileSync(tmp, html(mode));
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(root, mode, `hacer_ferm_stocking_${mode}${photoOnly ? '_clean' : ''}.jpg`);
    await page.screenshot({ path: out, type: 'jpeg', quality: 93 });
    fs.unlinkSync(tmp);
    console.log('saved', path.relative(root, out));
    await page.close();
  }
  await browser.close();
})();
