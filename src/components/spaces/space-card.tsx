'use client'

import { Space } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Users, Mic, Music } from 'lucide-react'
import Link from 'next/link'

const typeLabels: Record<string, string> = {
  recording: '녹음실',
  practice: '연습실',
  both: '복합',
}

const typeIcons: Record<string, React.ReactNode> = {
  recording: <Mic className="h-3 w-3" />,
  practice: <Music className="h-3 w-3" />,
  both: <Music className="h-3 w-3" />,
}

export function SpaceCard({ space }: { space: Space }) {
  return (
    <Link href={`/spaces/${space.id}`}>
      <Card className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={space.photos[0] || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800'}
            alt={space.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 gap-1 bg-black/50 text-white backdrop-blur-sm border-0"
          >
            {typeIcons[space.type]}
            {typeLabels[space.type]}
          </Badge>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-lg font-bold text-white truncate">{space.name}</h3>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              최대 {space.capacity}명
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {space.address?.split(' ').slice(0, 2).join(' ') || '서울'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {space.equipment.slice(0, 3).map((eq) => (
              <Badge key={eq} variant="outline" className="text-xs font-normal">
                {eq}
              </Badge>
            ))}
            {space.equipment.length > 3 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{space.equipment.length - 3}
              </Badge>
            )}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xl font-bold text-primary">
                {space.hourly_rate.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">원/시간</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
