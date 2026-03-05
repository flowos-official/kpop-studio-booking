'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { sampleSpaces, sampleBookings } from '@/lib/seed-data'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Music,
  Users,
  Plus,
  Mic,
} from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addDays,
  parseISO,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import Link from 'next/link'

const typeLabels: Record<string, string> = {
  recording: '녹음실',
  practice: '연습실',
  both: '복합',
}

const typeColors: Record<string, string> = {
  recording: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  practice: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  both: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: '대기중', color: 'bg-yellow-500/20 text-yellow-400' },
  confirmed: { label: '확정', color: 'bg-green-500/20 text-green-400' },
  cancelled: { label: '취소', color: 'bg-red-500/20 text-red-400' },
  completed: { label: '완료', color: 'bg-gray-500/20 text-gray-400' },
}

// Generate more sample bookings for a richer calendar view
function generateBookings() {
  const now = new Date()
  const bookings = [...sampleBookings]

  // Add more bookings spread across the month
  const additionalBookings = [
    {
      id: '3',
      space_id: '2',
      artist_id: '2',
      user_id: null,
      start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 14, 0).toISOString(),
      end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 17, 0).toISOString(),
      status: 'confirmed' as const,
      total_price: 240000,
      notes: '보컬 레코딩',
      created_at: new Date().toISOString(),
    },
    {
      id: '4',
      space_id: '4',
      artist_id: '1',
      user_id: null,
      start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 10, 0).toISOString(),
      end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 14, 0).toISOString(),
      status: 'pending' as const,
      total_price: 480000,
      notes: '뮤직비디오 촬영 전 리허설',
      created_at: new Date().toISOString(),
    },
    {
      id: '5',
      space_id: '1',
      artist_id: '3',
      user_id: null,
      start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 9, 0).toISOString(),
      end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12, 0).toISOString(),
      status: 'completed' as const,
      total_price: 450000,
      notes: '앨범 녹음 - 타이틀곡 가이드',
      created_at: new Date().toISOString(),
    },
    {
      id: '6',
      space_id: '3',
      artist_id: '2',
      user_id: null,
      start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 15, 0).toISOString(),
      end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 18, 0).toISOString(),
      status: 'confirmed' as const,
      total_price: 180000,
      notes: '안무 연습 - 컴백 준비',
      created_at: new Date().toISOString(),
    },
    {
      id: '7',
      space_id: '1',
      artist_id: '1',
      user_id: null,
      start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0).toISOString(),
      end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 0).toISOString(),
      status: 'confirmed' as const,
      total_price: 450000,
      notes: '보컬 녹음 세션',
      created_at: new Date().toISOString(),
    },
  ]

  return [...bookings, ...additionalBookings]
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<(typeof allBookings)[0] | null>(null)
  const [spaceFilter, setSpaceFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const allBookings = useMemo(() => generateBookings(), [])

  const filteredBookings = useMemo(() => {
    return allBookings.filter((b) => {
      if (spaceFilter !== 'all' && b.space_id !== spaceFilter) return false
      if (statusFilter !== 'all' && b.status !== statusFilter) return false
      return true
    })
  }, [allBookings, spaceFilter, statusFilter])

  // Calendar grid calculation
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getBookingsForDay = (day: Date) => {
    return filteredBookings.filter((b) => isSameDay(parseISO(b.start_time), day))
  }

  const selectedDayBookings = selectedDate ? getBookingsForDay(selectedDate) : []

  // Stats
  const monthBookings = filteredBookings.filter((b) => {
    const d = parseISO(b.start_time)
    return isSameMonth(d, currentMonth)
  })
  const confirmedCount = monthBookings.filter((b) => b.status === 'confirmed').length
  const pendingCount = monthBookings.filter((b) => b.status === 'pending').length
  const monthRevenue = monthBookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.total_price || 0), 0)

  const weekDayLabels = ['월', '화', '수', '목', '금', '토', '일']

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-primary" />
            예약 캘린더
          </h1>
          <p className="mt-1 text-muted-foreground">전체 예약 현황을 한눈에 확인하세요</p>
        </div>
        <Link href="/spaces">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            새 예약
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">이번 달 예약</p>
            <p className="text-2xl font-bold mt-1">{monthBookings.length}건</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">확정</p>
            <p className="text-2xl font-bold mt-1 text-green-400">{confirmedCount}건</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">대기중</p>
            <p className="text-2xl font-bold mt-1 text-yellow-400">{pendingCount}건</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">예상 매출</p>
            <p className="text-2xl font-bold mt-1 text-primary">{(monthRevenue / 10000).toFixed(0)}만원</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main Calendar */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-xl min-w-[140px] text-center">
                  {format(currentMonth, 'yyyy년 M월', { locale: ko })}
                </CardTitle>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setCurrentMonth(new Date())
                    setSelectedDate(new Date())
                  }}
                >
                  오늘
                </Button>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Select value={spaceFilter} onValueChange={setSpaceFilter}>
                  <SelectTrigger className="h-8 w-[140px] text-xs">
                    <SelectValue placeholder="공간 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 공간</SelectItem>
                    {sampleSpaces.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name.split(' - ')[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 w-[110px] text-xs">
                    <SelectValue placeholder="상태 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="confirmed">확정</SelectItem>
                    <SelectItem value="pending">대기중</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                    <SelectItem value="cancelled">취소</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Mobile filters */}
            <div className="flex sm:hidden items-center gap-2 mb-4">
              <Select value={spaceFilter} onValueChange={setSpaceFilter}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue placeholder="공간 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 공간</SelectItem>
                  {sampleSpaces.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name.split(' - ')[0]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="confirmed">확정</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                  <SelectItem value="completed">완료</SelectItem>
                  <SelectItem value="cancelled">취소</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekDayLabels.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const dayBookings = getBookingsForDay(day)
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const today = isToday(day)

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`relative min-h-[80px] sm:min-h-[100px] rounded-lg border p-1.5 text-left transition-all ${
                      !isCurrentMonth
                        ? 'border-transparent bg-muted/10 text-muted-foreground/40'
                        : isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : today
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-border/30 hover:border-border hover:bg-muted/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                          today
                            ? 'bg-primary text-primary-foreground'
                            : ''
                        }`}
                      >
                        {format(day, 'd')}
                      </span>
                      {dayBookings.length > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          {dayBookings.length}건
                        </span>
                      )}
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {dayBookings.slice(0, 3).map((booking) => {
                        const space = sampleSpaces.find((s) => s.id === booking.space_id)
                        return (
                          <div
                            key={booking.id}
                            className={`rounded px-1 py-0.5 text-[10px] leading-tight truncate border ${
                              typeColors[space?.type || 'recording']
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedBooking(booking)
                            }}
                          >
                            {format(parseISO(booking.start_time), 'HH:mm')} {space?.name.split(' - ')[0].replace(/\s/g, '')}
                          </div>
                        )
                      })}
                      {dayBookings.length > 3 && (
                        <div className="text-[10px] text-muted-foreground px-1">
                          +{dayBookings.length - 3}건 더
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded bg-violet-500/40" />
                녹음실
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded bg-emerald-500/40" />
                연습실
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded bg-amber-500/40" />
                복합
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar — selected day details */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {selectedDate
                  ? format(selectedDate, 'M월 d일 (EEEE)', { locale: ko })
                  : '날짜를 선택하세요'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedDate ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  캘린더에서 날짜를 클릭하면<br />해당일 예약 목록이 표시됩니다
                </p>
              ) : selectedDayBookings.length === 0 ? (
                <div className="text-center py-6">
                  <CalendarIcon className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">예약이 없습니다</p>
                  <Link href="/spaces">
                    <Button variant="outline" size="sm" className="mt-3 gap-1">
                      <Plus className="h-3.5 w-3.5" />
                      예약하기
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayBookings.map((booking) => {
                    const space = sampleSpaces.find((s) => s.id === booking.space_id)
                    const status = statusConfig[booking.status]
                    return (
                      <button
                        key={booking.id}
                        onClick={() => setSelectedBooking(booking)}
                        className="w-full rounded-lg border border-border/50 p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {space?.name || '알 수 없는 공간'}
                            </p>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {format(parseISO(booking.start_time), 'HH:mm')} -{' '}
                              {format(parseISO(booking.end_time), 'HH:mm')}
                            </div>
                            {booking.notes && (
                              <p className="mt-1 text-xs text-muted-foreground truncate">
                                {booking.notes}
                              </p>
                            )}
                          </div>
                          <Badge className={`text-[10px] ${status.color} border-0`}>
                            {status.label}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {booking.total_price?.toLocaleString()}원
                          </span>
                          {space && (
                            <Badge variant="outline" className="text-[10px] py-0">
                              {typeLabels[space.type]}
                            </Badge>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming bookings quick list */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                다가오는 예약
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredBookings
                  .filter((b) => new Date(b.start_time) >= new Date() && b.status !== 'cancelled')
                  .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                  .slice(0, 5)
                  .map((booking) => {
                    const space = sampleSpaces.find((s) => s.id === booking.space_id)
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted/20 cursor-pointer"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <div
                          className={`h-2 w-2 rounded-full flex-shrink-0 ${
                            booking.status === 'confirmed'
                              ? 'bg-green-400'
                              : 'bg-yellow-400'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {format(parseISO(booking.start_time), 'M/d')} {space?.name.split(' - ')[0]}
                          </p>
                        </div>
                        <span className="text-muted-foreground flex-shrink-0">
                          {format(parseISO(booking.start_time), 'HH:mm')}
                        </span>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              예약 상세
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (() => {
            const space = sampleSpaces.find((s) => s.id === selectedBooking.space_id)
            const status = statusConfig[selectedBooking.status]
            const startTime = parseISO(selectedBooking.start_time)
            const endTime = parseISO(selectedBooking.end_time)
            const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{space?.name}</h3>
                  <Badge className={`${status.color} border-0`}>{status.label}</Badge>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{format(startTime, 'yyyy년 M월 d일 (EEEE)', { locale: ko })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>
                      {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')} ({hours}시간)
                    </span>
                  </div>
                  {space && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span>{space.address}</span>
                    </div>
                  )}
                  {space && (
                    <div className="flex items-center gap-3">
                      {space.type === 'recording' ? (
                        <Mic className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <Music className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span>{typeLabels[space.type]}</span>
                    </div>
                  )}
                </div>

                {selectedBooking.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">메모</p>
                      <p className="text-sm">{selectedBooking.notes}</p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">총 금액</span>
                  <span className="text-xl font-bold text-primary">
                    {selectedBooking.total_price?.toLocaleString()}원
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  {selectedBooking.status === 'pending' && (
                    <Button className="flex-1">예약 확정</Button>
                  )}
                  {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                    <Button variant="outline" className="flex-1">
                      예약 취소
                    </Button>
                  )}
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
