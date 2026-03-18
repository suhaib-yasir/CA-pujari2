# Admin Panel & CRUD Setup Guide

## ✅ What's Been Built

### 1. **Admin Panel** (`/admin`)
- **URL**: `http://localhost:3000/admin`
- **Protection**: Requires user login (redirects to `/login` if not authenticated)
- **Features**:
  - ✓ Create Courses with: title, description, duration, level, modules, price, students_count
  - ✓ Edit Courses
  - ✓ Delete Courses
  - ✓ Create Webinars with: title, description, start date/time, duration, platform, price, seats
  - ✓ Edit Webinars
  - ✓ Delete Webinars
  - ✓ Real-time data refresh
  - ✓ Tabbed interface for courses and webinars
  - ✓ Success/Error messages

### 2. **CRUD API Endpoints**

**Courses:**
- `GET /api/courses` - Fetch all courses
- `POST /api/courses` - Create a course
- `PUT /api/courses/[id]` - Update a course
- `DELETE /api/courses/[id]` - Delete a course

**Webinars:**
- `GET /api/webinars` - Fetch all webinars
- `POST /api/webinars` - Create a webinar
- `PUT /api/webinars/[id]` - Update a webinar
- `DELETE /api/webinars/[id]` - Delete a webinar

### 3. **Pages Connected to Supabase**
- **Courses Page** (`/courses`) - Displays courses from `/api/courses`
- **Webinars Page** (`/webinars`) - Displays webinars from `/api/webinars`

---

## 🚀 Setup Instructions

### Step 1: Create Tables in Supabase

1. Go to your **Supabase Dashboard** → SQL Editor
2. Copy the entire SQL from `SQL_SCHEMA_AND_DUMMY_DATA.sql`
3. Paste it into the SQL editor and click **Run**
4. ✅ Tables `courses` and `webinars` will be created with dummy data

### Step 2: Add Service Role Key to .env.local

The admin API endpoints require `SUPABASE_SERVICE_ROLE_KEY` for server-side operations.

1. Go to Supabase → Settings → API
2. Copy the **Service Role Key** (KEEP THIS SECRET! Don't commit to Git)
3. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://doqjgpznxzqnmoclnuvm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable__Gy73LbuOznOUAcJFq7jlw_NAEcpIxm
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Restart Development Server

```bash
npm run dev
```

---

## 🧪 Testing the Admin Panel

### Test Workflow:

1. **Login First**
   - Navigate to `/login`
   - Sign up with an email and password (or use existing account)

2. **Access Admin Panel**
   - Go to `/admin`
   - You should see two tabs: **Courses** and **Webinars**

3. **Create a Course**
   - Click "Courses" tab
   - Fill in:
     - Title: "Advanced Trading Strategies"
     - Level: "Intermediate"
     - Description: "Learn advanced trading techniques"
     - Duration: "8 weeks"
     - Modules: 20
     - Price: "₹12,999"
   - Click "Create Course"
   - ✅ You should see success message and course appears in list

4. **Edit a Course**
   - Click the edit icon on any course
   - Form will populate with that course's data
   - Make changes and click "Update Course"
   - ✅ Course updated

5. **Delete a Course**
   - Click the trash icon on any course
   - Confirm deletion
   - ✅ Course removed

6. **Create a Webinar**
   - Click "Webinars" tab
   - Fill in:
     - Title: "Advanced Options Trading"
     - Start Date & Time: 2026-06-15 18:00
     - Duration: 120 minutes
     - Platform: "Zoom"
     - Price: "₹999"
     - Seats: 250
   - Click "Create Webinar"
   - ✅ Success message and webinar appears in list

7. **Verify Data in Public Pages**
   - Go to `/courses` → New courses should appear
   - Go to `/webinars` → New webinars should appear

---

## 📊 Database Schema

### Courses Table
```sql
- id (BIGSERIAL PRIMARY KEY) - Auto-generated
- title (TEXT) - Required
- description (TEXT) - Optional
- duration (TEXT) - e.g., "4 weeks"
- level (TEXT) - e.g., "Beginner", "Intermediate"
- modules (INTEGER) - Number of modules
- price (TEXT) - e.g., "₹4,999"
- students_count (INTEGER) - Number of enrolled students
- created_at (TIMESTAMP) - Auto
- updated_at (TIMESTAMP) - Auto
```

### Webinars Table
```sql
- id (BIGSERIAL PRIMARY KEY) - Auto-generated
- title (TEXT) - Required
- description (TEXT) - Optional
- starts_at (TIMESTAMP) - Required, start date & time
- duration_minutes (INTEGER) - Duration in minutes
- platform (TEXT) - e.g., "Zoom", "Google Meet"
- price (TEXT) - e.g., "Free", "₹299"
- seats (INTEGER) - Available seats
- created_at (TIMESTAMP) - Auto
- updated_at (TIMESTAMP) - Auto
```

---

## 🔐 Row Level Security (RLS)

Currently, RLS policies are set to allow:
- ✓ **Public**: Read courses and webinars
- ✓ **Authenticated Users**: Insert, update, delete

To restrict admin operations to only admin users:

```sql
-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Only allow admin users (via profiles table)
CREATE POLICY "Admin can manage courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

Then update the `profiles` table and set `role = 'admin'` for admin users.

---

## 🛠 Troubleshooting

### Error: "supabaseKey is required"
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Restart the dev server after adding env vars

### Admin panel shows "Loading admin panel..."
- Check browser console for errors
- Ensure you're logged in
- Check that `.env.local` has correct keys

### Changes don't appear on courses/webinars pages
- Click "Refresh" button in admin panel
- Or manually refresh the page (F5)
- Check network tab in browser DevTools to see if API calls are working

### Course/Webinar create fails with error
- Check browser console for error message
- Common issues:
  - Missing required fields (title for courses, title + starts_at for webinars)
  - Supabase connection issues
  - RLS policies blocking inserts

---

## 📝 Dummy Data Included

The SQL script includes:
- **6 Courses** with realistic trading course content
- **6 Webinars** with scheduled start times

You can delete these and add your own, or modify them in the admin panel.

---

## 🔄 Workflow Summary

```
User Login → /admin → Create/Edit/Delete Courses & Webinars
                     ↓
                  API Endpoints (/api/courses, /api/webinars)
                     ↓
                  Supabase Database
                     ↓
                  /courses and /webinars pages display data
```

---

## ✨ Next Steps (Optional Enhancements)

1. **Add role-based access control** - Only allow role='admin' users to access `/admin`
2. **Add course content management** - Store actual course modules/videos
3. **Add webinar bookings** - Track who books webinars
4. **Add course enrollment** - Track student progress
5. **Add analytics** - Dashboard showing course/webinar stats

---

**That's it!** Your admin panel is ready to use. 🎉
