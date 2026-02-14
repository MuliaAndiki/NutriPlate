from pathlib import Path
import shutil
from class_registry import CLASS_TO_INDEX

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
OUT_DIR = ROOT / "data_merged"

ORIGINAL_DATASET = "lasted"

VARIANT_DATASETS = {
    "bayam.v9i.yolov8": "bayam",
    "kentang goreng.v12i.yolov8": "kentang",
    "kol.v10i.yolov8": "kol",
    "sawi.v20i.yolov8": "sawi",
    "wortel.v29i.yolov8": "wortel",
    "Asam Keueng.v17i.yolov8": "asam keueng",
    "Eungkot Keumamah.v15i.yolov8": "eungkot keumamah",
    "kuah pliek u.v13i.yolov8": "kuah pliek u",
    "Sie Reuboh.v14i.yolov8": "sie reuboh",
}

IMG_EXT = {".jpg", ".jpeg", ".png", ".webp"}
SPLITS = ["train", "valid", "val", "test"]


def reset_out_dir():
    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)

    for s in ["train", "valid", "test"]:
        (OUT_DIR / "images" / s).mkdir(parents=True, exist_ok=True)
        (OUT_DIR / "labels" / s).mkdir(parents=True, exist_ok=True)

def normalize_label(path: Path, class_idx: int):
    lines = path.read_text().splitlines()
    out = []
    for l in lines:
        p = l.split()
        if len(p) >= 5:
            out.append(" ".join([str(class_idx)] + p[1:]))
    path.write_text("\n".join(out))


def merge_original():
    base = DATA_DIR / ORIGINAL_DATASET
    print(f"🔗 Merge original: {ORIGINAL_DATASET}")

    for split in ["train", "valid", "test"]:
        img_dir = base / "images" / split
        lbl_dir = base / "labels" / split

        if not img_dir.exists():
            continue

        for img in img_dir.iterdir():
            if img.suffix.lower() not in IMG_EXT:
                continue

            shutil.copy(img, OUT_DIR / "images" / split / img.name)

            lbl = lbl_dir / f"{img.stem}.txt"
            if lbl.exists():
                shutil.copy(lbl, OUT_DIR / "labels" / split / lbl.name)


def merge_variant(folder: str, class_name: str):
    base_idx = CLASS_TO_INDEX[class_name]
    dataset = DATA_DIR / folder

    print(f"➕ Merge {folder} → '{class_name}' ({base_idx})")

    for split in SPLITS:
        img_dir = dataset / split / "images"
        lbl_dir = dataset / split / "labels"

        if not img_dir.exists():
            continue

        out_split = "valid" if split == "val" else split

        for img in img_dir.iterdir():
            if img.suffix.lower() not in IMG_EXT:
                continue

            new_img = f"{class_name}_{img.name}"
            shutil.copy(img, OUT_DIR / "images" / out_split / new_img)

            lbl = lbl_dir / f"{img.stem}.txt"
            if lbl.exists():
                new_lbl = OUT_DIR / "labels" / out_split / f"{class_name}_{img.stem}.txt"
                shutil.copy(lbl, new_lbl)
                normalize_label(new_lbl, base_idx)


def main():
    print("🚀 MERGING DATASETS")
    reset_out_dir()
    merge_original()

    for folder, cls in VARIANT_DATASETS.items():
        merge_variant(folder, cls)

    print("✅ MERGE SELESAI → data_merged")

if __name__ == "__main__":
    main()
