import React, { createContext, useState, useEffect } from 'react'
import { ContextTypes } from '@/types/video-repo'
import { toast } from 'react-toastify'

export const GlobalContext = createContext({
  titleCase: () => '',
  logged: false,
  setLogged: () => {},
  user: '',
  setUser: () => {},
  sendEmail: () => {},
  errMsg: false,
} as ContextTypes)

const GlobalState = ({ children }: { children: React.ReactNode }) => {
  const [logged, setLogged] = useState<boolean>(false)
  const [user, setUser] = useState<string>('')
  const [errMsg, setErrMsg] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const retrieved = localStorage.getItem('logged')
      if (retrieved) {
        const storedJson = JSON.parse(retrieved)
        const savedSession = parseInt(storedJson)
        const asBoolean = Boolean(savedSession)
        setLogged(asBoolean)
      } else {
        setLogged(false)
      }
    }
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSession = localStorage.getItem('user')
      if (savedSession) {
        console.log(savedSession)
        setUser(savedSession)
      } else {
        setUser('')
      }
    }
  }, [])

  //function to validate the entered email
  const isEmailValid = (mail: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(mail)
  }

  const sendEmail = async (
    email: string,
    id: string | string[] | undefined,
    user?: string,
  ) => {
    //validate the email before taking action
    const valid = isEmailValid(email)
    if (!valid) {
      setErrMsg(true)
    } else {
      if (user) {
        try {
          const response = await fetch(
            `https://www.cofucan.tech/srce/api/send-email/${id}?sender=${user}&recipient=${email}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          console.log(response)
          if (response.status === 200) {
            const result = await response.json()
            toast.success(`${result.message}`, {
              style: {
                background: 'white', // Change the background color as needed
                color: 'green', // Change the text color as needed
                borderRadius: '8px', // Rounded corners for the toast
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add a subtle box shadow
                padding: '12px 24px', // Adjust padding as needed
                fontSize: '16px', // Adjust font size as needed
                textAlign: 'center',
              },
            })
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          const response = await fetch(
            `https://www.cofucan.tech/srce/api/send-email/${id}?sender=${''}&recipient=${email}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          console.log(response)
          if (response.status === 200) {
            const result = await response.json()
            toast.success(`${result.message}`, {
              style: {
                background: 'white', // Change the background color as needed
                color: 'green', // Change the text color as needed
                borderRadius: '8px', // Rounded corners for the toast
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add a subtle box shadow
                padding: '12px 24px', // Adjust padding as needed
                fontSize: '16px', // Adjust font size as needed
                textAlign: 'center',
              },
            })
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  const titleCase = (name: string) => {
    let intialised = ''
    if (name) {
      const copy = name
      let arr = copy.split(' ')
      let joined = []

      for (let i = 0; i <= arr.length; i++) {
        const initials =
          typeof arr[i] === 'string'
            ? arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
            : ''
        joined.push(initials)
      }
      intialised = joined.join(' ')
    }
    return intialised
  }

  const contextValue: ContextTypes = {
    titleCase,
    logged,
    setLogged,
    user,
    setUser,
    sendEmail,
    errMsg,
  }
  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalState
