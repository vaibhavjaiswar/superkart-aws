import { SelectHTMLAttributes } from "react";
import { ControllerRenderProps } from "react-hook-form";

interface SelectPropsType extends SelectHTMLAttributes<HTMLSelectElement> {
  field: ControllerRenderProps<any, any>
  options: {
    label: string
    value: string
  }[]
}

export default function Select({ field, options, ...rest }: SelectPropsType) {

  const { disabled, name, onBlur, onChange, ref, value } = field

  return (
    <select className="appearance-auto w-full px-3 py-2 bg-transparent border-2 border-neutral-400 rounded cursor-pointer" ref={ref} id={name} onBlur={onBlur} onChange={onChange} disabled={disabled} {...rest}>
      {
        options.length > 0
          ? options.map(option => <option className="font-sans" key={option.label + option.value} value={option.value}>{option.label}</option>)
          : <option className="font-sans" value="">No option available</option>
      }
    </select>
  )
}