import React from 'react'

function ColorPickerField({label,value, onHandleStyleChange}) {
  return (
    <div className='grid'>
        <div><label>{label}</label></div>
      
      <input type="color" value={value} 
        onChange={(e)=> onHandleStyleChange(e.target.value)} />
    </div>
  )
}

export default ColorPickerField
// import React from "react";

// function ColorPickerField({ label, value = "#000000", onHandleStyleChange }) {
//   return (
//     <div className="grid gap-2">
//       <div>
//         <label htmlFor={label}>{label}</label>
//       </div>
//       <input
//         id={label}
//         type="color"
//         value={value}
//         onChange={(e) => {
//           if (onHandleStyleChange) {
//             onHandleStyleChange(e.target.value);
//           }
//         }}
//       />
//     </div>
//   );
// }

// export default ColorPickerField;

