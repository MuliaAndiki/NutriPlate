from __future__ import annotations

import argparse
import ast
import shutil
from pathlib import Path
from typing import Dict, List, Tuple

IMG_EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
SPLITS = ["train", "valid", "test", "val"]

# Target class list exactly as requested (underscored names)
TARGET_CLASSES = [
    "nasi_putih",
    "mie_goreng",
    "bakso",
    "bakwan",
    "bihun",
    "capcay",
    "gado_gado",
    "ikan",
    "kerupuk",
    "martabak_telur",
    "nasi_goreng",
    "nugget",
    "opor_ayam",
    "pempek",
    "rendang",
    "roti",
    "sate",
    "sosis",
    "tahu",
    "telur",
    "tempe",
    "tumis_kangkung",
    "udang",
    "kentang",
    "apel",
    "pisang",
    "stroberi",
    "kiwi",
    "terong_balado",
    "sayur_sop",
    "donat",
    "asam_keueng",
    "keumamah",
    "kuah_pliek_u",
    "sie_reuboh",
]

# Aliases for collapsing specific variants into target classes
ALIASES = {
    "ikan goreng": "ikan",
    "ikan bakar": "ikan",
    "telur ceplok": "telur",
    "telur dadar": "telur",
    "telur rebus": "telur",
    "tempe goreng": "tempe",
    "tahu goreng": "tahu",
    "kentang goreng": "kentang",
    "kentang rebus": "kentang",
    "roti tawar": "roti",
    "rendang sapi": "rendang",
    "eungkot keumamah": "keumamah",
    "keumamah": "keumamah",
}


def normalize(name: str) -> str:
    # normalize underscores and hyphens to spaces
    return " ".join(name.strip().lower().replace("_", " ").replace("-", " ").split())


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


def build_mapping(source_names: List[str], target_names: List[str]) -> Dict[int, int]:
    target_index = {normalize(n): i for i, n in enumerate(target_names)}
    mapping: Dict[int, int] = {}

    for i, name in enumerate(source_names):
        key = normalize(name)
        if key in target_index:
            mapping[i] = target_index[key]
            continue
        if key in ALIASES:
            alias_key = normalize(ALIASES[key])
            if alias_key in target_index:
                mapping[i] = target_index[alias_key]

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
    remap: Dict[int, int],
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
        "path: /kaggle/input/nutriplate-data-merged/data_merged",
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
    parser.add_argument("--base", type=Path, required=True, help="Dataset base (data_merged)")
    parser.add_argument("--extra", type=Path, required=True, help="Dataset extra (lastedV2)")
    parser.add_argument("--output", type=Path, required=True, help="Output folder merged")
    parser.add_argument("--keep-empty", action="store_true", help="Keep images with no mapped labels")
    args = parser.parse_args()

    base_yaml = args.base / "data.yaml"
    extra_yaml = args.extra / "data.yaml"

    if not base_yaml.exists() or not extra_yaml.exists():
        raise FileNotFoundError("data.yaml tidak ditemukan di base/extra")

    base_names = parse_names_from_yaml(base_yaml)
    extra_names = parse_names_from_yaml(extra_yaml)

    base_mapping = build_mapping(base_names, TARGET_CLASSES)
    extra_mapping = build_mapping(extra_names, TARGET_CLASSES)

    if args.output.exists():
        shutil.rmtree(args.output)
    (args.output / "images").mkdir(parents=True, exist_ok=True)
    (args.output / "labels").mkdir(parents=True, exist_ok=True)

    base_counts = copy_dataset(args.base, args.output, "base", base_mapping, args.keep_empty)
    extra_counts = copy_dataset(args.extra, args.output, "extra", extra_mapping, args.keep_empty)

    write_output_yaml(args.output, TARGET_CLASSES)

    print("=== MERGE DONE ===")
    print("Target classes:", len(TARGET_CLASSES))
    print("Base copied:", base_counts)
    print("Extra copied:", extra_counts)
    print("Output:", args.output)
    print("Note: unmapped classes are dropped")


if __name__ == "__main__":
    main()
