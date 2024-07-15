'use client'

import Button from "@/components/Button"
import Input from "@/components/Input"
import { CommonResponseType, LoginFormInputType } from "@/utils/types"
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import { cookies } from "next/headers"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import * as yup from "yup"

interface ResponseType extends CommonResponseType {
  data: { name: string, email: string }
}

const formResolver = yup.object().shape({
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
})

export default function AdminLoginForm() {

  const router = useRouter()

  const { control, formState: { errors, isSubmitting }, handleSubmit, register, reset } = useForm<LoginFormInputType>({
    resolver: yupResolver(formResolver),
    defaultValues: {
      email: 'admin@superkart',
      password: '',
    }
  })

  const onSubmit: SubmitHandler<LoginFormInputType> = async (data) => {
    try {
      const response = await axios.post("/api/login", data)
      const { ok, message } = response.data
      if (ok) {
        router.push('/admin')
      } else {
        alert('Some error occured.')
        console.error(message)
      }
    } catch (error: any) {
      const { ok, message } = error.response.data
      if (ok) {
        alert(message)
      } else {
        alert('Some error occured.')
        console.error(error)
      }
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
          <label className="mb-1 block cursor-pointer" htmlFor="email">
            Email&nbsp;
            {errors.email && <span className="text-xs text-red-500">({errors.email.message})</span>}
          </label>
          <Controller name="email" control={control} render={({ field }) => <Input placeholder="Enter your email" field={field} disabled />} />
        </div>
        <div>
          <label className="mb-1 block cursor-pointer" htmlFor="password">
            Password&nbsp;
            {errors.password && <span className="text-xs text-red-500">({errors.password.message})</span>}
          </label>
          <Controller name="password" control={control} render={({ field }) => <Input type="password" placeholder="Enter your password" field={field} />} />
        </div>
      </div>
      <div className="my-4 flex gap-2">
        <Button className="flex-1" type="submit" variant="solid" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Log In'}
        </Button>
        <Button className="flex-1" type="reset" variant="outline">Reset</Button>
      </div>
    </form>
  )
}
