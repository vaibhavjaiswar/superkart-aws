'use client'

import { ReactElement } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  children: ReactElement
}

export default function Modal({ children }: PropsType) {

  const modal = (
    <div className="z-50 fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-sm">
      {children}
    </div>
  )

  return (
    createPortal(modal, document.body)
  )
}