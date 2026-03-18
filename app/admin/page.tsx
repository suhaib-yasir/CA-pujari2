'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Edit2, Plus, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp, stagger } from '@/lib/animations'

// Safe date formatter
function safeFormatDate(dateStr?: string): string {
  if (!dateStr) return 'TBA'
  try {
    return new Date(dateStr).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

type Course = {
  id?: string
  title: string
  description?: string
  duration?: string
  level?: string
  modules?: number
  price?: string
  students_count?: number
}

type Webinar = {
  id?: string
  title: string
  description?: string
  starts_at?: string
  duration_minutes?: number
  platform?: string
  price?: string
  seats?: number
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [courses, setCourses] = useState<Course[]>([])
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [editingWebinar, setEditingWebinar] = useState<Webinar | null>(null)
  const [courseForm, setCourseForm] = useState<Course>({ title: '', description: '', duration: '', level: 'Beginner', modules: 0, price: '' })
  const [webinarForm, setWebinarForm] = useState<Webinar>({ title: '', description: '', starts_at: '', duration_minutes: 60, platform: 'Zoom', price: '', seats: 500 })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Load courses and webinars
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [coursesRes, webinarsRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/webinars'),
      ])

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json()
        const coursesList = Array.isArray(coursesData.data) ? coursesData.data : []
        setCourses(coursesList)
        // eslint-disable-next-line no-console
        console.log('Courses loaded:', coursesList.length)
      } else {
        const err = await coursesRes.json()
        // eslint-disable-next-line no-console
        console.error('Courses API error:', err)
        setError(`Failed to load courses: ${err.error}`)
      }

      if (webinarsRes.ok) {
        const webinarsData = await webinarsRes.json()
        const webinarsList = Array.isArray(webinarsData.data) ? webinarsData.data : []
        setWebinars(webinarsList)
        // eslint-disable-next-line no-console
        console.log('Webinars loaded:', webinarsList.length)
      } else {
        const err = await webinarsRes.json()
        // eslint-disable-next-line no-console
        console.error('Webinars API error:', err)
        setError(`Failed to load webinars: ${err.error}`)
      }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to load data', err)
      setError(`Error loading data: ${err.message}`)
    }
    setLoading(false)
  }

  // COURSE HANDLERS
  async function handleCreateCourse(e: React.FormEvent) {
    e.preventDefault()
    setSubmitLoading(true)
    setMessage('')

    try {
      if (editingCourse?.id) {
        // Update course
        const res = await fetch(`/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseForm),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to update course')
        }

        setMessage('✅ Course updated successfully')
        setEditingCourse(null)
      } else {
        // Create course
        const res = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseForm),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to create course')
        }

        setMessage('✅ Course created successfully')
      }

      setCourseForm({ title: '', description: '', duration: '', level: 'Beginner', modules: 0, price: '' })
      loadData()
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  async function handleDeleteCourse(id: string) {
    if (!confirm('Are you sure you want to delete this course?')) return

    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to delete course')
      }

      setMessage('✅ Course deleted successfully')
      loadData()
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`)
    }
  }

  // WEBINAR HANDLERS
  async function handleCreateWebinar(e: React.FormEvent) {
    e.preventDefault()
    setSubmitLoading(true)
    setMessage('')

    try {
      if (editingWebinar?.id) {
        // Update webinar
        const res = await fetch(`/api/webinars/${editingWebinar.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webinarForm),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to update webinar')
        }

        setMessage('✅ Webinar updated successfully')
        setEditingWebinar(null)
      } else {
        // Create webinar
        const res = await fetch('/api/webinars', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webinarForm),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to create webinar')
        }

        setMessage('✅ Webinar created successfully')
      }

      setWebinarForm({ title: '', description: '', starts_at: '', duration_minutes: 60, platform: 'Zoom', price: '', seats: 500 })
      loadData()
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  async function handleDeleteWebinar(id: string) {
    if (!confirm('Are you sure you want to delete this webinar?')) return

    try {
      const res = await fetch(`/api/webinars/${id}`, { method: 'DELETE' })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to delete webinar')
      }

      setMessage('✅ Webinar deleted successfully')
      loadData()
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`)
    }
  }

  // Fallback demo data
  const fallbackCourses: Course[] = [
    { id: '1', title: 'Trading Fundamentals', description: 'Learn the foundations of stock market trading.', duration: '4 weeks', level: 'Beginner', modules: 12, price: '₹4,999', students_count: 2500 },
    { id: '2', title: 'Technical Analysis Mastery', description: 'Read charts like a professional.', duration: '6 weeks', level: 'Beginner', modules: 18, price: '₹7,999', students_count: 1800 },
  ]

  const fallbackWebinars: Webinar[] = [
    { id: '1', title: 'Stock Market Basics for Beginners', description: 'Learn how stock markets work.', starts_at: '2026-04-15T19:00:00', duration_minutes: 90, platform: 'Zoom', price: 'Free', seats: 500 },
    { id: '2', title: 'Candlestick Patterns That Work', description: 'Professional trading patterns explained.', starts_at: '2026-04-22T19:00:00', duration_minutes: 120, platform: 'Google Meet', price: '₹299', seats: 300 },
  ]

  if (authLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading admin panel...</p>
        </div>
      </>
    )
  }

  if (!user) {
    return null
  }

  // Use fallback data if API returns empty
  const displayCourses = courses.length > 0 ? courses : fallbackCourses
  const displayWebinars = webinars.length > 0 ? webinars : fallbackWebinars

  return (
    <>
      <Navigation />

      <div className="min-h-screen bg-background py-16">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-6">
          <motion.h1 variants={fadeUp} className="text-4xl font-bold mb-2">
            Admin Dashboard
          </motion.h1>
          <motion.p variants={fadeUp} className="text-muted-foreground mb-8">
            Manage courses and webinars
          </motion.p>

          {message && (
            <motion.div variants={fadeUp} className="mb-6 p-4 bg-muted rounded-lg">
              {message}
            </motion.div>
          )}

          {error && (
            <motion.div variants={fadeUp} className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-600">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
              <Button onClick={loadData} variant="outline" size="sm" className="mt-2">
                Retry
              </Button>
            </motion.div>
          )}

          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="mb-8 w-full grid w-full grid-cols-2">
              <TabsTrigger value="courses" className="w-full">Courses ({displayCourses.length})</TabsTrigger>
              <TabsTrigger value="webinars" className="w-full">Webinars ({displayWebinars.length})</TabsTrigger>
            </TabsList>

            {/* ===== COURSES TAB ===== */}
            <TabsContent value="courses" className="space-y-8 min-h-screen">
              {/* Course Form */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <Card>
                  <CardHeader>
                    <CardTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</CardTitle>
                    <CardDescription>Fill in the course details below</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateCourse} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            placeholder="e.g., Trading Fundamentals"
                            value={courseForm.title}
                            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="level">Level</Label>
                          <Input
                            id="level"
                            placeholder="e.g., Beginner"
                            value={courseForm.level}
                            onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Course description"
                          value={courseForm.description}
                          onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="duration">Duration</Label>
                          <Input
                            id="duration"
                            placeholder="e.g., 4 weeks"
                            value={courseForm.duration}
                            onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="modules">Modules</Label>
                          <Input
                            id="modules"
                            type="number"
                            placeholder="e.g., 12"
                            value={courseForm.modules}
                            onChange={(e) => setCourseForm({ ...courseForm, modules: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            placeholder="e.g., ₹4,999"
                            value={courseForm.price}
                            onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button type="submit" disabled={submitLoading}>
                          {editingCourse ? 'Update Course' : 'Create Course'}
                        </Button>
                        {editingCourse && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditingCourse(null)
                              setCourseForm({ title: '', description: '', duration: '', level: 'Beginner', modules: 0, price: '' })
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Courses List */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">All Courses</h2>
                  <Button onClick={loadData} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayCourses.length === 0 ? (
                    <p className="text-muted-foreground">No courses yet</p>
                  ) : (
                    displayCourses.map((course) => (
                      <Card key={course.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <CardDescription>{course.level}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>{course.duration}</p>
                            <p>{course.modules} modules</p>
                            <p className="font-semibold">{course.price}</p>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingCourse(course)
                                setCourseForm(course)
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteCourse(course.id || '')}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </motion.div>
            </TabsContent>

            {/* ===== WEBINARS TAB ===== */}
            <TabsContent value="webinars" className="space-y-8 min-h-screen">
              {/* Webinar Form */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <Card>
                  <CardHeader>
                    <CardTitle>{editingWebinar ? 'Edit Webinar' : 'Create New Webinar'}</CardTitle>
                    <CardDescription>Fill in the webinar details below</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateWebinar} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="w-title">Title *</Label>
                          <Input
                            id="w-title"
                            placeholder="e.g., Stock Market Basics"
                            value={webinarForm.title}
                            onChange={(e) => setWebinarForm({ ...webinarForm, title: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="w-starts_at">Start Date & Time *</Label>
                          <Input
                            id="w-starts_at"
                            type="datetime-local"
                            value={webinarForm.starts_at}
                            onChange={(e) => setWebinarForm({ ...webinarForm, starts_at: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="w-description">Description</Label>
                        <Textarea
                          id="w-description"
                          placeholder="Webinar description"
                          value={webinarForm.description}
                          onChange={(e) => setWebinarForm({ ...webinarForm, description: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="w-duration">Duration (min)</Label>
                          <Input
                            id="w-duration"
                            type="number"
                            placeholder="e.g., 90"
                            value={webinarForm.duration_minutes}
                            onChange={(e) => setWebinarForm({ ...webinarForm, duration_minutes: parseInt(e.target.value) || 60 })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="w-platform">Platform</Label>
                          <Input
                            id="w-platform"
                            placeholder="e.g., Zoom"
                            value={webinarForm.platform}
                            onChange={(e) => setWebinarForm({ ...webinarForm, platform: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="w-price">Price</Label>
                          <Input
                            id="w-price"
                            placeholder="e.g., Free"
                            value={webinarForm.price}
                            onChange={(e) => setWebinarForm({ ...webinarForm, price: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="w-seats">Seats</Label>
                          <Input
                            id="w-seats"
                            type="number"
                            placeholder="e.g., 500"
                            value={webinarForm.seats}
                            onChange={(e) => setWebinarForm({ ...webinarForm, seats: parseInt(e.target.value) || 500 })}
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button type="submit" disabled={submitLoading}>
                          {editingWebinar ? 'Update Webinar' : 'Create Webinar'}
                        </Button>
                        {editingWebinar && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditingWebinar(null)
                              setWebinarForm({ title: '', description: '', starts_at: '', duration_minutes: 60, platform: 'Zoom', price: '', seats: 500 })
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Webinars List */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">All Webinars</h2>
                  <Button onClick={loadData} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayWebinars.length === 0 ? (
                    <p className="text-muted-foreground">No webinars yet</p>
                  ) : (
                    displayWebinars.map((webinar) => {
                      try {
                        return (
                          <Card key={webinar.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">{webinar.title}</CardTitle>
                              <CardDescription>{webinar.platform}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <p className="text-sm text-muted-foreground line-clamp-2">{webinar.description}</p>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p>{safeFormatDate(webinar.starts_at)}</p>
                                <p>{webinar.duration_minutes || 60} minutes</p>
                                <p className="font-semibold">{webinar.price || 'N/A'}</p>
                                <p>{webinar.seats || 500} seats</p>
                              </div>
                              <div className="flex gap-2 pt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingWebinar(webinar)
                                    setWebinarForm(webinar)
                                  }}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteWebinar(webinar.id || '')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      } catch (err) {
                        console.error('Error rendering webinar:', webinar, err)
                        return (
                          <Card key={webinar.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">{webinar.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-xs text-red-600">Error rendering webinar</p>
                            </CardContent>
                          </Card>
                        )
                      }
                    })
                  )}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </>
  )
}
