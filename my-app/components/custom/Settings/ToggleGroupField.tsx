import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import React from 'react'

function ToggleGroupField({label,value,options, onHandleStyleChange}) {
  return (
    <div>
      <label>{label}</label>
      <ToggleGroup type='single'
        defaultValue={value}
        onValueChange={(v)=> onHandleStyleChange(v)}>
        {options.map((option,index)=> (
            <ToggleGroupItem key= {index} value={option?.value}><option.icon /></ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

export default ToggleGroupField
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import React from "react";

// function ToggleGroupField({ label, value, options, onHandleStyleChange }) {
//   return (
//     <div>
//       <label>{label}</label>
//       <ToggleGroup
//         type="single"
//         defaultValue={value}
//         onValueChange={(v) => {
//           if (v) {
//             onHandleStyleChange(v);
//           }
//         }}
//       >
//         {options.map((option, index) => (
//           <ToggleGroupItem key={index} value={option?.value}>
//             {option?.icon ? <option.icon /> : null}
//           </ToggleGroupItem>
//         ))}
//       </ToggleGroup>
//     </div>
//   );
// }

// export default ToggleGroupField;
