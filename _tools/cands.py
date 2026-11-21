import urllib.parse, urllib.request, io
from PIL import Image, ImageDraw
UA={"User-Agent":"StarbellDemo/0.1 (design research; contact tmuranda1@gmail.com)"}
C = {
 "A gr-jambi-front":"Toyota Land Cruiser TNGA - GR Sport (J300) (front) in Putri Pinang Masak Park, Jambi City.jpg",
 "B prado-china3":"TOYOTA LAND CRUISER PRADO (J150) China (3).jpg",
 "C prado-china9":"TOYOTA LAND CRUISER PRADO (J150) China (9).jpg",
 "D lx-sonic-front":"Lexus LX 600 VJA310 Sonic Quartz - front.jpg",
 "E lx-ultra2":"LEXUS LX 600 ULTRA LUXURY (J310) (2).jpg",
 "F lx-atomic":"Lexus LX 600 VJA310 Atomic Silver (2).jpg",
 "G def-sb2":"Land Rover Defender 110 L663 Santorini Black (2).jpg",
 "H def-sb4":"Land Rover Defender 110 L663 Santorini Black (4).jpg",
 "I def-sb8":"Land Rover Defender 110 L663 Santorini Black (8).jpg",
 "J def-9063":"Land Rover Defender (L663) DSC 9063.jpg",
 "K lc200-vx":"Toyota Land Cruiser J200 4.5 VX V8 2021.jpg",
 "L lc200-cc0":"Toyota Land Cruiser (49430781897).jpg",
}
W,H=480,320; cols=4; rows=3
sheet=Image.new("RGB",(W*cols,H*rows),"white")
for i,(k,n) in enumerate(C.items()):
    u="https://commons.wikimedia.org/wiki/Special:FilePath/"+urllib.parse.quote(n)+"?width=640"
    try: im=Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60).read())).convert("RGB")
    except Exception as e: print("fail",k,e); continue
    im.thumbnail((W,H-18)); x,y=(i%cols)*W,(i//cols)*H
    sheet.paste(im,(x,y+18)); ImageDraw.Draw(sheet).text((x+4,y+3),k,fill="black")
sheet.save("_tools/cand/sheet.jpg",quality=85)
