'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Mic, Music, LayoutGrid } from 'lucide-react'
import { SpaceType } from '@/types'

interface SpaceFiltersProps {
  activeType: SpaceType
  onTypeChange: (type: SpaceType) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

const typeFilters: { value: SpaceType; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: '전체', icon: <LayoutGrid className="h-4 w-4" /> },
  { value: 'recording', label: '녹음실', icon: <Mic className="h-4 w-4" /> },
  { value: 'practice', label: '연습실', icon: <Music className="h-4 w-4" /> },
  { value: 'both', label: '복합', icon: <LayoutGrid className="h-4 w-4" /> },
]

export function SpaceFilters({ activeType, onTypeChange, searchQuery, onSearchChange }: SpaceFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        {typeFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={activeType === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTypeChange(filter.value)}
            className="gap-1.5"
          >
            {filter.icon}
            {filter.label}
          </Button>
        ))}
      </div>
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="공간 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  )
}
