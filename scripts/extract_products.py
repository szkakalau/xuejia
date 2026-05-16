#!/usr/bin/env python3
"""Extract brands and products from 古巴雪茄零售价.pptx into JSON + images."""

from __future__ import annotations

import json
import re
import shutil
import unicodedata
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
PPTX = ROOT / "古巴雪茄零售价.pptx"
OUT_BRANDS = ROOT / "data" / "brands.json"
OUT_PRODUCTS = ROOT / "data" / "products.json"
OUT_IMAGES = ROOT / "public" / "products"

NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
}

BRAND_SLIDES = {
    1: ("cohiba", "COHIBA", "高希霸"),
    13: ("trinidad", "TRINIDAD", "千里達"),
    17: ("bolivar", "BOLIVAR", "保利華"),
    20: ("combinaccion", "COMBINACCION", "組合"),
    22: ("h-upmann", "H.UPANN", "優民"),
    28: ("hoyo", "HOYO DE MONTERREY", "好友"),
    33: ("montecristo", "MONTECRISTO", "蒙特"),
    41: ("partagas", "PARTAGAS", "帕特加斯"),
    48: ("juan-lopez", "JUAN LOPEZ", "胡安洛佩斯"),
    51: ("ramon-allones", "RAMON ALLONES", "雷蒙阿隆尼"),
    54: ("romeo", "ROMEO Y JULIETA", "羅密歐"),
    63: ("san-cristobal", "SAN CRISTOBAL DE LA HABANA", "聖克里斯多"),
    65: ("davidoff", "Davidoff", "大衛杜夫"),
}


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text or "item"


def slide_num(path: str) -> int:
    m = re.search(r"slide(\d+)\.xml", path)
    return int(m.group(1)) if m else 0


def get_slide_texts(z: ZipFile, slide_path: str) -> list[str]:
    xml = z.read(slide_path).decode("utf-8")
    return [t.strip() for t in re.findall(r"<a:t[^>]*>([^<]*)</a:t>", xml) if t.strip()]


def get_slide_images(z: ZipFile, slide_path: str) -> list[str]:
    rel_path = slide_path.replace("slides/", "slides/_rels/").replace(".xml", ".xml.rels")
    if rel_path not in z.namelist():
        return []
    root = ET.fromstring(z.read(rel_path))
    images = []
    for rel in root.findall("rel:Relationship", NS):
        target = rel.get("Target", "")
        if "media/" in target:
            media = "ppt/" + target.lstrip("../")
            if media in z.namelist():
                images.append(media)
    return images


def parse_price(texts: list[str], start: int) -> tuple[int | None, bool, int]:
    """Return (price_hkd, in_stock, next_index)."""
    joined = " ".join(texts[start : start + 6])
    if re.search(r"暫時無貨|暂时无货", joined, re.I):
        return None, False, start + 1
    m = re.search(r"(\d[\d,]*)\s*(?:HKD|港币|港幣)", joined, re.I)
    if m:
        price = int(m.group(1).replace(",", ""))
        return price, True, start + 1
    # price might be split: '46000' then 'HKD'
    for j in range(start, min(start + 8, len(texts))):
        if re.match(r"^\d[\d,]+$", texts[j]):
            num = int(texts[j].replace(",", ""))
            rest = " ".join(texts[j : j + 3])
            if re.search(r"HKD|港币|港幣", rest, re.I) or num >= 500:
                if re.search(r"暫時無貨|暂时无货", rest, re.I):
                    return None, False, j + 1
                return num, True, j + 1
    return None, True, start + 1


def extract_product_block(texts: list[str], i: int, brand_id: str, brand_en: str, brand_zh: str) -> tuple[dict | None, int]:
    n = len(texts)
    if i >= n:
        return None, i + 1

    # Find 規格 marker
    spec_idx = None
    for j in range(i, min(i + 12, n)):
        if texts[j] in ("規格", "规格"):
            spec_idx = j
            break
    if spec_idx is None:
        return None, i + 1

    name_parts = [texts[k] for k in range(i, spec_idx) if texts[k] not in ("VIP",)]
    if not name_parts:
        return None, spec_idx + 1

    name_zh = "".join(name_parts[:3])
    name_en = ""
    for part in name_parts:
        if re.search(r"[A-Za-z]", part):
            name_en = part.strip()
            break
    if not name_en:
        name_en = " ".join(name_parts)

    # Parse specs after 規格
    packaging = ""
    length = ""
    ring_gauge: int | None = None
    k = spec_idx + 1
    while k < min(spec_idx + 15, n):
        if texts[k] in ("盒裝支數", "盒裝支數：", "盒装支数") or texts[k].startswith("盒裝"):
            k += 1
            pack_nums = []
            while k < n and texts[k] not in ("VIP", "客戶價", "客戶價：", "支裝", "支装"):
                if re.match(r"^\d+$", texts[k]):
                    pack_nums.append(texts[k])
                k += 1
            if pack_nums:
                packaging = f"{'/'.join(pack_nums)}支裝"
            continue
        if texts[k] in ("長", "长") and k + 1 < n:
            length = texts[k + 1].replace("*", "mm")
            k += 2
            continue
        if texts[k] in ("環", "环") and k + 1 < n:
            try:
                ring_gauge = int(re.sub(r"\D", "", texts[k + 1]))
            except ValueError:
                pass
            k += 2
            continue
        if texts[k] in ("VIP", "客戶價", "客戶價：", "支裝", "支装"):
            break
        k += 1

    # Find VIP price
    price_hkd = None
    in_stock = True
    for j in range(spec_idx, min(spec_idx + 25, n)):
        if "客戶價" in texts[j] or "客戶价" in texts[j] or texts[j] == "VIP":
            price_hkd, in_stock, _ = parse_price(texts, j + 1)
            if price_hkd is None and not in_stock:
                break
            if price_hkd is not None:
                break
        if re.search(r"暫時無貨|暂时无货", texts[j], re.I):
            in_stock = False
            price_hkd = None
            break
        m = re.search(r"(\d[\d,]*)\s*(?:HKD|港币)", texts[j], re.I)
        if m:
            price_hkd = int(m.group(1).replace(",", ""))
            in_stock = True
            break

    # Next block starts at next 規格 or end
    next_i = spec_idx + 1
    for j in range(spec_idx + 1, n):
        if texts[j] in ("規格", "规格") and j > spec_idx + 3:
            next_i = j - len([x for x in range(i, j) if texts[x] in ("規格", "规格")])
            # find start of this product's name - walk back from j
            next_i = j
            for back in range(j - 1, max(i, j - 8), -1):
                if texts[back] in ("支裝", "支装") or re.search(r"HKD|港币", texts[back], re.I):
                    continue
                if texts[back] not in ("VIP", "客戶價", "客戶價：", "環", "長", "盒裝支數", ":"):
                    next_i = back
                    break
            break
    else:
        next_i = n

    # Simpler next_i: find next 規格 after VIP block
    next_i = spec_idx + 1
    found_vip = False
    for j in range(spec_idx + 1, n):
        if "客戶價" in texts[j] or re.search(r"HKD|港币|暫時無貨|暂时无货", texts[j], re.I):
            found_vip = True
        if found_vip and texts[j] in ("規格", "规格") and j > spec_idx + 5:
            # name starts a few tokens before this 規格
            next_i = j
            for back in range(j - 1, max(i, j - 10), -1):
                if texts[back] not in ("VIP", "客戶價", "客戶價：", "支裝", "支装", "環", "長", ":") and not re.match(
                    r"^\d+$", texts[back]
                ):
                    if texts[back] not in ("規格", "规格", "盒裝支數", "盒裝支數："):
                        next_i = back
                        break
            break
    else:
        next_i = n

    display_name = name_en if name_en else name_zh
    slug_base = slugify(f"{brand_id}-{display_name}-{packaging}-{length}")
    product = {
        "id": slug_base,
        "brandId": brand_id,
        "brandName": brand_en,
        "brandNameZh": brand_zh,
        "name": display_name[:80],
        "nameZh": name_zh[:80],
        "specs": {
            "length": length,
            "ringGauge": ring_gauge,
            "packaging": packaging,
        },
        "priceHkd": price_hkd or 0,
        "priceDisplay": str(price_hkd) if price_hkd else "詢價",
        "inStock": in_stock and price_hkd is not None and price_hkd > 0,
        "image": f"/products/{slug_base}.jpg",
        "slug": slug_base,
    }
    return product, next_i if next_i > i else i + 1


def assign_brand_for_slide(slide_n: int) -> tuple[str, str, str] | None:
    sorted_brands = sorted(BRAND_SLIDES.items())
    current = None
    for slide_start, info in sorted_brands:
        if slide_n >= slide_start:
            current = info
        else:
            break
    return current


def main() -> None:
    if not PPTX.exists():
        raise SystemExit(f"PPTX not found: {PPTX}")

    OUT_IMAGES.mkdir(parents=True, exist_ok=True)
    for f in OUT_IMAGES.glob("*"):
        if f.is_file():
            f.unlink()

    brands = [
        {"id": bid, "name": en, "nameZh": zh, "slug": bid}
        for _, (bid, en, zh) in sorted(BRAND_SLIDES.items(), key=lambda x: x[0])
    ]

    products: list[dict] = []
    seen_slugs: set[str] = set()

    with ZipFile(PPTX) as z:
        slides = sorted(
            [n for n in z.namelist() if re.match(r"ppt/slides/slide\d+\.xml", n)],
            key=slide_num,
        )
        slide_images_map: dict[int, list[str]] = {}

        for slide_path in slides:
            sn = slide_num(slide_path)
            if sn in BRAND_SLIDES:
                continue
            brand_info = assign_brand_for_slide(sn)
            if not brand_info:
                continue
            brand_id, brand_en, brand_zh = brand_info
            texts = get_slide_texts(z, slide_path)
            images = get_slide_images(z, slide_path)
            slide_images_map[sn] = images

            i = 0
            slide_products: list[dict] = []
            while i < len(texts):
                if texts[i] in ("規格", "规格"):
                    i += 1
                    continue
                prod, next_i = extract_product_block(texts, i, brand_id, brand_en, brand_zh)
                if prod and prod["name"]:
                    slide_products.append(prod)
                if next_i <= i:
                    i += 1
                else:
                    i = next_i

            # Dedupe within slide and assign images
            for idx, prod in enumerate(slide_products):
                base_slug = prod["slug"]
                slug = base_slug
                c = 1
                while slug in seen_slugs:
                    slug = f"{base_slug}-{c}"
                    c += 1
                seen_slugs.add(slug)
                prod["slug"] = slug
                prod["id"] = slug

                if images:
                    img_media = images[min(idx, len(images) - 1)]
                    ext = Path(img_media).suffix or ".jpeg"
                    if ext == ".png":
                        out_name = f"{slug}.png"
                    else:
                        out_name = f"{slug}.jpg"
                    dest = OUT_IMAGES / out_name
                    with z.open(img_media) as src, open(dest, "wb") as dst:
                        shutil.copyfileobj(src, dst)
                    prod["image"] = f"/products/{out_name}"
                else:
                    prod["image"] = "/products/placeholder.jpg"

                products.append(prod)

    # Placeholder image
    placeholder = OUT_IMAGES / "placeholder.jpg"
    if not placeholder.exists() and products:
        first_img = next((Path(ROOT / "public" / "products" / Path(p["image"]).name) for p in products if p.get("image")), None)
        if first_img and first_img.exists():
            shutil.copy(first_img, placeholder)

    OUT_BRANDS.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_BRANDS, "w", encoding="utf-8") as f:
        json.dump(brands, f, ensure_ascii=False, indent=2)
    with open(OUT_PRODUCTS, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"Brands: {len(brands)}")
    print(f"Products: {len(products)}")
    print(f"Images dir: {OUT_IMAGES} ({len(list(OUT_IMAGES.glob('*')))} files)")


if __name__ == "__main__":
    main()
