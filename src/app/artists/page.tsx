import { ArtistCard } from '@/components/artists/artist-card'
import { sampleArtists } from '@/lib/seed-data'

export default function ArtistsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">아티스트</h1>
        <p className="mt-1 text-muted-foreground">
          STUDIOBOOK과 함께하는 아티스트들을 만나보세요
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sampleArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  )
}
