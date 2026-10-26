from html.parser import HTMLParser
from pathlib import Path
import unittest
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
class Document(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids, self.references, self.headings = [], [], []
        self.feed(source)
    def handle_starttag(self, tag, attributes):
        data = dict(attributes)
        if 'id' in data:
            self.ids.append(data['id'])
        if tag in ('script', 'img') and 'src' in data:
            self.references.append(data['src'])
        if tag in ('link', 'a') and 'href' in data:
            self.references.append(data['href'])
        if tag == 'h1':
            self.headings.append(tag)

class Site(unittest.TestCase):
    def setUp(self):
        self.source = (ROOT/'index.html').read_text()
        self.doc = Document(self.source)
    def test_unique_ids_and_main_heading(self):
        self.assertEqual(len(self.doc.ids), len(set(self.doc.ids)))
        self.assertEqual(len(self.doc.headings), 1)
    def test_local_references_exist(self):
        for reference in self.doc.references:
            url = urlsplit(reference)
            if url.scheme or url.netloc:
                continue
            if url.path:
                self.assertTrue((ROOT/url.path).is_file(), reference)
            elif url.fragment:
                self.assertIn(url.fragment, self.doc.ids)
    def test_no_external_runtime_dependencies(self):
        self.assertNotIn('src="https://', self.source)
        self.assertNotIn('href="https://fonts.', self.source)
        self.assertNotIn('@import', (ROOT/'assets/modern/site.css').read_text())
    def test_progressive_enhancement_and_metadata(self):
        self.assertIn('class="filters"', self.source)
        self.assertIn('aria-pressed="true"', self.source)
        self.assertIn('name="description"', self.source)
        self.assertIn('application/ld+json', self.source)
        self.assertNotIn('CV_ENG_Ares_Bortolussi.pdf', self.source)

if __name__ == '__main__':
    unittest.main()
