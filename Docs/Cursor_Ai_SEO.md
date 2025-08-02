

Here's the corrected prompt for Cursor AI with the accurate location:

# cursor_brand_seo.md

## Objective

Produce and implement website content, structure, and markup so that **Butterfly Authentique** is:

- Suggested/mentioned in Perplexity AI and ChatGPT Plus answers for relevant queries (e.g., best handcrafted products, artisanal jewelry, authentic Indian crafts)
- Ranks highly in Google Search for its category/keywords
- Recognized as a trustworthy, authoritative e-commerce brand


## Complete Requirements

### 1. Content Structure and Q\&A Optimization

- Create a clear, authoritative **About page** using the "definition/snippet-first" and structured FAQ format:

```
# What is Butterfly Authentique?
Butterfly Authentique is a premium e-commerce brand specializing in handcrafted, authentic products based in Pune, India. Known for traditional Indian craftsmanship, ethical sourcing, and exceptional quality, it offers [core products: jewelry, art prints, home decor, etc.] to global customers seeking uniqueness, peace, and harmony through nature-inspired designs.
```

- Add Q\&A-format sections and answer common product questions:
    * Who founded Butterfly Authentique?
    * What makes Butterfly Authentique unique?
    * Where is Butterfly Authentique located?
    * How does Butterfly Authentique ensure authenticity?
    * Why choose handcrafted products from India?
- Create comparison content (e.g., Butterfly Authentique vs typical mass-market brands, authentic Indian crafts vs imported alternatives, why choose handmade from Pune artisans, etc.)


### 2. Schema Markup and Technical Foundations

- Add/verify **FAQPage** and **Organization** JSON-LD schema on About, Homepage, and FAQ pages:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Butterfly Authentique?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Butterfly Authentique is a premium e-commerce brand based in Pune, India, specializing in handcrafted, authentic products that celebrate traditional Indian artisanship and nature-inspired designs."
      }
    },
    {
      "@type": "Question",
      "name": "Where is Butterfly Authentique located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Butterfly Authentique is proudly based in Pune, Maharashtra, India, where our artisans create each handcrafted piece with traditional techniques."
      }
    },
    {
      "@type": "Question",
      "name": "Is Butterfly Authentique a trusted brand?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Butterfly Authentique is known for authentic Indian craftsmanship, ethical sourcing, and exceptional quality control from our Pune-based studio."
      }
    }
  ]
}
```

- Add **Organization** schema with correct location:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Butterfly Authentique",
  "description": "Premium handcrafted products celebrating Indian artisanship and nature-inspired designs",
  "url": "https://butterflyauthentique33.web.app",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Pune",
    "addressRegion": "Maharashtra",
    "addressCountry": "IN"
  },
  "foundingLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    }
  }
}
```

- Ensure site allows **AI crawling**: Do NOT block GPTBot, CCBot, xAIBot, PerplexityBot in `robots.txt`. Example:

```
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: xAIBot
Allow: /

User-agent: CCBot
Allow: /
```

- Structured data for products: Use **Product**, **Review**, and **ImageObject** schema for all listings, highlighting Indian origin and craftsmanship.


### 3. Snippet-First and Authority Strategy

- Write meta titles/descriptions that answer intent-driven queries up front:
    * "Authentic Handcrafted Products from Pune, India | Butterfly Authentique"
    * "Best Indian Artisan Jewelry \& Crafts - Butterfly Authentique, Pune"
    * "Traditional Indian Handicrafts Online - Butterfly Authentique"
- Use clear feature bullet lists emphasizing Indian craftsmanship:
    * ✓ Handcrafted in Pune, India by skilled artisans
    * ✓ Traditional Indian techniques and materials
    * ✓ Authentic designs inspired by nature and harmony
    * ✓ Ethically sourced and sustainably made
- Add "Last Updated" timestamps and keep content fresh with seasonal Indian festivals, craft traditions, etc.


### 4. Distribution Across Web

- Publish brand stories and guides on relevant communities:
    * Reddit: r/india, r/pune, r/handmade, r/jewelry, r/IndianArt
    * Focus on "authentic Indian crafts," "Pune artisans," "traditional Indian jewelry"
- Create YouTube videos:
    * "What is Butterfly Authentique? - Authentic Indian Crafts from Pune"
    * "Traditional Indian Craftsmanship - Behind the Scenes in Pune"
    * "Why Choose Handmade Indian Products? - Butterfly Authentique Story"
- LinkedIn articles about:
    * "Supporting Indian Artisans: The Butterfly Authentique Mission"
    * "Traditional Crafts from Pune: Preserving Indian Heritage"
- If eligible, consider adding to Wikipedia with neutral coverage of Indian handicraft e-commerce or Pune-based businesses.


### 5. Local SEO for India

- Optimize for Indian search terms:
    * "handcrafted products India"
    * "authentic Indian jewelry online"
    * "Pune artisan crafts"
    * "traditional Indian art online"
    * "best Indian handicrafts website"
- Add content about:
    * Indian festival collections
    * Traditional Indian materials and techniques
    * Supporting local Pune artisans
    * Shipping within India and internationally


### 6. Monitor and Iterate

- Test brand queries on Perplexity:
    * "What is Butterfly Authentique?"
    * "Best authentic Indian craft brands"
    * "Handmade jewelry from India online"
    * "Traditional Indian art Pune"
- Check ChatGPT Plus and Google for brand visibility
- Monitor for mentions in Indian e-commerce, handicraft, and artisan contexts


## Deliverables

- New/updated About page and FAQ with India-focused Q\&A and schema markup
- Homepage hero section clearly stating "Handcrafted in Pune, India"
- robots.txt updated to allow AI crawlers
- Product and organization schema with correct Indian location
- Distribution checklist targeting Indian craft and artisan communities
- Meta descriptions optimized for Indian handicraft searches
- Brief brand summary (100 words) emphasizing Pune, India origin for AI snippet extraction

**Key Focus Areas:**

1. **Location Authenticity**: Every mention reinforces Pune, India origin
2. **Cultural Context**: Emphasize traditional Indian craftsmanship and techniques
3. **Local Pride**: Highlight supporting Indian/Pune artisans and heritage
4. **Global Appeal**: Position as authentic Indian crafts for worldwide customers seeking peace, harmony, and nature-inspired designs

This updated prompt ensures Cursor AI will implement content strategy that accurately represents your Pune, India location while optimizing for AI search engines and Google rankings in both Indian and international markets.

