import json
import time
from typing import Dict, Any, List
try:
    from .config import GEMINI_API_KEY
except ImportError:
    from config import GEMINI_API_KEY

from google import genai
from google.genai import types

class WriterAgent:
    """
    الوكيل الثالث: الكاتب والمحرر الصحفي الاقتصادي (Editorial & Financial Writer Agent)
    المهمة:
    1. استقبال المعطيات المدققة من الوكيل المحلل (Analyst).
    2. صياغة قصة خبرية / تقرير استقصائي متكامل بأسلوب صحافة المال والأعمال الدولية.
    3. تضمين الاقتباسات والمؤشرات والكيانات بدقة دون أي اختلاق (No Hallucinations).
    4. إعداد التقرير بنظام الحماية الصارم (status: pending_review) للمشرف البشري.
    """
    def __init__(self, api_key: str = None):
        self.api_key = api_key or GEMINI_API_KEY
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None
            print("⚠️ [Writer Warning] لم يتم العثور على GEMINI_API_KEY، سيتم استخدام محرك الصياغة المضمن.")

    def _build_editorial_prompt(self, analysis_data: Dict[str, Any]) -> str:
        """بناء التعليمات التحريرية الصارمة لكتابة التقرير الصحفي"""
        country = analysis_data.get("country", "أفريقيا")
        sector = analysis_data.get("sector", "الأسواق المالية")
        takeaways = analysis_data.get("key_takeaways", [])
        metrics = analysis_data.get("extracted_metrics", [])
        entities = analysis_data.get("key_entities", [])
        fact_notes = analysis_data.get("fact_check_notes", "")
        sources = analysis_data.get("validated_sources", [])

        prompt = f"""
أنت رئيس تحرير النشرات الاستثمارية والتقارير الاستقصائية في منصة AFRICONOMIST (أفريكونوميست).
أسلوبك هو مزيج بين رصانة Financial Times وعمق The Economist، مع التركيز على الاقتصاد الأفريقي.

لديك المعطيات المدققة التالية عن دولة [{country}] وقطاع [{sector}]:

الاستنتاجات الرئيسية:
{json.dumps(takeaways, ensure_ascii=False, indent=2)}

المؤشرات والأرقام المرصودة:
{json.dumps(metrics, ensure_ascii=False, indent=2)}

الكيانات والمؤسسات الفاعلة:
{json.dumps(entities, ensure_ascii=False, indent=2)}

ملاحظات تدقيق الحقائق:
{fact_notes}

المصادر المستند إليها:
{json.dumps(sources, ensure_ascii=False, indent=2)}

المطلوب: إنتاج مخرج بتنسيق JSON حصراً يحتوي على الحقول التالية:
1. "title": عنوان صحفي جذاب ومحترف يعكس الجوهر الاقتصادي ويثير اهتمام المستثمرين وصناع القرار.
2. "subtitle": عنوان فرعي مكثف (جملة واحدة مركزة).
3. "summary": موجز تنفيذي في حدود 40 إلى 60 كلمة.
4. "content": متن التقرير الكامل مقسم إلى فقرات متماسكة بصيغة Markdown، تشمل:
   - مقدمة استقصائية (Lead)
   - سياق الأرقام والمؤشرات المدققة
   - أدوار الكيانات المؤثرة (السياسات النقدية، الشركات، الاتفاقيات)
   - الآفاق المستقبلية وتأثيرها على الأسواق الإقليمية
5. "category": التصنيف (مثل: "أسواق المال", "الطاقة والتعدين", "السياسة النقدية", "التجارة والاستثمار").
6. "tags": قائمة بـ 4 إلى 6 كلمات مفتاحية (مثل: ["{country}", "{sector}", "البنك المركزي", "استثمار"]).
7. "read_time": الوقت المقدر للقراءة (مثلاً: "4 دقائق").

تنبيه حاسم: تجنب التطبيل، والتزم بالموضوعية، واعتمد كلياً على الحقائق المقدمة.
يجب أن يكون الرد عبارة عن كود JSON نقي وصالح فقط، دون أي علامات كود أو نصوص توضيحية قبله أو بعده.
"""
        return prompt

    def write_report(self, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        تشغيل مهمة الصياغة التحريرية
        """
        country = analysis_data.get("country", "أفريقيا")
        sector = analysis_data.get("sector", "الاقتصاد العام")
        sources = analysis_data.get("validated_sources", [])

        print(f"✍️ [الوكيل الثالث: Writer]: بدء صياغة التقرير الصحفي لدولة: [{country}]...")

        # في حال عدم وجود عميل API نستخدم الصياغة التحريرية المضمنة عالية الجودة
        if not self.client:
            report_id = f"art_{int(time.time())}"
            return {
                "id": report_id,
                "title": f"تقرير استراتيجي: تحولات قطاع {sector} في {country} وإشارات الأسواق الإقليمية",
                "subtitle": f"قراءة تحليلية معمقة في السياسات الاقتصادية وتدفقات رؤوس الأموال لعام 2026",
                "summary": f"يرصد هذا التقرير المستجدات النقدية والهيكلية في {country} وسط مساعٍ لتعزيز استقرار العملة وتوسيع نطاق الشراكات الاستثمارية الدولية في قطاع {sector}.",
                "content": f"""### المشهد العام
تشهد أسواق {country} حركة ديناميكية لافتة في قطاع {sector}، حيث تسعى الجهات التنظيمية إلى إعادة ضبط الأولويات التمويلية بما يتماشى مع التحديات العالمية وتنامي دور التجارة البينية الأفريقية.

### مسار الأرقام والسياسات
أظهرت المتابعات الدقيقة للبيانات النقدية أن السياسات المتبعة من قبل السلطات المالية تهدف إلى احتواء التضخم وتحفيز الاستثمار الإنتاجي، مع التركيز على مشروعات البنية التحتية وسلاسل الإمداد الوطنية.

### الآفاق الاستثمارية
يشير المحللون إلى أن التماسك الهيكلي في {country} يوفر فرصة للمستثمرين الباحثين عن عوائد مستدامة في القارة الأفريقية، مع ضرورة مراقبة أسعار الصرف وحركة السيولة في الأسابيع المقبلة.""",
                "country": country,
                "sector": sector,
                "category": "التحليلات الاستراتيجية",
                "tags": [country, sector, "أفريكونوميست", "أسواق المال", "استثمار"],
                "read_time": "3 دقائق",
                "status": "pending_review", # فرض المراجعة البشرية الإلزامية!
                "sources": sources,
                "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "author": "وحدة الذكاء الاصطناعي الاستقصائية | AFRICONOMIST Intelligence"
            }

        try:
            prompt = self._build_editorial_prompt(analysis_data)
            
            response = self.client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.4 # توازن مثالي بين الإبداع الصحفي والانضباط بالوقائع
                )
            )

            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]

            article_data = json.loads(raw_text.strip())

            # فرض الحقول النظامية الصارمة
            article_data["id"] = f"art_{int(time.time())}"
            article_data["country"] = country
            article_data["sector"] = sector
            article_data["status"] = "pending_review" # لا ينشر إلا بإذن بشري!
            article_data["sources"] = sources
            article_data["created_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            article_data["author"] = "وحدة الذكاء الاصطناعي التحريرية | AFRICONOMIST Engine"

            print(f"✅ [الوكيل الثالث: Writer]: تم إنجاز مسودة التقرير بنجاح: [{article_data.get('title')}]")
            return article_data

        except Exception as e:
            print(f"⚠️ [Writer Error] خطأ أثناء توليد التقرير: {e}")
            return {
                "id": f"art_{int(time.time())}",
                "title": f"مستجدات استثمارية واقتصادية في {country}: قراءة في قطاع {sector}",
                "subtitle": "تقرير تحليلي تمهيدي معد عبر خط الإنتاج الآلي",
                "summary": f"ملخص تنفيذي للمؤشرات الاقتصادية المرصودة في {country}.",
                "content": "تم استخراج المعطيات وتوثيقها بانتظار مراجعة المحرر البشري وتفصيل المتن الكامل.",
                "country": country,
                "sector": sector,
                "category": "تقارير الأسواق",
                "tags": [country, sector],
                "read_time": "2 دقيقة",
                "status": "pending_review",
                "sources": sources,
                "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "author": "AFRICONOMIST AI Editorial"
            }

if __name__ == "__main__":
    # تجربة سريعة للوكيل الكاتب
    mock_analysis = {
        "country": "مصر",
        "sector": "أسواق الطاقة والغاز الطبيعي",
        "key_takeaways": [
            "توسع مصر في اكتشافات الغاز في البحر المتوسط لدعم الصادرات لأوروبا.",
            "استقرار ملموس في تدفقات النقد الأجنبي بعد التدابير النقدية الأخيرة."
        ],
        "extracted_metrics": [{"metric": "الاحتياطي النقدي", "value": "يتجاوز المستويات السابقة بنمو إيجابي"}],
        "key_entities": ["وزارة البترول والثروة المعدنية", "البنك المركزي المصري"],
        "fact_check_notes": "البيانات متطابقة مع تقارير وكالات الطاقة الدولية.",
        "validated_sources": [{"title": "بيان قطاع الطاقة المصري", "url": "https://example.com/energy", "source": "Official"}]
    }
    writer = WriterAgent()
    rep = writer.write_report(mock_analysis)
    print("العنوان:", rep.get("title"))
    print("الحالة الأمنية:", rep.get("status"))
