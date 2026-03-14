from __future__ import annotations

import argparse
import random
import shutil
from pathlib import Path
from typing import Dict, List

IMG_EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
SPLITS = ["train", "valid", "test", "val"]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Downsample YOLO dataset by class caps to reduce bias."
    )
    parser.add_argument("--data", type=Path, required=True, help="Input dataset root")
    parser.add_argument("--out", type=Path, required=True, help="Output dataset root")
    parser.add_argument(
        "--max-per-class",
        type=int,
        default=2000,
        help="Max instances per class in TRAIN split (default 2000)",
    )
    parser.add_argument(
        "--seed", type=int, default=42, help="Random seed for reproducible sampling"
    )
    parser.add_argument(
        "--keep-val-test",
        action="store_true",
        help="Keep val/test intact (default true).",
    )
    return parser.parse_args()


def load_names(yaml_path: Path) -> List[str]:
    names: List[str] = []
    for line in yaml_path.read_text(encoding="utf-8").splitlines():
        if line.strip().startswith("- "):
            names.append(line.strip()[2:])
    return names


def read_label(path: Path) -> List[int]:
    if not path.exists():
        return []
    ids = []
    for line in path.read_text().splitlines():
        parts = line.split()
        if len(parts) < 5:
            continue
        try:
            ids.append(int(float(parts[0])))
        except ValueError:
            continue
    return ids


def iter_images(img_dir: Path):
    if not img_dir.exists():
        return []
    return [p for p in img_dir.iterdir() if p.is_file() and p.suffix.lower() in IMG_EXT]


def main() -> None:
    args = parse_args()
    random.seed(args.seed)

    yaml_path = args.data / "data.yaml"
    if not yaml_path.exists():
        raise FileNotFoundError(f"data.yaml not found in {args.data}")

    names = load_names(yaml_path)
    n_classes = len(names)

    if args.out.exists():
        shutil.rmtree(args.out)
    (args.out / "images").mkdir(parents=True, exist_ok=True)
    (args.out / "labels").mkdir(parents=True, exist_ok=True)

    # Copy val/test unchanged by default
    for split in ["valid", "test", "val"]:
        src_img = args.data / "images" / split
        src_lbl = args.data / "labels" / split
        if not src_img.exists():
            continue
        out_split = "valid" if split == "val" else split
        dst_img = args.out / "images" / out_split
        dst_lbl = args.out / "labels" / out_split
        dst_img.mkdir(parents=True, exist_ok=True)
        dst_lbl.mkdir(parents=True, exist_ok=True)

        for img in iter_images(src_img):
            lbl = src_lbl / f"{img.stem}.txt"
            shutil.copy2(img, dst_img / img.name)
            if lbl.exists():
                shutil.copy2(lbl, dst_lbl / lbl.name)

    # Train split downsample
    train_img = args.data / "images" / "train"
    train_lbl = args.data / "labels" / "train"
    out_train_img = args.out / "images" / "train"
    out_train_lbl = args.out / "labels" / "train"
    out_train_img.mkdir(parents=True, exist_ok=True)
    out_train_lbl.mkdir(parents=True, exist_ok=True)

    # First pass: collect per-class image list
    per_class: Dict[int, List[Path]] = {i: [] for i in range(n_classes)}
    all_images = iter_images(train_img)
    for img in all_images:
        lbl = train_lbl / f"{img.stem}.txt"
        cls_ids = read_label(lbl)
        for cid in set(cls_ids):
            if 0 <= cid < n_classes:
                per_class[cid].append(img)

    # Determine keep set
    keep_images = set()
    for cid, imgs in per_class.items():
        if len(imgs) <= args.max_per_class:
            keep_images.update(imgs)
        else:
            keep_images.update(random.sample(imgs, args.max_per_class))

    # Copy kept images + labels
    for img in keep_images:
        lbl = train_lbl / f"{img.stem}.txt"
        shutil.copy2(img, out_train_img / img.name)
        if lbl.exists():
            shutil.copy2(lbl, out_train_lbl / lbl.name)

    # Write data.yaml (path same format)
    lines = [
        "path: /kaggle/input/nutriplate-data-merged/data_merged",
        "",
        "train: images/train",
        "val: images/valid",
        "test: images/test",
        "",
        f"nc: {n_classes}",
        "names:",
    ]
    lines.extend([f"  - {n}" for n in names])
    (args.out / "data.yaml").write_text("\n".join(lines) + "\n", encoding="utf-8")

    print("Downsample complete")
    print("Output:", args.out)
    print("Max per class:", args.max_per_class)
    print("Kept train images:", len(keep_images))


if __name__ == "__main__":
    main()
