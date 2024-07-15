'use client'

import Button from "@/components/Button"
import { CommonResponseType } from "@/utils/types";
import axios from "axios";
import { useState } from "react";

interface ResponseType extends CommonResponseType {
  data: string[]
}

export default function AdminAddProductForm() {

  const [isUpdating, setIsUpdating] = useState(false)

  const updateExpiredImages = async () => {
    setIsUpdating(true)
    const response = await axios.get('/api/admin/update-expired-images')
    const { ok, message, data } = response.data as ResponseType
    if (ok) {
      console.log(response.data)
      alert(message)
    } else {
      console.log(response.data)
      alert('Some error occured')
    }
    setIsUpdating(false)
  }

  return (
    <div>
      <p className="mb-2">Click to refresh pre-signed URL of images in AWS S3.</p>
      <Button variant="outline" onClick={updateExpiredImages} disabled={isUpdating}>
        {isUpdating ? 'Updating Images...' : 'Update Expired Images'}
      </Button>
    </div >
  )
}