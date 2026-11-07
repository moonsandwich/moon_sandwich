// hacer 메인 배너 생성기 (기존 홈페이지 톤: 풀블리드 제품 사진 + 브랜드 태그 + 굵은 흰색 카피)
// 사용: node build.js            -> pc/, mobile/ 에 최종 이미지 생성
//       node build.js --guide    -> guide/ 에 안전영역 표시본 생성
//  - photos/<id>_pc.jpg / photos/<id>_mobile.jpg 를 넣으면 제품 사진이 배경으로 들어갑니다.
//    (없으면 브랜드 톤의 임시 배경으로 만들어집니다)
//  - banners.json 에서 문구/색/focus(가구 위치) 수정 후 다시 실행.
//  - logo/hacer_logo.png (흰색 로고, 투명 배경)를 넣으면 텍스트 로고 대신 사용됩니다.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const root = __dirname;
const banners = JSON.parse(fs.readFileSync(path.join(root, 'banners.json'), 'utf8'));
const SIZES = { pc: { w: 1920, h: 850 }, mobile: { w: 750, h: 1000 } };
const logoFile = path.join(root, 'logo', 'hacer_logo.png');
const hasLogo = fs.existsSync(logoFile);
const guide = process.argv.includes('--guide');

function html(b, mode) {
  const { w, h } = SIZES[mode];
  const pc = mode === 'pc';
  const photo = path.join(root, 'photos', `${b.id}_${mode}.jpg`);
  const hasPhoto = fs.existsSync(photo);
  const [w1, w2, w3] = b.wall;
  const logo = hasLogo ? `<img class="logo" src="file://${logoFile}">` : `<div class="logo word">hacer</div>`;
  const backdrop = hasPhoto
    ? `background:url('file://${photo}') ${b.focus}/cover no-repeat;`
    : `background:
        radial-gradient(ellipse 50% 40% at ${pc ? '30%' : '50%'} ${pc ? '62%' : '48%'}, rgba(255,255,255,.22), transparent 70%),
        linear-gradient(180deg,${w1} 0%,${w2} 64%,${w3} 64.1%,${w3} 100%);`;
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{word-break:keep-all;width:${w}px;height:${h}px;overflow:hidden;position:relative;font-family:'Noto Sans KR',sans-serif;color:#fff}
.bg{position:absolute;inset:0;${backdrop}}
.scrim{position:absolute;inset:0;background:${pc
  ? 'linear-gradient(90deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0) 42%,rgba(0,0,0,.45) 100%)'
  : 'linear-gradient(180deg,rgba(0,0,0,.12) 0%,rgba(0,0,0,0) 22%,rgba(0,0,0,0) 48%,rgba(0,0,0,.62) 100%)'}}
.logo{position:absolute;z-index:3;color:#fff;text-shadow:0 1px 10px rgba(0,0,0,.25)}
.word{font-family:'Cormorant Garamond',serif;font-weight:500;line-height:1}
.txt{position:absolute;z-index:3;text-shadow:0 2px 14px rgba(0,0,0,.35)}
.tag{display:inline-block;background:${b.accent};color:${b.tagText};font-weight:500;letter-spacing:.04em;line-height:1;text-shadow:none}
h1{font-weight:900;line-height:1.22;letter-spacing:-.03em}
.sub{font-weight:700;color:rgba(255,255,255,.92);line-height:1.45;letter-spacing:-.01em}
.cta{display:inline-block;font-family:'Cormorant Garamond',serif;font-weight:600;letter-spacing:.22em;border-bottom:1.5px solid #fff;padding-bottom:5px}
${pc ? `
.logo.word{left:260px;top:56px;font-size:60px}
img.logo{left:260px;top:52px;height:54px}
.txt{left:1000px;top:318px;width:660px}
.tag{font-size:42px;padding:12px 22px;margin-bottom:34px}
h1{font-size:68px;margin-bottom:22px}
.sub{font-size:30px;margin-bottom:38px}
.cta{font-size:19px}
` : `
.logo.word{left:50px;top:44px;font-size:54px}
img.logo{left:50px;top:40px;height:48px}
.txt{left:50px;right:50px;bottom:84px}
.tag{font-size:28px;padding:10px 18px;margin-bottom:24px}
h1{font-size:56px;margin-bottom:16px}
.sub{font-size:24px;margin-bottom:28px}
.cta{font-size:17px}
`}
.g{position:absolute;z-index:9;border:2px dashed rgba(0,255,255,.9);color:#0ff;font:600 16px sans-serif;padding:4px 8px}
</style></head><body>
<div class="bg"></div><div class="scrim"></div>
${logo}
<div class="txt">
  <div class="tag">${b.brand}</div>
  <h1>${b.head.join('<br>')}</h1>
  <div class="sub">${b.sub}</div>
  <div class="cta">${b.cta} →</div>
</div>
${guide ? (pc
  ? `<div class="g" style="left:260px;top:0;width:1400px;height:${h}px">SAFE 1400px (가로가 잘려도 유지되는 영역)</div>
     <div class="g" style="left:260px;top:110px;width:700px;height:640px;border-color:#f0f">가구 영역</div>`
  : `<div class="g" style="left:0;top:0;width:${w}px;height:${h}px">SAFE</div>
     <div class="g" style="left:0;top:110px;width:${w}px;height:480px;border-color:#f0f">가구 영역</div>`) : ''}
</body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  for (const mode of ['pc', 'mobile']) {
    const { w, h } = SIZES[mode];
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    for (const b of banners) {
      const tmp = path.join(root, `.tmp_${b.id}_${mode}.html`);
      fs.writeFileSync(tmp, html(b, mode));
      await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const dir = guide ? path.join(root, 'guide') : path.join(root, mode);
      fs.mkdirSync(dir, { recursive: true });
      const out = path.join(dir, `hacer_banner_${b.id}_${mode}.jpg`);
      await page.screenshot({ path: out, type: 'jpeg', quality: 92 });
      fs.unlinkSync(tmp);
      console.log('saved', path.relative(root, out));
    }
    await page.close();
  }
  await browser.close();
})();
