/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    
    // PDF.js worker 설정
    config.resolve.alias.pdfjs = 'pdfjs-dist/legacy/build/pdf';
    config.resolve.alias.worker = 'pdfjs-dist/legacy/build/pdf.worker.entry';
    
    return config;
  },
}

module.exports = nextConfig