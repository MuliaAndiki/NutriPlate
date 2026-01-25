from pathlib import Path
import yaml
import shutil

ROOT = Path(__file__).resolve().parents[1]     
DATA_DIR = ROOT / "data"
OUT_DIR = ROOT / "data_merged"

ORIGINAL_DATASET_NAME = "lasted"

BASE_CLASS_INDEX = {
    "ayam goreng": 1,
    "bakwan": 3,
    "telur" :22
}

VARIANT_DATASETS = {
    "ayamgoreng": "ayam goreng",
    "bakwan": "bakwan",
    "telur" : "telur"
}


def reset_out_dir():
    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)

    for split in ["train", "valid", "test"]:
        (OUT_DIR / "images" / split).mkdir(parents=True, exist_ok=True)
        (OUT_DIR / "labels" / split).mkdir(parents=True, exist_ok=True)

def merge_original_dataset():
    dataset_dir = DATA_DIR / ORIGINAL_DATASET_NAME
    if not dataset_dir.exists():
        raise RuntimeError(f"Original dataset not found: {dataset_dir}")

    print(f"🔗 Adding ORIGINAL dataset: {ORIGINAL_DATASET_NAME}")

    for split in ["train", "valid", "test"]:
        img_dir = dataset_dir / "images" / split
        lbl_dir = dataset_dir / "labels" / split

        if not img_dir.exists():
            continue

        for img in img_dir.glob("*.*"):
            shutil.copy(img, OUT_DIR / "images" / split / img.name)

            lbl = lbl_dir / f"{img.stem}.txt"
            if lbl.exists():
                shutil.copy(lbl, OUT_DIR / "labels" / split / lbl.name)


def normalize_labels(label_path: Path, index_map: dict[int, int]):
    lines = label_path.read_text().splitlines()
    new_lines = []

    for line in lines:
        parts = line.split()
        if not parts:
            continue
        cls = int(parts[0])
        new_cls = index_map.get(cls, cls)
        new_lines.append(" ".join([str(new_cls)] + parts[1:]))

    label_path.write_text("\n".join(new_lines))


def merge_variant_dataset(folder: str, base_name: str):
    dataset_dir = DATA_DIR / folder
    if not dataset_dir.exists():
        print(f"⚠️ Variant not found: {folder}")
        return

    print(f"🔧 Merging VARIANT: {folder} → {base_name}")
    base_index = BASE_CLASS_INDEX[base_name]

    data_yaml = yaml.safe_load((dataset_dir / "data.yaml").read_text())
    index_map = {i: base_index for i in range(len(data_yaml["names"]))}

    for split in ["train", "valid", "test"]:
        img_dir = dataset_dir / split / "images"
        lbl_dir = dataset_dir / split / "labels"
        if not img_dir.exists():
            continue

        for img in img_dir.glob("*.*"):
            new_img = OUT_DIR / "images" / split / f"{base_name}_{img.name}"
            shutil.copy(img, new_img)

            lbl = lbl_dir / f"{img.stem}.txt"
            if lbl.exists():
                new_lbl = OUT_DIR / "labels" / split / f"{base_name}_{img.stem}.txt"
                shutil.copy(lbl, new_lbl)
                normalize_labels(new_lbl, index_map)


def main():
    print(" MERGING DATASETS")
    reset_out_dir()

    merge_original_dataset()

    for folder, base in VARIANT_DATASETS.items():
        merge_variant_dataset(folder, base)

    print(" DONE: data_merged READY")


if __name__ == "__main__":
    main()
