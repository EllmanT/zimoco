import json, sys, urllib.parse, urllib.request, io
from PIL import Image, ImageDraw
UA={"User-Agent":"StarbellDemo/0.1 (design research; contact tmuranda1@gmail.com)"}
POOLS={
 "lc300":["Toyota Land Cruiser J300 interior","Toyota Land Cruiser 300 rear","Toyota Land Cruiser J300 side","Toyota Land Cruiser 300 V35A engine","Land Cruiser J300 dashboard","Toyota Land Cruiser 300 wheel","Toyota Land Cruiser 300 rear seats"],
 "prado":["Toyota Land Cruiser Prado J150 interior","Toyota Land Cruiser Prado J150 rear","Toyota Land Cruiser Prado J150 side","Toyota 1GD-FTV engine","Toyota Land Cruiser Prado dashboard"],
 "lx":["Lexus LX 600 interior","Lexus LX 600 rear","Lexus LX 600 side","Lexus LX 600 dashboard","Lexus V35A-FTS engine","Lexus LX 600 wheel"],
 "defender":["Land Rover Defender 110 interior","Land Rover Defender 110 rear","Land Rover Defender 110 side","Land Rover Defender L663 dashboard","Land Rover Defender 110 front"],
}
def search(q,n=18):
    p={"action":"query","format":"json","generator":"search","gsrsearch":q+" filetype:bitmap","gsrnamespace":"6","gsrlimit":str(n),"prop":"imageinfo","iiprop":"url|size|mime"}
    u="https://commons.wikimedia.org/w/api.php?"+urllib.parse.urlencode(p)
    d=json.load(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=40))
    out=[]
    for pg in d.get("query",{}).get("pages",{}).values():
        ii=pg["imageinfo"][0]
        if ii["mime"]=="image/jpeg" and ii["width"]>=1800: out.append((pg["title"][5:],ii["width"],ii["height"]))
    return out
pool=sys.argv[1]
seen={}; 
for q in POOLS[pool]:
    for t,w,h in search(q):
        if t not in seen: seen[t]=(w,h,q)
items=list(seen.items())[:40]
W,H=300,200; cols=8; rows=(len(items)+cols-1)//cols
sheet=Image.new("RGB",(W*cols,(H+14)*rows),"white"); d=ImageDraw.Draw(sheet)
for i,(t,(w,h,q)) in enumerate(items):
    u="https://commons.wikimedia.org/wiki/Special:FilePath/"+urllib.parse.quote(t)+"?width=420"
    try: im=Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60).read())).convert("RGB")
    except Exception as e: continue
    im.thumbnail((W,H)); x,y=(i%cols)*W,(i//cols)*(H+14)
    sheet.paste(im,(x,y+14)); d.text((x+3,y+1),f"{i}",fill="red")
sheet.save(f"_tools/cand/{pool}.jpg",quality=82)
json.dump([t for t,_ in items],open(f"_tools/cand/{pool}.json","w"))
print(pool,len(items))
