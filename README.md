# آفريكونوميست | Africonomist

<p align="center">
  <strong>منصة الصحافة الاقتصادية والمالية الأفريقية الذكية</strong><br>
  <em>African Economic & Financial Intelligence Platform</em>
</p>

---

## 📌 عن المنصة (About Africonomist)

**آفريكونوميست (Africonomist)** هي منصة صحافة اقتصادية متطورة تغطي 54 دولة أفريقية، مبنية وفق أحدث معايير الأمان (Zero-Trust) والذكاء الاصطناعي متعدد الوكلاء (Multi-Agent Architecture) بإشراف المحررين البشريين (Human-in-the-Loop).

### 🛡️ المبادئ المعمارية الصارمة:
1. **الإنسان في الحلقة (Human-in-the-Loop):** أي مقال يولده وكيل الذكاء الاصطناعي يحمل افتراضياً حالة `pending_review`، ولا يُنشر إلا بعد مراجعة واعتماد المحرر البشري (`HUMAN_EDITOR`).
2. **إلزامية المصادر (Citations Mandatory):** كل مقال يتضمن مصادر موثقة وروابط مباشرة من البنوك المركزية وهيئات الإحصاء وصناديق التنمية.
3. **قاعدة البيانات MongoDB Atlas:** دعم البحث الدلالي (Vector Search) لتغذية وكلاء الذكاء الاصطناعي بسياق تاريخي دقيق (RAG).
4. **الوصول المشفر والصلاحيات (RBAC):** استخدام Firebase Custom Claims لحماية مسارات التحرير.

---

## 🚀 التثبيت والتشغيل المحلي (Quickstart)

```bash
# 1. استنساخ المستودع
git clone https://github.com/YOUR_USERNAME/africonomist.git
cd africonomist

# 2. تثبيت الحزم
npm install

# 3. إعداد متغيرات البيئة
cp .env.example .env.local

# 4. تشغيل خادم التطوير
npm run dev
```

---

## 📂 هيكلية المشروع (Project Architecture)

* `src/app/`: مسارات Next.js الحديثة (App Router) لصفحات المقالات والدول وبوابة التحرير.
* `src/components/`: مكونات الواجهة بتصميم اقتصادي رصين، بدون كبسولات، ومتوافق مع معايير النفاذية (WCAG 2.1).
* `src/lib/services/`: طبقة الاتصال بـ MongoDB Atlas واستدعاء Gemini ووكلاء الرصد.
* `src/types/`: مخططات التحقق الصارم عبر Zod و TypeScript.

---

## 📜 الترخيص
جميع الحقوق محفوظة © 2026 لمنصة آفرريكونوميست (Africonomist).
