# Website Integration Prompt - Euracare CMS to Public Website

## Overview
Integrate the Euracare CMS backend API with a public-facing website while maintaining optimal performance and user experience. The website will dynamically fetch and display content from the CMS dashboard, including doctors, services, blogs, team members, testimonials, and career opportunities.

---

## Technology Stack & Architecture

### CMS Stack (Source System)
- **Frontend**: React 19 + TypeScript + Vite
- **State Management**: React Context API + Hooks
- **UI Framework**: Tailwind CSS
- **Editor**: Tiptap v3 (Rich text editor with image/link support)
- **Image Storage**: Cloudinary (CDN-optimized)
- **Real-time**: WebSocket support for notifications
- **HTTP Client**: Axios with custom interceptors, timeout=30s
- **API Base**: `https://euracare-cms-backend-mco8l.ondigitalocean.app/api/v1`

### Website Requirements
- **Framework**: React
- **Lazy Loading**: Essential for performance
- **Caching**: Implement client-side + ISR/SSG (if Next.js/Nuxt)
- **Image Optimization**: Use responsive images, CDN delivery
- **SEO**: Meta tags for each dynamic page

---

## Complete API Endpoint Reference

### 1. **Doctors Endpoint**
```
GET    /api/v1/doctors/
GET    /api/v1/doctors/{id}
POST   /api/v1/doctors/
PUT    /api/v1/doctors/{id}
PATCH  /api/v1/doctors/{id}
DELETE /api/v1/doctors/{id}
POST   /api/v1/doctors/bulk-delete
```

**Response Structure:**
```typescript
{
  data: {
    doctor: DoctorResponse | DoctorResponse[],
    meta: { page, limit, total }
  }
}

// Doctor Object
{
  id: string;
  full_name: string;
  email: string;
  phone: string;
  language?: string;
  bio?: string;
  profile_picture_url?: string;
  reg_number?: string;
  years_of_experince?: string;
  programs_and_specialty?: string[];
  professional_association?: string[];
  research_interest?: string[];
  qualification?: string[];
  training_and_education?: string[];
  certification?: string[];
  createdAt?: string;
  updatedAt?: string;
}
```

**Query Parameters:**
- `page` (int): Pagination page number (default: 1)
- `limit` (int): Results per page (recommended: 10-20)
- `search` (string): Search by name/email

---

### 2. **Services Endpoint**
```
GET    /api/v1/services
GET    /api/v1/services/{id}/
POST   /api/v1/services/
PATCH  /api/v1/services/{id}
DELETE /api/v1/services/{id}
POST   /api/v1/services/bulk-delete
```

**Response Structure:**
```typescript
{
  data: {
    services: ServiceResponse[],
    service: ServiceResponse
  },
  total: number
}

// Service Object
{
  id: string;
  snippet?: {
    service_name?: string;
    service_description?: string;
    cover_image_url?: string;
  };
  page?: {
    banner_image_url?: string;
    service_overview?: string;
    video_url?: string;
    conditions_we_treat?: string[];
    test_and_diagnostics?: string[];
    treatments_and_procedures?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}
```

---

### 3. **Blogs/Articles Endpoint**
```
GET    /api/v1/articles/
GET    /api/v1/articles/{id}/
POST   /api/v1/articles/
PUT    /api/v1/articles/{id}
PATCH  /api/v1/articles/{id}/publish
DELETE /api/v1/articles/{id}
POST   /api/v1/blogs/bulk-delete
```

**Response Structure:**
```typescript
{
  data: {
    articles: {
      articles: BlogResponse[];
      meta: { page, limit, total }
    }
  }
}

// Blog Object (Two Response Patterns - Handle Both)
Pattern 1: {
  id: string;
  snippet?: {
    title: string;
    cover_image_url?: string;
  };
  page?: {
    content?: {
      additionalProp1: string; // HTML content from Tiptap
    };
    video_link_url?: string;
    category?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

Pattern 2: {
  id: string;
  title: string;
  content: string; // HTML from Tiptap
  excerpt?: string;
  image?: string;
  author?: string;
  category?: string;
  tags?: string[];
  status: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
}
```

**Query Parameters:**
- `page` (int): Pagination
- `limit` (int): Results per page
- `search` (string): Search by title  
- `status` (string): 'draft' | 'published'

**Important Notes:**
- Blogs contain **Tiptap HTML content** (not markdown)
- Content includes: `<p>`, `<strong>`, `<em>`, `<ul>`, `<ol>`, `<img>`, `<a>` tags
- Images are Cloudinary URLs (already optimized)
- Links have attributes: `target="_blank"`, `rel="noopener noreferrer"`
- Videos are embedded via `<iframe>` or external URLs in `video_link_url`

---

### 4. **Team Members Endpoint**
```
GET    /api/v1/teams/
GET    /api/v1/teams/{id}/
POST   /api/v1/teams/
PUT    /api/v1/teams/{id}
PATCH  /api/v1/teams/{id}
DELETE /api/v1/teams/{id}
```

**Response Structure:**
```typescript
{
  data: {
    team_members: TeamMemberResponse[],
    meta: { page, limit, total }
  }
}

// Team Member Object
{
  id: string;
  profile_picture_url?: string;
  full_name: string;
  role: string;
  category: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}
```

---

### 5. **Testimonials Endpoint**
```
GET    /api/v1/testimonials/
GET    /api/v1/testimonials/{id}/
POST   /api/v1/testimonials/
PUT    /api/v1/testimonials/{id}
DELETE /api/v1/testimonials/{id}
POST   /api/v1/testimonials/bulk-delete
```

**Response Structure:**
```typescript
{
  data: {
    testimonials: TestimonialResponse[],
    meta: { page, limit, total }
  }
}

// Testimonial Object
{
  id: string;
  title: string;
  patient_name: string;
  service: string;
  video_url: string;
  thumbnail_url?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

---

### 6. **Career/Jobs Endpoint**
```
GET    /api/v1/jobs/
GET    /api/v1/jobs/{id}/
POST   /api/v1/jobs/
PUT    /api/v1/jobs/{id}
PATCH  /api/v1/jobs/{id}
DELETE /api/v1/jobs/{id}
GET    /api/v1/jobs/{id}/applications
POST   /api/v1/jobs/{id}/apply
```

---

### 7. **Overview/Dashboard Endpoint**
```
GET /api/v1/overview/
```

**Response Structure:**
```typescript
{
  success: boolean;
  data: {
    overview: {
      articles: BlogResponse[];
      doctors: DoctorResponse[];
      services: ServiceResponse[];
      audit: AuditResponse[];
    }
  }
}
```

This endpoint provides sample data from each content type in single request.

---

## Performance Optimization Strategy

### 1. **Implement Hierarchical Caching**

#### Level 1: Browser Cache
```javascript
// Set appropriate Cache-Control headers on API responses
// For list endpoints: cache for 5 minutes (300s)
// For detail endpoints: cache for 10 minutes (600s)
// For images: cache for 1 month (2592000s)

// Use axios interceptors to handle caching
const cacheConfig = {
  lists: 300,        // 5 minutes
  details: 600,      // 10 minutes
  images: 2592000    // 30 days
};
```

#### Level 2: Memory Cache (In-App)
```javascript
// Implement SWR (Stale-While-Revalidate) pattern
// Fetch in background while serving cached data

class CacheManager {
  private cache = new Map();
  
  async get(key, fetcher, ttl = 300) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.time < ttl * 1000) {
      return cached.value;
    }
    
    // Fetch fresh data in background
    this.cache.set(key, {
      value: cached?.value, // Return stale data immediately
      time: Date.now()
    });
    
    const fresh = await fetcher();
    this.cache.set(key, { value: fresh, time: Date.now() });
    return fresh;
  }
}
```

#### Level 3: Static Gen with ISR (Next.js)
```typescript
// pages/doctors/[id].tsx
export async function getStaticProps({ params }) {
  const doctor = await fetch(`${API_URL}/doctors/${params.id}`);
  return {
    props: { doctor },
    revalidate: 3600  // Revalidate every hour
  };
}

export async function getStaticPaths() {
  const doctors = await fetch(`${API_URL}/doctors?limit=100`);
  return {
    paths: doctors.map(d => ({ params: { id: d.id } })),
    fallback: 'blocking'  // On-demand ISR for new doctors
  };
}
```

### 2. **Image Optimization**

```javascript
// Use Cloudinary's transformation parameters
const optimizeCloudinaryUrl = (url, options = {}) => {
  // Example Cloudinary URL transformation
  // Original: https://res.cloudinary.com/cloud/image/upload/v1234/doctor.jpg
  // Optimized: https://res.cloudinary.com/cloud/image/upload/w_400,h_300,c_fill,q_auto,f_webp/v1234/doctor.jpg
  
  const params = {
    w: options.width || 400,      // Width
    h: options.height || 300,     // Height
    c: 'fill',                    // Crop mode
    q: 'auto',                    // Auto quality
    f: 'webp',                    // WebP format (auto-fallback)
    ...options.transform
  };
  
  return `${url}?${Object.entries(params).map(([k,v]) => `${k}=${v}`).join('&')}`;
};

// Usage in React
<img 
  src={optimizeCloudinaryUrl(doctor.profile_picture_url, { width: 200 })}
  srcSet={`
    ${optimizeCloudinaryUrl(doctor.profile_picture_url, { width: 200 })} 200w,
    ${optimizeCloudinaryUrl(doctor.profile_picture_url, { width: 400 })} 400w,
    ${optimizeCloudinaryUrl(doctor.profile_picture_url, { width: 800 })} 800w
  `}
  sizes="(max-width: 600px) 100vw, 50vw"
  alt={doctor.full_name}
/>
```

### 3. **Lazy Loading & Pagination**

```javascript
// Implement virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';

// Fetch in chunks, not all at once
const usePaginatedDoctors = () => {
  const [page, setPage] = useState(1);
  const [doctors, setDoctors] = useState([]);
  
  useEffect(() => {
    fetch(`/api/v1/doctors?page=${page}&limit=20`)
      .then(r => r.json())
      .then(data => {
        setDoctors(prev => page === 1 ? data : [...prev, ...data]);
      });
  }, [page]);
  
  return { doctors, loadMore: () => setPage(p => p + 1) };
};
```

### 4. **Code Splitting**

```javascript
// Use dynamic imports for heavy components
const BlogEditor = lazy(() => import('@/components/BlogEditor'));
const DoctorForm = lazy(() => import('@/components/DoctorForm'));

// For routes
const routes = [
  {
    path: '/doctors',
    component: lazy(() => import('@/pages/Doctors'))
  },
  {
    path: '/blogs',
    component: lazy(() => import('@/pages/Blogs'))
  }
];
```

### 5. **API Request Optimization**

```javascript
// 1. Batch requests when possible
const fetchMultipleContent = async () => {
  try {
    const [doctors, services, blogs] = await Promise.all([
      fetch('/api/v1/doctors?limit=10'),
      fetch('/api/v1/services?limit=10'),
      fetch('/api/v1/articles?limit=10&status=published')
    ]);
    // Process all at once
  } catch (error) {
    // Handle errors
  }
};

// 2. Debounce search requests
const useSearchDoctors = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.length >= 2) {
        fetch(`/api/v1/doctors?search=${searchQuery}`)
          .then(r => r.json())
          .then(setResults);
      }
    }, 300),
    []
  );
  
  return { query, setQuery: (q) => { setQuery(q); debouncedSearch(q); }, results };
};

// 3. Request timeout handling
const fetchWithTimeout = (url, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  return fetch(url, { signal: controller.signal })
    .then(r => (clearTimeout(id), r))
    .catch(e => { clearTimeout(id); throw e; });
};
```

---

## Tiptap Blog Editor Integration

### Content Storage Format
The blog endpoint returns HTML content edited with Tiptap. The content is stored in:
- **CMS Response**: `response.data.data.articles[0].page.content.additionalProp1` (or nested variant)
- **Content Type**: Full HTML (not markdown)

### Rendering Blog Content Safely

```typescript
import DOMPurify from 'dompurify';

interface BlogContentProps {
  content: string;
}

export const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
  // 1. Sanitize HTML to prevent XSS
  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'p', 'a', 'ul', 'ol', 'li', 'br', 'img', 'iframe', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'style']
  });
  
  // 2. Render with dangerouslySetInnerHTML (after sanitization)
  return (
    <article 
      className="prose prose-sm md:prose-base max-w-3xl mx-auto"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

// Alternative: Use rehype for safer rendering
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeSanitize from 'rehype-sanitize';
import rehypeReact from 'rehype-react';

const processContent = (html) => {
  const processor = unified()
    .use(rehypeParse)
    .use(rehypeSanitize)
    .use(rehypeReact);
  
  return processor.processSync(html).result;
};
```

### Styling Blog Content

```css
/* Tailwind CSS for Tiptap-generated content */
.blog-content {
  @apply prose prose-sm md:prose-base;
}

.blog-content p {
  @apply mb-4 leading-relaxed text-gray-700;
}

.blog-content h1, 
.blog-content h2, 
.blog-content h3 {
  @apply font-bold text-gray-900 mt-6 mb-3;
}

.blog-content h1 { @apply text-2xl md:text-3xl; }
.blog-content h2 { @apply text-xl md:text-2xl; }
.blog-content h3 { @apply text-lg md:text-xl; }

.blog-content ul, 
.blog-content ol {
  @apply ml-6 mb-4;
}

.blog-content a {
  @apply text-blue-600 hover:text-blue-800 underline;
}

.blog-content img {
  @apply w-full h-auto rounded-lg shadow-md my-4;
}

.blog-content iframe {
  @apply w-full aspect-video rounded-lg my-4;
}

.blog-content strong {
  @apply font-bold text-gray-900;
}

.blog-content em {
  @apply italic text-gray-800;
}
```

### Video Embedding

```typescript
export const EmbedVideo: React.FC<{ url: string }> = ({ url }) => {
  // If it's a YouTube URL
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return (
      <iframe
        width="100%"
        height="400"
        src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
        frameBorder="0"
        allowFullScreen
        className="rounded-lg"
      />
    );
  }
  
  // If it's a Vimeo URL
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return (
      <iframe
        width="100%"
        height="400"
        src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
        frameBorder="0"
        allowFullScreen
        className="rounded-lg"
      />
    );
  }
  
  // Generic video URL
  return (
    <video
      width="100%"
      height="400"
      controls
      className="rounded-lg"
    >
      <source src={url} />
    </video>
  );
};
```

---

## Authentication & Authorization

### Token Management

```typescript
// 1. Store tokens securely
const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
  // For sensitive apps, use httpOnly cookies instead
};

// 2. Automatic token refresh
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/auth/refresh', { refresh_token: refreshToken });
        const newToken = response.data.data.access_token;
        localStorage.setItem('authToken', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### Public vs. Private Content

```typescript
// For public website, only fetch published content
const getPublishedBlogs = async () => {
  const response = await fetch('/api/v1/articles?status=published&limit=50');
  return response.json();
};

// Don't expose draft content to public
const shouldShowContent = (content) => {
  return content.status === 'published' || !content.status;
};
```

---

## SEO Optimization

### Meta Tags for Dynamic Content

```typescript
interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export const useSEO = ({ title, description, image, url }: SEOProps) => {
  useEffect(() => {
    // Standard meta tags
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    
    // Open Graph
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    if (image) document.querySelector('meta[property="og:image"]')?.setAttribute('content', image);
    if (url) document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
    
    // Twitter Card
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
    if (image) document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', image);
  }, [title, description, image, url]);
};

// Usage
export const DoctorDetail: React.FC<{ id: string }> = ({ id }) => {
  const [doctor, setDoctor] = useState(null);
  
  useEffect(() => {
    fetch(`/api/v1/doctors/${id}`)
      .then(r => r.json())
      .then(setDoctor);
  }, [id]);
  
  useSEO({
    title: `${doctor?.full_name} - Euracare Doctors`,
    description: doctor?.bio || 'Meet our expert doctor',
    image: doctor?.profile_picture_url,
  });
  
  return <div>{/* Doctor details */}</div>;
};
```

---

## Error Handling & Resilience

### Graceful Degradation

```typescript
export const useSafeAPI = <T,>(url: string, fallback: T) => {
  const [data, setData] = useState<T>(fallback);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    
    fetch(url)
      .then(r => r.json())
      .then(result => {
        if (isMounted) setData(result);
      })
      .catch(err => {
        if (isMounted) {
          setError(err);
          setData(fallback); // Use fallback on error
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    
    return () => { isMounted = false; };
  }, [url, fallback]);
  
  return { data, error, loading };
};

// Show cached/offline data if API fails
const { data: doctors, error } = useSafeAPI(
  '/api/v1/doctors',
  getCachedDoctors() // Return previously cached data
);
```

---

## Implementation Checklist

### Phase 1: Setup (Week 1)
- [ ] Clone website repository
- [ ] Install dependencies
- [ ] Configure API client with base URL
- [ ] Set up environment variables (API_URL, CLOUDINARY_CLOUD, etc.)
- [ ] Implement error handler wrapper

### Phase 2: Core Integration (Week 2-3)
- [ ] **Doctors Page**
  - [ ] Fetch and display doctor list with pagination
  - [ ] Create doctor detail page with SEO
  - [ ] Add filtering/search functionality
  - [ ] Implement lazy loading for images
  
- [ ] **Services Page**
  - [ ] Fetch and display services with category filtering
  - [ ] Create service detail page
  - [ ] Display service animations/transitions
  
- [ ] **Team Members Page**
  - [ ] Fetch and display team members by category
  - [ ] Create team member profiles
  
- [ ] **Testimonials**
  - [ ] Create testimonials carousel/gallery
  - [ ] Embed video testimonials securely

### Phase 3: Blog Integration (Week 4)
- [ ] Set up blog listing page
- [ ] Create blog detail/article page
- [ ] Implement blog HTML rendering (sanitized)
- [ ] Add video embedding support
- [ ] Create related articles section
- [ ] Add blog search functionality
- [ ] Implement breadcrumb navigation

### Phase 4: Careers Integration (Week 5)
- [ ] Create jobs listing page
- [ ] Create job detail page
- [ ] Implement job application form
- [ ] Add CV upload functionality

### Phase 5: Performance & Optimization (Week 6)
- [ ] Implement caching strategy
- [ ] Set up image optimization
- [ ] Add lazy loading on all pages
- [ ] Optimize bundle size
- [ ] Test Core Web Vitals
- [ ] Set up CDN caching headers

### Phase 6: Testing & Deployment (Week 7)
- [ ] Unit tests for API services
- [ ] Playwright E2E tests
- [ ] Load testing with k6/Artillery
- [ ] Security audit (XSS, CSRF)
- [ ] SEO audit with Lighthouse
- [ ] Deploy to staging
- [ ] Deploy to production with monitoring

---

## Performance Targets

| Metric | Target |
|--------|--------|
| **Largest Contentful Paint (LCP)** | < 2.5s |
| **First Input Delay (FID)** | < 100ms |
| **Cumulative Layout Shift (CLS)** | < 0.1 |
| **Time to First Byte (TTFB)** | < 600ms |
| **Initial Page Load** | < 3s |
| **Image Load Time** | < 1s (with CDN) |
| **API Response Time** | < 500ms (p95) |

---

## Monitoring & Analytics

```typescript
// Track Core Web Vitals
import { getCLS, getCWV, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getCWV(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);

// API call monitoring
const trackAPICall = (endpoint: string, duration: number, success: boolean) => {
  analytics.track('API_CALL', {
    endpoint,
    duration,
    success,
    timestamp: new Date()
  });
};
```

---

## Security Considerations

1. **Content Security Policy (CSP)**
   ```html
   <meta http-equiv="Content-Security-Policy" content="
     default-src 'self';
     script-src 'self' 'unsafe-inline' https://trusted-extensions.com;
     style-src 'self' 'unsafe-inline';
     img-src 'self' https: data:;
     frame-src 'self' https://www.youtube.com https://player.vimeo.com;
   ">
   ```

2. **XSS Protection**: Sanitize all HTML content from Tiptap
3. **CORS**: Configure CORS properly on backend
4. **Rate Limiting**: Implement rate limiting on API client side
5. **Input Validation**: Validate all search/filter inputs

---

## Questions to Clarify with AI

When implementing, ensure to ask:
1. What's the preferred website framework?
2. Should we use ISR (Next.js) or client-side rendering?
3. What's the target audience size for initial launch?
4. Do we need real-time updates or is daily cache acceptable?
5. Should we support offline mode?
6. What level of SEO optimization is needed?
7. Do we need multi-language support?
8. What's the mobile-first priority level?

---

This prompt provides a complete blueprint for integrating the Euracare CMS with a public website while maintaining industry best practices for performance, security, and scalability.
