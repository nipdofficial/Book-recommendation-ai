import re
from typing import Iterable

STOP = set("""
a an the and or but if while is are was were be been being have has had do did does
of to in on for with from that this those these as by at into over after before about
""".split())

def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    toks = [t for t in text.split() if t and t not in STOP]
    return " ".join(toks)

def flatten_text(title: str, summary: str, genres: Iterable[str]) -> str:
    return f"{normalize(title)} {normalize(summary)} {' '.join(normalize(g) for g in genres)}"
