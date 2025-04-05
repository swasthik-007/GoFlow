import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import SignInButton from './SignInButton'

function Hero() {
  return (
    <div className='px-10 md:px-28 lg:px-44 flex flex-col items-center'>
      <h2 className='font-extrabold text-5xl '>AI powered <span className='text-blue-500'>
        Email Templates</span>
    </h2>
    <p className='text-center mt-4'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa consequuntur beatae velit quibusdam ratione officia amet quae ducimus voluptatem iusto quaerat nulla similique architecto, odio quas numquam? Eum, corporis </p>
    <div className='flex gap-5 mt-6'>
        <Button
         variant= "outline">Try Demo get</Button>
        <SignInButton/>
    </div>

    <Image src={'/ff.jpg'} alt='landing' width={1000} height={800} className='mt-12 rounded-xl'/>

    </div>
  )
}

export default Hero
