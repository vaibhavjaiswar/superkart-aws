import { InputHTMLAttributes } from "react"
import { ControllerRenderProps, UseFormRegister } from "react-hook-form"

interface InputPropType extends Omit<InputHTMLAttributes<HTMLInputElement>, ''> {
  className?: string
  field: ControllerRenderProps<any, any>
}

// export default function Input({ label, register, ...rest }: InputPropType) {
export default function Input({ className, field, ...rest }: InputPropType) {

  const { disabled, name, onBlur, onChange, ref, value } = field

  return (
    <input
      disabled={disabled}
      className={`w-full px-3 py-1.5 border-2 border-neutral-400 rounded disabled:opacity-50 ${className}`}
      id={name}
      ref={ref}
      onBlur={onBlur}
      onChange={onChange}
      value={value}
      {...rest}
    />
  )
}