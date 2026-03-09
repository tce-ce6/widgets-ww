import re
with open("buttons_temp.xml", "r") as f:
    text = f.read()
    matches = re.findall(r'<g\s+id="([^"]+)"', text)
    print("\n".join(matches))
