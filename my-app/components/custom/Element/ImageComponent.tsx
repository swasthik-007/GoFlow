import React from 'react'

function ImageComponent({style,imageUrl,outerStyle}) {
  return (
    <div style={outerStyle}>
      <img src={imageUrl} alt="Image" style={style} />
    </div>
  )
}

export default ImageComponent
