# Media Upload Implementation

## Overview

This document describes the implementation of the media upload functionality that allows users to upload files directly to Supabase storage with a 100MB file size limit.

## Features Implemented

### ✅ File Upload to Supabase
- Files are uploaded directly to the `dreamcut-assets` Supabase storage bucket
- Uses the existing Supabase infrastructure already configured in the project
- Files are organized by user ID: `users/{userId}/uploads/{filename}`

### ✅ File Size Validation
- **100MB maximum file size limit** per file
- Client-side validation before upload starts
- Clear error messages when files exceed the limit
- File size display in the UI

### ✅ Supported File Types
- **Images**: All image formats (JPEG, PNG, GIF, WebP, etc.)
- **Videos**: MP4, MOV, AVI, WMV, FLV, WebM
- **Audio**: MP3, WAV, OGG, M4A, AAC
- **Documents**: PDF, DOC, DOCX, TXT

### ✅ User Experience Features
- **Real-time upload progress** with visual indicators
- **Loading states** with spinning animations
- **Error handling** with detailed error messages
- **Toast notifications** for success/failure feedback
- **Authentication checks** - only signed-in users can upload
- **File size display** in the media grid

### ✅ Technical Implementation

#### Storage Integration
```typescript
// lib/utils/storage.ts
export async function uploadUserMedia(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult>
```

#### Media Store Updates
```typescript
// store/useMediaStore.ts
interface MediaStore {
  updateUploadedMedia: (mediaId: string, updates: Partial<MediaItem>) => void;
  // ... other methods
}
```

#### Enhanced MediaItem Interface
```typescript
// components/chat/mediaTypes.ts
export interface MediaItem {
  // ... existing fields
  supabasePath?: string;
  supabaseBucket?: string;
  fileSize?: number;
  mimeType?: string;
  isUploading?: boolean;
  uploadProgress?: number;
  uploadError?: string;
}
```

## File Organization in Supabase

```
dreamcut-assets/
├── users/
│   ├── {user-id-1}/
│   │   └── uploads/
│   │       ├── 1703123456789_my_image.jpg
│   │       ├── 1703123456790_video.mp4
│   │       └── 1703123456791_document.pdf
│   ├── {user-id-2}/
│   │   └── uploads/
│   │       └── ...
```

## Usage Flow

1. **User clicks "Upload files"** button in the Media Modal
2. **File selection dialog** opens with supported file types
3. **File validation** checks size (100MB limit) and type
4. **Upload starts** with progress indicator
5. **File uploads to Supabase** storage bucket
6. **Media metadata saved** to database for persistence
7. **Success/error feedback** via toast notifications
8. **Media item appears** in the uploads grid with Supabase URL
9. **Media persists** across page reloads and sessions

## Error Handling

### File Size Errors
- Files over 100MB are rejected with clear error message
- Shows actual file size vs. limit

### Upload Errors
- Network failures
- Supabase storage errors
- Authentication issues
- File type validation errors

### User Feedback
- Toast notifications for all success/error states
- Visual indicators in the media grid
- Progress bars during upload
- Error overlays on failed uploads

## Security Considerations

- **Authentication required** - only signed-in users can upload
- **User isolation** - files are organized by user ID
- **File type validation** - only supported formats allowed
- **Size limits** - prevents abuse and storage overuse
- **Unique filenames** - timestamp-based naming prevents conflicts

## Database Persistence

### ✅ Media Metadata Storage
- **Database table**: `user_media` stores all uploaded file metadata
- **Automatic saving**: Metadata is saved after successful upload
- **User isolation**: Each user can only access their own media
- **Row Level Security**: Enforced at the database level

### ✅ Session Persistence
- **Page reload**: Media files persist across browser refreshes
- **User sessions**: Media is loaded when user signs in
- **Cross-device**: Media is available on any device where user signs in
- **Automatic loading**: Media loads automatically when opening uploads tab

## Integration with Chat

Once uploaded, media files are available in the chat interface:
- **Supabase URLs** are used for media references
- **File metadata** is preserved (size, type, upload date)
- **Thumbnail generation** for images and videos
- **Preview functionality** for all media types
- **Persistent availability** across sessions and devices

## Future Enhancements

Potential improvements that could be added:
- **Image compression** before upload
- **Thumbnail generation** for videos
- **Batch upload** with queue management
- **Upload resume** for large files
- **File organization** with folders/tags
- **Storage quota** management per user
