'use client'

import { Artist } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'
import Link from 'next/link'

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link href={`/artists/${artist.id}`}>
      <Card className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={artist.profile_photo || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400'}
            alt={artist.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white">{artist.name}</h3>
            <p className="text-sm text-white/70">{artist.agency}</p>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="gap-1">
              {artist.genre}
            </Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {artist.member_count === 1 ? '솔로' : `${artist.member_count}인조`}
            </span>
          </div>
          {artist.bio && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{artist.bio}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
