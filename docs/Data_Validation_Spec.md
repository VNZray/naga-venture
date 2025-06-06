# Data Validation & Transformation Specification

## Overview
This document defines the data validation rules and transformation requirements for the Shop Module API. It ensures data consistency between frontend TypeScript types and backend database models.

## TypeScript Type Definitions

### Core Validation Rules

#### ShopData Interface Validation
```typescript
// Required Fields (must never be null/undefined)
const requiredFields = [
  'id',           // string, 6-50 chars, alphanumeric + underscore/dash
  'name',         // string, 1-200 chars, trimmed
  'category',     // string, predefined enum values
  'image',        // string, valid URL format
  'rating',       // number, 0-5 range, max 1 decimal place
  'ratingCount'   // number, >= 0, integer
];

// Optional Fields (can be null/undefined)
const optionalFields = [
  'subcategory',    // string, predefined enum values
  'description',    // string, max 1000 chars, HTML sanitized
  'tagline',        // string, max 100 chars
  'story',          // string, max 5000 chars, HTML sanitized
  'location',       // string, max 200 chars
  'contact',        // string, phone number format validation
  'email',          // string, email format validation
  'distance',       // number, >= 0, max 2 decimal places
  'isFavorited',    // boolean, default false
  'isOpen'          // boolean, computed from business hours
];
```

### Field-Specific Validation

#### ID Validation
```typescript
interface IdValidation {
  pattern: /^[a-zA-Z0-9_-]{6,50}$/;
  examples: {
    valid: ['shop_123', 'naga-bakery', 'restaurant001'];
    invalid: ['sh', 'shop with spaces', 'shop@#$%'];
  };
}
```

#### Image URL Validation
```typescript
interface ImageUrlValidation {
  pattern: /^https?:\/\/.+\.(jpg|jpeg|png|webp)(\?.*)?$/i;
  maxFileSize: '5MB';
  recommendedDimensions: {
    main: '800x600',
    thumbnail: '300x200',
    cover: '1200x400'
  };
  examples: {
    valid: [
      'https://cdn.nagaventure.com/shops/shop1.jpg',
      'https://images.unsplash.com/photo-123.webp?w=800'
    ];
    invalid: [
      'invalid-url',
      'http://example.com/image.gif',
      'https://malicious-site.com/image.exe'
    ];
  };
}
```

#### Rating Validation
```typescript
interface RatingValidation {
  type: 'number';
  minimum: 0;
  maximum: 5;
  multipleOf: 0.1;
  examples: {
    valid: [0, 2.5, 4.7, 5.0];
    invalid: [-1, 5.1, 2.75, 'four'];
  };
}
```

#### Coordinate Validation
```typescript
interface LocationValidation {
  latitude: {
    type: 'number';
    minimum: -90;
    maximum: 90;
    precision: 6; // decimal places
  };
  longitude: {
    type: 'number';
    minimum: -180;
    maximum: 180;
    precision: 6; // decimal places
  };
  examples: {
    valid: {
      latitude: 13.621414,
      longitude: 123.195648
    };
    invalid: {
      latitude: 91.0,    // > 90
      longitude: -181.0  // < -180
    };
  };
}
```

## Data Transformation Rules

### Input Sanitization
```typescript
interface InputSanitization {
  name: {
    trim: true;
    removeHtml: true;
    maxLength: 200;
    transform: (value: string) => value.trim().replace(/\s+/g, ' ');
  };
  
  description: {
    trim: true;
    sanitizeHtml: true; // Allow basic formatting
    maxLength: 1000;
    allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'];
  };
  
  contact: {
    trim: true;
    normalizePhone: true; // Convert to E.164 format
    pattern: /^\+?[\d\s\-\(\)]{10,15}$/;
  };
}
```

### Output Formatting
```typescript
interface OutputFormatting {
  rating: {
    decimalPlaces: 1;
    transform: (value: number) => Math.round(value * 10) / 10;
  };
  
  distance: {
    decimalPlaces: 2;
    unit: 'km';
    transform: (value: number) => Math.round(value * 100) / 100;
  };
  
  businessHours: {
    format: 'HH:mm';
    timezone: 'Asia/Manila';
    validate: (time: string) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  };
}
```

## Database Schema Mapping

### Core Shop Table
```sql
CREATE TABLE shops (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  description TEXT,
  tagline VARCHAR(100),
  story TEXT,
  
  -- Images (stored as JSON array)
  image VARCHAR(500) NOT NULL,
  logo VARCHAR(500),
  cover_image VARCHAR(500),
  gallery JSON,
  
  -- Rating
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
  
  -- Location
  location VARCHAR(200),
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  
  -- Contact
  contact VARCHAR(50),
  email VARCHAR(100),
  
  -- Business Info
  business_hours JSON,
  price_range VARCHAR(20),
  is_open BOOLEAN DEFAULT true,
  
  -- Features
  amenities JSON,
  promotions JSON,
  tags JSON,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_category (category),
  INDEX idx_rating (rating),
  INDEX idx_location (latitude, longitude),
  FULLTEXT INDEX idx_search (name, description, tags)
);
```

### User Favorites Table
```sql
CREATE TABLE user_favorites (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  shop_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_user_shop (user_id, shop_id),
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_shop (shop_id)
);
```

## API Request/Response Transformation

### Request Preprocessing
```typescript
// Before sending to database
class RequestTransformer {
  static preprocessShopData(input: any): ShopData {
    return {
      id: this.validateId(input.id),
      name: this.sanitizeName(input.name),
      category: this.validateCategory(input.category),
      rating: this.normalizeRating(input.rating),
      image: this.validateImageUrl(input.image),
      location: input.location ? {
        latitude: this.validateLatitude(input.location.latitude),
        longitude: this.validateLongitude(input.location.longitude)
      } : undefined,
      // ... other fields
    };
  }
  
  private static validateId(id: string): string {
    if (!/^[a-zA-Z0-9_-]{6,50}$/.test(id)) {
      throw new ValidationError('Invalid shop ID format');
    }
    return id;
  }
  
  private static sanitizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ').substring(0, 200);
  }
}
```

### Response Postprocessing
```typescript
// After retrieving from database
class ResponseTransformer {
  static formatShopData(dbRow: any): ShopData {
    return {
      id: dbRow.id,
      name: dbRow.name,
      category: dbRow.category,
      rating: this.formatRating(dbRow.rating),
      ratingCount: dbRow.rating_count,
      image: this.ensureAbsoluteUrl(dbRow.image),
      distance: this.calculateDistance(
        dbRow.latitude, 
        dbRow.longitude, 
        this.userLocation
      ),
      isFavorited: this.checkIfFavorited(dbRow.id, this.userId),
      isOpen: this.checkIfOpen(dbRow.business_hours),
      // ... other transformations
    };
  }
  
  private static formatRating(rating: number): number {
    return Math.round(rating * 10) / 10;
  }
  
  private static ensureAbsoluteUrl(url: string): string {
    if (url.startsWith('http')) return url;
    return `${CDN_BASE_URL}/${url}`;
  }
}
```

## Validation Error Handling

### Error Types
```typescript
enum ValidationErrorType {
  REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',
  INVALID_FORMAT = 'INVALID_FORMAT',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  DUPLICATE_VALUE = 'DUPLICATE_VALUE',
  REFERENCE_NOT_FOUND = 'REFERENCE_NOT_FOUND'
}

interface ValidationError {
  type: ValidationErrorType;
  field: string;
  message: string;
  receivedValue?: any;
  expectedFormat?: string;
}
```

### Error Response Format
```typescript
interface ValidationErrorResponse {
  success: false;
  error: {
    code: 'VALIDATION_ERROR';
    message: 'Request validation failed';
    details: {
      errors: ValidationError[];
      requestId: string;
    };
  };
}
```

## Testing Data Sets

### Valid Test Data
```typescript
export const validShopData: ShopData = {
  id: 'test-shop-001',
  name: 'Test Restaurant',
  category: 'restaurant',
  subcategory: 'filipino',
  description: 'A great place to eat authentic Filipino food.',
  image: 'https://example.com/shop.jpg',
  rating: 4.5,
  ratingCount: 120,
  location: 'Naga City, Camarines Sur',
  mapLocation: {
    latitude: 13.621414,
    longitude: 123.195648
  },
  contact: '+63912345678',
  email: 'info@testrestaurant.com',
  isFavorited: false,
  isOpen: true
};
```

### Invalid Test Data
```typescript
export const invalidShopData = [
  {
    // Missing required fields
    name: 'Incomplete Shop'
    // Missing: id, category, image, rating, ratingCount
  },
  {
    // Invalid formats
    id: 'ab',                    // Too short
    name: '',                    // Empty
    rating: 6,                   // Out of range
    email: 'invalid-email',      // Invalid format
    mapLocation: {
      latitude: 91,              // Out of range
      longitude: -181            // Out of range
    }
  }
];
```

This specification ensures that all data flowing through the system meets our quality standards and maintains consistency between frontend and backend components.
