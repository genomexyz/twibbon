#!/usr/bin/env python3
"""Build demografi JSON data from member_pk.csv"""
import csv, json, os

# City coordinate lookup (166 unique entries)
COORDS = {
    "auckland": (-36.8485, 174.7633),
    "baltimore": (39.2904, -76.6122),
    "baltimore, md": (39.2904, -76.6122),
    "bandung": (-6.9175, 107.6191),
    "beijing": (39.9042, 116.4074),
    "bern": (46.9480, 7.4474),
    "birmingham": (52.4862, -1.8904),
    "birmingham city": (52.4862, -1.8904),
    "bogor": (-6.5944, 106.7892),
    "bologna": (44.4949, 11.3426),
    "bonn": (50.7374, 7.0982),
    "boston, massachusetts": (42.3601, -71.0589),
    "brighton": (50.8229, -0.1363),
    "bulaksumur, kota yogyakarta, daerah istimewa yogyakarta": (-7.7971, 110.3688),
    "chicago": (41.8781, -87.6298),
    "cilandak": (-6.3072, 106.7974),
    "cranfield": (52.0739, -0.6233),
    "daerah istimewa yogyakarta": (-7.7971, 110.3688),
    "delft": (52.0116, 4.3571),
    "depok": (-6.4025, 106.7942),
    "dublin": (53.3498, -6.2603),
    "dumai": (1.6667, 101.4500),
    "edinburgh": (55.9533, -3.1883),
    "exeter": (50.7184, -3.5339),
    "ghent, belgia": (51.0543, 3.7174),
    "glasgow": (55.8609, -4.2514),
    "groningen": (53.2194, 6.5665),
    "jakarta": (-6.2088, 106.8456),
    "jakarta barat": (-6.1683, 106.7588),
    "jakarta pusat": (-6.1865, 106.8341),
    "jakarta selatan": (-6.2615, 106.8106),
    "jakarta timur": (-6.2250, 106.9004),
    "jakarta utara": (-6.1383, 106.8630),
    "kabupaten aceh barat": (4.2760, 96.1510),
    "kabupaten badung": (-8.5800, 115.1800),
    "kabupaten bandung": (-6.9500, 107.6000),
    "kabupaten bandung barat": (-6.9200, 107.5200),
    "kabupaten bantaeng": (-5.5500, 119.9500),
    "kabupaten banyumas": (-7.4800, 109.1500),
    "kabupaten banyuwangi": (-8.4000, 114.1500),
    "kabupaten bekasi": (-6.2500, 107.0000),
    "kabupaten belu": (-9.3000, 124.4000),
    "kabupaten bogor": (-6.5950, 106.7900),
    "kabupaten bone": (-4.7000, 120.3000),
    "kabupaten brebes": (-6.8700, 109.0500),
    "kabupaten buton selatan": (-5.5500, 122.5500),
    "kabupaten deli serdang": (3.5500, 98.7000),
    "kabupaten fakfak": (-2.9200, 132.3000),
    "kabupaten indramayu": (-6.3300, 108.3200),
    "kabupaten jayapura": (-2.5500, 140.7000),
    "kabupaten jayawijaya": (-4.1000, 138.8000),
    "kabupaten jember": (-8.1700, 113.7000),
    "kabupaten jombang": (-7.5500, 112.2333),
    "kabupaten karo": (3.1000, 98.3000),
    "kabupaten kediri": (-7.8000, 111.9500),
    "kabupaten klaten": (-7.7000, 110.6000),
    "kabupaten kotawaringin barat": (-2.4000, 111.7333),
    "kabupaten kubu raya": (-0.3500, 109.5000),
    "kabupaten kuningan": (-7.0000, 108.4833),
    "kabupaten kuantan singingi": (-0.5000, 101.5000),
    "kabupaten lahat": (-3.8000, 103.5000),
    "kabupaten lombok barat": (-8.6500, 116.0833),
    "kabupaten lombok timur": (-8.5333, 116.4833),
    "kabupaten lombok utara": (-8.3500, 116.2000),
    "kabupaten lumajang": (-8.1333, 113.2167),
    "kabupaten magelang": (-7.4667, 110.2167),
    "kabupaten malang": (-8.1000, 112.6000),
    "kabupaten manokwari": (-0.8629, 134.0640),
    "kabupaten merauke": (-8.5000, 140.3333),
    "kabupaten mesuji": (-4.0000, 105.3000),
    "kabupaten muaro jambi": (-1.5500, 103.5500),
    "kabupaten padang lawas": (1.1000, 99.8000),
    "kabupaten pangkajene dan kepulauan": (-7.0000, 120.5000),
    "kabupaten pasuruan": (-7.6167, 112.9000),
    "kabupaten pesawaran": (-5.4000, 105.1000),
    "kabupaten pinrang": (-3.3000, 119.6000),
    "kabupaten purworejo": (-7.7167, 110.0000),
    "kabupaten sidoarjo": (-7.4500, 112.7000),
    "kabupaten sinjai": (-5.2000, 120.1000),
    "kabupaten sleman": (-7.7167, 110.3500),
    "kabupaten sragen": (-7.4333, 111.0167),
    "kabupaten sukoharjo": (-7.6833, 110.8333),
    "kabupaten tangerang": (-6.2000, 106.6300),
    "kabupaten tanggamus": (-5.3000, 104.6000),
    "kabupaten tasikmalaya": (-7.3500, 108.1000),
    "kabupaten tegal": (-6.9000, 109.1333),
    "kabupaten timor tengah utara": (-9.3000, 124.4000),
    "kabupaten toli-toli": (1.1000, 120.8000),
    "kabupaten tuban": (-6.9000, 112.0500),
    "kabupaten wakatobi": (-5.3000, 123.5000),
    "kota administrasi jakarta barat": (-6.1683, 106.7588),
    "kota administrasi jakarta pusat": (-6.1865, 106.8341),
    "kota administrasi jakarta selatan": (-6.2615, 106.8106),
    "kota administrasi jakarta timur": (-6.2250, 106.9004),
    "kota administrasi jakarta utara": (-6.1383, 106.8630),
    "kota ambon": (-3.6954, 128.1814),
    "kota balikpapan": (-1.2635, 116.8270),
    "kota bandar lampung": (-5.4500, 105.2667),
    "kota bandung": (-6.9175, 107.6191),
    "kota banjar": (-7.3667, 108.5333),
    "kota batam": (1.1300, 104.0500),
    "kota bekasi": (-6.2349, 106.9896),
    "kota blitar": (-8.1000, 112.1667),
    "kota bogor": (-6.5944, 106.7892),
    "kota bukittinggi": (-0.3000, 100.3667),
    "kota depok": (-6.4025, 106.7942),
    "kota dumai": (1.6667, 101.4500),
    "kota jambi": (-1.6101, 103.6131),
    "kota jayapura": (-2.5916, 140.6690),
    "kota kediri": (-7.8167, 112.0167),
    "kota kupang": (-10.1772, 123.6070),
    "kota magelang": (-7.4667, 110.2167),
    "kota makassar": (-5.1477, 119.4327),
    "kota malang": (-7.9839, 112.6214),
    "kota manado": (1.4748, 124.8421),
    "kota mataram": (-8.5833, 116.1167),
    "kota medan": (3.5952, 98.6722),
    "kota metro": (-5.1167, 105.3000),
    "kota mojokerto": (-7.4667, 112.4333),
    "kota palangka raya": (-2.2167, 113.9167),
    "kota palembang": (-2.9761, 104.7754),
    "kota palu": (-0.9000, 119.8667),
    "kota pasuruan": (-7.6500, 112.9000),
    "kota pekanbaru": (0.5071, 101.4478),
    "kota pontianak": (0.0000, 109.3333),
    "kota sabang": (5.8833, 95.3167),
    "kota semarang": (-7.0051, 110.4381),
    "kota serang": (-6.1200, 106.1500),
    "kota sorong": (-0.8762, 131.2558),
    "kota surabaya": (-7.2575, 112.7521),
    "kota surakarta": (-7.5667, 110.8167),
    "kota tangerang": (-6.1780, 106.6300),
    "kota tangerang selatan": (-6.2889, 106.7183),
    "kota tarakan": (3.3000, 117.6333),
    "kota tegal": (-6.8667, 109.1333),
    "kota tidore kepulauan": (0.6833, 127.4000),
    "kota yogyakarta": (-7.7971, 110.3688),
    "kongens lyngby": (55.7700, 12.5000),
    "kuala lumpur": (3.1390, 101.6869),
    "london": (51.5074, -0.1278),
    "luar negeri": (0.0, 0.0),
    "madrid": (40.4168, -3.7038),
    "makassar": (-5.1477, 119.4327),
    "manchester": (53.4808, -2.2426),
    "medan": (3.5952, 98.6722),
    "melbourne": (-37.8136, 144.9631),
    "milan": (45.4642, 9.1900),
    "nantes": (47.2184, -1.5536),
    "newcastle": (54.9783, -1.6178),
    "newcastle upon tyne": (54.9783, -1.6178),
    "nottingham": (52.9548, -1.1581),
    "oxford": (51.7520, -1.2577),
    "reading": (51.4543, -0.9781),
    "sheffield": (53.3811, -1.4701),
    "sidoarjo": (-7.4500, 112.7000),
    "solna (stockholm)": (59.3600, 18.0000),
    "southampton": (50.9097, -1.4044),
    "sukoharjo": (-7.6833, 110.8333),
    "surabaya": (-7.2575, 112.7521),
    "sydney": (-33.8688, 151.2093),
    "tangerang": (-6.1780, 106.6300),
    "tangerang selatan": (-6.2889, 106.7183),
    "tegal": (-6.8667, 109.1333),
    "toronto": (43.6532, -79.3832),
    "uppsala": (59.8586, 17.6389),
    "wageningen": (51.9692, 5.6654),
    "washington, dc": (38.9072, -77.0369),
    "yogyakarta": (-7.7971, 110.3688),
    "york": (53.9590, -1.0815),
}

def get_coords(city_name):
    key = city_name.strip().lower()
    if key in COORDS:
        return {"lat": COORDS[key][0], "lng": COORDS[key][1]}
    # Try fuzzy match without "kota administrasi" / "kabupaten" prefixes
    for prefix in ["kota administrasi ", "kota ", "kabupaten "]:
        if key.startswith(prefix):
            short = key[len(prefix):]
            if short in COORDS:
                return {"lat": COORDS[short][0], "lng": COORDS[short][1]}
    # Try adding "kota" prefix
    for prefix in ["", "kota ", "kabupaten "]:
        test = prefix + key
        if test in COORDS:
            return {"lat": COORDS[test][0], "lng": COORDS[test][1]}
    print(f"WARNING: Unknown city '{city_name}'")
    return {"lat": -6.2, "lng": 106.8}  # Default to Jakarta area

# Process CSV
members = []
with open("member_pk.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        dom = row["Kota/Kabupaten Domisili Saat Ini"].strip()
        tuj = row["Kota Tujuan Studi"].strip()
        members.append({
            "nama": row["Nama Lengkap"].strip(),
            "rumpun": row["Rumpun Studi"].strip(),
            "kelompok": row["Nama Kelompok"].strip(),
            "domisili": dom,
            "tujuan": tuj,
            "negara": row["Negara Tujuan Studi"].strip(),
            "univ": row["Universitas Tujuan Studi"].strip(),
            "origin": get_coords(dom),
            "dest": get_coords(tuj),
        })

# Build coords.json (deduplicated)
all_cities = {}
for m in members:
    for city, key in [(m["domisili"], "dom_" + m["domisili"].lower().replace(" ", "_")),
                      (m["tujuan"], "tuj_" + m["tujuan"].lower().replace(" ", "_"))]:
        if city.lower() not in all_cities:
            all_cities[city.lower()] = get_coords(city)

# Save files
os.makedirs("assets/demografi", exist_ok=True)
with open("assets/demografi/coords.json", "w") as f:
    json.dump(all_cities, f, indent=2)

with open("assets/demografi/members.json", "w") as f:
    json.dump(members, f, indent=2)

print(f"Processed {len(members)} members")
print(f"Unique cities: {len(all_cities)}")
print("Files saved to assets/demografi/")
