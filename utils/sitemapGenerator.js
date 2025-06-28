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

const generateSitemap = async (domain) => {
  try {
    const smStream = new SitemapStream({
      hostname: `https://${domain}`,
      cacheTime: 600000
    });

    const pipeline = smStream.pipe(createGzip());
    
    // Use default routes for localhost or unknown domains
    const routes = domain.includes('localhost') ? defaultRoutes : (domainRoutes[domain] || defaultRoutes);
    
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