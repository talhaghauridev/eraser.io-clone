'use client'
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs'
import { memo } from 'react'

const AuthButtons = () => {
  return (
      <div className="sm:flex sm:gap-4">
              <div
                className="block rounded-md  px-5 py-2.5 text-sm font-medium 
                 text-white transition "
              >
                <LoginLink postLoginRedirectURL="/dashboard"> Login</LoginLink>
              </div>

              <div
                className="hidden rounded-md bg-gray-100 
                  px-5 py-2.5 text-sm font-medium
                  text-black transition
                 hover:text-slate-800 sm:block"
              >
                <RegisterLink>Register</RegisterLink>
              </div>
    </div>
  )
}

export default memo(AuthButtons)
