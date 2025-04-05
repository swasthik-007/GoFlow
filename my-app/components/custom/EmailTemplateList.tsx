import Image from 'next/image';
import React, { useState } from 'react'
import { Button } from '../ui/button';

function EmailTemplateList() {
    const [emailList , setEmailList] = useState();
  return (
    <div>
      <h2 className="font-bold text-xl text-primary mt-6">Workspace</h2>
      {emailList?.length === 0 && 
        <div className='font-bold text-xl mt-7 flex col items-center'>
            <Image
              src="/images.png"
              alt="empty"
              width={250}
              height={250}
            />  
            <Button className='mt-7'> + Create New</Button>  
        </div>
      }
    </div>
  )
}

export default EmailTemplateList