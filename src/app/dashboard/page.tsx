'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { sampleSpaces, sampleArtists, sampleBookings } from '@/lib/seed-data'
import {
  Calendar, CreditCard, Users, Building2, TrendingUp, Clock,
  Plus, BarChart3, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: '대기중', variant: 'secondary' },
  confirmed: { label: '확정', variant: 'default' },
  cancelled: { label: '취소', variant: 'destructive' },
  completed: { label: '완료', variant: 'outline' },
}

const stats = [
  {
    title: '이번 달 매출',
    value: '5,700,000원',
    change: '+12.5%',
    changeType: 'up' as const,
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    title: '총 예약',
    value: '48건',
    change: '+8건',
    changeType: 'up' as const,
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    title: '등록 공간',
    value: `${sampleSpaces.length}개`,
    change: '활성',
    changeType: 'up' as const,
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    title: '등록 아티스트',
    value: `${sampleArtists.length}명`,
    change: '+2명',
    changeType: 'up' as const,
    icon: <Users className="h-4 w-4" />,
  },
]

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">대시보드</h1>
          <p className="mt-1 text-muted-foreground">공간 및 예약을 관리하세요</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          새 공간 등록
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  {stat.icon}
                </div>
                <Badge
                  variant="secondary"
                  className={`gap-1 text-xs ${
                    stat.changeType === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {stat.changeType === 'up' ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings" className="gap-1.5">
            <Calendar className="h-4 w-4" />
            예약 관리
          </TabsTrigger>
          <TabsTrigger value="spaces" className="gap-1.5">
            <Building2 className="h-4 w-4" />
            공간 관리
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-1.5">
            <BarChart3 className="h-4 w-4" />
            매출 현황
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">최근 예약</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>공간</TableHead>
                    <TableHead>아티스트</TableHead>
                    <TableHead>일시</TableHead>
                    <TableHead>금액</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleBookings.map((booking) => {
                    const space = sampleSpaces.find((s) => s.id === booking.space_id)
                    const artist = sampleArtists.find((a) => a.id === booking.artist_id)
                    const status = statusLabels[booking.status]
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{space?.name || '-'}</TableCell>
                        <TableCell>{artist?.name || '-'}</TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {format(new Date(booking.start_time), 'M/d HH:mm', { locale: ko })} -{' '}
                            {format(new Date(booking.end_time), 'HH:mm', { locale: ko })}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {booking.total_price?.toLocaleString()}원
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">상세</Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spaces" className="mt-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">등록된 공간</CardTitle>
                <Button size="sm" className="gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  공간 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>공간명</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>시간당 요금</TableHead>
                    <TableHead>수용 인원</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleSpaces.map((space) => (
                    <TableRow key={space.id}>
                      <TableCell className="font-medium">{space.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {space.type === 'recording' ? '녹음실' : space.type === 'practice' ? '연습실' : '복합'}
                        </Badge>
                      </TableCell>
                      <TableCell>{space.hourly_rate.toLocaleString()}원</TableCell>
                      <TableCell>최대 {space.capacity}명</TableCell>
                      <TableCell>
                        <Badge variant={space.is_active ? 'default' : 'secondary'}>
                          {space.is_active ? '운영중' : '비활성'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">편집</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <h3 className="text-lg font-semibold">매출 현황</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supabase 연동 후 실시간 매출 데이터가 표시됩니다
                  </p>
                </div>

                {/* Mock revenue data */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">이번 달</p>
                      <p className="text-2xl font-bold text-primary mt-1">5,700,000원</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">지난 달</p>
                      <p className="text-2xl font-bold mt-1">5,066,000원</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">총 누적</p>
                      <p className="text-2xl font-bold mt-1">32,450,000원</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
