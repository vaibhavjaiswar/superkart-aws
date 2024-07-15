'use client'

import Button from "@/components/Button"
import Input from "@/components/Input"
import { CommonResponseType, SignUpFormInputType } from "@/utils/types"
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import * as yup from "yup"

interface ResponseType extends CommonResponseType {
  data: { name: string, email: string }
}

const formResolver = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("required")
    .min(3, "must be at least 3 characters")
    .max(20, "must be at most 20 characters"),
  email: yup
    .string()
    .required("required")
    .email("must be valid email"),
  password: yup
    .string()
    .required("required")
    .min(6, "must be at least 6 characters")
    .max(16, "must be at most 16 characters")
    .matches(/[A-Z]/, "must have a capital character")
    .matches(/[a-z]/, "must have a small character")
    .matches(/[0-9]/, "must have a number"),
  retypePassword: yup
    .string()
    .required("required")
    .oneOf([yup.ref("password")], "must match the password"),
})

export default function SignUpForm() {

  const [isHidden, setIsHidden] = useState(true)
  const { control, formState: { errors, isSubmitting }, handleSubmit, register, reset } = useForm<SignUpFormInputType>({
    resolver: yupResolver(formResolver),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      retypePassword: '',
    },
  })
  const router = useRouter()

  const onSubmit: SubmitHandler<SignUpFormInputType> = async (data) => {
    try {
      const { name, email, password } = data
      const response = await axios.post("/api/signup", { name, email, password })
      const { ok, message } = response.data
      if (ok) {
        alert(message)
      } else {
        alert(message)
        console.warn(message)
      }
    } catch (error) {
      alert('Some error occured.')
      console.error(error)
    }
  }

  const onReset = () => reset()

  useEffect(() => {
    (async () => {
      const cookies: Record<string, string> = {}
      document.cookie.split(';').forEach(cookie => {
        const [name, value] = cookie.split('=')
        cookies[name?.trim()] = value?.trim()
      })
      const response = await fetch('/api/verify-user', {
        method: 'post',
        body: JSON.stringify({ token: cookies['token'] }),
      })
      const json = await response.json() as ResponseType
      if (json.ok) {
        alert('You are already logged in!')
        router.replace('/')
      }
    })()
  }, [router])

  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
      <div className="flex flex-col gap-2 justify-start items-stretch">
        <div>
          <label className="mb-1 block cursor-pointer" htmlFor="name">
            Name&nbsp;
            {errors.name && <span className="text-xs text-red-500">({errors.name.message})</span>}
          </label>
          <Controller name="name" control={control} render={({ field }) => <Input placeholder="Enter your full name" field={field} />} />
        </div>
        <div>
          <label className="mb-1 block cursor-pointer" htmlFor="email">
            Email&nbsp;
            {errors.email && <span className="text-xs text-red-500">({errors.email.message})</span>}
          </label>
          <Controller name="email" control={control} render={({ field }) => <Input placeholder="Enter your email" field={field} />} />
        </div>
        <div>
          <label className="mb-1 block cursor-pointer" htmlFor="password">
            Password&nbsp;
            {errors.password && <span className="text-xs text-red-500">({errors.password.message})</span>}
          </label>
          <Controller name="password" control={control} render={({ field }) => <Input type="password" placeholder="Create your password" field={field} />} />
        </div>
        <div>
          <label className="mb-1 block cursor-pointer" htmlFor="retypePassword">
            Retype Password&nbsp;
            {errors.retypePassword && <span className="text-xs text-red-500">({errors.retypePassword.message})</span>}
          </label>
          <div className="relative">
            <Controller name="retypePassword" control={control} render={({ field }) => <Input type={isHidden ? "password" : "text"} placeholder="Enter your password again" field={field} />} />
            <button className="mr-1 px-2 py-1.5 absolute top-1/2 right-0 -translate-y-1/2 text-sm text-neutral-600 bg-neutral-50 rounded" type="button" onClick={(e) => { e.preventDefault(); setIsHidden(!isHidden) }}>
              {isHidden ? "Show" : "Hide"}
            </button>
          </div>
        </div>
      </div>
      <div className="my-4 flex gap-2">
        <Button className="flex-1" type="submit" variant="solid" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Sign Up'}
        </Button>
        <Button className="flex-1" type="reset" variant="outline">Reset</Button>
      </div>
    </form>
  )
}
