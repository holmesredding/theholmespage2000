#!/usr/bin/env python3

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
POSTS_DIR = ROOT / "posts"
OUTPUT_PATH = ROOT / "reviews.json"

METADATA_RE = re.compile(r"^\s*<!--\s*\n(.*?)\n-->\s*", re.DOTALL)
TITLE_RE = re.compile(r"^#\s+(.+)$", re.MULTILINE)
IMAGE_RE = re.compile(r"^!\[[^\]]*\]\(([^)]+)\)", re.MULTILINE)
SATISFACTION_RE = re.compile(
    r'<span class="scale-label">Satisfaction</span>.*?width:\s*(\d+)%', re.DOTALL
)


@dataclass
class Review:
    title: str
    file: str
    date: str
    dateDisplay: str
    excerpt: str
    satisfaction: int
    tags: list[str]
    image: str | None


def parse_metadata(markdown: str) -> dict[str, str]:
    match = METADATA_RE.match(markdown)
    if not match:
        return {}

    metadata: dict[str, str] = {}
    for raw_line in match.group(1).splitlines():
        line = raw_line.strip()
        if not line or ":" not in line:
            continue
        key, value = line.split(":", 1)
        metadata[key.strip()] = value.strip()
    return metadata


def remove_metadata(markdown: str) -> str:
    return METADATA_RE.sub("", markdown, count=1)


def parse_title(markdown: str) -> str:
    match = TITLE_RE.search(markdown)
    if not match:
        raise ValueError("Missing H1 title")
    return match.group(1).strip()


def parse_image_path(markdown: str, md_path: Path) -> str | None:
    match = IMAGE_RE.search(markdown)
    if not match:
        return None
    image_path = (md_path.parent / match.group(1).strip()).resolve()
    return image_path.relative_to(ROOT).as_posix()


def parse_excerpt(markdown: str) -> str:
    blocks = re.split(r"\n\s*\n", markdown)
    for block in blocks:
        text = " ".join(line.strip() for line in block.splitlines()).strip()
        if not text:
            continue
        if text.startswith("# "):
            continue
        if text.startswith("*") and "Review*" in text:
            continue
        if text == "---":
            continue
        if text.startswith("!["):
            continue
        if text.startswith("<div") or text.startswith("<p ") or text.startswith("<span "):
            continue
        return text
    raise ValueError("Missing review excerpt paragraph")


def parse_satisfaction(markdown: str) -> int:
    match = SATISFACTION_RE.search(markdown)
    if not match:
        raise ValueError("Missing Satisfaction scale value")
    return int(match.group(1))


def parse_tags(raw_tags: str | None) -> list[str]:
    if not raw_tags:
        raise ValueError("Missing tags metadata")
    tags = [tag.strip() for tag in raw_tags.split(",") if tag.strip()]
    if not tags:
        raise ValueError("Tags metadata is empty")
    return tags


def format_date_display(raw_date: str) -> str:
    parsed = date.fromisoformat(raw_date)
    return f"{parsed.day} {parsed.strftime('%B %Y')}"


def parse_review(md_path: Path) -> Review | None:
    markdown = md_path.read_text(encoding="utf-8")
    metadata = parse_metadata(markdown)
    if not metadata.get("date"):
        return None

    body = remove_metadata(markdown)
    return Review(
        title=parse_title(body),
        file=md_path.relative_to(ROOT).as_posix(),
        date=metadata["date"],
        dateDisplay=format_date_display(metadata["date"]),
        excerpt=parse_excerpt(body),
        satisfaction=parse_satisfaction(body),
        tags=parse_tags(metadata.get("tags")),
        image=parse_image_path(body, md_path),
    )


def main() -> None:
    reviews: list[Review] = []
    for md_path in sorted(POSTS_DIR.glob("*.md")):
        review = parse_review(md_path)
        if review is not None:
            reviews.append(review)

    reviews.sort(key=lambda review: (review.date, review.title), reverse=True)
    OUTPUT_PATH.write_text(
        json.dumps([review.__dict__ for review in reviews], indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
