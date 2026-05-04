import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Suratin — Generator Surat Resmi AI'
  const subtitle = searchParams.get('subtitle') ?? 'Buat surat resmi dengan cepat'

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A1628',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ color: '#0891B2', fontSize: 24, fontWeight: 700 }}>suratin.id</div>
        <div>
          <div
            style={{
              color: '#FFFFFF',
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            {title}
          </div>
          <div style={{ color: '#94A3B8', fontSize: 28 }}>{subtitle}</div>
        </div>
        <div style={{ color: '#22D3EE', fontSize: 20 }}>AI-powered · Gratis · Download PDF</div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
