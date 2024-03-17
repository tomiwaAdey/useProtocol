import { useState } from 'react'
import Persona from 'persona'

export default function PersonaIDCheck({
  onCompleted,
  showSubmittedMessage = false,
  insideChatContainer = false,
}: {
  onCompleted?(inquiryId: string): void
  showSubmittedMessage?: boolean
  insideChatContainer?: boolean
}) {
  const [rechecked, setRechecked] = useState(false)
  const [ready, setReady] = useState(false)
  const environment = process.env.PERSONA_ENVIRONMENT_ID
  return (
    <>
      <div className='aiCenter jcCenter column'>
        {!ready && <p>...</p>}
        {rechecked && showSubmittedMessage && (
          <div className='column aiCenter'>
            <h3 style={{ whiteSpace: 'pre-line', textAlign: 'center' }}>
              {`Submission received.\nWe'll review your document and respond shortly.`}
            </h3>
          </div>
        )}
        {!rechecked && (
          <div>
            <Persona.Inquiry
              templateId={process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID}
              environmentId={environment}
              onReady={() => setReady(true)}
              onComplete={async ({ inquiryId, status, fields }) => {
                console.log('done')
                // try {
                // //   await sendInquiry(inquiryId)
                //   setRechecked(true)
                //   if (onCompleted) {
                //     onCompleted(inquiryId)
                //   }
                // } catch (e) {
                //   console.log(e)
                // }
              }}
            />
          </div>
        )}
      </div>
    </>
  )
}
