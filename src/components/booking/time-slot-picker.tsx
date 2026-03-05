'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore } from 'date-fns'
import { ko } from 'date-fns/locale'

interface TimeSlotPickerProps {
  hourlyRate: number
  onSlotSelect: (date: Date, startHour: number, endHour: number) => void
  existingBookings?: { start_time: string; end_time: string }[]
}

const timeSlots = Array.from({ length: 14 }, (_, i) => i + 9) // 9AM to 10PM

export function TimeSlotPicker({ hourlyRate, onSlotSelect, existingBookings = [] }: TimeSlotPickerProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlots, setSelectedSlots] = useState<number[]>([])

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))

  const isSlotBooked = (date: Date, hour: number) => {
    return existingBookings.some((booking) => {
      const bookingStart = new Date(booking.start_time)
      const bookingEnd = new Date(booking.end_time)
      const slotTime = new Date(date)
      slotTime.setHours(hour, 0, 0, 0)
      return slotTime >= bookingStart && slotTime < bookingEnd
    })
  }

  const isSlotPast = (date: Date, hour: number) => {
    const slotTime = new Date(date)
    slotTime.setHours(hour, 0, 0, 0)
    return isBefore(slotTime, new Date())
  }

  const handleSlotClick = (date: Date, hour: number) => {
    if (isSlotBooked(date, hour) || isSlotPast(date, hour)) return

    if (!selectedDate || !isSameDay(selectedDate, date)) {
      setSelectedDate(date)
      setSelectedSlots([hour])
    } else {
      setSelectedSlots((prev) => {
        if (prev.includes(hour)) {
          return prev.filter((h) => h !== hour)
        }
        const newSlots = [...prev, hour].sort((a, b) => a - b)
        // Ensure continuous selection
        const min = Math.min(...newSlots)
        const max = Math.max(...newSlots)
        return Array.from({ length: max - min + 1 }, (_, i) => min + i)
      })
    }
  }

  const handleConfirm = () => {
    if (selectedDate && selectedSlots.length > 0) {
      const startHour = Math.min(...selectedSlots)
      const endHour = Math.max(...selectedSlots) + 1
      onSlotSelect(selectedDate, startHour, endHour)
    }
  }

  const totalPrice = selectedSlots.length * hourlyRate

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            예약 시간 선택
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentWeekStart, 'M월 d일', { locale: ko })} - {format(addDays(currentWeekStart, 6), 'M월 d일', { locale: ko })}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            {/* Day headers */}
            <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-1 mb-2">
              <div />
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className={`text-center text-xs font-medium py-2 rounded-md ${
                    isToday(day) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div>{format(day, 'EEE', { locale: ko })}</div>
                  <div className="text-sm font-bold">{format(day, 'd')}</div>
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="space-y-1">
              {timeSlots.map((hour) => (
                <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] gap-1">
                  <div className="flex items-center justify-end pr-2 text-xs text-muted-foreground">
                    {hour}:00
                  </div>
                  {weekDays.map((day) => {
                    const booked = isSlotBooked(day, hour)
                    const past = isSlotPast(day, hour)
                    const isSelected = selectedDate && isSameDay(selectedDate, day) && selectedSlots.includes(hour)
                    return (
                      <button
                        key={`${day.toISOString()}-${hour}`}
                        onClick={() => handleSlotClick(day, hour)}
                        disabled={booked || past}
                        className={`h-8 rounded-md text-xs font-medium transition-all ${
                          booked
                            ? 'bg-destructive/20 text-destructive cursor-not-allowed'
                            : past
                            ? 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
                            : isSelected
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-muted/30 hover:bg-primary/20 hover:text-primary cursor-pointer'
                        }`}
                      >
                        {booked ? '예약됨' : isSelected ? '선택' : ''}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selection summary */}
        {selectedSlots.length > 0 && selectedDate && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div>
              <p className="text-sm font-medium">
                {format(selectedDate, 'M월 d일 (EEE)', { locale: ko })} {Math.min(...selectedSlots)}:00 - {Math.max(...selectedSlots) + 1}:00
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedSlots.length}시간 × {hourlyRate.toLocaleString()}원
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{totalPrice.toLocaleString()}원</p>
              </div>
              <Button onClick={handleConfirm} size="sm">
                예약하기
              </Button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-muted/30" />
            예약 가능
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-primary" />
            선택됨
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-destructive/20" />
            예약됨
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
