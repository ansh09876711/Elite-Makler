import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(
      'https://news.google.com/rss/search?q=Indian+real+estate+property&hl=en-IN&gl=IN&ceid=IN:en',
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    if (!res.ok) throw new Error('Failed to fetch RSS')
    const xml = await res.text()

    const items: any[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    
    // Premium Unsplash images for real estate categories
    const images = [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    ]

    while ((match = itemRegex.exec(xml)) !== null && items.length < 4) {
      const itemContent = match[1]
      
      const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/)
      const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/)
      const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
      const sourceMatch = itemContent.match(/<source[^>]*>([\s\S]*?)<\/source>/)

      if (titleMatch && linkMatch) {
        let title = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
        const link = linkMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
        const pubDateStr = pubDateMatch ? pubDateMatch[1].trim() : ''
        const source = sourceMatch ? sourceMatch[1].trim() : 'News'

        // Clean source off title
        if (title.includes(' - ')) {
          title = title.substring(0, title.lastIndexOf(' - ')).trim()
        }

        let dateFormatted = 'Recent'
        try {
          if (pubDateStr) {
            const date = new Date(pubDateStr)
            dateFormatted = date.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
          }
        } catch (e) {}

        items.push({
          title,
          link,
          date: dateFormatted,
          source,
          image: images[items.length % images.length],
          readTime: `${Math.floor(Math.random() * 3) + 3} min read`
        })
      }
    }

    return NextResponse.json({ success: true, articles: items })
  } catch (err: any) {
    console.error('News API error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
