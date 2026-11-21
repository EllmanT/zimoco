import urllib.parse, urllib.request, io
from PIL import Image, ImageDraw
UA={"User-Agent":"StarbellDemo/0.1 (design research; contact tmuranda1@gmail.com)"}
C = {
 "M hakone-gr":"2025 Hakone Ekiden Headquarter car No 2 Land Cruiser J300 GR Sport.jpg",
 "N gr-front-2":"Toyota Land Cruiser TNGA - GR Sport (J300) (front) in Putri Pinang Masak Park, Jambi City (cropped).jpg",
 "O lc300-russia":"2021 Toyota Land Cruiser 300 (Russia) front view.jpg",
 "P lx-exec-front":"Lexus LX 600 \"EXECUTIVE\" (3BA-VJA310W-GKULZ) front.jpg",
}
W,H=640,430; cols=2; rows=2
sheet=Image.new("RGB",(W*cols,H*rows),"white")
for i,(k,n) in enumerate(C.items()):
    u="https://commons.wikimedia.org/wiki/Special:FilePath/"+urllib.parse.quote(n)+"?width=640"
    try: im=Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60).read())).convert("RGB")
    except Exception as e: print("fail",k,e); continue
    im.thumbnail((W,H-18)); x,y=(i%cols)*W,(i//cols)*H
    sheet.paste(im,(x,y+18)); ImageDraw.Draw(sheet).text((x+4,y+3),k,fill="black")
sheet.save("_tools/cand/sheet2.jpg",quality=85)
