import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SpaceCard } from '@/components/spaces/space-card'
import { sampleSpaces } from '@/lib/seed-data'
import { ArrowRight, Mic, Music, Calendar, CreditCard, Star, Sparkles } from 'lucide-react'

const features = [
  {
    icon: <Mic className="h-6 w-6" />,
    title: '프리미엄 녹음실',
    description: '최고급 장비와 방음 시설을 갖춘 녹음실에서 퀄리티 높은 레코딩을 경험하세요.',
  },
  {
    icon: <Music className="h-6 w-6" />,
    title: '전문 연습실',
    description: '넓은 공간과 전면 거울, 고급 음향 시스템으로 완벽한 안무 연습을 지원합니다.',
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: '실시간 예약',
    description: '원하는 시간대를 실시간으로 확인하고 즉시 예약할 수 있습니다.',
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: '간편 결제',
    description: '토스페이먼츠 연동으로 안전하고 빠른 결제가 가능합니다.',
  },
]

const stats = [
  { value: '50+', label: '등록된 공간' },
  { value: '200+', label: '아티스트' },
  { value: '10,000+', label: '완료된 예약' },
  { value: '4.9', label: '평균 만족도' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-purple-900/10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute top-40 right-1/4 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5 text-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              K-POP 아티스트를 위한 공간 플랫폼
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              최고의 공간에서
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                최고의 음악을
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              녹음실부터 연습실까지, K-POP 아티스트에게 필요한 모든 공간을
              <br className="hidden sm:block" />
              한곳에서 찾고 예약하세요.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/spaces">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  공간 둘러보기
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  무료로 시작하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/40 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Spaces */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">인기 공간</h2>
            <p className="mt-1 text-muted-foreground">아티스트들이 가장 많이 찾는 공간</p>
          </div>
          <Link href="/spaces">
            <Button variant="ghost" className="gap-1 text-primary">
              전체 보기
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sampleSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/40 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">왜 STUDIOBOOK인가요?</h2>
            <p className="mt-2 text-muted-foreground">아티스트의 작업 환경을 최우선으로 생각합니다</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-8 sm:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJIMjR2LTJoMTJ6TTM2IDI0djJIMjR2LTJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              지금 바로 시작하세요
            </h2>
            <p className="mt-3 text-white/80">
              회원가입 후 원하는 공간을 바로 예약할 수 있습니다.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/login">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Star className="h-4 w-4" />
                  무료 회원가입
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
