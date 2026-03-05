'use client'

import { use } from 'react'
import { sampleArtists } from '@/lib/seed-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Users, Building2, Music } from 'lucide-react'
import Link from 'next/link'

export default function ArtistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const artist = sampleArtists.find((a) => a.id === id)

  if (!artist) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">아티스트를 찾을 수 없습니다</h1>
        <Link href="/artists">
          <Button variant="outline" className="mt-4">아티스트 목록으로</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/artists" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        아티스트 목록으로
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Profile Photo */}
        <div className="md:col-span-1">
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <img
              src={artist.profile_photo || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400'}
              alt={artist.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>

        {/* Info */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{artist.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="gap-1">
                <Music className="h-3 w-3" />
                {artist.genre}
              </Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {artist.member_count === 1 ? '솔로' : `${artist.member_count}인조`}
              </span>
              {artist.agency && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {artist.agency}
                </span>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-2">소개</h2>
            <p className="text-muted-foreground leading-relaxed">{artist.bio}</p>
          </div>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">아티스트 정보</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">이름</span>
                  <p className="font-medium">{artist.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">소속사</span>
                  <p className="font-medium">{artist.agency || '-'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">장르</span>
                  <p className="font-medium">{artist.genre || '-'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">멤버 수</span>
                  <p className="font-medium">{artist.member_count}명</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
