# LuxeHaven — Setup Guide

## ✅ Jo ho chuka hai

- [x] Next.js 14 project
- [x] Supabase credentials `.env.local` mein set
- [x] Cloudinary integration ready
- [x] Dev server chal raha hai → http://localhost:3000

---

## ⚡ Abhi Karna Hai — SIRF 2 Steps

---

### STEP 1 — Supabase mein Tables banao (2 min)

1. Is link pe jao:
   **https://supabase.com/dashboard/project/odrisbaabgeyhzaauqtl/sql/new**

2. `supabase/schema.sql` file ka **poora content** copy karo

3. SQL Editor mein paste karo → **Run** button dabao

4. Success message aayega:
   ```
   total_properties | total_agents
   6                | 4
   ```

---

### STEP 2 — Cloudinary setup karo (3 min)

1. https://cloudinary.com pe free account banao

2. Dashboard se copy karo:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

3. `.env.local` mein fill karo:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=123456789
   CLOUDINARY_API_SECRET=abc123xyz
   ```

4. Dev server restart karo:
   ```
   Ctrl+C  →  npm run dev
   ```

---

## 🚀 Dev Server

```bash
cd luxehaven
npm run dev
# → http://localhost:3000
```

---

## 📁 Pages

| URL | Page |
|-----|------|
| `/` | Home (hero, properties, EMI calc) |
| `/properties` | All listings with filters |
| `/properties/[slug]` | Property detail + enquiry form |
| `/contact` | Contact form → saves to Supabase |
| `/about` | Team + awards |
| `/services` | Services listing |
| `/localities` | Neighbourhood explorer |
| `/api/enquiry` | POST enquiry API |
| `/api/upload` | POST image upload (Cloudinary) |
| `/api/properties` | GET properties JSON |
| `/api/setup` | GET — database status check |

---

## 🖼️ Property Images Upload karna

```bash
# Kisi bhi image ke liye
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/image.jpg" \
  -F "slug=bypass-forest-retreat" \
  -F "property_id=UUID_HERE" \
  -F "alt=Front view" \
  -F "is_primary=true"
```
