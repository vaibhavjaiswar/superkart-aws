interface ButtonPropType extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode | string
  className?: string
  variant: 'solid' | 'outline'
}

export default function Button({ children, className, variant = 'solid', ...rest }: ButtonPropType) {
  let colors = ''

  switch (variant) {
    case 'outline':
      colors = 'bg-neutral-100 text-neutral-900 border-2 border-neutral-900 hover:bg-neutral-200'
      break
    default:
      colors = 'bg-neutral-900 text-neutral-100 border-2 border-neutral-900 hover:bg-neutral-950 hover:border-neutral-950'
      break
  }

  return (
    <button
      className={`w-full sm:w-auto active:outline active:outline-2 active:outline-neutral-400 min-w-max px-3 py-1 rounded disabled:opacity-50 ${colors} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}