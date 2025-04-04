import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'

function EditorHeader() {
  return (
    <div className='p-4 shadow-sm flex justify-between items-center'>
        <Image src="/logo.png" alt="Logo" />
        <div>

        </div>
        <div className=''>
            <Button variant="ghost" >Send test email</Button>
            <Button >Save template</Button>
        </div>
    </div>
  )
}

export default EditorHeader
