'use client'

import { use, useState } from 'react'
import { sampleSpaces } from '@/lib/seed-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TimeSlotPicker } from '@/components/booking/time-slot-picker'
import { MapPin, Users, Mic, Music, Monitor, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

const typeLabels: Record<string, string> = {
  recording: '녹음실',
  practice: '연습실',
  both: '복합 스튜디오',
}

export default function SpaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const space = sampleSpaces.find((s) => s.id === id)
  const [selectedPhoto, setSelectedPhoto] = useState(0)

  if (!space) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">공간을 찾을 수 없습니다</h1>
        <Link href="/spaces">
          <Button variant="outline" className="mt-4">공간 목록으로</Button>
        </Link>
      </div>
    )
  }

  const handleSlotSelect = (date: Date, startHour: number, endHour: number) => {
    const bookingParams = new URLSearchParams({
      spaceId: space.id,
      date: format(date, 'yyyy-MM-dd'),
      start: startHour.toString(),
      end: endHour.toString(),
    })
    router.push(`/booking/new?${bookingParams.toString()}`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link href="/spaces" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        목록으로 돌아가기
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left - Photos & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo gallery */}
          <div className="space-y-3">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <img
                src={space.photos[selectedPhoto] || space.photos[0]}
                alt={space.name}
                className="h-full w-full object-cover"
              />
              <Badge className="absolute left-4 top-4 gap-1 bg-black/60 text-white backdrop-blur-sm border-0">
                {space.type === 'recording' ? <Mic className="h-3 w-3" /> : <Music className="h-3 w-3" />}
                {typeLabels[space.type]}
              </Badge>
            </div>
            {space.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {space.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhoto(index)}
                    className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      selectedPhoto === index ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{space.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {space.address}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                최대 {space.capacity}명
              </span>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed">{space.description}</p>
          </div>

          <Separator />

          {/* Equipment */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                장비 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {space.equipment.map((eq) => (
                  <div key={eq} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {eq}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar */}
          <TimeSlotPicker
            hourlyRate={space.hourly_rate}
            onSlotSelect={handleSlotSelect}
          />
        </div>

        {/* Right - Pricing card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">
                      {space.hourly_rate.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">원/시간</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">공간 유형</span>
                    <span className="font-medium">{typeLabels[space.type]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">수용 인원</span>
                    <span className="font-medium">최대 {space.capacity}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">장비</span>
                    <span className="font-medium">{space.equipment.length}종</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">위치</span>
                    <span className="font-medium">{space.address?.split(' ').slice(1, 3).join(' ')}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <p className="text-xs text-muted-foreground">
                  위 캘린더에서 원하시는 시간대를 선택하시면 예약을 진행할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
