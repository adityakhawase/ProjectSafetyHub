# Media Upload Feature - Implementation Summary

## Overview
Students and teachers can now upload photos or videos with their complaints. Media is required for certain complaint types and optional for others.

## Requirements by Category

### Media REQUIRED for:
- **Bullying** - Photo/video evidence is mandatory
- **Ragging** - Photo/video evidence is mandatory
- **Infrastructure Issue** - Photo/video of the issue is mandatory

### Media OPTIONAL for:
- Harassment
- Safety Concern
- Hostel Issue
- Medical Emergency
- Other

## Changes Made

### 1. Backend API (`app/api/[[...path]]/route.js`)

**Added constants:**
```javascript
const MEDIA_REQUIRED_CATEGORIES = ['Bullying', 'Ragging', 'Infrastructure Issue'];
```

**Updated complaint creation:**
- Validates media requirement based on category
- Accepts `mediaBase64` and `mediaType` in request body
- Validates file types: JPEG, PNG, GIF, MP4, WebM, MOV
- Validates file size: Maximum 50MB
- Stores media in complaint document with metadata

**Media validation:**
- File type validation (images and videos only)
- File size limit (50MB max)
- Required field validation for specific categories

### 2. Frontend (`app/page.js`)

**Added state management:**
```javascript
const [mediaFile, setMediaFile] = useState(null);
const [mediaPreview, setMediaPreview] = useState(null);
```

**Added handler functions:**
- `handleMediaChange()` - Processes file selection, validates, creates preview
- `removeMedia()` - Clears selected media

**Updated complaint submission:**
- Checks if media is required for selected category
- Converts media to Base64 before sending
- Includes media in complaint payload
- Clears media after successful submission

**Added UI components:**
- Media upload section in complaint form
- Drag-and-drop area with file input
- Image/video preview
- Remove button for selected media
- Dynamic label showing "Required" or "Optional"
- File type and size information

**Added media display:**
- Shows uploaded media in complaint view
- Displays images inline
- Provides video player with controls
- Shows upload timestamp

## User Experience

### For Students/Teachers:

1. **Fill complaint form** with title, description, category, branch
2. **Media section appears** showing:
   - "Photo/Video (Required)" for Bullying, Ragging, Infrastructure Issue
   - "Photo/Video (Optional)" for other categories
3. **Upload media** by:
   - Clicking the upload area
   - Dragging and dropping files
4. **Preview** the selected media
5. **Remove** if needed
6. **Submit** complaint (validation ensures required media is present)

### For Admin/Principal:

1. **View complaints** with media displayed
2. **See images/videos** inline in complaint details
3. **Play videos** with built-in controls
4. **Check upload timestamp** for verification

## Technical Details

### Supported File Types:
- **Images**: JPEG, PNG, GIF
- **Videos**: MP4, WebM, MOV (QuickTime)

### File Size Limit:
- Maximum 50MB per file
- Base64 encoding adds ~33% overhead

### Storage:
- Media stored as Base64 in MongoDB
- Included in complaint document
- Metadata includes upload timestamp and file type

### Validation:
- Client-side: File type and size validation
- Server-side: File type, size, and requirement validation
- Error messages guide users to fix issues

## Database Schema Update

```javascript
complaint.media = {
  id: "uuid",
  base64: "data:image/jpeg;base64,...",
  type: "image/jpeg",
  uploadedAt: "2024-03-15T10:30:00Z"
}
```

## Error Handling

**Client-side errors:**
- "Invalid file type. Allowed: JPEG, PNG, GIF, MP4, WebM, MOV"
- "File too large. Maximum size: 50MB"
- "Media (photo/video) is required for [Category] complaints"

**Server-side errors:**
- Same validation errors returned as JSON responses

## Future Enhancements

1. **Compression**: Compress images/videos before storage
2. **CDN Integration**: Store media on CDN instead of database
3. **Multiple Files**: Allow multiple media uploads per complaint
4. **Thumbnail Generation**: Generate thumbnails for preview
5. **Virus Scanning**: Scan uploaded files for malware
6. **Watermarking**: Add watermark to images for authenticity
7. **Encryption**: Encrypt sensitive media files
8. **Expiration**: Auto-delete media after certain period

## Testing Checklist

- [ ] Upload image to optional category complaint
- [ ] Upload video to optional category complaint
- [ ] Try submitting Bullying complaint without media (should fail)
- [ ] Upload media to Bullying complaint (should succeed)
- [ ] Try uploading unsupported file type (should fail)
- [ ] Try uploading file > 50MB (should fail)
- [ ] View complaint with media in student dashboard
- [ ] View complaint with media in admin dashboard
- [ ] View complaint with media in principal dashboard
- [ ] Remove media and reupload
- [ ] Verify media displays correctly (image and video)
