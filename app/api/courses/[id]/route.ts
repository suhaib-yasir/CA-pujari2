import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseClient'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, duration, level, modules, price, students_count } = body

    if (!id || !title) {
      return NextResponse.json({ error: 'Missing id or title' }, { status: 400 })
    }

    const supabaseAdmin = createServerSupabase()
    const { data, error } = await supabaseAdmin
      .from('courses')
      .update({
        title,
        description,
        duration,
        level,
        modules: modules || 0,
        price,
        students_count: students_count || 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')

    if (error) {
      // eslint-disable-next-line no-console
      console.error('API /api/courses/[id] PUT error', error)
      return NextResponse.json({ error: error.message ?? String(error) }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
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
      .from('courses')
      .delete()
      .eq('id', id)
      .select('*')

    if (error) {
      // eslint-disable-next-line no-console
      console.error('API /api/courses/[id] DELETE error', error)
      return NextResponse.json({ error: error.message ?? String(error) }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, data: data[0] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
