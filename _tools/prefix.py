import json, sys, urllib.parse, urllib.request, io, time
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw
UA={"User-Agent":"StarbellDemo/0.1 (design research; contact tmuranda1@gmail.com)"}
def api(**p):
    p["format"]="json"; u="https://commons.wikimedia.org/w/api.php?"+urllib.parse.urlencode(p)
    for k in range(4):
        try: return json.load(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=40))
        except Exception: time.sleep(1.5)
    return {}
prefixes=sys.argv[2:]
titles=[]
for pre in prefixes:
    d=api(action="query",list="allpages",apnamespace="6",apprefix=pre,aplimit="60")
    titles+=[p["title"][5:] for p in d.get("query",{}).get("allpages",[])]
titles=[t for t in dict.fromkeys(titles) if t.lower().endswith(".jpg")]
print(len(titles))
for i,t in enumerate(titles): print(i,t.encode("ascii","replace").decode())
def thumb(t):
    u="https://commons.wikimedia.org/wiki/Special:FilePath/"+urllib.parse.quote(t)+"?width=380"
    for k in range(3):
        try: return Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=45).read())).convert("RGB")
        except Exception: time.sleep(1)
with ThreadPoolExecutor(8) as ex: ims=list(ex.map(thumb,titles))
W,H=300,215;cols=6;rows=(len(titles)+cols-1)//cols
sheet=Image.new("RGB",(W*cols,(H+14)*rows),"white");d=ImageDraw.Draw(sheet)
for i,im in enumerate(ims):
    x,y=(i%cols)*W,(i//cols)*(H+14); d.text((x+3,y+1),str(i),fill="red")
    if im: im.thumbnail((W-2,H)); sheet.paste(im,(x,y+14))
sheet.save(f"_tools/cand/{sys.argv[1]}.jpg",quality=80); json.dump(titles,open(f"_tools/cand/{sys.argv[1]}.json","w"))
