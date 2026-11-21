import json, urllib.parse, urllib.request, os, sys
UA = {"User-Agent": "StarbellDemo/0.1 (design research; contact tmuranda1@gmail.com)"}
OUT = "public/cars"
items = {
 "lc300-gr-1": "Toyota Land Cruiser TNGA - GR Sport (J300) (front) in Putri Pinang Masak Park, Jambi City (cropped).jpg",
 "lc300-zx-1": "2021 Toyota Land Cruieser 300 ZX.jpg",
 "prado-1": "Toyota LAND CRUISER PRADO DIESEL TX L Package 5-Seater (3DA-GDJ150W-GGTEY) front.jpg",
 "lx600-1": "Lexus LX 600 VJA310 Sonic Quartz - front.jpg",
 "lx600-2": "Lexus LX 600 \"EXECUTIVE\" (3BA-VJA310W-GKULZ) front.jpg",
 "defender-1": "Land Rover Defender (L663) DSC 9063.jpg",
 "lc200-1": "Toyota Land Cruiser J200 4.5 VX V8 2021.jpg",
}
credits = {}
for key, name in items.items():
    api = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({"action":"query","format":"json","titles":"File:"+name,"prop":"imageinfo","iiprop":"extmetadata|url"})
    d = json.load(urllib.request.urlopen(urllib.request.Request(api, headers=UA), timeout=40))
    ii = list(d["query"]["pages"].values())[0]["imageinfo"][0]
    md = ii["extmetadata"]
    credits[key] = {"file": name, "page": ii["descriptionurl"], "license": md.get("LicenseShortName",{}).get("value"),
                    "author": __import__("re").sub("<[^>]+>","",md.get("Artist",{}).get("value","")), }
    url = "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(name) + "?width=2400"
    path = f"{OUT}/{key}.jpg"
    try:
        data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90).read()
    except Exception as e:
        print("FAIL", key, e); continue
    if data[:3] != b"\xff\xd8\xff": print("NOT JPEG", key); continue
    open(path, "wb").write(data)
    print(key, len(data)//1024, "KB", credits[key]["license"])
json.dump(credits, open(f"{OUT}/credits.json","w"), indent=1)
