from __future__ import annotations

import argparse
import ast
import shutil
from pathlib import Path

IMG_EXT = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
SPLIT_ALIASES = {"train": "train", "valid": "valid", "val": "valid", "test": "test"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Merge multiple YOLO datasets and generate a single data.yaml."
    )
    parser.add_argument(
        "--input-root",
        type=Path,
        default=Path("preprocessing/data/newDatas"),
        help="Folder root dataset sumber.",
    )
    parser.add_argument(
        "--output-root",
        type=Path,
        default=Path("preprocessing/data_merged"),
        help="Folder output hasil merge.",
    )
    parser.add_argument(
        "--yaml-path",
        default="/kaggle/input/nutriplate-data-merged/data_merged",
        help="Nilai path di data.yaml output.",
    )
    parser.add_argument(
        "--force-nc",
        type=int,
        default=None,
        help="Paksa jumlah class. Jika diisi lebih besar dari class real, akan ditambah placeholder.",
    )
    return parser.parse_args()


def normalize_name(name: str) -> str:
    return " ".join(name.strip().lower().split())


def parse_names_from_yaml(yaml_path: Path) -> list[str]:
    lines = yaml_path.read_text(encoding="utf-8").splitlines()
    names: list[str] = []

    for i, line in enumerate(lines):
        stripped = line.strip()
        if not stripped.startswith("names:"):
            continue

        rhs = stripped.split(":", 1)[1].strip()
        if rhs.startswith("["):
            values = ast.literal_eval(rhs)
            return [str(v) for v in values]

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

    raise ValueError(f"'names' tidak ditemukan pada {yaml_path}")


def collect_datasets(input_root: Path) -> list[Path]:
    datasets: list[Path] = []
    for yaml_path in sorted(input_root.rglob("data.yaml")):
        dataset_dir = yaml_path.parent
        has_split = any((dataset_dir / s / "images").exists() for s in SPLIT_ALIASES)
        if has_split:
            datasets.append(dataset_dir)
    return datasets


def reset_output(output_root: Path) -> None:
    if output_root.exists():
        shutil.rmtree(output_root)
    for split in ("train", "valid", "test"):
        (output_root / "images" / split).mkdir(parents=True, exist_ok=True)
        (output_root / "labels" / split).mkdir(parents=True, exist_ok=True)


def remap_label_file(src_label: Path, dst_label: Path, mapping: dict[int, int]) -> None:
    out_lines: list[str] = []
    for raw in src_label.read_text(encoding="utf-8").splitlines():
        parts = raw.split()
        if len(parts) < 5:
            continue
        src_idx = int(parts[0])
        if src_idx not in mapping:
            continue
        parts[0] = str(mapping[src_idx])
        out_lines.append(" ".join(parts))
    dst_label.write_text("\n".join(out_lines), encoding="utf-8")


def append_placeholder_classes(global_names: list[str], target_nc: int) -> None:
    idx = len(global_names)
    while len(global_names) < target_nc:
        candidate = f"placeholder_class_{idx}"
        while candidate in global_names:
            idx += 1
            candidate = f"placeholder_class_{idx}"
        global_names.append(candidate)
        idx += 1


def main() -> None:
    args = parse_args()
    input_root = args.input_root.resolve()
    output_root = args.output_root.resolve()

    datasets = collect_datasets(input_root)
    if not datasets:
        raise FileNotFoundError(f"Tidak ada dataset valid di {input_root}")

    reset_output(output_root)

    global_names: list[str] = []
    global_index: dict[str, int] = {}
    copied_images = 0

    print(f"Input root : {input_root}")
    print(f"Output root: {output_root}")
    print(f"Datasets   : {len(datasets)}")

    for dataset_dir in datasets:
        data_yaml = dataset_dir / "data.yaml"
        dataset_names = parse_names_from_yaml(data_yaml)
        if not dataset_names:
            print(f"[SKIP] {dataset_dir.name}: names kosong.")
            continue

        local_to_global: dict[int, int] = {}
        for i, name in enumerate(dataset_names):
            key = normalize_name(name)
            if key not in global_index:
                global_index[key] = len(global_names)
                global_names.append(key)
            local_to_global[i] = global_index[key]

        dataset_tag = normalize_name(dataset_dir.name).replace(" ", "_").replace(".", "_")
        print(f"[MERGE] {dataset_dir.name}")

        for split_dir_name, out_split in SPLIT_ALIASES.items():
            img_dir = dataset_dir / split_dir_name / "images"
            lbl_dir = dataset_dir / split_dir_name / "labels"
            if not img_dir.exists():
                continue

            for img_path in sorted(img_dir.iterdir()):
                if not img_path.is_file() or img_path.suffix.lower() not in IMG_EXT:
                    continue

                new_stem = f"{dataset_tag}__{img_path.stem}"
                out_img = output_root / "images" / out_split / f"{new_stem}{img_path.suffix.lower()}"
                out_lbl = output_root / "labels" / out_split / f"{new_stem}.txt"
                unique_idx = 1
                while out_img.exists() or out_lbl.exists():
                    out_img = output_root / "images" / out_split / f"{new_stem}_{unique_idx}{img_path.suffix.lower()}"
                    out_lbl = output_root / "labels" / out_split / f"{new_stem}_{unique_idx}.txt"
                    unique_idx += 1

                shutil.copy2(img_path, out_img)

                src_lbl = lbl_dir / f"{img_path.stem}.txt"
                if src_lbl.exists():
                    remap_label_file(src_lbl, out_lbl, local_to_global)
                else:
                    out_lbl.write_text("", encoding="utf-8")

                copied_images += 1

    if args.force_nc is not None:
        if args.force_nc < len(global_names):
            raise ValueError(
                f"force-nc ({args.force_nc}) lebih kecil dari class terdeteksi ({len(global_names)})."
            )
        append_placeholder_classes(global_names, args.force_nc)

    if len(global_names) != len(set(global_names)):
        raise ValueError("Terdapat duplikat nama class setelah proses merge.")

    data_yaml_out = output_root / "data.yaml"
    lines = [
        f"path: {args.yaml_path}",
        "",
        "train: images/train",
        "val: images/valid",
        "test: images/test",
        "",
        f"nc: {len(global_names)}",
        "names:",
    ]
    lines.extend([f"  - {name}" for name in global_names])
    data_yaml_out.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"✅ Merge selesai, total gambar: {copied_images}")
    print(f"✅ data.yaml: {data_yaml_out}")
    print(f"✅ total class: {len(global_names)}")


if __name__ == "__main__":
    main()
