import time
import random
from typing import Dict, Any, List
from pymongo import MongoClient

try:
    from .config import MONGODB_URI, MONGODB_DB_NAME
    from .scout_agent import ScoutAgent
    from .analyst_agent import AnalystAgent
    from .writer_agent import WriterAgent
except ImportError:
    from config import MONGODB_URI, MONGODB_DB_NAME
    from scout_agent import ScoutAgent
    from analyst_agent import AnalystAgent
    from writer_agent import WriterAgent

# قائمة تمثيلية للدول الأفريقية وأبرز قطاعاتها لتدوير خط الإنتاج ليلاً ونهاراً
AFRICAN_COUNTRIES_TARGETS = [
    {"country": "مصر", "sector": "أسواق الطاقة والغاز وتدفقات الاستثمار الأجنبي"},
    {"country": "الجزائر", "sector": "الطاقة والغاز الطبيعي والشراكات الصناعية"},
    {"country": "المغرب", "sector": "صناعة السيارات والطاقات المتجددة وصادرات الفوسفات"},
    {"country": "نيجيريا", "sector": "إنتاج النفط واستقرار العملة والتقنية المالية Fintech"},
    {"country": "جنوب أفريقيا", "sector": "أسواق المعادن والتعدين وسندات الخزانة"},
    {"country": "كينيا", "sector": "الخدمات المصرفية الرقمية وتجارة المنتجات الزراعية"},
    {"country": "غانا", "sector": "تصدير الذهب والكاكاو وإعادة هيكلة الديون السيادية"},
    {"country": "تونس", "sector": "السياسات المالية وتنشيط قطاع الصناعات التصديرية"},
    {"country": "إثيوبيا", "sector": "التصنيع وتحديث البنية التحتية والاتصالات"},
    {"country": "رواندا", "sector": "الابتكار الرقمي ومراكز الخدمات المالية الدولية"}
]

class NewsroomPipeline:
    """
    المنسق المركزي لخط إنتاج غرفة الأخبار الذكية في AFRICONOMIST
    """
    def __init__(self):
        print("🚀 [Pipeline] تهيئة منسق خط إنتاج الوكلاء الذكي...")
        self.scout = ScoutAgent()
        self.analyst = AnalystAgent()
        self.writer = WriterAgent()
        
        # إعداد الاتصال بقاعدة بيانات MongoDB Atlas
        self.db = None
        if MONGODB_URI:
            try:
                client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
                self.db = client[MONGODB_DB_NAME]
                print(f"📦 [Pipeline] تم الاتصال بقاعدة بيانات MongoDB Atlas: [{MONGODB_DB_NAME}]")
            except Exception as e:
                print(f"⚠️ [Pipeline Warning] تعذر الاتصال بـ MongoDB: {e}")
        else:
            print("ℹ️ [Pipeline] لم يتم تحديد MONGODB_URI. سيتم حفظ المخرجات محلياً.")

    def run_single_cycle(self, country: str = None, sector: str = None) -> Dict[str, Any]:
        """
        تشغيل دورة إنتاجية كاملة لمقال واحد:
        1. البحث والكشط (Scout)
        2. التحليل والتدقيق (Analyst)
        3. الصياغة الصحفية (Writer)
        4. التخزين في MongoDB بحالة pending_review
        """
        if not country or not sector:
            target = random.choice(AFRICAN_COUNTRIES_TARGETS)
            country = target["country"]
            sector = target["sector"]

        print(f"\n=======================================================")
        print(f"🔄 [دورة إنتاج جديدة] الدولة: {country} | القطاع: {sector}")
        print(f"=======================================================")

        # المرحلة 1: البحث والكشط
        scout_result = self.scout.execute(country=country, sector=sector)

        # المرحلة 2: التحليل وتدقيق الحقائق
        analysis_result = self.analyst.analyze(scout_result)

        # المرحلة 3: الصياغة التحريرية الصحفية
        final_article = self.writer.write_report(analysis_result)

        # المرحلة 4: الحفظ في MongoDB Atlas بحالة pending_review
        if self.db is not None:
            try:
                collection = self.db["articles"]
                # التحقق من عدم تكرار المعرف
                collection.update_one(
                    {"id": final_article["id"]},
                    {"$set": final_article},
                    upsert=True
                )
                print(f"💾 [Pipeline] تم حفظ التقرير في MongoDB Atlas بنجاح! الحالة: [pending_review]")
            except Exception as e:
                print(f"⚠️ [Pipeline Error] خطأ أثناء الحفظ في MongoDB: {e}")

        print(f"🎉 [دورة مكتملة] تم إرسال التقرير للمشرف البشري: {final_article.get('title')}\n")
        return final_article

    def start_autonomous_loop(self, interval_seconds: int = 1800):
        """
        تشغيل الوكلاء ليلاً ونهاراً بشكل ذاتي ومستمر
        الفاصل الافتراضي: 1800 ثانية (كل نصف ساعة تقرير جديد لدولة مختلفة)
        """
        print(f"🌟 [Autopilot] بدء العمل المستمر لخط الوكلاء ليلاً ونهاراً كل {interval_seconds // 60} دقيقة...")
        
        while True:
            try:
                self.run_single_cycle()
                print(f"⏳ [Autopilot] في انتظار الدورة القادمة بعد {interval_seconds} ثانية...")
                time.sleep(interval_seconds)
            except KeyboardInterrupt:
                print("\n🛑 تم إيقاف المحرك الآلي بواسطة المستخدم.")
                break
            except Exception as e:
                print(f"⚠️ خطأ غير متوقع في الدورة الآلية: {e}. إعادة المحاولة بعد دقيقة واحدة...")
                time.sleep(60)

if __name__ == "__main__":
    import sys
    pipeline = NewsroomPipeline()

    # إذا تم تمرير المعامل --loop يعمل بشكل دائم ليلاً ونهاراً
    if len(sys.argv) > 1 and sys.argv[1] == "--loop":
        pipeline.start_autonomous_loop(interval_seconds=1800)
    else:
        # تشغيل دورة تجريبية واحدة فوراً
        pipeline.run_single_cycle(country="الجزائر", sector="مشروعات الطاقة الشمسية وصادرات الغاز")
