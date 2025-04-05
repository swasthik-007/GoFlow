import { Input } from '@/components/ui/input';
import React from 'react'

function InputStyleField({ label, value, onHandleStyleChange, type = 'px' }) {
    const FormattedValue = (value_) => {
      return Number((value_ ?? "").toString().replace(type, "")) || 0;
    };
  
    return (
      <div>
        <label>{label}</label>
        <div className="flex">
          <Input
            value={FormattedValue(value)}
            onChange={(e) => onHandleStyleChange(e.target.value + type)}
          />
          <h2 className="p-1.5 bg-gray-100 rounded-r-lg -ml-2">{type}</h2>
        </div>
      </div>
    );
  }
  

export default InputStyleField
