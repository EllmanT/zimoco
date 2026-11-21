import json, re, urllib.parse, urllib.request, time, io
from PIL import Image
UA={"User-Agent":"StarbellDemo/0.1 (design research; contact tmuranda1@gmail.com)"}
OUT="public/cars"
items={
 "zx-rear":"TOYOTA LAND CRUISER (J300) China (2).jpg",
 "zx-int":"Toyota LAND CRUISER ZX (3DA-FJA300W-GMUZY) interior.jpg",
 "gr-1":"Toyota LAND CRUISER GR SPORT (3DA-FJA300W-GMUSY) front.jpg",
 "gr-rear":"Toyota LAND CRUISER GR SPORT (3DA-FJA300W-GMUSY) rear.jpg",
 "prado-2":"Toyota LAND CRUISER PRADO DIESEL TX L Package 5-Seater (3DA-GDJ150W-GGTEY) rear.jpg",
 "prado-int":'Toyota LAND CRUISER PRADO TX"L Package" (LDA-GDJ150W-GKTEY) interior.jpg',
 "prado-eng":"Toyota 1GD-FTV 01.jpg",
 "lx600-rear":"Lexus LX 600 VJA310 Sonic Quartz - rear.jpg",
 "lx600-int":'Lexus LX 600 "EXECUTIVE" (3BA-VJA310W-GKULZ) interior.jpg',
 "lx600-side":"Lexus LX 600 VJA310 Ultra Luxury Sonic Quartz 01.jpg",
 "lx600-eng":"2021 Toyota Land Cruiser 300 (Russia) V35A-FTS V6 petrol engine.png",
 "defender-1":"Land Rover Defender (L663) DSC 9062.jpg",
 "defender-2":"Land Rover Defender (L663) DSC 9063.jpg",
}
def get(url):
    for k in range(4):
        try: return urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=90).read()
        except Exception: time.sleep(2)
credits=json.load(open(f"{OUT}/credits.json"))
for key,name in items.items():
    api="https://commons.wikimedia.org/w/api.php?"+urllib.parse.urlencode({"action":"query","format":"json","titles":"File:"+name,"prop":"imageinfo","iiprop":"extmetadata|url"})
    d=json.loads(get(api)); ii=list(d["query"]["pages"].values())[0]["imageinfo"][0]; md=ii["extmetadata"]
    credits[key]={"file":name,"page":ii["descriptionurl"],"license":md.get("LicenseShortName",{}).get("value"),"author":re.sub("<[^>]+>","",md.get("Artist",{}).get("value",""))}
    data=get("https://commons.wikimedia.org/wiki/Special:FilePath/"+urllib.parse.quote(name)+"?width=2400")
    if not data: print("FAIL",key); continue
    ext="png" if name.lower().endswith(".png") else "jpg"
    path=f"{OUT}/{key}.{ext}"; open(path,"wb").write(data)
    im=Image.open(io.BytesIO(data)); print(key,im.size,im.mode,len(data)//1024,"KB",credits[key]["license"])
json.dump(credits,open(f"{OUT}/credits.json","w"),indent=1)
