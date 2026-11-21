import json, sys, urllib.parse, urllib.request, io, time
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw
UA={"User-Agent":"StarbellDemo/0.1 (design research; contact tmuranda1@gmail.com)"}
CATS={"lc300":["Toyota Land Cruiser (J300)"],"prado":["Toyota Land Cruiser Prado (J150)"],"lx":["Lexus LX (J310)"],"defender":["Land Rover Defender (L663)"]}
def api(**p):
    p["format"]="json"
    u="https://commons.wikimedia.org/w/api.php?"+urllib.parse.urlencode(p)
    for k in range(4):
        try: return json.load(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=40))
        except Exception as e: time.sleep(1.5)
    return {}
def members(cat,typ):
    out=[];cont={}
    while True:
        d=api(action="query",list="categorymembers",cmtitle="Category:"+cat,cmtype=typ,cmlimit="500",**cont)
        out+= [m["title"] for m in d.get("query",{}).get("categorymembers",[])]
        if "continue" in d: cont={"cmcontinue":d["continue"]["cmcontinue"]}
        else: break
    return out
def info(titles):
    res={}
    for i in range(0,len(titles),40):
        d=api(action="query",titles="|".join(titles[i:i+40]),prop="imageinfo",iiprop="size|mime")
        for pg in d.get("query",{}).get("pages",{}).values():
            ii=(pg.get("imageinfo") or [{}])[0]
            if ii.get("mime")=="image/jpeg": res[pg["title"][5:]]=(ii["width"],ii["height"])
    return res
def thumb(t):
    u="https://commons.wikimedia.org/wiki/Special:FilePath/"+urllib.parse.quote(t)+"?width=360"
    for k in range(3):
        try: return Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=45).read())).convert("RGB")
        except Exception: time.sleep(1)
    return None
pool=sys.argv[1]; maxn=int(sys.argv[2]) if len(sys.argv)>2 else 48
titles=[]
for c in CATS[pool]:
    titles+=members(c,"file")
    for sc in members(c,"subcat")[:12]: titles+=members(sc[9:],"file")
titles=list(dict.fromkeys(titles))
inf=info(titles)
good=[(t,wh) for t,wh in inf.items() if wh[0]>=1800]
good.sort(key=lambda x:-x[1][0])
good=good[:maxn]
print(pool,"files",len(titles),"jpeg>=1800",len(good))
W,H=250,170;cols=8;rows=(len(good)+cols-1)//cols
with ThreadPoolExecutor(8) as ex: ims=list(ex.map(lambda g:thumb(g[0]),good))
sheet=Image.new("RGB",(W*cols,(H+14)*rows),"white");d=ImageDraw.Draw(sheet)
for i,im in enumerate(ims):
    x,y=(i%cols)*W,(i//cols)*(H+14)
    d.text((x+3,y+1),str(i),fill="red")
    if im: im.thumbnail((W-2,H)); sheet.paste(im,(x,y+14))
sheet.save(f"_tools/cand/{pool}.jpg",quality=80)
json.dump([g[0] for g in good],open(f"_tools/cand/{pool}.json","w"))
