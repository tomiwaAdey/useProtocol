// src/app/kyc.tsx
import { useRouter } from 'next/router'
import PersonaIDCheck from '@/components/PersonaIDCheck'

export default function KYCPage() {
  const router = useRouter()

  const handleCompleted = (inquiryId: string) => {
    router.push('/dashboard')
  }

  return (
    <div>
      <h1>KYC Process</h1>
      <PersonaIDCheck onCompleted={handleCompleted} />
    </div>
  )
}
