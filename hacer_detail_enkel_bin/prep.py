# 원본 사진 정리: 누끼 PNG는 여백 잘라내고, 라이프스타일/사이즈표 분류 -> prepared/ + manifest.json
import os, glob, json, hashlib
from PIL import Image
R = os.path.dirname(os.path.abspath(__file__))
CM = {'black':'01_블랙_black','cashmere':'02_캐시미어_cashmere','dark_chocolate':'03_다크초콜릿_dark_chocolate'}
man = {}
for key, d in CM.items():
    src = f'{R}/images/{d}'; out = f'{R}/prepared/{key}'; os.makedirs(out, exist_ok=True)
    m = {'closed':{}, 'open':{}, 'life':[], 'chart':None}
    seen = set()
    for s, sk in (('small','S'),('medium','M'),('large','L')):
        fs = sorted(glob.glob(f'{src}/{s}_*'))
        pngs = [f for f in fs if f.endswith('.png')]; jpgs = [f for f in fs if f.endswith('.jpg')]
        for tag, f in (('closed', pngs[0]), ('open', pngs[-1])):
            im = Image.open(f).convert('RGBA'); bb = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
            p = f'{out}/{tag}_{sk}.png'; im.crop(bb).save(p); m[tag][sk] = os.path.relpath(p, R)
        if s == 'medium': m['chart'] = os.path.relpath(jpgs[-1], R)
        for f in jpgs[:-1]:
            h = hashlib.md5(open(f,'rb').read()).hexdigest()
            if h not in seen: seen.add(h); m['life'].append(os.path.relpath(f, R))
    man[key] = m
    print(key, {k:(v if k!='life' else len(v)) for k,v in m.items() if k in('life',)}, m['life'])
json.dump(man, open(f'{R}/manifest.json','w'), ensure_ascii=False, indent=1)
