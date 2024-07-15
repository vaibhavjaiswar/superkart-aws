'use client'

import Button from "@/components/Button"
import Input from "@/components/Input"
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";
import { categoryOptions } from "@/constants/category";
import { subCategoryOptions } from "@/constants/subcategory";
import { AddProductFormData } from "@/utils/types";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

const formResolver = yup.object().shape({
  name: yup.string().required("required").trim(),
  description: yup.string().required("required").trim(),
  features: yup.string().required("required").trim(),
  price: yup.number().required("required").moreThan(0, "must be greater than 0"),
  discountprice: yup.number().required("required").moreThan(0, "must be greater than 0").lessThan(yup.ref("price"), "must be less than Price"),
  image: yup.mixed().required("required").test("file", "must be a file", (value) => value instanceof FileList),
  category: yup.string().required("required"),
  subcategory: yup.string().required("required"),
})

export default function AdminAddProductForm() {

  const [_, setForceRender] = useState(0)
  const { control, formState: { errors, isSubmitting, isSubmitSuccessful }, handleSubmit, register, reset, setValue, watch } = useForm<AddProductFormData>({
    // @ts-ignore
    resolver: yupResolver(formResolver),
    defaultValues: {
      name: '',
      description: '',
      features: '',
      price: 0,
      discountprice: 0,
      image: null,
      category: '',
      subcategory: '',
    }
  })

  if (isSubmitSuccessful) reset()

  const onSubmit: SubmitHandler<AddProductFormData> = async (data) => {
    const { image } = data
    if (image && image?.length > 0) {
      const fileKey = await uploadImage(image[0]) as unknown as string | null
      if (fileKey !== null) {
        const response = await axios.post('/api/admin/add-product', {
          name: data.name,
          description: data.description,
          features: data.features,
          price: data.price,
          discountPrice: data.discountprice,
          fileKey: fileKey,
          category: data.category,
          subcategory: data.subcategory,
        })
        const { ok, message } = response.data
        if (ok) {
          alert(message)
        } else {
          alert(message)
          console.warn(message)
        }
      }
    }
  }

  const onReset = () => reset()

  const handleImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('image', e.target.files)
    setForceRender(Math.random())
  }

  const handleImageRemove = () => {
    setValue('image', null)
    setForceRender(Math.random())
  }

  const uploadImage = async (image: File) => {
    try {
      const signedURLRepsonse = await axios.get('/api/admin/put-signed-url?filename=' + image.name)

      if (signedURLRepsonse.data.ok) {
        const url = signedURLRepsonse.data.url
        const key = url.split("?")[0].split(".com/")[1]
        const uploadResponse = await axios.put(url, image)
        if (uploadResponse.status === 200)
          return key
        else
          return null
      } else {
        return null
      }
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const category = watch('category')

  useEffect(() => {
    setValue('subcategory', '')
  }, [category, setValue])

  const imageFile = watch('image')?.item(0) || null
  const currentSubCategoryOptions = subCategoryOptions[watch('category')]

  return (
    <form className="max-w-xl" onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
      <div className="flex flex-col gap-2 justify-start items-stretch">
        <div>
          <label className="mb-1 block cursor-pointer" htmlFor="image">
            Product Image&nbsp;
            {errors.image && <span className="text-xs text-red-500">({errors.image.message})</span>}
            <input id="image" type="file" className="hidden" accept="image/png,image/jpeg,image/jpeg" {...register('image')} onChange={handleImageFile} />
            <div className="p-2 min-h-80 mt-1 mb-2 border-4 border-dashed rounded-xl flex flex-col justify-center items-center hover:border-neutral-400">
              {
                imageFile === null ? (
                  <span>No image selected</span>
                ) : (
                  <>
                    <Image alt="product's image" src={URL.createObjectURL(imageFile)} width={288} height={288} />
                    <span>{imageFile.name}</span>
                  </>
                )
              }
            </div>
          </label>
          <Button type="button" variant="outline" onClick={handleImageRemove}>Remove Image</Button>
        </div>
        <div>
          <label className="mb-1 block cursor-pointer" htmlFor="name">
            Product Name&nbsp;
            {errors.name && <span className="text-xs text-red-500">({errors.name.message})</span>}
          </label>
          <Controller name="name" control={control} render={({ field }) => (
            <Input type="text" placeholder="Enter the product's name" field={field} />
          )} />
        </div>
        <div>
          <label className="mb-1 block cursor-pointer" htmlFor="description">
            Description&nbsp;
            {errors.description && <span className="text-xs text-red-500">({errors.description.message})</span>}
          </label>
          <Controller name="description" control={control} render={({ field }) => (
            <TextArea placeholder="Enter the product's description" field={field} />
          )} />
        </div>
        <div>
          <label className="mb-1 block cursor-pointer" htmlFor="features">
            Features&nbsp;
            {errors.features && <span className="text-xs text-red-500">({errors.features.message})</span>}
          </label>
          <Controller name="features" control={control} render={({ field }) => (
            <TextArea placeholder="Enter the product's features" field={field} />
          )} />
        </div>
        <div>
          <label className="mb-1 block cursor-pointer" htmlFor="price">
            Price&nbsp;
            {errors.price && <span className="text-xs text-red-500">({errors.price.message})</span>}
          </label>
          <Controller name="price" control={control} render={({ field }) => (
            <Input type="number" placeholder="Enter the product's price" field={field} />
          )} />
        </div>
        <div>
          <label className="mb-1 block cursor-pointer" htmlFor="discountprice">
            Discount Price&nbsp;
            {errors.discountprice && <span className="text-xs text-red-500">({errors.discountprice.message})</span>}
          </label>
          <Controller name="discountprice" control={control} render={({ field }) => (
            <Input type="number" placeholder="Enter the product's discount price" field={field} />
          )} />
        </div>
        <div>
          <label className="mb-1 block cursor-pointer" htmlFor="category">
            Category&nbsp;
            {errors.category && <span className="text-xs text-red-500">({errors.category.message})</span>}
          </label>
          <Controller name="category" control={control} render={({ field }) => (
            <Select field={field} options={categoryOptions} />
          )} />
        </div>
        <div>
          <label className="mb-1 block cursor-pointer" htmlFor="subcategory">
            Sub-Category&nbsp;
            {errors.subcategory && <span className="text-xs text-red-500">({errors.subcategory.message})</span>}
          </label>
          <Controller name="subcategory" control={control} render={({ field }) => (
            <Select field={field} options={currentSubCategoryOptions} />
          )} />
        </div>
      </div>
      <div className="my-4 flex gap-2">
        <Button type="submit" variant="solid" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Product'}
        </Button>
        <Button type="reset" variant="outline" disabled={isSubmitting}>Reset</Button>
      </div>
    </form>
  )
}