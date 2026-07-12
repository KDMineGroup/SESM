/**
 * SESMine Meta Tag Auto-Injector v5.0
 * Injects per-page SEO meta, OG, Twitter Card, canonical
 * Uses real logo from CDN
 */
(function () {
  'use strict';

  const BASE  = 'https://www.sesmine.com';
  const LOGO  = 'https://cdn.grapesjs.com/workspaces/cmjdh0oo603xm12grpuiruk7p/assets/f6b95b3d-49d1-4e77-b952-49ed80c4befa__image-9-14-1404-ap-at-8.42-pm.png';
  const OG    = BASE + '/assets/img/og-cover.jpg'; // 1200×630 social card
  const path  = window.location.pathname.replace(/\/$/, '') || '/';

  /* ── Page Definitions ── */
  const PAGES = {
    '/': {
      title: 'SESMine Intelligence | AI-Powered Mining & Industrial Analytics Platform',
      desc:  'Real-time commodity intelligence, ESG tracking, predictive analytics, and procurement tools for the global mining industry. Trusted by 2,400+ companies.',
      kw:    'mining intelligence platform, commodity analytics, ESG tracking, predictive maintenance, industrial AI',
      type:  'website',
    },
    '/index.html': {
      title: 'SESMine Intelligence | AI-Powered Mining & Industrial Analytics Platform',
      desc:  'Real-time commodity intelligence, ESG tracking, predictive analytics, and procurement tools for the global mining industry. Trusted by 2,400+ companies.',
      kw:    'mining intelligence platform, commodity analytics, ESG tracking, predictive maintenance, industrial AI',
      type:  'website',
    },
    '/pricing.html': {
      title: 'Pricing — SESMine Intelligence Platform',
      desc:  'Transparent, flexible pricing for every team. Start free for 14 days. Explorer, Professional, and Enterprise tiers available.',
      kw:    'sesmine pricing, mining analytics subscription, industrial intelligence cost',
      type:  'website',
    },
    '/news.html': {
      title: 'Mining Industry News & Intelligence — SESMine',
      desc:  'Breaking news, commodity market updates, ESG milestones, and technology breakthroughs from the global mining sector. 340+ articles monthly.',
      kw:    'mining news, commodity market news, ESG mining, mining technology news',
      type:  'website',
    },
    '/contact.html': {
      title: 'Contact SESMine — Support & Sales Enquiries',
      desc:  'Get in touch with the SESMine team for platform support, enterprise sales, partnership opportunities, and media enquiries.',
      kw:    'sesmine contact, mining platform support, sesmine sales',
      type:  'website',
    },
    '/resources.html': {
      title: 'Resources & Knowledge Centre — SESMine Intelligence',
      desc:  'Whitepapers, case studies, webinars, and interactive tools for mining professionals. Data-driven guides for every discipline.',
      kw:    'mining whitepapers, mining case studies, ESG resources, mining data guides',
      type:  'website',
    },
    '/hub-preview.html': {
      title: 'Hub Preview — SESMine Intelligence Platform',
      desc:  'Explore SESMine\'s six specialized intelligence hubs: Economics, Engineering, Innovation, Procurement, Safety, and Sustainability.',
      kw:    'mining intelligence hubs, sesmine hubs, industrial analytics hubs',
      type:  'website',
    },
    '/hubs/economics-hub.html': {
      title: 'Economics Hub — Commodity Pricing & Market Forecasting | SESMine',
      desc:  'Real-time commodity prices, inflation trend analysis, financial forecasting, and market intelligence for mining and industrial sectors.',
      kw:    'mining commodity prices, copper price forecast, gold market analysis, mining economics',
      type:  'website',
    },
    '/hubs/engineering-hub.html': {
      title: 'Engineering Hub — Technical Specs & CAD Resources | SESMine',
      desc:  'Engineering best practices, technical specifications, CAD resources, and equipment standards for mining operations.',
      kw:    'mining engineering, CAD resources, equipment specifications, mining technical data',
      type:  'website',
    },
    '/hubs/innovation-hub.html': {
      title: 'Innovation Hub — Mining Technology & Automation | SESMine',
      desc:  'Emerging technologies, R&D projects, automation advancements, and digital transformation insights for the mining industry.',
      kw:    'mining automation, mining technology, mining AI, digital mining transformation',
      type:  'website',
    },
    '/hubs/procurement-hub.html': {
      title: 'Procurement Hub — Supply Chain & Vendor Intelligence | SESMine',
      desc:  'Supply chain management, vendor databases, strategic sourcing tools, and procurement analytics for industrial operations.',
      kw:    'mining procurement, supply chain management, vendor database, strategic sourcing',
      type:  'website',
    },
    '/hubs/safety-hub.html': {
      title: 'Safety Hub — Industrial Safety Compliance Platform | SESMine',
      desc:  'Regulatory compliance tracking, incident reporting, safety protocols, and risk management tools for mining operations.',
      kw:    'mining safety compliance, incident reporting, safety management system, mining regulations',
      type:  'website',
    },
    '/hubs/sustainability-hub.html': {
      title: 'Sustainability Hub — ESG & Environmental Intelligence | SESMine',
      desc:  'Carbon footprint tracking, renewable energy integration, waste management, and ESG reporting tools for the mining sector.',
      kw:    'mining ESG, carbon tracking, sustainability mining, environmental compliance',
      type:  'website',
    },
    '/products/ai-predictor.html': {
      title: 'AI Predictor — Predictive Maintenance & Market Forecasting | SESMine',
      desc:  'Machine learning models for equipment failure prediction, commodity price forecasting, and supply chain disruption alerts.',
      kw:    'predictive maintenance AI, equipment failure prediction, mining AI analytics, price forecasting',
      type:  'website',
    },
    '/products/cost-calculator.html': {
      title: 'Cost Calculator — CAPEX & OPEX Estimator | SESMine',
      desc:  'Interactive CAPEX and OPEX calculator for mining and industrial projects. Estimate costs with real-time material and labor data.',
      kw:    'mining cost calculator, CAPEX OPEX calculator, mining project costs, industrial cost estimator',
      type:  'website',
    },
    '/products/equipment-database.html': {
      title: 'Equipment Database — Industrial Machinery Repository | SESMine',
      desc:  'Comprehensive database of industrial mining equipment with technical specs, vendor associations, and maintenance history.',
      kw:    'mining equipment database, industrial machinery specs, mining equipment comparison',
      type:  'website',
    },
    '/dashboard/main-dashboard.html': {
      title: 'Dashboard — SESMine Intelligence Platform',
      desc:  'Your personalized SESMine intelligence dashboard. Monitor hubs, analytics, and ESG metrics in one place.',
      kw:    'sesmine dashboard, mining analytics dashboard',
      type:  'website',
    },
    '/auth/login.html': {
      title: 'Sign In — SESMine Intelligence Platform',
      desc:  'Sign in to your SESMine account to access AI-powered mining intelligence, analytics, and your personalized hub dashboard.',
      kw:    'sesmine login, sesmine sign in',
      type:  'website',
    },
    '/auth/signup.html': {
      title: 'Create Account — SESMine Intelligence Platform',
      desc:  'Join 2,400+ mining professionals on SESMine. Create your free account and access 14 days of full platform access.',
      kw:    'sesmine signup, sesmine register, mining platform account',
      type:  'website',
    },
  };

  /* ── Helpers ── */
  function getMeta(sel) {
    return document.querySelector(sel);
  }

  function setOrCreate(type, key, value) {
    const attr = type === 'name' ? `meta[name="${key}"]` : `meta[property="${key}"]`;
    let el = getMeta(attr);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(type, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }

  function setCanonical(url) {
    let el = document.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement('link');
      el.rel = 'canonical';
      document.head.appendChild(el);
    }
    el.href = url;
  }

  /* ── Inject ── */
  function inject() {
    const page = PAGES[path] || PAGES['/'];
    const canonical = BASE + path;

    // Title
    document.title = page.title;

    // Standard meta
    setOrCreate('name', 'description', page.desc);
    setOrCreate('name', 'keywords',    page.kw);
    setOrCreate('name', 'author',      'SESMine Intelligence Platform');
    setOrCreate('name', 'robots',      'index, follow, max-snippet:-1, max-image-preview:large');

    // Open Graph
    setOrCreate('property', 'og:type',        page.type || 'website');
    setOrCreate('property', 'og:site_name',   'SESMine Intelligence');
    setOrCreate('property', 'og:title',       page.title);
    setOrCreate('property', 'og:description', page.desc);
    setOrCreate('property', 'og:url',         canonical);
    setOrCreate('property', 'og:image',       OG);
    setOrCreate('property', 'og:image:width', '1200');
    setOrCreate('property', 'og:image:height','630');
    setOrCreate('property', 'og:image:alt',   'SESMine Intelligence Platform');
    setOrCreate('property', 'og:locale',      'en_US');

    // Twitter Card
    setOrCreate('name', 'twitter:card',        'summary_large_image');
    setOrCreate('name', 'twitter:site',        '@SESMine');
    setOrCreate('name', 'twitter:title',       page.title);
    setOrCreate('name', 'twitter:description', page.desc);
    setOrCreate('name', 'twitter:image',       OG);

    // Canonical
    setCanonical(canonical);

    // Favicon (real logo)
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/png';
      document.head.appendChild(favicon);
    }
    favicon.href = LOGO;

    // Apple Touch Icon
    let apple = document.querySelector('link[rel="apple-touch-icon"]');
    if (!apple) {
      apple = document.createElement('link');
      apple.rel = 'apple-touch-icon';
      document.head.appendChild(apple);
    }
    apple.href = LOGO;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
