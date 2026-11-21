import json, sys, urllib.parse, urllib.request
UA = {"User-Agent": "StarbellDemo/0.1 (design research; contact tmuranda1@gmail.com)"}
def search(q, n=14):
    p = {"action":"query","format":"json","generator":"search","gsrsearch":q+" filetype:bitmap","gsrnamespace":"6","gsrlimit":str(n),
         "prop":"imageinfo","iiprop":"url|size|mime|extmetadata","iiurlwidth":"400"}
    u = "https://commons.wikimedia.org/w/api.php?"+urllib.parse.urlencode(p)
    d = json.load(urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=40))
    out=[]
    for pg in d.get("query",{}).get("pages",{}).values():
        ii = pg["imageinfo"][0]
        md = ii.get("extmetadata",{})
        out.append((pg["title"], ii["width"], ii["height"], ii["mime"], md.get("LicenseShortName",{}).get("value"), ii["url"]))
    return sorted(out, key=lambda x:-x[1])
for q in sys.argv[1:]:
    print("##", q)
    for t,w,h,m,l,u in search(q):
        if m=="image/jpeg" and w>=1800: print(f"{w}x{h} | {l} | {t}")
