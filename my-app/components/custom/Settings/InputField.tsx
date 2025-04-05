import { Input } from '@/components/ui/input'
import React from 'react'

function InputField({label, value , onHandleInputChange}) {
  return (
    <div>
        <label>{label}</label>
        <Input value={value} onChange={(event)=> onHandleInputChange(event.target.value)} />
    </div>
  )
}

export default InputField

// import { Input } from "@/components/ui/input";
// import React from "react";

// function InputField({ label, value, onHandleInputChange }) {
//   return (
//     <div className="flex flex-col gap-2">
//       <label htmlFor={label}>{label}</label>
//       <Input
//         id={label}
//         value={value}
//         onChange={(event) => {
//           if (onHandleInputChange) {
//             onHandleInputChange(event.target.value); // Change to `Number(event.target.value)` for numeric input
//           }
//         }}
//       />
//     </div>
//   );
// }

// export default InputField;
