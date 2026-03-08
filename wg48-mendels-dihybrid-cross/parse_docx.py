import zipfile
import re

def get_docx_text(path):
    try:
        with zipfile.ZipFile(path) as docx:
            xml_content = docx.read('word/document.xml').decode('utf-8')
            # remove formatting tags
            text = re.sub('<[^>]+>', ' ', xml_content)
            # collapse spaces
            return re.sub(r'\s+', ' ', text).strip()
    except Exception as e:
        return str(e)

print(get_docx_text("ref_en_bio_10_wg48/Dihybrid Cross Combinations.docx"))
