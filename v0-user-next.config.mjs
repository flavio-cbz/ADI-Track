/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Génère une version standalone pour Docker
  reactStrictMode: true,
  swcMinify: true, // Utilise SWC pour la minification (plus rapide que Terser)
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'production', // Désactive l'optimisation des images en production pour réduire la taille
  },
  experimental: {
    // Optimisations expérimentales
    optimizeCss: true, // Optimise les CSS
    scrollRestoration: true, // Améliore la restauration du défilement
  },
}

export default nextConfig

