import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function AuthGuard({ children }: { children: JSX.Element }) {
  const router = useRouter()

  const { status } = useSession()

  useEffect(() => {
    if (status !== "loading") if (status !== "authenticated") router.push('/api/auth/signin')
  }, [status, router])

  if (status === "loading") {
    return <h1 style={{ padding: '1pc' }}>Authenticating...</h1>
  } else {
    if (status === "authenticated") {
      return <>{children}</>
    } else {
      return <h1 style={{ padding: '1pc' }}>403</h1>
    }
  }
}
