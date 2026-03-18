import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    const supabaseAdmin = createServerSupabase()
    const { data, error } = await supabaseAdmin.from('webinars').select('*').order('starts_at', { ascending: false })
    if (error) {
      // eslint-disable-next-line no-console
      console.error('API /api/webinars GET error', error)
      return NextResponse.json({ error: error.message ?? String(error) }, { status: 500 })
    }
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, starts_at, duration_minutes, platform, price, seats } = body

    if (!title || !starts_at) {
      return NextResponse.json({ error: 'Missing title or starts_at' }, { status: 400 })
    }

    const supabaseAdmin = createServerSupabase()
    const { data, error } = await supabaseAdmin
      .from('webinars')
      .insert({
        title,
        description,
        starts_at,
        duration_minutes: duration_minutes || 60,
        platform,
        price,
        seats: seats || 500,
        created_at: new Date().toISOString(),
      })
      .select('*')

    if (error) {
      // eslint-disable-next-line no-console
      console.error('API /api/webinars POST error', error)
      return NextResponse.json({ error: error.message ?? String(error) }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
