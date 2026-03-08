import re
with open("index.html") as f:
    text = f.read()

m = re.search(r'<g id="Stage2-_Card_1"(.+?)</g>\s*<g id="Stage2-_Card_2"', text, re.DOTALL)
if m:
    print(re.findall(r'<text.*?>\s*<tspan[^>]*>(.*?)</tspan>', m.group(1)))
