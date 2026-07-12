/**
 * SESMine Structured Data Injector v5.0
 * Auto-detects page and injects correct JSON-LD schema
 * Covers: Organization, WebSite, SoftwareApp, BreadcrumbList, FAQPage, Product
 */
(function () {
  'use strict';

  const BASE     = 'https://www.sesmine.com';
  const LOGO_URL = 'https://cdn.grapesjs.com/workspaces/cmjdh0oo603xm12grpuiruk7p/assets/f6b95b3d-49d1-4e77-b952-49ed80c4befa__image-9-14-1404-ap-at-8.42-pm.png';
  const OG_IMAGE = BASE + '/assets/img/og-cover.jpg';
  const path     = window.location.pathname.replace(/\/$/, '') || '/';

  /* ── Schema Builders ── */

  const schemas = {

    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SESMine Intelligence',
      alternateName: 'SESMINE',
      url: BASE,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
        width: 320,
        height: 96
      },
      image: OG_IMAGE,
      description: 'AI-powered mining intelligence platform providing real-time commodity analytics, ESG tracking, predictive maintenance, and procurement intelligence for the global mining industry.',
      foundingDate: '2020',
      industry: 'Mining Intelligence & Industrial Analytics',
      sameAs: [
        'https://linkedin.com/company/sesmine',
        'https://twitter.com/sesmine',
        'https://github.com/KDMineGroup/SESMINE-Market-base'
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'support@sesmine.com',
          availableLanguage: ['English'],
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
            opens: '09:00',
            closes: '18:00'
          }
        },
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: 'hello@sesmine.com'
        }
      ]
    },

    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SESMine Intelligence',
      url: BASE,
      description: 'AI-powered mining intelligence platform',
      publisher: { '@type': 'Organization', name: 'SESMine Intelligence' },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: BASE + '/search?q={search_term_string}' },
        'query-input': 'required name=search_term_string'
      }
    },

    softwareApp: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SESMine Intelligence Platform',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'Mining Analytics',
      operatingSystem: 'Web Browser',
      url: BASE,
      image: LOGO_URL,
      description: 'AI-powered mining and industrial intelligence platform with real-time analytics, ESG tracking, and predictive tools.',
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '0',
        highPrice: '299',
        priceCurrency: 'USD',
        offerCount: 3
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        bestRating: '5',
        worstRating: '1',
        reviewCount: '312'
      },
      featureList: [
        'Real-time commodity price tracking',
        'AI-powered predictive maintenance',
        'ESG compliance monitoring',
        'Procurement intelligence',
        'Engineering specifications database',
        'Safety compliance tracking'
      ]
    },

    breadcrumb: function (items) {
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: BASE + item.url
        }))
      };
    },

    faqPage: function (faqs) {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      };
    }
  };

  /* ── Page-specific schema map ── */
  const PAGE_SCHEMAS = {
    '/': [schemas.organization, schemas.website, schemas.softwareApp],
    '/index.html': [schemas.organization, schemas.website, schemas.softwareApp],

    '/pricing.html': [
      schemas.organization,
      schemas.breadcrumb([{ name: 'Home', url: '/' }, { name: 'Pricing', url: '/pricing.html' }]),
      schemas.faqPage([
        { q: 'Is there a free trial?', a: 'Yes. All plans include a 14-day free trial with no credit card required.' },
        { q: 'Can I change my plan?', a: 'Yes, you can upgrade or downgrade at any time from your account settings.' },
        { q: 'What payment methods are accepted?', a: 'We accept all major credit cards, bank transfers, and enterprise invoicing.' },
        { q: 'Is there a discount for annual billing?', a: 'Yes. Annual billing saves up to 20% compared to monthly pricing.' }
      ])
    ],

    '/news.html': [
      schemas.organization,
      schemas.breadcrumb([{ name: 'Home', url: '/' }, { name: 'News', url: '/news.html' }])
    ],

    '/contact.html': [
      schemas.organization,
      schemas.breadcrumb([{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact.html' }]),
      schemas.faqPage([
        { q: 'How do I contact SESMine support?', a: 'Email support@sesmine.com or use the contact form. Response within 4 hours on business days.' },
        { q: 'Where is SESMine headquartered?', a: 'SESMine Intelligence operates globally with teams across North America, Europe, and the Asia-Pacific region.' }
      ])
    ],

    '/resources.html': [
      schemas.organization,
      schemas.breadcrumb([{ name: 'Home', url: '/' }, { name: 'Resources', url: '/resources.html' }])
    ],

    '/hubs/economics-hub.html': [
      schemas.organization,
      schemas.breadcrumb([{ name: 'Home', url: '/' }, { name: 'Hubs', url: '/hub-preview.html' }, { name: 'Economics', url: '/hubs/economics-hub.html' }])
    ],

    '/hubs/engineering-hub.html': [
      schemas.organization,
      schemas.breadcrumb([{ name: 'Home', url: '/' }, { name: 'Hubs', url: '/hub-preview.html' }, { name: 'Engineering', url: '/hubs/engineering-hub.html' }])
    ],

    '/hubs/innovation-hub.html': [
      schemas.organization,
      schemas.breadcrumb([{ name: 'Home', url: '/' }, { name: 'Hubs', url: '/hub-preview.html' }, { name: 'Innovation', url: '/hubs/innovation-hub.html' }])
    ],

    '/hubs/procurement-hub.html': [
      schemas.organization,
      schemas.breadcrumb([{ name: 'Home', url: '/' }, { name: 'Hubs', url: '/hub-preview.html' }, { name: 'Procurement', url: '/hubs/procurement-hub.html' }])
    ],

    '/hubs/safety-hub.html': [
      schemas.organization,
      schemas.breadcrumb([{ name: 'Home', url: '/' }, { name: 'Hubs', url: '/hub-preview.html' }, { name: 'Safety', url: '/hubs/safety-hub.html' }])
    ],

    '/hubs/sustainability-hub.html': [
      schemas.organization,
      schemas.breadcrumb([{ name: 'Home', url: '/' }, { name: 'Hubs', url: '/hub-preview.html' }, { name: 'Sustainability', url: '/hubs/sustainability-hub.html' }])
    ],

    '/products/ai-predictor.html': [
      schemas.organization,
      schemas.breadcrumb([{ name: 'Home', url: '/' }, { name: 'Products', url: '/products/' }, { name: 'AI Predictor', url: '/products/ai-predictor.html' }])
    ],

    '/products/cost-calculator.html': [
      schemas.organization,
      schemas.breadcrumb([{ name: 'Home', url: '/' }, { name: 'Products', url: '/products/' }, { name: 'Cost Calculator', url: '/products/cost-calculator.html' }])
    ],

    '/products/equipment-database.html': [
      schemas.organization,
      schemas.breadcrumb([{ name: 'Home', url: '/' }, { name: 'Products', url: '/products/' }, { name: 'Equipment Database', url: '/products/equipment-database.html' }])
    ]
  };

  /* ── Inject ── */
  function inject() {
    const list = PAGE_SCHEMAS[path] || [schemas.organization, schemas.website];
    list.forEach(schema => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(schema, null, 2);
      document.head.appendChild(s);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
