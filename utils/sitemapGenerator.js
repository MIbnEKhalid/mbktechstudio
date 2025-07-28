import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';

const defaultRoutes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/FAQS', changefreq: 'monthly', priority: 0.8 },
  { url: '/Terms&Conditions', changefreq: 'monthly', priority: 0.5 },
  { url: '/Support&Contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/TrackTicket', changefreq: 'monthly', priority: 0.6 },
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

export { generateSitemap, domainRoutes };