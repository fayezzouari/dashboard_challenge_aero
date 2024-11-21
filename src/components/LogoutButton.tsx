'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const res = await fetch('/api/logout', { method: 'POST' })
    if (res.ok) {
      router.push('/login')
    }
  }

  return <Button onClick={handleLogout}>Logout</Button>
}
