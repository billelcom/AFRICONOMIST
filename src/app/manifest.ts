import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'لافريكونوميست | L’AFRICONOMIST',
    short_name: 'لافريكونوميست',
    description: 'الصحيفة الاقتصادية الإفريقية الرائدة: رصد تحليلي واستقصائي لاقتصادات وأسواق مال 54 دولة إفريقية.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    theme_color: '#070A12',
    background_color: '#080C14',
    categories: ['business', 'finance', 'news'],
    lang: 'ar',
    dir: 'rtl',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'غرفة الأخبار والرقابة',
        short_name: 'غرفة الأخبار',
        description: 'متابعة تقارير الذكاء الاصطناعي والمصادقة التحريرية',
        url: '/?tab=editorial',
        icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
      },
      {
        name: 'أسواق المال الإفريقية',
        short_name: 'الأسواق',
        description: 'مؤشرات البورصات والسندات السيادية والعملات',
        url: '/?tab=home&section=markets',
        icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
      },
      {
        name: 'التقارير الاستقصائية',
        short_name: 'استقصاء',
        description: 'تحقيقات معمقة في الطاقة والتعدين والتجارة',
        url: '/?tab=home&section=investigations',
        icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
      }
    ]
  };
}
