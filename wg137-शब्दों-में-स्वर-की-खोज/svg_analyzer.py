import xml.etree.ElementTree as ET
from urllib.request import urlopen
import re

html_path = '/Users/tce_admin/projects/widgets/widgets-ww/wg136-compound-words-adventure/index.html'
with open(html_path, 'r') as f:
    text = f.read()

# Since the file is HTML5 and might not be perfectly well-formed XML,
# we need to extract just the <svg> block.
svg_start = text.find('<svg')
svg_end = text.find('</svg>') + 6
svg_text = text[svg_start:svg_end]

# Clean up SVG to make it parseable if there are issues
svg_text = re.sub(r'&\w+;', '', svg_text)

try:
    root = ET.fromstring(svg_text)
except Exception as e:
    print(f"Failed to parse: {e}")
    exit(1)

# Namespace handling
ns = {'svg': 'http://www.w3.org/2000/svg'}
# Note: ElementTree prepends namespace like {http://www.w3.org/2000/svg} to tags

def un_ns(tag):
    return tag.split('}')[-1]

families = ['sun', 'rain', 'snow', 'fire', 'sea', 'sand']

positions = [
    (516.5, 212.11), # 0
    (278.5, 336.11), # 1
    (277.5, 567.11), # 2
    (516.5, 694.11), # 3
    (755.5, 567.11), # 4
    (754.5, 336.11)  # 5
]

# We need to find the <g id="..._family_assets">
output = {}

for family in families:
    fam_id = f"{family}_family_assets"
    fam_node = None
    for el in root.iter():
        if el.attrib.get('id') == fam_id:
            fam_node = el
            break
    
    if not fam_node:
        print(f"Could not find {fam_id}")
        continue
    
    # Iterate immediate children.
    # Group them by which position they belong to.
    # Each child <g> might contain a <rect> or paths. We can just serialize the child to string to find keywords.
    # Actually, we can just look for the first path's d attribute or total path length!
    slot_signatures = {0: "", 1: "", 2: "", 3: "", 4: "", 5: ""}
    
    for child in fam_node:
        # serialize to string
        child_str = ET.tostring(child, encoding='unicode')
        
        # Check where this group is located
        # We look for path d="M..." or rect x="..."
        # Since Adobe XD exports groups centered around their content, 
        # let's just find the first "x=" or "d=" and approximate.
        # Even better: the rectangles are exactly at positions above!
        matched_slot = -1
        for i, (px, py) in enumerate(positions):
            # Check if this group is the background rect itself or contains the artwork close to it
            # The artwork paths typically start near the position.
            # We can use regex to find x="..." y="..." OR d="M{x},{y}...
            
            # Since the groups don't have explicit bounding box info in the XML without rendering,
            # Let's just find x= and y= values
            coords = re.findall(r'x="([\d\.]+)" y="([\d\.]+)"', child_str)
            if coords:
                x, y = map(float, coords[0])
                if abs(x - px) < 100 and abs(y - py) < 100:
                    matched_slot = i
                    break
            else:
                # Find first M x,y in path
                paths = re.findall(r'd="M\s*([\d\.-]+)\s*,\s*([\d\.-]+)', child_str)
                if paths:
                    x, y = map(float, paths[0])
                    # center of slot is px+100, py+100
                    cx = px + 100
                    cy = py + 100
                    if abs(x - cx) < 150 and abs(y - cy) < 150:
                        matched_slot = i
                        break
                        
        if matched_slot != -1:
            # Append path data length to signature to identify the artwork uniquely
            paths = re.findall(r'd="([^"]+)"', child_str)
            for d in paths:
                # Simple hash: length of path data + first 10 chars
                slot_signatures[matched_slot] += f"{len(d)}-{d[:10]}|"
        else:
            # Might be the central image
            pass
            
    output[family] = slot_signatures

print(output)

# Now cross reference distractors
# SUN distractors: bow, shell
# SUN correct: flower, light, glasses, screen
# RAIN correct: bow, coat, drop, storm
# RAIN distractors: flower, ball
# SEA correct: shell, food, horse, weed
# SEA distractors: fly, glasses

# Let's print out the exact overlaps
seen = {}
for fam, slots in output.items():
    for slot, sig in slots.items():
        if len(sig) > 0:
            if sig not in seen:
                seen[sig] = []
            seen[sig].append((fam, slot))

for sig, occurs in seen.items():
    if len(occurs) > 1:
        print(f"Overlap found: {occurs}")
