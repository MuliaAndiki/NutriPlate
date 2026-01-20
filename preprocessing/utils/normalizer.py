
from pathlib import Path

MAP = {
     "tempe": "tempe",
    "tempe bacem": "tempe",
    "tempe bakar": "tempe",
    "tempe mendoan": "tempe",
    "tempe kecap": "tempe",
    "tempe oreg": "tempe",
    "tempe sambal": "tempe",
    "tempe tumis": "tempe",
    "tempe semur": "tempe",
    "tempe kuah santan": "tempe",

    "tahu": "tahu",
    "tahu balado": "tahu",
    "tahu kecap": "tahu",
    "tahu isi": "tahu",
    "tahu kuning": "tahu",
    "tahu rebus": "tahu",
    "tahu tauco": "tahu",

    "udang": "udang",
    "udang kecap": "udang",
    "udang sambal": "udang",
    "udang goreng tepung": "udang",
    "udang bakar": "udang",
    "udang asam manis": "udang",
    "udang tumis": "udang",
}
LABEL_MAP = {
    name: 0  
    for name in MAP.values()
}

def normalize_label_file(label_path):
    lines = label_path.read_text().splitlines()
    new_lines = []

    for line in lines:
        cls, *rest = line.split()
        cls = int(cls)
        new_cls = TARGET_CLASS_INDEX  
        new_lines.append(f"{new_cls} {' '.join(rest)}")

    label_path.write_text("\n".join(new_lines))

