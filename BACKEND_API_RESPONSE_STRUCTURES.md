# Euracare Backend API Response Structures

## Overview

This document contains clean payload structures for backend API endpoints. Use these for website integration.

**Base URL:** `https://euracare-cms-backend-mco8l.ondigitalocean.app`

**Authentication:** Bearer token in `Authorization` header

---

## 1. Doctors Endpoint

### GET /doctors/
List all doctors

```typescript
{
  success: boolean;
  data: {
    doctor: DoctorResponse[];
  }
}

type DoctorResponse = {
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
  professional_association?: string | string[];
  research_interest?: string[];
  qualification?: string[];
  training_and_education?: string[];
  certification?: string[];
  createdAt?: string;
  updatedAt?: string;
}
```

### GET /doctors/{id}
Get single doctor details

```typescript
{
  success: boolean;
  data: {
    doctor: DoctorResponse;
  }
}

type DoctorResponse = {
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
  professional_association?: string | string[];
  research_interest?: string[];
  qualification?: string[];
  training_and_education?: string[];
  certification?: string[];
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 2. Services Endpoint

### GET /services
List all services

```typescript
{
  success: boolean;
  data: {
    services: ServiceResponse[];
  }
}

type ServiceResponse = {
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
  created_at?: string;
  updated_at?: string;
}
```

### GET /services/{id}/
Get single service details

```typescript
{
  success: boolean;
  data: {
    service: ServiceResponse;
  }
}

type ServiceResponse = {
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
  created_at?: string;
  updated_at?: string;
}
```

---

## 3. Blogs/Articles Endpoint

### GET /articles/
List all articles/blogs

```typescript
{
  success: boolean;
  data: {
    articles: {
      articles: ArticleResponse[];
    }
  }
}

type ArticleResponse = {
  id: string;
  snippet?: {
    title?: string;
    cover_image_url?: string;
  };
  page?: {
    content?: {
      additionalProp1?: string; // HTML content from Tiptap
    };
    video_link_url?: string;
    category?: string;
  };
  status?: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
}
```

### GET /articles/{id}/
Get single article/blog details

```typescript
{
  success: boolean;
  data: {
    article: ArticleResponse;
  }
}

type ArticleResponse = {
  id: string;
  snippet?: {
    title?: string;
    cover_image_url?: string;
  };
  page?: {
    content?: {
      additionalProp1?: string; // HTML content from Tiptap
    };
    video_link_url?: string;
    category?: string;
  };
  status?: 'draft' | 'published';
  author?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 4. Team Members Endpoint

### GET /teams/
List all team members

```typescript
{
  success: boolean;
  data: {
    team_members: TeamMemberResponse[];
  }
}

type TeamMemberResponse = {
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

### GET /teams/{id}/
Get single team member details

```typescript
{
  success: boolean;
  data: TeamMemberResponse;
}

type TeamMemberResponse = {
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

## 5. Testimonials Endpoint

### GET /testimonials/
List all testimonials

```typescript
{
  success: boolean;
  data: {
    testimonials: TestimonialResponse[];
  }
}

type TestimonialResponse = {
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

### GET /testimonials/{id}/
Get single testimonial details

```typescript
{
  success: boolean;
  data: {
    testimonial: TestimonialResponse;
  }
}

type TestimonialResponse = {
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

## 6. Jobs/Careers Endpoint

### GET /jobs/
List all job openings

```typescript
{
  success: boolean;
  data: {
    jobs: JobResponse[];
  }
}

type JobResponse = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  objective: string;
  duties_and_responsibilities: Record<string, any> | string;
  qualifications_and_requirements: Record<string, any> | string;
}
```

### GET /jobs/{id}/
Get single job details

```typescript
{
  success: boolean;
  data: {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    objective: string;
    duties_and_responsibilities: Record<string, any> | string;
    qualifications_and_requirements: Record<string, any> | string;
  }
}

type JobResponse = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  objective: string;
  duties_and_responsibilities: Record<string, any> | string;
  qualifications_and_requirements: Record<string, any> | string;
}
```

---

## Error Response Structure

All endpoints return error responses in the following format:

```typescript
{
  success: false;
  message: string;
  data: null;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
```

### Common HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid input parameters |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | User does not have permission |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## Data Type Notes

- **Arrays vs Objects**: Some fields like `professional_association`, `duties_and_responsibilities` can be either arrays or objects
- **Image URLs**: All image URLs are Cloudinary CDN URLs that support transformations
- **HTML Content**: Blog articles contain Tiptap-generated HTML in the `page.content.additionalProp1` field
- **Timestamps**: All dates are ISO 8601 format (e.g., `2024-02-10T14:30:00Z`)
- **Optional Fields**: Fields marked with `?` are optional and may not always be present in responses
