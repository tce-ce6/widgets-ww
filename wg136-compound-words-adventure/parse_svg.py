import xml.etree.ElementTree as ET
import sys
import re

html_path = 'index.html'
with open(html_path, 'r') as f:
    text = f.read()

svg_start = text.find('<svg')
svg_end = text.find('</svg>') + 6
svg_text = text[svg_start:svg_end]

# Basic cleaning if needed
svg_text = re.sub(r'&\w+;', '', svg_text)
# Remove namespaces for easier parsing
svg_text = re.sub(r'xmlns(:\w+)?="[^"]+"', '', svg_text)

try:
    root = ET.fromstring(svg_text)
except Exception as e:
    print(f"Failed to parse inner svg: {e}")
    sys.exit(1)

# we just want to list the ids or data-names of the top level groups inside svg
print("Top-level group IDs and data-names:")
for el in root:
    if el.tag.endswith('g'):
        id_attr = el.attrib.get('id', '')
        data_name = el.attrib.get('data-name', '')
        print(f"Group: id='{id_attr}' data-name='{data_name}'")

        # Let's also look one level deeper for groups that might be the families or answers
        for child in el:
            if child.tag.endswith('g'):
                cid = child.attrib.get('id', '')
                cname = child.attrib.get('data-name', '')
                if cid or cname:
                    print(f"  Child Group: id='{cid}' data-name='{cname}'")
                    # Let's peek into child children
                    for gc in child:
                        if gc.tag.endswith('g'):
                            gcid = gc.attrib.get('id', '')
                            gcname = gc.attrib.get('data-name', '')
                            if gcid or gcname:
                                print(f"    Grandchild Group: id='{gcid}' data-name='{gcname}'")

