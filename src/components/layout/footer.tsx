import { Music } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Music className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">STUDIOBOOK</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              K-POP 아티스트를 위한 최고의 녹음실·연습실 대관 플랫폼. 
              최적의 공간에서 최고의 음악을 만들어보세요.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">서비스</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/spaces" className="hover:text-foreground transition-colors">공간 둘러보기</Link></li>
              <li><Link href="/artists" className="hover:text-foreground transition-colors">아티스트</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">대시보드</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">지원</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-foreground transition-colors cursor-pointer">이용약관</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">개인정보처리방침</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">고객센터</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-8">
          <p className="text-center text-xs text-muted-foreground">
            © 2026 STUDIOBOOK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
