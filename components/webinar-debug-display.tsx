'use client'

import { useEffect, useState } from 'react'

export function WebinarDebugDisplay() {
  const [webinars, setWebinars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWebinars() {
      try {
        const res = await fetch('/api/webinars')
        const data = await res.json()
        setWebinars(Array.isArray(data.data) ? data.data : [])
      } catch (err) {
        console.error('Debug fetch error:', err)
      }
      setLoading(false)
    }
    fetchWebinars()
  }, [])

  if (loading) return <div className="p-4">Loading webinars...</div>

  return (
    <div className="p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
      <p className="font-semibold text-blue-600 mb-4">🔍 Webinar Test Display (Debug Only)</p>
      <p className="text-sm mb-4">Total webinars: {webinars.length}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {webinars.length === 0 ? (
          <p className="text-sm text-muted-foreground">No webinars to display</p>
        ) : (
          webinars.map((w: any) => (
            <div key={w.id} className="p-3 bg-white border rounded">
              <p className="font-semibold text-sm">{w.title}</p>
              <p className="text-xs text-gray-600">{w.platform}</p>
              <p className="text-xs text-gray-500">{new Date(w.starts_at || '').toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
