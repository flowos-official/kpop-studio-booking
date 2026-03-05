export interface Profile {
  id: string
  full_name: string | null
  role: 'artist' | 'admin' | 'manager'
  phone: string | null
  avatar_url: string | null
  created_at: string
}

export interface Space {
  id: string
  name: string
  type: 'recording' | 'practice' | 'both'
  description: string | null
  equipment: string[]
  hourly_rate: number
  capacity: number
  photos: string[]
  address: string | null
  is_active: boolean
  created_at: string
}

export interface Program {
  id: string
  space_id: string
  name: string
  description: string | null
  duration_hours: number
  price: number
  includes: string[]
  created_at: string
}

export interface Artist {
  id: string
  user_id: string | null
  name: string
  agency: string | null
  genre: string | null
  member_count: number
  bio: string | null
  profile_photo: string | null
  created_at: string
}

export interface Booking {
  id: string
  space_id: string
  artist_id: string | null
  user_id: string | null
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  total_price: number | null
  notes: string | null
  created_at: string
  space?: Space
  artist?: Artist
}

export interface Payment {
  id: string
  booking_id: string
  amount: number
  method: string | null
  status: 'pending' | 'paid' | 'refunded' | 'failed'
  toss_payment_key: string | null
  paid_at: string | null
  created_at: string
}

export type SpaceType = 'all' | 'recording' | 'practice' | 'both'
