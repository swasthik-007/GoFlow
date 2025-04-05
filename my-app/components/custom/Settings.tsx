"use client";
import { useSelectedElement } from "@/app/provider";
import React, { useEffect, useState } from "react";
import InputField from "./Settings/InputField";
import ColorPickerField from "./Settings/ColorPickerField";
import InputStyleField from "./Settings/InputStyleField";
import SliderField from "./Settings/SliderField";
import TextAreaField from "./Settings/TextAreaField";
import ToggleGroupField from "./Settings/ToggleGroupField";
import {
  AArrowUp,
  AlignCenter,
  AlignLeft,
  AlignRight,
  CaseLower,
  CaseUpper,
} from "lucide-react";
import DropdownField from "./Settings/DropdownField";
import ImagePreview from "./Settings/ImagePreview";

// const TextTransformOptions = [
//   {
//     value: "uppercase",
//     icon: CaseUpper,
//   },
//   {
//     value: "lowercase",
//     icon: CaseLower,
//   },
//   {
//     value: "capitalize",
//     icon: AArrowUp,
//   },
// ];
// const TextAlignOptions = [
//   {
//     value: "left",
//     icon: AlignLeft,
//   },
//   {
//     value: "center",
//     icon: AlignCenter,
//   },
//   {
//     value: "right",
//     icon: AlignRight,
//   },
// ];

// function Settings() {
//   const { selectedElement, setSelectedElement } = useSelectedElement();
//   const [element, setElement] = useState();

//   useEffect(() => {
//     setElement(selectedElement?.layout?.[selectedElement?.index]);
//   }, [selectedElement]);

//   const onHandleInputChange = (fieldName, value) => {
//     const updatedData = { ...selectedElement };
//     // console.log(updatedData.layout[selectedElement.index].content);
//     updatedData.layout[selectedElement.index][fieldName] = value;
//     setSelectedElement(updatedData);
//     // console.log(updatedData);
//   };

//   // const onHandleStyleChange = (fieldName, fieldValue) => {
//   //   const updateElement = {
//   //     ...selectedElement,
//   //     layout: {
//   //       ...selectedElement?.layout,
//   //       [selectedElement?.index]: {
//   //         ...selectedElement?.layout[selectedElement?.index],
//   //         style: {
//   //           ...selectedElement?.layout[selectedElement?.index]?.style,
//   //           [fieldName]: fieldValue,
//   //         },
//   //       },
//   //     },
//   //   };
//   //   setSelectedElement((prevElement) => ({
//   //     ...prevElement,
//   //     layout: {
//   //       ...prevElement?.layout,
//   //       [prevElement?.index]: {
//   //         ...prevElement?.layout[prevElement?.index],
//   //         style: {
//   //           ...prevElement?.layout[prevElement?.index]?.style,
//   //           [fieldName]: fieldValue,
//   //         },
//   //       },
//   //     },
//   //   }));
//   //   console.log("Updated Element:", updateElement); // Debug log

//   // };

//   const onHandleStyleChange = (fieldName, fieldValue) => {
//     const updateElement = {
//       ...selectedElement,
//       layout: {
//         ...selectedElement?.layout,
//         [selectedElement?.index]: {
//           ...selectedElement?.layout[selectedElement?.index],
//           style: {
//             ...selectedElement?.layout[selectedElement?.index]?.style,
//             [fieldName]: fieldValue,
//           },
//         },
//       },
//     };
//     console.log('Updated Element:', updateElement);
//     console.log('selected Element:', selectedElement);
//     setSelectedElement(updateElement);
//   };

//   // const onHandleStyleChange = (fieldName, fieldValue) => {
//   //   setSelectedElement((prevElement) => ({
//   //     ...prevElement, // Ensure top-level object is new
//   //     layout: { ...prevElement.layout }, // Ensure layout object is new
//   //   }));

//   //   console.log(`Style Updated: ${fieldName} -> ${fieldValue}`);
//   // };

//   // const onHandleStyleChange = (fieldName, fieldValue) => {
//   //   const updateElement = {
//   //     ...selectedElement,
//   //     layout: {
//   //       ...selectedElement?.layout,
//   //       [selectedElement?.index]: {
//   //         ...selectedElement?.layout[selectedElement?.index],
//   //         style: {
//   //           ...selectedElement?.layout[selectedElement?.index]?.style,
//   //           [fieldName]: fieldValue, // Update the specific style field
//   //         },
//   //       },
//   //     },
//   //   };
//   //   setSelectedElement({ ...updateElement });
//   //   console.log(updateElement);
//   // };
//   const onHandleOuterStyleChange = (fieldName, fieldValue) => {
//     const updateElement = {
//       ...selectedElement,
//       layout: {
//         ...selectedElement?.layout,
//         [selectedElement?.index]: {
//           ...selectedElement?.layout[selectedElement?.index],
//           outerStyle: {
//             ...selectedElement?.layout[selectedElement?.index]?.outerStyle,
//             [fieldName]: fieldValue, // Update the specific outerStyle field
//           },
//         },
//       },
//     };
//     setSelectedElement(updateElement);
//   };

//   return (
//     <div className="p-5 flex flex-col gap-4">
//       <h2 className="font-bold text-xl ">Settings</h2>
//       {element?.hasOwnProperty("imageUrl") && (
//         <ImagePreview
//           label={"Image Preview"}
//           value={element?.imageUrl}
//           onHandleInputChange={(value) =>
//             onHandleInputChange("imageUrl", value)
//           }
//         />
//       )}
//       {element?.hasOwnProperty("content") && (
//         <InputField
//           label={"Content"}
//           value={element?.content}
//           onHandleInputChange={(value) => onHandleInputChange("content", value)}
//         />
//       )}
//       {element?.hasOwnProperty("textarea") && (
//         <TextAreaField
//           label={"Text Area"}
//           value={element?.textarea || ""} // Ensure an empty string is passed if the value is empty
//           onHandleInputChange={(value) =>
//             onHandleInputChange("textarea", value)
//           }
//         />
//       )}

//       {element?.url && (
//         <InputField
//           label={"url"}
//           value={element?.url}
//           onHandleInputChange={(value) => onHandleInputChange("url", value)}
//         />
//       )}
//       {element?.style?.width && (
//         <SliderField
//           label={"Width"}
//           value={element?.style?.width || "auto"}
//           type="%"
//           onHandleStyleChange={(value) => onHandleStyleChange("width", value)}
//         />
//       )}
//       {element?.style?.textAlign && (
//         <ToggleGroupField
//           label={"Text Align"}
//           value={element?.style?.textAlign}
//           options={TextAlignOptions}
//           onHandleStyleChange={(value) =>
//             onHandleStyleChange("textAlign", value)
//           }
//         />
//       )}
//       {/* 
//       {element?.style?.backgroundColor && (
//         <ColorPickerField
//           label="Background Color"
//           value={element?.style?.backgroundColor}
//           onHandleStyleChange={(value) =>
//             onHandleStyleChange("backgroundColor", value)
//           }
//         />
//       )} */}

//       <ColorPickerField
//         label="Background Color"
//         value={element?.style?.backgroundColor || "#ffffff"} // Default white color
//         onHandleStyleChange={(value) => {
//           console.log("Background Color Changed:", value); // Debug Log
//           onHandleStyleChange("backgroundColor", value);
//         }}
//       />

//       {element?.style?.color && (
//         <ColorPickerField
//           label="Text Color"
//           value={element?.style?.color}
//           onHandleStyleChange={(value) => onHandleStyleChange("color", value)}
//         />
//       )}
//       {element?.style?.fontSize && (
//         <InputStyleField
//           label={"Font Size"}
//           value={element?.style?.fontSize}
//           onHandleStyleChange={(value) =>
//             onHandleStyleChange("fontSize", value)
//           }
//         />
//       )}
//       {element?.style?.textTransform && (
//         <ToggleGroupField
//           label={"Text Transform"}
//           value={element?.style.textTransform}
//           options={TextTransformOptions}
//           onHandleStyleChange={(value) =>
//             onHandleStyleChange("textTransform", value)
//           }
//         />
//       )}

//       {element?.style?.padding && (
//         <InputStyleField
//           label={"Padding"}
//           value={element?.style?.padding}
//           type="%"
//           onHandleStyleChange={(value) => onHandleStyleChange("padding", value)}
//         />
//       )}
//       {element?.style?.margin && (
//         <InputStyleField
//           label={"Margin"}
//           value={element?.style?.margin}
//           type="%"
//           onHandleStyleChange={(value) => onHandleStyleChange("margin", value)}
//         />
//       )}
//       {element?.style?.borderRadius && (
//         <SliderField
//           label={"Border Radius"}
//           value={element?.style?.borderRadius}
//           onHandleStyleChange={(value) =>
//             onHandleStyleChange("borderRadius", value)
//           }
//         />
//       )}
//       {element?.style?.fontWeight && (
//         <DropdownField
//           label={"Font Weight"}
//           value={element?.style?.fontWeight}
//           options={["normal", "bold"]}
//           onHandleStyleChange={(value) =>
//             onHandleStyleChange("fontWeight", value)
//           }
//         />
//       )}
//       <div>
//         <h2 className="font-bold mb-2 ">Outer Style</h2>
//         {element?.outerStyle?.backgroundColor && (
//           <ColorPickerField
//             label="Background Color"
//             value={element?.outerStyle?.backgroundColor}
//             onHandleStyleChange={(value) =>
//               onHandleOuterStyleChange("backgroundColor", value)
//             }
//           />
//         )}
//         {element?.outerStyle?.justifyContent && (
//           <ToggleGroupField
//             label="Align"
//             value={element?.outerStyle?.justifyContent}
//             options={TextAlignOptions}
//             onHandleStyleChange={(value) =>
//               onHandleOuterStyleChange("justifyContent", value)
//             }
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// export default Settings;

// // import { useState } from "react";
// // import ColorPickerField from "./Settings/ColorPickerField"
// // import InputStyleField from "./Settings/InputStyleField";
// // import SliderField from "./Settings/SliderField";
// // import ToggleGroupField from "./Settings/ToggleGroupField";
// // import DropdownField from "./Settings/DropdownField";
// // import ButtonComponent from "./Element/ButtonComponent";

// // const TextAlignOptions = ["left", "center", "right"];
// // const TextTransformOptions = ["none", "uppercase", "lowercase", "capitalize"];

// // const Settings = () => {
// //   const [element, setElement] = useState({
// //     url: "",
// //     style: {
// //       width: "100%",
// //       textAlign: "left",
// //       backgroundColor: "#ffffff",
// //       color: "#000000",
// //       fontSize: "16px",
// //       textTransform: "none",
// //       padding: "10px",
// //       margin: "10px",
// //       borderRadius: "5px",
// //       fontWeight: "normal",
// //     },
// //     outerStyle: {
// //       backgroundColor: "#f8f8f8",
// //       justifyContent: "center",
// //     },
// //   });

// //   const onHandleInputChange = (key, value) => {
// //     setElement((prev) => ({
// //       ...prev,
// //       [key]: value,
// //     }));
// //   };

// //   const onHandleStyleChange = (key, value) => {
// //     setElement((prev) => ({
// //       ...prev,
// //       style: { ...prev.style, [key]: value },
// //     }));
// //   };

// //   const onHandleOuterStyleChange = (key, value) => {
// //     setElement((prev) => ({
// //       ...prev,
// //       outerStyle: { ...prev.outerStyle, [key]: value },
// //     }));
// //   };

// //   return (
// //     <div style={element.outerStyle}>
// //       {element?.url && (
// //         <InputStyleField
// //           label="URL"
// //           value={element?.url}
// //           onHandleInputChange={(value) => onHandleInputChange("url", value)}
// //         />
// //       )}

// //       {element?.style?.width && (
// //         <SliderField
// //           label="Width"
// //           value={element?.style?.width}
// //           type="%"
// //           onHandleStyleChange={(value) => onHandleStyleChange("width", value)}
// //         />
// //       )}

// //       {element?.style?.textAlign && (
// //         <ToggleGroupField
// //           label="Text Align"
// //           value={element?.style?.textAlign}
// //           options={TextAlignOptions}
// //           onHandleStyleChange={(value) =>
// //             onHandleStyleChange("textAlign", value)
// //           }
// //         />
// //       )}

// //       {element?.style?.backgroundColor && (
// //         <ColorPickerField
// //           label="Background Color"
// //           value={element?.style?.backgroundColor}
// //           onHandleStyleChange={(value) =>
// //             onHandleStyleChange("backgroundColor", value)
// //           }
// //         />
// //       )}

// //       {element?.style?.color && (
// //         <ColorPickerField
// //           label="Text Color"
// //           value={element?.style?.color}
// //           onHandleStyleChange={(value) => onHandleStyleChange("color", value)}
// //         />
// //       )}

// //       {element?.style?.fontSize && (
// //         <InputStyleField
// //           label="Font Size"
// //           value={element?.style?.fontSize}
// //           onHandleStyleChange={(value) =>
// //             onHandleStyleChange("fontSize", value)
// //           }
// //         />
// //       )}

// //       {element?.style?.textTransform && (
// //         <ToggleGroupField
// //           label="Text Transform"
// //           value={element?.style.textTransform}
// //           options={TextTransformOptions}
// //           onHandleStyleChange={(value) =>
// //             onHandleStyleChange("textTransform", value)
// //           }
// //         />
// //       )}

// //       {element?.style?.padding && (
// //         <InputStyleField
// //           label="Padding"
// //           value={element?.style?.padding}
// //           type="%"
// //           onHandleStyleChange={(value) => onHandleStyleChange("padding", value)}
// //         />
// //       )}

// //       {element?.style?.margin && (
// //         <InputStyleField
// //           label="Margin"
// //           value={element?.style?.margin}
// //           type="%"
// //           onHandleStyleChange={(value) => onHandleStyleChange("margin", value)}
// //         />
// //       )}

// //       {element?.style?.borderRadius && (
// //         <SliderField
// //           label="Border Radius"
// //           value={element?.style?.borderRadius}
// //           onHandleStyleChange={(value) =>
// //             onHandleStyleChange("borderRadius", value)
// //           }
// //         />
// //       )}

// //       {element?.style?.fontWeight && (
// //         <DropdownField
// //           label="Font Weight"
// //           value={element?.style?.fontWeight}
// //           options={["normal", "bold"]}
// //           onHandleStyleChange={(value) =>
// //             onHandleStyleChange("fontWeight", value)
// //           }
// //         />
// //       )}

// //       <div>
// //         <h2 className="font-bold mb-2">Outer Style</h2>

// //         {element?.outerStyle?.backgroundColor && (
// //           <ColorPickerField
// //             label="Background Color"
// //             value={element?.outerStyle?.backgroundColor}
// //             onHandleStyleChange={(value) =>
// //               onHandleOuterStyleChange("backgroundColor", value)
// //             }
// //           />
// //         )}

// //         {element?.outerStyle?.justifyContent && (
// //           <ToggleGroupField
// //             label="Align"
// //             value={element?.outerStyle?.justifyContent}
// //             options={TextAlignOptions}
// //             onHandleStyleChange={(value) =>
// //               onHandleOuterStyleChange("justifyContent", value)
// //             }
// //           />
// //         )}
// //       </div>

// //       {/* The Button */}
// //       <ButtonComponent
// //         style={element.style}
// //         outerStyle={element.outerStyle}
// //         content={element.content}
// //         url={element.url}
// //       />
// //     </div>
// //   );
// // };

// // export default Settings;



// const TextTransformOptions = [
//   {
//     value: 'uppercase',
//     icon: CaseUpper
//   },
//   {
//     value: 'lowercase',
//     icon: CaseLower
//   },
//   {
//     value: 'capitalize',
//     icon: AArrowUp
//   }
// ]
// const TextAlignOptions = [
//   {
//     value: 'left',
//     icon: AlignLeft
//   },
//   {
//     value: 'center',
//     icon: AlignCenter
//   },
//   {
//     value: 'right',
//     icon: AlignRight
//   }
// ]


// function Settings() {
//   const { selectedElement, setSelectedElement } = useSelectedElement();
//   const [element, setElement] = useState();

//   useEffect(() => {
//     // console.log("Selected Element:", selectedElement.layout[selectedElement?.index]);
//     setElement(selectedElement?.layout?.[selectedElement?.index]);
//   }, [selectedElement]);

//   const onHandleInputChange = (fieldName, value) => {
//     const updatedData = { ...selectedElement };
//     // console.log(updatedData.layout[selectedElement.index]);
//     updatedData.layout[selectedElement.index][fieldName] = value;
//     setSelectedElement(updatedData);
//   };

//   const onHandleStyleChange = (fieldName, fieldValue) => {
//     const updateElement = {
//       ...selectedElement,
//       layout: {
//         ...selectedElement?.layout,
//         [selectedElement?.index]: {
//           ...selectedElement?.layout[selectedElement?.index],
//           style: {
//             ...selectedElement?.layout[selectedElement?.index]?.style,
//             [fieldName]: fieldValue,
//           },
//         },
//       },
//     };
//     console.log('selected Element:', selectedElement);
//     setSelectedElement(updateElement);
//     console.log('selected Element:', selectedElement);
//   };
//   const onHandleOuterStyleChange = (fieldName, fieldValue) => {
//     const updateElement = {
//       ...selectedElement,
//       layout: {
//         ...selectedElement?.layout,
//         [selectedElement?.index]: {
//           ...selectedElement?.layout[selectedElement?.index],
//           outerStyle: {
//             ...selectedElement?.layout[selectedElement?.index]?.outerStyle,
//             [fieldName]: fieldValue, // Update the specific outerStyle field
//           },
//         },
//       },
//     };
//     setSelectedElement(updateElement);
//   };

//   return (
//     <div className='p-5 flex flex-col gap-4'>
//       <h2 className='font-bold text-xl '>Settings</h2>
//       {element?.hasOwnProperty('imageUrl') && (
//         <ImagePreview
//           label={'Image Preview'}
//           value={element?.imageUrl}
//           onHandleInputChange={(value) => onHandleInputChange('imageUrl', value)}
//         />
//       )}
//       {element?.hasOwnProperty('content') && (
//         <InputField
//           label={'Content'}
//           value={element?.content}
//           onHandleInputChange={(value) => onHandleInputChange('content', value)}
//         />
//       )}
//       {element?.hasOwnProperty('textarea') && (
//         <TextAreaField
//           label={'Text Area'}
//           value={element?.textarea || ''} // Ensure an empty string is passed if the value is empty
//           onHandleInputChange={(value) => onHandleInputChange('textarea', value)}
//         />
//       )}
    

//       {element?.url && (
//         <InputField
//           label={'url'}
//           value={element?.url}
//           onHandleInputChange={(value) => onHandleInputChange('url', value)}
//         />
//       )}
//       {element?.style?.width && (
//         <SliderField
//         label={'Width'}
//         value={element?.style?.width || 'auto'}
//         type='%'
//         onHandleStyleChange={(value) => onHandleStyleChange('width', value)}
//         />
//       )}
//       {element?.style?.textAlign && 
//         <ToggleGroupField label={'Text Align'} value={element?.style?.textAlign}
//         options={TextAlignOptions}
//         onHandleStyleChange={(value)=> onHandleStyleChange('textAlign', value)} />}

//       {element?.style?.backgroundColor && (
//         <ColorPickerField
//           label='Background Color'
//           value={element?.style?.backgroundColor}
//           onHandleStyleChange={(value) =>
//             onHandleStyleChange('backgroundColor', value)
//           }
//         />
//       )}
//       {element?.style?.color && (
//         <ColorPickerField
//           label='Text Color'
//           value={element?.style?.color}
//           onHandleStyleChange={(value) =>
//             onHandleStyleChange('color', value)
//           }
//         />
//       )}
//       {element?.style?.fontSize && 
//         <InputStyleField label={'Font Size'} value={element?.style?.fontSize}
//         onHandleStyleChange={(value)=> onHandleStyleChange('fontSize', value)} />}
//       {element?.style?.textTransform && 
//         <ToggleGroupField label={'Text Transform'} value={element?.style.textTransform}
//         options={TextTransformOptions}
//         onHandleStyleChange={(value)=> onHandleStyleChange('textTransform', value)} />}

//       {element?.style?.padding && 
//         <InputStyleField label={'Padding'} value={element?.style?.padding}
//         type='%' 
//         onHandleStyleChange={(value)=> onHandleStyleChange('padding', value)} />}
//       {element?.style?.margin && 
//         <InputStyleField label={'Margin'} value={element?.style?.margin}
//         type='%' 
//         onHandleStyleChange={(value)=> onHandleStyleChange('margin', value)} />}
//       {element?.style?.borderRadius && 
//         <SliderField label={'Border Radius'} value={element?.style?.borderRadius}
//         onHandleStyleChange={(value)=> onHandleStyleChange('borderRadius', value)} />}
//       {element?.style?.fontWeight && 
//         <DropdownField label={'Font Weight'} value={element?.style?.fontWeight} 
//         options={['normal', 'bold', ]}
//         onHandleStyleChange={(value)=> onHandleStyleChange('fontWeight', value)} />}
//       <div>
//         <h2 className='font-bold mb-2 '>Outer Style</h2>
//         {element?.outerStyle?.backgroundColor&& 
//           <ColorPickerField
//             label='Background Color'
//             value={element?.outerStyle?.backgroundColor}
//             onHandleStyleChange={(value) =>
//               onHandleOuterStyleChange('backgroundColor', value)
//             }
//           />
//         }
//         {element?.outerStyle?.justifyContent&& 
//           <ToggleGroupField
//             label='Align'
//             value={element?.outerStyle?.justifyContent}
//             options={TextAlignOptions}
//             onHandleStyleChange={(value) =>
//               onHandleOuterStyleChange('justifyContent', value)
//             }
//           />
//         }
//       </div>

//     </div>
//   );
// }

// export default Settings;

const TextTransformOptions = [
  {
    value: 'uppercase',
    icon: CaseUpper
  },
  {
    value: 'lowercase',
    icon: CaseLower
  },
  {
    value: 'capitalize',
    icon: AArrowUp
  }
]
const TextAlignOptions = [
  {
    value: 'left',
    icon: AlignLeft
  },
  {
    value: 'center',
    icon: AlignCenter
  },
  {
    value: 'right',
    icon: AlignRight
  }
]


function Settings() {
  const { selectedElement, setSelectedElement } = useSelectedElement();
  const [element, setElement] = useState();

  useEffect(() => {
    // console.log("Selected Element:", selectedElement.layout[selectedElement?.index]);
    setElement(selectedElement?.layout?.[selectedElement?.index]);
  }, [selectedElement]);

  const onHandleInputChange = (fieldName, value) => {
    const updatedData = { ...selectedElement };
    // console.log(updatedData.layout[selectedElement.index]);
    updatedData.layout[selectedElement.index][fieldName] = value;
    setSelectedElement(updatedData);
  };

  const onHandleStyleChange = (fieldName, fieldValue) => {
    const updateElement = {
      ...selectedElement,
      layout: {
        ...selectedElement?.layout,
        [selectedElement?.index]: {
          ...selectedElement?.layout[selectedElement?.index],
          style: {
            ...selectedElement?.layout[selectedElement?.index]?.style,
            [fieldName]: fieldValue,
          },
        },
      },
    };
    console.log('selected Element:', selectedElement);
    setSelectedElement(updateElement);
    console.log('selected Element:', selectedElement);
  };
  const onHandleOuterStyleChange = (fieldName, fieldValue) => {
    const updateElement = {
      ...selectedElement,
      layout: {
        ...selectedElement?.layout,
        [selectedElement?.index]: {
          ...selectedElement?.layout[selectedElement?.index],
          outerStyle: {
            ...selectedElement?.layout[selectedElement?.index]?.outerStyle,
            [fieldName]: fieldValue, // Update the specific outerStyle field
          },
        },
      },
    };
    setSelectedElement(updateElement);
  };

  return (
    <div className='p-5 flex flex-col gap-4'>
      <h2 className='font-bold text-xl '>Settings</h2>
      {element?.hasOwnProperty('imageUrl') && (
        <ImagePreview
          label={'Image Preview'}
          value={element?.imageUrl}
          onHandleInputChange={(value) => onHandleInputChange('imageUrl', value)}
        />
      )}
      {element?.hasOwnProperty('content') && (
        <InputField
          label={'Content'}
          value={element?.content}
          onHandleInputChange={(value) => onHandleInputChange('content', value)}
        />
      )}
      {element?.hasOwnProperty('textarea') && (
        <TextAreaField
          label={'Text Area'}
          value={element?.textarea || ''} // Ensure an empty string is passed if the value is empty
          onHandleInputChange={(value) => onHandleInputChange('textarea', value)}
        />
      )}
    

      {element?.url && (
        <InputField
          label={'url'}
          value={element?.url}
          onHandleInputChange={(value) => onHandleInputChange('url', value)}
        />
      )}
      {element?.style?.width && (
        <SliderField
        label={'Width'}
        value={element?.style?.width || 'auto'}
        type='%'
        onHandleStyleChange={(value) => onHandleStyleChange('width', value)}
        />
      )}
      {element?.style?.textAlign && 
        <ToggleGroupField label={'Text Align'} value={element?.style?.textAlign}
        options={TextAlignOptions}
        onHandleStyleChange={(value)=> onHandleStyleChange('textAlign', value)} />}

      {element?.style?.backgroundColor && (
        <ColorPickerField
          label='Background Color'
          value={element?.style?.backgroundColor}
          onHandleStyleChange={(value) =>
            onHandleStyleChange('backgroundColor', value)
          }
        />
      )}
      {element?.style?.color && (
        <ColorPickerField
          label='Text Color'
          value={element?.style?.color}
          onHandleStyleChange={(value) =>
            onHandleStyleChange('color', value)
          }
        />
      )}
      {element?.style?.fontSize && 
        <InputStyleField label={'Font Size'} value={element?.style?.fontSize}
        onHandleStyleChange={(value)=> onHandleStyleChange('fontSize', value)} />}
      {element?.style?.textTransform && 
        <ToggleGroupField label={'Text Transform'} value={element?.style.textTransform}
        options={TextTransformOptions}
        onHandleStyleChange={(value)=> onHandleStyleChange('textTransform', value)} />}

      {element?.style?.padding && 
        <InputStyleField label={'Padding'} value={element?.style?.padding}
        type='%' 
        onHandleStyleChange={(value)=> onHandleStyleChange('padding', value)} />}
      {element?.style?.margin && 
        <InputStyleField label={'Margin'} value={element?.style?.margin}
        type='%' 
        onHandleStyleChange={(value)=> onHandleStyleChange('margin', value)} />}
      {element?.style?.borderRadius && 
        <SliderField label={'Border Radius'} value={element?.style?.borderRadius}
        onHandleStyleChange={(value)=> onHandleStyleChange('borderRadius', value)} />}
      {element?.style?.fontWeight && 
        <DropdownField label={'Font Weight'} value={element?.style?.fontWeight} 
        options={['normal', 'bold', ]}
        onHandleStyleChange={(value)=> onHandleStyleChange('fontWeight', value)} />}
      <div>
        <h2 className='font-bold mb-2 '>Outer Style</h2>
        {element?.outerStyle?.backgroundColor&& 
          <ColorPickerField
            label='Background Color'
            value={element?.outerStyle?.backgroundColor}
            onHandleStyleChange={(value) =>
              onHandleOuterStyleChange('backgroundColor', value)
            }
          />
        }
        {element?.outerStyle?.justifyContent&& 
          <ToggleGroupField
            label='Align'
            value={element?.outerStyle?.justifyContent}
            options={TextAlignOptions}
            onHandleStyleChange={(value) =>
              onHandleOuterStyleChange('justifyContent', value)
            }
          />
        }
      </div>

    </div>
  );
}

export default Settings;