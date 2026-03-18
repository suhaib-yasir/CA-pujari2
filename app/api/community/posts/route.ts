import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    const supabaseAdmin = createServerSupabase()
    const { data, error } = await supabaseAdmin
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      // eslint-disable-next-line no-console
      console.error('API /api/community/posts GET error', error)
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
    const { title, content, category, author_name } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing title or content' }, { status: 400 })
    }

    const supabaseAdmin = createServerSupabase()
    const { data, error } = await supabaseAdmin
      .from('community_posts')
      .insert({
        title,
        content,
        category: category || 'General',
        author_name: author_name || 'Anonymous',
      })
      .select('*')

    if (error) {
      // eslint-disable-next-line no-console
      console.error('API /api/community/posts POST error', error)
      return NextResponse.json({ error: error.message ?? String(error) }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
