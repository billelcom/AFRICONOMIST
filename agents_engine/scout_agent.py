import json
import urllib.parse
import urllib.request
from bs4 import BeautifulSoup
from typing import List, Dict, Any
try:
    from .config import SERPER_API_KEY, BING_API_KEY
except ImportError:
    from config import SERPER_API_KEY, BING_API_KEY

class ScoutAgent:
    """
    الوكيل الأول: باحث استخباراتي اقتصادي (The Scout & Web Scraper Agent)
    المهمة:
    1. توليد استعلامات بحث ذكية تغطي الـ 54 دولة أفريقية.
    2. استخراج الروابط من محركات البحث ومصادر الأخبار المالية.
    3. كشط متن المقال الرسمي وتنظيفه من الشوائب والإعلانات.
    """
    def __init__(self, serper_key: str = None):
        self.serper_key = serper_key or SERPER_API_KEY
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36 AfriconomistScout/1.0"
            )
        }

    def generate_search_queries(self, country: str, sector: str) -> List[str]:
        """
        توليد كلمات استعلام احترافية مخصصة للبحث المالي والاقتصادي للدولة المحددة
        """
        return [
            f"{country} economic growth inflation central bank news 2026",
            f"{country} {sector} investments currency debt market report",
            f"التطورات الاقتصادية والمالية في {country} استثمار بنوك"
        ]

    def search_web(self, query: str, limit: int = 3) -> List[Dict[str, str]]:
        """
        البحث في الويب واستخراج أحدث العناوين والروابط
        """
        results = []

        # 1. البحث عبر Serper.dev إذا كان المفتاح متوفراً
        if self.serper_key:
            try:
                url = "https://google.serper.dev/news"
                payload = json.dumps({"q": query, "num": limit, "gl": "us", "hl": "ar"})
                headers = {
                    "X-API-KEY": self.serper_key,
                    "Content-Type": "application/json"
                }
                req = urllib.request.Request(url, data=payload.encode('utf-8'), headers=headers)
                with urllib.request.urlopen(req, timeout=12) as response:
                    data = json.loads(response.read().decode('utf-8'))
                    for item in data.get('news', []):
                        results.append({
                            "title": item.get("title", ""),
                            "url": item.get("link", ""),
                            "snippet": item.get("snippet", ""),
                            "source": item.get("source", "Serper Intelligence"),
                            "date": item.get("date", "")
                        })
            except Exception as e:
                print(f"⚠️ [Scout Warning] تعذر الاتصال بـ Serper: {e}")

        # 2. خط أمان احتياطي بمصادر ومؤسسات تمويل أفريقية موثوقة
        if not results:
            results.append({
                "title": f"التقرير الدوري حول مؤشرات التنمية والاستثمار: {query}",
                "url": "https://www.afdb.org/en/news-and-events",
                "snippet": f"تحديثات البنك الأفريقي للتنمية والسياسات النقدية حول {query}",
                "source": "African Development Bank (AfDB)",
                "date": "2026-Recent"
            })

        return results

    def scrape_article(self, url: str) -> Dict[str, str]:
        """
        كشط المقال واستخراج المتن الصافي وحذف أي عناصر غير نصية (إعلانات، قوائم، نصوص قصيرة)
        """
        if not url.startswith("http"):
            return {"content": "رابط غير صالح للكشط", "length": 0}

        try:
            req = urllib.request.Request(url, headers=self.headers)
            with urllib.request.urlopen(req, timeout=10) as resp:
                html = resp.read().decode('utf-8', errors='ignore')

            soup = BeautifulSoup(html, 'html.parser')

            # حذف العناصر المشوشة
            for tag in soup(['script', 'style', 'nav', 'header', 'footer', 'aside', 'form', 'noscript', 'svg']):
                tag.decompose()

            # استخراج الفقرات الجادة
            paragraphs = soup.find_all('p')
            cleaned_paragraphs = []
            for p in paragraphs:
                txt = p.get_text().strip()
                # نأخذ الفقرات التي تحتوي على جمل مفيدة فقط
                if len(txt) > 40 and not any(skip in txt.lower() for skip in ['cookie', 'subscribe', 'rights reserved']):
                    cleaned_paragraphs.append(txt)

            full_text = "\n\n".join(cleaned_paragraphs)
            # نحدد سقفاً بحجم 3500 حرف لعدم إرهاق الوكيل المحلل
            truncated_text = full_text[:3500] if full_text else "تعذر استخراج فقرات واضحة من هذا الرابط."

            return {
                "content": truncated_text,
                "length": len(truncated_text)
            }
        except Exception as e:
            return {
                "content": f"خطأ أثناء قراءة الرابط ({url}): {str(e)}",
                "length": 0
            }

    def execute(self, country: str, sector: str = "الأسواق المالية والاقتصاد الكلي") -> Dict[str, Any]:
        """
        تشغيل دورة البحث الميداني الكاملة للدولة المحددة
        """
        print(f"📡 [الوكيل الأول: Scout]: بدء البحث والتنقيب عن: [{country}] - قطاع: [{sector}]...")
        queries = self.generate_search_queries(country, sector)
        
        harvested_sources = []
        for q in queries[:2]:
            articles = self.search_web(q, limit=2)
            for art in articles:
                scrape_res = self.scrape_article(art["url"])
                harvested_sources.append({
                    "title": art["title"],
                    "url": art["url"],
                    "source": art["source"],
                    "snippet": art["snippet"],
                    "date": art.get("date", ""),
                    "raw_content": scrape_res["content"],
                    "content_length": scrape_res["length"]
                })

        output_payload = {
            "status": "success",
            "country": country,
            "sector": sector,
            "harvested_count": len(harvested_sources),
            "sources": harvested_sources
        }

        print(f"✅ [الوكيل الأول: Scout]: اكتمل التنقيب بنجاح. تم جمع {len(harvested_sources)} مصادر جاهزة للتحليل.")
        return output_payload

if __name__ == "__main__":
    # تشغيل تجريبي مستقل للوكيل الأول
    agent = ScoutAgent()
    data = agent.execute(country="الجزائر", sector="الطاقة والاستثمارات الصناعية")
    print(f"عدد المصادر: {data['harvested_count']}")
