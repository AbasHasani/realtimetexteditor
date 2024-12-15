import { SignIn } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
  return (
    <main className='auth-page'>
        <SignIn />
    </main>
  )
}

export default Page