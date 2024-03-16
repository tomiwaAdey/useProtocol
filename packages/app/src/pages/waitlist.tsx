'use client'
import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIRE,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const analytics = getAnalytics(app)

interface WaitlistFormValues {
  legalName: string
  email: string
  alias: string
  creativeField: string[]
  experience: string
  purpose: string[]
  description: string
  previousExperience: string
  uniqueness: string
  twitter: string
  instagram: string
  website: string
  portfolio: string
}

export default function WaitlistForm() {
  const [isLoading, setIsLoading] = useState(false)
  const initialValues: WaitlistFormValues = {
    legalName: '',
    email: '',
    alias: '',
    creativeField: [],
    experience: '',
    purpose: [],
    description: '',
    previousExperience: '',
    uniqueness: '',
    twitter: '',
    instagram: '',
    website: '',
    portfolio: '',
  }

  const validate = (values: WaitlistFormValues) => {
    const errors: Partial<WaitlistFormValues> = {}
    if (!values.legalName) errors.legalName = 'Legal name is required'
    if (!values.email) errors.email = 'Email is required'
    return errors
  }

  const handleSubmit = async (values: WaitlistFormValues) => {
    setIsLoading(true)
    try {
      await addDoc(collection(db, 'waitlist'), values)
      console.log('Waitlist form submitted successfully!')
    } catch (error) {
      console.error('Error submitting waitlist form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className='max-w-3xl mx-auto space-y-4'>
          <div>
            <Label htmlFor='legalName' className='block text-sm font-medium'>
              Legal Full Name
            </Label>
            <Field
              id='legalName'
              name='legalName'
              type='text'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
            <ErrorMessage name='legalName' component='div' className='text-red-500 text-sm mt-1' />
          </div>

          <div>
            <Label htmlFor='email' className='block text-sm font-medium'>
              Email
            </Label>
            <Field
              id='email'
              name='email'
              type='email'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
            <ErrorMessage name='email' component='div' className='text-red-500 text-sm mt-1' />
          </div>

          <div>
            <Label htmlFor='alias' className='block text-sm font-medium'>
              Professional Alias or Brand Name
            </Label>
            <Field
              id='alias'
              name='alias'
              type='text'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
          </div>

          <div>
            <Label htmlFor='creativeField' className='block text-sm font-medium'>
              Primary Creative Field
            </Label>
            <Select name='creativeField'>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Fields' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='digitalArt'>Digital Art</SelectItem>
                <SelectItem value='music'>Music</SelectItem>
                <SelectItem value='writing'>Writing</SelectItem>
                <SelectItem value='software'>Software Development</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='experience' className='block text-sm font-medium'>
              Years of Experience in Your Field
            </Label>
            <Select name='experience'>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Experience' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='0-2'>0-2 years</SelectItem>
                <SelectItem value='3-5'>3-5 years</SelectItem>
                <SelectItem value='6-10'>6-10 years</SelectItem>
                <SelectItem value='10+'>10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='purpose' className='block text-sm font-medium'>
              Primary Purpose for Using RightClickUse
            </Label>
            <Select name='purpose'>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Purposes' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='monetize'>Monetizing digital works</SelectItem>
                <SelectItem value='distribute'>Distributing exclusive content</SelectItem>
                <SelectItem value='engage'>Engaging with my audience in new ways</SelectItem>
                <SelectItem value='explore'>Exploring digital rights management</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='description' className='block text-sm font-medium'>
              Brief Description of Your Work
            </Label>
            <Textarea
              id='description'
              name='description'
              placeholder='Provide a short description to give insight into your style, themes, or unique aspects of your work.'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
          </div>

          <div>
            <Label htmlFor='previousExperience' className='block text-sm font-medium'>
              Previous Experience with Digital Sales
            </Label>
            <Select name='previousExperience'>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Experience' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>None</SelectItem>
                <SelectItem value='some'>Some (e.g., sold digital products online)</SelectItem>
                <SelectItem value='experienced'>Experienced (e.g., I own an empire)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='uniqueness' className='block text-sm font-medium'>
              What Makes Your Work Unique?
            </Label>
            <Textarea
              id='uniqueness'
              name='uniqueness'
              placeholder='Provide any additional information that sets your work apart.'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
          </div>

          <div>
            <Label htmlFor='twitter' className='block text-sm font-medium'>
              Twitter Username
            </Label>
            <Field
              id='twitter'
              name='twitter'
              type='text'
              placeholder='@username'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
          </div>

          <div>
            <Label htmlFor='instagram' className='block text-sm font-medium'>
              Instagram Username
            </Label>
            <Field
              id='instagram'
              name='instagram'
              type='text'
              placeholder='@username'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
          </div>

          <div>
            <Label htmlFor='website' className='block text-sm font-medium'>
              Website URL
            </Label>
            <Field
              id='website'
              name='website'
              type='url'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
          </div>

          <div>
            <Label htmlFor='portfolio' className='block text-sm font-medium'>
              Portfolio URL
            </Label>
            <Field
              id='portfolio'
              name='portfolio'
              type='url'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
          </div>

          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={isSubmitting || isLoading}
              className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
