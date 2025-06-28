import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';

const defaultRoutes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/FAQS', changefreq: 'monthly', priority: 0.8 },
  { url: '/Terms&Conditions', changefreq: 'monthly', priority: 0.5 },
  { url: '/Support&Contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/TrackTicket', changefreq: 'monthly', priority: 0.6 },
  { url: '/new', changefreq: 'monthly', priority: 0.5 },
  { url: '/FAQS/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc', changefreq: 'monthly', priority: 0.7 }
];

const domainRoutes = {
  'mbktechstudio.com': defaultRoutes,
  'docs.mbktechstudio.com': [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/Documentation', changefreq: 'monthly', priority: 0.9 }
  ],
  'portfolio.mbktechstudio.com': [
    { url: '/', changefreq: 'daily', priority: 1.0 }
  ],
  'api.mbktechstudio.com': [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/Documentation', changefreq: 'monthly', priority: 0.9 }
  ],
  'download.mbktechstudio.com': [
    { url: '/', changefreq: 'daily', priority: 1.0 }
  ]
};

const generateSitemap = async (domain, siteType = null) => {
  try {
    const smStream = new SitemapStream({
      hostname: `https://${domain}`,
      cacheTime: 600000
    });

    const pipeline = smStream.pipe(createGzip());
    
    let routes;
    if (domain.includes('localhost')) {
      // Use routes based on site type for localhost
      if (siteType && domainRoutes[`${siteType}.mbktechstudio.com`]) {
        routes = domainRoutes[`${siteType}.mbktechstudio.com`];
      } else {
        routes = defaultRoutes;
      }
    } else {
      routes = domainRoutes[domain] || defaultRoutes;
    }
    
    // Add routes
    for (const route of routes) {
      smStream.write(route);
    }

    smStream.end();
    return await streamToPromise(pipeline);
  } catch (err) {
    console.error(`Error generating sitemap for ${domain}:`, err);
    throw err;
  }
};

const getAllSitemaps = async (domain) => {
  const results = {};
  const baseHostname = domain.includes('localhost') ? domain : 'mbktechstudio.com';
  
  // Generate default sitemap
  results['main'] = await generateSitemap(baseHostname);
  
  // Generate sitemaps for each subdomain
  for (const [key, _] of Object.entries(domainRoutes)) {
    if (key !== 'mbktechstudio.com') {
      const subdomainBase = domain.includes('localhost') ? domain : key;
      results[key.split('.')[0]] = await generateSitemap(subdomainBase);
    }
  }
  
  return results;
};

export { generateSitemap, domainRoutes, getAllSitemaps };