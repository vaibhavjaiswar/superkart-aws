'use client'

import Button from "@/components/Button";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

type SuggestionFormInputType = {
  email: string
  message: string
}

const formSchema = yup.object().shape({
  email: yup.string().trim().required("required").email(),
  message: yup.string().trim().required("required"),
})

export default function SuggestionForm() {

  const { control, formState: { errors, isSubmitting, }, handleSubmit, reset } = useForm<SuggestionFormInputType>({
    resolver: yupResolver(formSchema),
    defaultValues: { email: '', message: '' }
  })

  const onSubmit: SubmitHandler<SuggestionFormInputType> = (data) => {
    console.log(data)
    alert('Thanks for the feedback!')
  }

  const onReset = () => reset()

  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
      <div className="flex flex-col gap-2 justify-start items-stretch">
        <h3 className="text-2xl">Fill this form...</h3>
        <div>
          <label className="mb-1 block cursor-pointer" htmlFor="email">
            Email&nbsp;
            {errors.email && <span className="text-xs text-red-500">({errors.email.message})</span>}
          </label>
          <Controller name="email" control={control} render={({ field }) => <Input field={field} placeholder="Enter your email" />} />
        </div>
        <div>
          <label className="mb-1 block cursor-pointer" htmlFor="message">
            Message&nbsp;
            {errors.message && <span className="text-xs text-red-500">({errors.message.message})</span>}
          </label>
          <Controller name="message" control={control} render={({ field }) => <TextArea placeholder="Type your message here..." field={field} />} />
        </div>
      </div>
      <div className="my-4 flex gap-2">
        <Button className="flex-1" type="submit" variant="solid">
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
        <Button className="flex-1" type="reset" variant="outline">Reset</Button>
      </div>
    </form>
  )
}