// Structured Data for SEO
document.addEventListener('DOMContentLoaded', function() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "ResumeCraft 2026",
        "description": "AI-powered resume builder with smart templates and live editing",
        "url": window.location.origin,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "creator": {
            "@type": "Organization",
            "name": "ResumeCraft Team"
        }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
});