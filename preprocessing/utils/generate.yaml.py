from pathlib import Path
from class_registry import ALL_CLASSES


ROOT = Path(__file__).resolve().parents[1]

OUT = ROOT / "data_merged" / "data.yaml"

def main():
    lines = [
        "path: /kaggle/input/nutriplate-data-merged/data_merged",
        "",
        "train: images/train",
        "val: images/valid",
        "test: images/test",
        "",
        f"nc: {len(ALL_CLASSES)}",
        "names:",
    ]

    for c in ALL_CLASSES:
        lines.append(f"  - {c}")

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"✅ data.yaml dibuat ({len(ALL_CLASSES)} class)")
    print(f"📄 lokasi: {OUT}")

if __name__ == "__main__":
    main()
