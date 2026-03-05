'use client'

import { use, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { sampleSpaces } from '@/lib/seed-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CreditCard, CheckCircle2, Clock, MapPin, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const spaceId = searchParams.get('spaceId') || id
  const date = searchParams.get('date') || '2026-03-06'
  const startHour = parseInt(searchParams.get('start') || '10')
  const endHour = parseInt(searchParams.get('end') || '13')

  const space = sampleSpaces.find((s) => s.id === spaceId)
  const hours = endHour - startHour
  const totalPrice = space ? space.hourly_rate * hours : 0

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate Toss Payments flow
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
      toast.success('결제가 완료되었습니다!', {
        description: '예약이 확정되었습니다. 이메일로 확인서를 보내드립니다.',
      })
    }, 2000)
  }

  if (isComplete) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold">예약이 완료되었습니다!</h1>
        <p className="mt-2 text-muted-foreground">
          예약 확인 이메일이 발송되었습니다. 대시보드에서 예약을 관리할 수 있습니다.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard">
            <Button>대시보드로 이동</Button>
          </Link>
          <Link href="/spaces">
            <Button variant="outline">다른 공간 둘러보기</Button>
          </Link>
        </div>
      </div>
    )
  }

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

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href={`/spaces/${spaceId}`} className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        공간으로 돌아가기
      </Link>

      <h1 className="text-2xl font-bold mb-6">예약 확인</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Booking form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Space info */}
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={space.photos[0]}
                    alt={space.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{space.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {space.address}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3.5 w-3.5" />
                    {date} {startHour}:00 - {endHour}:00 ({hours}시간)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booker info */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">예약자 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>이름</Label>
                  <Input placeholder="홍길동" />
                </div>
                <div className="space-y-2">
                  <Label>전화번호</Label>
                  <Input placeholder="010-0000-0000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>이메일</Label>
                <Input type="email" placeholder="name@example.com" />
              </div>
              <div className="space-y-2">
                <Label>메모 (선택)</Label>
                <Textarea placeholder="특별한 요청사항이 있으시면 입력해주세요" rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Payment method */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                결제 방법
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {['카드 결제', '토스페이', '카카오페이', '네이버페이'].map((method) => (
                  <button
                    key={method}
                    className="rounded-lg border border-border/50 p-3 text-center text-sm font-medium transition-all hover:border-primary/50 hover:bg-primary/5 focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    {method}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                * 현재 테스트 모드로 실제 결제는 이루어지지 않습니다. (토스페이먼츠 샌드박스)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">결제 내역</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">공간</span>
                    <span className="font-medium">{space.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">날짜</span>
                    <span className="font-medium">{date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">시간</span>
                    <span className="font-medium">{startHour}:00 - {endHour}:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">시간당 요금</span>
                    <span className="font-medium">{space.hourly_rate.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">이용 시간</span>
                    <span className="font-medium">{hours}시간</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">총 결제 금액</span>
                  <span className="text-2xl font-bold text-primary">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      결제 처리 중...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      {totalPrice.toLocaleString()}원 결제하기
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  결제 시 이용약관 및 환불 정책에 동의하는 것으로 간주됩니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
