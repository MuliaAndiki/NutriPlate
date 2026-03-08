from __future__ import annotations

import argparse
import random
import shutil
from pathlib import Path

IMG_EXT = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
SPLITS = ("train", "valid", "test")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Split YOLO datasets into train/valid/test."
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=Path("preprocessing/data/notSplit"),
        help="Folder yang berisi banyak dataset YOLO (default: preprocessing/data/notSplit).",
    )
    parser.add_argument(
        "--source-split",
        default="train",
        help="Nama folder split sumber yang berisi data belum dibagi (default: train).",
    )
    parser.add_argument(
        "--train-ratio",
        type=float,
        default=0.8,
        help="Rasio train (default: 0.8).",
    )
    parser.add_argument(
        "--valid-ratio",
        type=float,
        default=0.1,
        help="Rasio valid (default: 0.1).",
    )
    parser.add_argument(
        "--test-ratio",
        type=float,
        default=0.1,
        help="Rasio test (default: 0.1).",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Seed random agar hasil split konsisten (default: 42).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Hanya tampilkan rencana split tanpa menyalin file.",
    )
    return parser.parse_args()


def validate_ratios(train_ratio: float, valid_ratio: float, test_ratio: float) -> None:
    total = train_ratio + valid_ratio + test_ratio
    if abs(total - 1.0) > 1e-8:
        raise ValueError(
            f"Jumlah rasio harus 1.0, sekarang {total:.6f}. "
            "Contoh benar: 0.8 0.1 0.1"
        )
    for value, name in (
        (train_ratio, "train"),
        (valid_ratio, "valid"),
        (test_ratio, "test"),
    ):
        if value < 0:
            raise ValueError(f"Rasio {name} tidak boleh negatif.")


def list_images(images_dir: Path) -> list[Path]:
    return sorted(
        [p for p in images_dir.iterdir() if p.is_file() and p.suffix.lower() in IMG_EXT]
    )


def split_items(
    items: list[Path],
    train_ratio: float,
    valid_ratio: float,
    rng: random.Random,
) -> dict[str, list[Path]]:
    shuffled = items[:]
    rng.shuffle(shuffled)

    total = len(shuffled)
    train_count = int(total * train_ratio)
    valid_count = int(total * valid_ratio)
    test_count = total - train_count - valid_count

    train_items = shuffled[:train_count]
    valid_items = shuffled[train_count : train_count + valid_count]
    test_items = shuffled[train_count + valid_count : train_count + valid_count + test_count]

    return {"train": train_items, "valid": valid_items, "test": test_items}


def update_data_yaml(data_yaml: Path) -> None:
    lines = data_yaml.read_text(encoding="utf-8").splitlines()
    out: list[str] = []

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("train:"):
            out.append("train: ../train/images")
        elif stripped.startswith("val:") or stripped.startswith("valid:"):
            out.append("val: ../valid/images")
        elif stripped.startswith("test:"):
            out.append("test: ../test/images")
        else:
            out.append(line)

    data_yaml.write_text("\n".join(out) + "\n", encoding="utf-8")


def copy_split(
    dataset_dir: Path,
    source_images: Path,
    source_labels: Path,
    split_map: dict[str, list[Path]],
    dry_run: bool,
) -> None:
    tmp_root = dataset_dir / ".split_tmp"

    if not dry_run:
        if tmp_root.exists():
            shutil.rmtree(tmp_root)

        for split in SPLITS:
            (tmp_root / split / "images").mkdir(parents=True, exist_ok=True)
            (tmp_root / split / "labels").mkdir(parents=True, exist_ok=True)

        for split, images in split_map.items():
            for img in images:
                dst_img = tmp_root / split / "images" / img.name
                shutil.copy2(img, dst_img)

                lbl = source_labels / f"{img.stem}.txt"
                if lbl.exists():
                    dst_lbl = tmp_root / split / "labels" / lbl.name
                    shutil.copy2(lbl, dst_lbl)

        for split in SPLITS:
            target_split = dataset_dir / split
            if target_split.exists():
                shutil.rmtree(target_split)
            shutil.move(str(tmp_root / split), str(target_split))

        shutil.rmtree(tmp_root, ignore_errors=True)


def process_dataset(
    dataset_dir: Path,
    source_split: str,
    train_ratio: float,
    valid_ratio: float,
    seed: int,
    dry_run: bool,
) -> None:
    data_yaml = dataset_dir / "data.yaml"
    source_images = dataset_dir / source_split / "images"
    source_labels = dataset_dir / source_split / "labels"

    if not data_yaml.exists():
        print(f"[SKIP] {dataset_dir.name}: data.yaml tidak ditemukan.")
        return

    if not source_images.exists():
        print(f"[SKIP] {dataset_dir.name}: folder {source_images} tidak ditemukan.")
        return

    images = list_images(source_images)
    if not images:
        print(f"[SKIP] {dataset_dir.name}: tidak ada file gambar di {source_images}.")
        return

    rng = random.Random(seed)
    split_map = split_items(images, train_ratio, valid_ratio, rng)

    print(
        f"[OK] {dataset_dir.name}: total={len(images)} "
        f"train={len(split_map['train'])} valid={len(split_map['valid'])} test={len(split_map['test'])}"
    )

    copy_split(dataset_dir, source_images, source_labels, split_map, dry_run=dry_run)

    if not dry_run:
        update_data_yaml(data_yaml)


def main() -> None:
    args = parse_args()
    validate_ratios(args.train_ratio, args.valid_ratio, args.test_ratio)

    root = args.root.resolve()
    if not root.exists():
        raise FileNotFoundError(f"Folder root tidak ditemukan: {root}")

    dataset_dirs = sorted([d for d in root.iterdir() if d.is_dir()])
    if not dataset_dirs:
        print(f"Tidak ada dataset folder di: {root}")
        return

    print(f"Root dataset: {root}")
    print(
        f"Rasio split: train={args.train_ratio}, valid={args.valid_ratio}, test={args.test_ratio}, seed={args.seed}"
    )
    if args.dry_run:
        print("Mode: DRY RUN (tanpa menulis file)")

    for dataset_dir in dataset_dirs:
        process_dataset(
            dataset_dir=dataset_dir,
            source_split=args.source_split,
            train_ratio=args.train_ratio,
            valid_ratio=args.valid_ratio,
            seed=args.seed,
            dry_run=args.dry_run,
        )


if __name__ == "__main__":
    main()
