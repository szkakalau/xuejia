import pathlib
import re

root = pathlib.Path(__file__).resolve().parent.parent / "src"
CLOSE_WRONG = "</" + "motion" + ">"
CLOSE_RIGHT = "</" + "motion"[:0] + "div" + ">"
OPEN_PATTERN = re.compile(r"<" + "motion" + r"(\s)")

for f in root.rglob("*.tsx"):
    t = f.read_text(encoding="utf-8")
    nt = t.replace(CLOSE_WRONG, CLOSE_RIGHT)
    nt = OPEN_PATTERN.sub("<div\\1", nt)
    if nt != t:
        f.write_text(nt, encoding="utf-8")
        print("fixed", f)
