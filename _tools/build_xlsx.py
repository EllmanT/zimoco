from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

wb = Workbook()

# ---------- Sheet 1: prospects ----------
ws = wb.active
ws.title = "Prospects"
hdr = ["Priority", "Company", "Brands / Segment", "Segment type", "Conflict vs Faramatsi", "Current site status",
       "Site problems observed", "Est. budget tier (my estimate, unverified)", "Public contact (verify before use)",
       "Phone / WhatsApp", "Email", "Address", "Demo angle", "Design direction (unique per client)",
       "Source", "Status", "Next action"]
rows = [
 ["1","Starbell Auto","Premium used imports (Land Cruiser, Prado, GR Sport); importer via intl dealer network","Used premium import","MEDIUM - Toyota used vs Faramatsi Toyota new. You chose to proceed; disclose.","starbellauto.com = 'under maintenance' placeholder only","No site at all. Listings live on DriveNow/Facebook instead","$$ (LC300 stock listed up to ~$140k)","zim@starbellauto.com","+263 77 226 2946 (site); +263 78 459 6133 (directory)","zim@starbellauto.com","Norfolk Rd, Mount Pleasant (site); 3 Sentosa Rd (DriveNow); 3 Dungarvan Rd W (Starbell Select FB)","Speculative demo - build it, then pitch","Quiet-luxury import house: dark, editorial, big photography, 'sourced for you' story (see Starbell prompt)","drivenow.co.zw/dealer/starbell_auto_4; starbellauto.com; facebook.com/starbellselect","Not contacted","Build preview; confirm correct phone/address with them"],
 ["5","Autoworld Zimbabwe (Isuzu)","Isuzu (official dealer): D-Max, MU-X, N/F/FX trucks","Franchise new + trucks","NONE - Faramatsi has no Isuzu","WordPress, built by Radical Cloud Solutions","Footer (c)2023; broken/mismatched links; blank placeholder images; duplicated contact form w/ template text; no live inventory","$$$ (franchise, fleet/truck buyers)","Sales: Chisipite. Service: Pomona","+263 8677 004 334; WhatsApp 0775 463 762; Pomona 8677 004 312","(Cloudflare-obscured; get from site contact page)","24 Silwood Close, Chisipite Circle; Pomona Office Park Stand 3496; Bulawayo 37 Doncaster Rd","Fix broken lead capture + live stock + fleet quote funnel","Industrial-confident: Isuzu red/black, workwear-honest, fleet & lifestyle (D-Max vs MU-X)","autoworld.co.zw","Not contacted","Find dealer principal; send teardown + demo"],
 ["2","ZIMOCO","Mercedes-Benz, Jeep, Mitsubishi, GWM (Haval/Tank/ORA), Fiat, Alfa Romeo, FUSO, Freightliner","Franchise group (premium)","LOW - no Mercedes/Jeep; GWM/Mitsubishi vs Faramatsi Suzuki/JAC only loosely","WordPress dealership template","Copyright 2024 stale; menu duplicated x3; 'Vehicles' links to '#'; dup shop pages; placeholder labels; no lead form beyond phone/WhatsApp","$$$$ (largest premium group; Mercedes)","Head office Southerton; Borrowdale showroom; body shop Workington","024 2754303; WhatsApp +263 77 258 9624","(not shown)","Cnr Third St & George Silundika Ave, Southerton; Sam Levy's Village Borrowdale; 24 Douglas Rd Workington","Per-brand microsites (Mercedes vs GWM) + test drive/finance funnel","Premium European restraint for Mercedes; sub-brand sites with own look","zimoco.co.zw; mercedes-benz-africa.com Zimbabwe page","Not contacted","Highest ticket. Ask for marketing manager / MD"],
 ["Later","Land Rover Zimbabwe (retailer) - site already good","Land Rover / Range Rover / Defender","Franchise premium","NONE","Official JLR template site; no local retailer content","No local stock, no phones/emails, generic global template; 'contact your retailer'","$$$$ (luxury; verify retailer entity)","Retailer entity at 125 Leopold Takawira St / Samora Machel Ave - identify operator","(not listed)","(not listed)","125 Leopold Takawira St / Samora Machel, Harare","Local retailer site: stock, test drive, service booking, certified pre-owned","British heritage/outdoor, very large imagery","landrover.co.zw","Not contacted","Identify local retailer operator first (may be controlled by OEM site rules - check)"],
 ["Later","BYD Zimbabwe / Tsapo (not a competitor; site already modern)","BYD: Shark 6, Sealion 6, Atto 3, Dolphin Surf","NEV importer/dealer","NONE (confirmed by you) - not a competitor","Modern Next.js site (already decent)","Typos ('FUTUREINTELLIGENTLY'), FAQ answers missing, no real lead form, mixed hybrid/EV messaging","$$$ (solar + EV group)","admin@bydzimbabwe.co.zw","Eastlea +263 8677 010 071; Hatfield +263 24 2500 736; support +263 77 423 6236","admin@bydzimbabwe.co.zw","265 Samora Machel Ave Eastlea; 31 Airport Rd Hatfield","Only pitch if no Faramatsi conflict; lead form + finance/charging calculators","Tech-forward EV/solar ecosystem","bydzimbabwe.co.zw","Later","Revisit only for retainer/SEO work; site is current"],
 ["4","Ford Zimbabwe (Croco Motors + Duly Motors shared portal)","Ford (shared franchise with Croco)","Franchise","ACCEPTED by you: Faramatsi sells no Ford. But Croco (Faramatsi rival) co-owns the Ford franchise, so tell Faramatsi up front","Under Ford Zimbabwe template","(Dealer pages hosted by Ford)","$$$","Harare - Speke Ave cnr Third St","+263 242 703 441; Duly's listing +263 71 433 1058","portian@dulys.co.zw (ZimAuto listing)","Speke Ave cnr Third St","Own-brand site (they currently ride Ford's)","Ford blue/heritage","fordzimbabwe.com; zimauto.co.zw/dealers","Not contacted","Decide client: Ford Zimbabwe as a whole (Croco+Duly). Identify who owns the portal"],
 ["B","Fusuccess Motors","Multi-brand new + Japanese imports; hire purchase; delivers ZW/Zambia/Tanzania","Multi-brand importer","LOW-MED - sells Toyota etc. but import model","Single keyword-stuffed landing page","No inventory, no form, keyword stuffing, Gmail contact, 50% deposit model","$$ (verify scale)","Meikles Building office","+263 78 345 3443 (WhatsApp); +263 71 359 3065","fusuccessinvestments@gmail.com","Office 31, 1st Floor, Meikles Bldg, cnr R Mugabe & Orr St","Real inventory + enquiry funnel","Trade-confident, cross-border","fusuccess.co.zw","Not contacted","Qualify budget on a call"],
 ["B","Exceed Auto","New & pre-owned; 'over 500 sold'","Independent dealer","LOW","Has site (limited data)","Not audited","$$","12 Brighton Rd, Harare","(get from site)","(get from site)","12 Brighton Rd, Harare","Upgrade","TBD","exceed-auto.co.zw","Not contacted","Audit site first"],
 ["B","Linrik Luxury Cars","Luxury used/imports","Premium used","LOW","Unknown","Not audited","$$$","Harare","+263 77 272 6609","admin@linrik.com","Harare","Luxury listing site","Black/gold restraint","zimauto.co.zw/dealers","Not contacted","Audit; cluster with Starbell is a competitor - DON'T do both"],
 ["3","Jetour Zimbabwe dealer (new 2026 launch)","Jetour; 10yr/1m km engine warranty; dealer principal Michael Hove (per press)","New NEV/SUV importer","LOW","Unknown / new","Official OEM-template site exists (jetour.co.zw); thin, SA-branded socials","$$$ (new network, launch budget)","Dealer principal named in press","+263 867 718 6332 / 6333","sales@jetour.co.zw","Eastlea showroom, Harare; Bulawayo & Mutare planned","Redesign pitch: OEM template site exists at jetour.co.zw (launched 28 Aug 2026); check dealer branding rules first","Bold, youthful","thezimbabwemail.com Sept 2026","Not contacted","Dealer principal Michael Hove (per press). Confirm site customisation allowed"],
 ["X","Croco Motors (Toyota/Ford/Nissan/Mazda/Kia/Volvo)","Group","Franchise group","HARD EXCLUDE - direct Faramatsi rival","Has site","-","-","-","+263 24 277 1601","-","1 Telford Rd Graniteside","DO NOT TOUCH","-","crocomotors.co.zw","EXCLUDED","-"],
 ["X","Clover Leaf Motors Suzuki","Suzuki","Franchise","EXCLUDE - Faramatsi sells Suzuki","WordPress by Quatrohaus","-","-","-","+263 242 485 522","-","Msasa","DO NOT TOUCH","-","cloverleaf.co.zw","EXCLUDED","-"],
 ["X","Amtec Motors","Mazda, Nissan","Franchise","EXCLUDE - Faramatsi sells Mazda/Nissan","-","-","-","-","-","-","-","DO NOT TOUCH","-","press","EXCLUDED","-"],
]
order={"1":1,"2":2,"3":3,"4":4,"5":5,"Later":6,"B":7,"X":8}
rows.sort(key=lambda r: order.get(r[0],9))
ws.append(hdr)
for r in rows: ws.append(r)
widths = [8,26,34,18,34,30,44,24,32,32,28,34,34,38,32,14,36]
for i,w in enumerate(widths,1): ws.column_dimensions[get_column_letter(i)].width = w
for c in ws[1]:
    c.font = Font(bold=True,color="FFFFFF"); c.fill = PatternFill("solid",fgColor="1F2937"); c.alignment = Alignment(wrap_text=True,vertical="center")
for row in ws.iter_rows(min_row=2):
    for c in row: c.alignment = Alignment(wrap_text=True,vertical="top")
    p = row[0].value
    fill = {"1":"DCFCE7","2":"DCFCE7","3":"DCFCE7","4":"DCFCE7","5":"DCFCE7","Later":"FEF9C3","X":"FEE2E2"}.get(str(p))
    if fill:
        for c in row: c.fill = PatternFill("solid",fgColor=fill)
ws.freeze_panes = "C2"

# ---------- Sheet 2: conflict map ----------
cm = wb.create_sheet("Conflict map")
cm.append(["Brand","Faramatsi sells it?","Dealer in Harare (found)","Safe to serve?","Note"])
for r in [
 ["Toyota","YES (Faramatsi Toyota)","Croco, Starbell (used import), imports","Only used-import tier, disclosed","Starbell is a used-import premium play, not franchise new"],
 ["Lexus","YES","-","NO",""],
 ["Nissan","YES","Croco, Amtec","NO",""],
 ["Mazda","YES","Croco, Amtec","NO",""],
 ["Suzuki","YES","Clover Leaf Suzuki, Suzuki Harare","NO",""],
 ["Hino","YES","-","NO",""],
 ["JAC","YES (via Asia Mobility)","-","NO",""],
 ["Higer","YES","Croco (Higer/Yutong)","NO",""],
 ["Isuzu","NO","Autoworld","YES","Cleanest target"],
 ["Mercedes-Benz / Jeep / Mitsubishi / GWM","NO (verify GWM overlap with JAC? different brand)","ZIMOCO","YES","Largest ticket"],
 ["Land Rover","NO","Retailer at 125 Leopold Takawira","YES","Identify operator"],
 ["Ford","NO","Croco + Duly","YES (user decision)","Croco is a Faramatsi rival and co-holds the franchise: tell Faramatsi"],
 ["BYD","NO (confirmed)","BYD Zimbabwe / Tsapo","Later","Site already modern"],
 ["Jetour / Chery / Haval-other","NO","new","YES","Launch sites"],
]: cm.append(r)
for c in cm[1]:
    c.font = Font(bold=True,color="FFFFFF"); c.fill = PatternFill("solid",fgColor="1F2937")
for i,w in enumerate([34,34,38,26,50],1): cm.column_dimensions[get_column_letter(i)].width = w

# ---------- Sheet 3: pricing ----------
pr = wb.create_sheet("Offer & pricing")
pr.append(["Tier","Build fee (USD)","Monthly retainer (USD)","What is included"])
for r in [
 ["Preview (free)",0,0,"Working demo on a preview URL, 1-page teardown of their current site. Costs you ~1 day if reusing the template."],
 ["Launch",2500,150,"Brand-new site, inventory CMS, WhatsApp+form lead capture, SEO foundation, analytics, 1 location"],
 ["Authority",3500,250,"Launch + finance calculator, compare, test-drive/service booking, lead dashboard, monthly SEO report"],
 ["Flagship",5000,400,"Authority + multi-branch/multi-brand, AI car-finder, CRM/email routing, quarterly strategy review"],
]: pr.append(r)
for c in pr[1]:
    c.font = Font(bold=True,color="FFFFFF"); c.fill = PatternFill("solid",fgColor="1F2937")
for i,w in enumerate([18,18,22,90],1): pr.column_dimensions[get_column_letter(i)].width = w

# ---------- Sheet 4: sources ----------
sc = wb.create_sheet("Notes & sources")
for r in [
 ["IMPORTANT","Contacts are public info scraped from dealer sites / directories on 2 Nov 2026. Verify each before outreach. Budget tiers are my own estimates from company size, not known figures."],
 ["ZimAuto dealer directory","58 listed dealers, mostly small Gmail-contact operators - NOT big-budget; only a few worth a call (Linrik, Duly's)."],
 ["Sources","starbellauto.com; drivenow.co.zw; zimoco.co.zw; autoworld.co.zw; crocomotors.co.zw; fordzimbabwe.com; fusuccess.co.zw; landrover.co.zw; bydzimbabwe.co.zw; cloverleaf.co.zw; zimauto.co.zw/dealers; thezimbabwemail.com (Chinese brands, Sept 2026)"],
]: sc.append(r)
sc.column_dimensions["A"].width = 28; sc.column_dimensions["B"].width = 140

wb.save(r"C:\Users\Ropafadzo Muridzi\Documents\tapiwa projects\starbell-auto\Harare-Dealer-Prospects-v2.xlsx")
print("ok")
