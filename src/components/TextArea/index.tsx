import { TextareaHTMLAttributes, useState } from "react"
import { ControllerRenderProps } from "react-hook-form"

interface TextAreaPropType extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  field: ControllerRenderProps<any, any>
}

export default function TextArea({ field, ...rest }: TextAreaPropType) {

  const { disabled, name, onBlur, onChange, ref, value } = field

  return (
    <textarea
      className="w-full px-3 py-1.5 border-2 border-neutral-400 rounded disabled:opacity-50"
      disabled={disabled}
      id={name}
      onBlur={onBlur}
      onChange={onChange}
      ref={ref}
      value={value}
      {...rest}
    />
  )
}