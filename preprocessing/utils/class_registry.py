BASE_CLASSES = [
    "ayam bakar",
    "ayam goreng",
    "bakso",
    "bakwan",
    "bihun",
    "capcay",
    "gado-gado",
    "ikan goreng",
    "kerupuk",
    "martabak telur",
    "mie",
    "nasi goreng",
    "nasi putih",
    "nugget",
    "opor ayam",
    "pempek",
    "rendang",
    "roti",
    "sate",
    "sosis",
    "soto",
    "tahu",
    "telur",
    "tempe",
    "tumis kangkung",
    "udang",
]

NEW_CLASSES = [
    "bayam",
    "kentang",
    "kol",
    "sawi",
    "wortel",
    "asam keueng",
    "eungkot keumamah",
    "kuah pliek u",
    "sie reuboh",
]

ALL_CLASSES = BASE_CLASSES + NEW_CLASSES

CLASS_TO_INDEX = {name: i for i, name in enumerate(ALL_CLASSES)}
