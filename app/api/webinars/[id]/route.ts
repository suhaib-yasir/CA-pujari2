import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseClient'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, starts_at, duration_minutes, platform, price, seats } = body

    if (!id || !title) {
      return NextResponse.json({ error: 'Missing id or title' }, { status: 400 })
    }

    const supabaseAdmin = createServerSupabase()
    const { data, error } = await supabaseAdmin
      .from('webinars')
      .update({
        title,
        description,
        starts_at,
        duration_minutes: duration_minutes || 60,
        platform,
        price,
        seats: seats || 500,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')

    if (error) {
      // eslint-disable-next-line no-console
      console.error('API /api/webinars/[id] PUT error', error)
      return NextResponse.json({ error: error.message ?? String(error) }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Webinar not found' }, { status: 404 })
    }

    return NextResponse.json({ data: data[0] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const supabaseAdmin = createServerSupabase()
    const { data, error } = await supabaseAdmin
      .from('webinars')
      .delete()
      .eq('id', id)
      .select('*')

    if (error) {
      // eslint-disable-next-line no-console
      console.error('API /api/webinars/[id] DELETE error', error)
      return NextResponse.json({ error: error.message ?? String(error) }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Webinar not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, data: data[0] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
