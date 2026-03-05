'use client'

import { useState, useMemo } from 'react'
import { SpaceCard } from '@/components/spaces/space-card'
import { SpaceFilters } from '@/components/spaces/space-filters'
import { sampleSpaces } from '@/lib/seed-data'
import { SpaceType } from '@/types'

export default function SpacesPage() {
  const [activeType, setActiveType] = useState<SpaceType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSpaces = useMemo(() => {
    return sampleSpaces.filter((space) => {
      const matchesType = activeType === 'all' || space.type === activeType
      const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        space.equipment.some((eq) => eq.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (space.address && space.address.includes(searchQuery))
      return matchesType && matchesSearch
    })
  }, [activeType, searchQuery])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">공간 둘러보기</h1>
        <p className="mt-1 text-muted-foreground">
          K-POP 아티스트에게 최적화된 녹음실과 연습실을 찾아보세요
        </p>
      </div>

      <div className="mb-6">
        <SpaceFilters
          activeType={activeType}
          onTypeChange={setActiveType}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {filteredSpaces.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">검색 결과가 없습니다</p>
          <p className="mt-1 text-sm text-muted-foreground">다른 검색어나 필터를 시도해보세요</p>
        </div>
      )}
    </div>
  )
}
