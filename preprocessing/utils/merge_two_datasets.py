from __future__ import annotations

import argparse
import ast
import json
import shutil
from pathlib import Path
from typing import Dict, List, Tuple

IMG_EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
SPLITS = ["train", "valid", "test", "val"]

DEFAULT_SYNONYMS = {
    # aman (nama dish sama, hanya variasi penamaan)
    "eungkot keumamah": "keumamah",
}


def parse_names_from_yaml(yaml_path: Path) -> List[str]:
    lines = yaml_path.read_text(encoding="utf-8").splitlines()
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("names:"):
            rhs = stripped.split(":", 1)[1].strip()
            if rhs.startswith("["):
                return [str(x) for x in ast.literal_eval(rhs)]
            names = []
            j = i + 1
            while j < len(lines):
                cur = lines[j].strip()
                if not cur:
                    j += 1
                    continue
                if cur.startswith("- "):
                    names.append(cur[2:].strip())
                    j += 1
                    continue
                break
            return names
    raise ValueError(f"names tidak ditemukan di {yaml_path}")


def normalize(name: str) -> str:
    return " ".join(name.strip().lower().split())


def build_mapping(
    source_names: List[str],
    target_names: List[str],
    extra_map: Dict[str, str],
) -> Dict[int, int]:
    target_index = {normalize(n): i for i, n in enumerate(target_names)}
    mapping: Dict[int, int] = {}

    for i, name in enumerate(source_names):
        key = normalize(name)
        if key in target_index:
            mapping[i] = target_index[key]
            continue
        if key in extra_map:
            mapped_name = normalize(extra_map[key])
            if mapped_name in target_index:
                mapping[i] = target_index[mapped_name]

    return mapping


def remap_label_lines(lines: List[str], mapping: Dict[int, int]) -> Tuple[List[str], int]:
    out = []
    dropped = 0
    for line in lines:
        parts = line.split()
        if len(parts) < 5:
            dropped += 1
            continue
        try:
            src_idx = int(float(parts[0]))
        except ValueError:
            dropped += 1
            continue
        if src_idx not in mapping:
            dropped += 1
            continue
        parts[0] = str(mapping[src_idx])
        out.append(" ".join(parts))
    return out, dropped


def iter_images(split_dir: Path):
    if not split_dir.exists():
        return []
    return [p for p in split_dir.iterdir() if p.is_file() and p.suffix.lower() in IMG_EXT]


def copy_dataset(
    dataset_dir: Path,
    out_dir: Path,
    tag: str,
    remap: Dict[int, int] | None,
    keep_empty: bool,
) -> Dict[str, int]:
    counts = {"images": 0, "labels_dropped": 0, "images_skipped": 0}

    for split in SPLITS:
        src_img = dataset_dir / "images" / split
        src_lbl = dataset_dir / "labels" / split
        if not src_img.exists():
            continue
        out_split = "valid" if split == "val" else split
        dst_img = out_dir / "images" / out_split
        dst_lbl = out_dir / "labels" / out_split
        dst_img.mkdir(parents=True, exist_ok=True)
        dst_lbl.mkdir(parents=True, exist_ok=True)

        for img in iter_images(src_img):
            label_path = src_lbl / f"{img.stem}.txt"
            label_lines = label_path.read_text().splitlines() if label_path.exists() else []

            if remap is not None:
                label_lines, dropped = remap_label_lines(label_lines, remap)
                counts["labels_dropped"] += dropped
                if not label_lines and not keep_empty:
                    counts["images_skipped"] += 1
                    continue

            new_stem = f"{tag}__{img.stem}"
            out_img = dst_img / f"{new_stem}{img.suffix.lower()}"
            out_lbl = dst_lbl / f"{new_stem}.txt"

            # avoid name collisions
            idx = 1
            while out_img.exists() or out_lbl.exists():
                out_img = dst_img / f"{new_stem}_{idx}{img.suffix.lower()}"
                out_lbl = dst_lbl / f"{new_stem}_{idx}.txt"
                idx += 1

            shutil.copy2(img, out_img)
            out_lbl.write_text("\n".join(label_lines), encoding="utf-8")
            counts["images"] += 1

    return counts


def write_output_yaml(out_dir: Path, target_names: List[str]) -> None:
    lines = [
        f"path: {out_dir}",
        "",
        "train: images/train",
        "val: images/valid",
        "test: images/test",
        "",
        f"nc: {len(target_names)}",
        "names:",
    ]
    lines.extend([f"  - {n}" for n in target_names])
    (out_dir / "data.yaml").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", type=Path, required=True, help="Dataset target (class list dipakai)")
    parser.add_argument("--extra", type=Path, required=True, help="Dataset tambahan yang akan di-merge")
    parser.add_argument("--output", type=Path, required=True, help="Output folder merged")
    parser.add_argument("--map", type=Path, default=None, help="JSON mapping source->target class")
    parser.add_argument("--keep-empty", action="store_true", help="Keep images with no mapped labels")
    args = parser.parse_args()

    base_yaml = args.base / "data.yaml"
    extra_yaml = args.extra / "data.yaml"

    if not base_yaml.exists() or not extra_yaml.exists():
        raise FileNotFoundError("data.yaml tidak ditemukan di base/extra")

    target_names = parse_names_from_yaml(base_yaml)
    source_names = parse_names_from_yaml(extra_yaml)

    extra_map = DEFAULT_SYNONYMS.copy()
    if args.map and args.map.exists():
        extra_map.update({normalize(k): v for k, v in json.loads(args.map.read_text()).items()})

    remap = build_mapping(source_names, target_names, extra_map)

    if args.output.exists():
        shutil.rmtree(args.output)
    (args.output / "images").mkdir(parents=True, exist_ok=True)
    (args.output / "labels").mkdir(parents=True, exist_ok=True)

    base_counts = copy_dataset(args.base, args.output, "base", None, args.keep_empty)
    extra_counts = copy_dataset(args.extra, args.output, "extra", remap, args.keep_empty)

    write_output_yaml(args.output, target_names)

    print("=== MERGE DONE ===")
    print("Base copied:", base_counts)
    print("Extra copied:", extra_counts)
    print("Output:", args.output)
    print("Mapping used (source index -> target index):", remap)
    print("Note: unmapped classes from extra dataset are dropped")


if __name__ == "__main__":
    main()
