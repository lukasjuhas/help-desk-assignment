"use client"

import { useState, useEffect, useRef } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import axios from "axios"
import Link from "next/link"
import SlideTransition from "../components/SlideTransition"

type FormData = {
  name: string
  email: string
  description: string
}

export default function FormFlow() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    clearErrors,
    watch,
    reset,
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: { name: "", email: "", description: "" },
  })

  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)

  const name = watch("name")
  const email = watch("email")
  const description = watch("description")

  useEffect(() => {
    if (step === 1 && nameRef.current) {
      nameRef.current.focus()
    } else if (step === 2 && emailRef.current) {
      emailRef.current.focus()
    } else if (step === 3 && descriptionRef.current) {
      descriptionRef.current.focus()
    }
  }, [step])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await axios.post("/api/tickets", data)

      setSuccessMessage(`Your ticket ID: ${response.data.public_id}`)
      setStep(4)
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.errors
          ? (err.response.data.errors as { message: string }[])
              .map((error) => error.message)
              .join(", ")
          : "Failed to create ticket."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const resetFormAndStartNew = () => {
    reset()
    setStep(1)
    setSuccessMessage(null)
    setError(null)
  }

  const validateCurrentStep = async (): Promise<boolean> => {
    if (step === 1) {
      return await trigger("name")
    } else if (step === 2) {
      return await trigger("email")
    } else if (step === 3) {
      return await trigger("description")
    }
    return false
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()
    if (isValid) {
      setStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    clearErrors()
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setValue(field, value, { shouldValidate: false })
    clearErrors(field)
  }

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()

      if (step === 3) {
        await handleSubmit(onSubmit)()
      } else {
        await nextStep()
      }
    }
  }

  return (
    <div className="flex justify-center items-center py-24">
      <div className="w-full max-w-lg text-center">
        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
          <SlideTransition key={step}>
            {step === 1 && (
              <div>
                <h2 className="text-3xl font-bold mb-8">
                  First of all, what is your name?
                </h2>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className={`input input-bordered w-full mb-4 ${
                    errors.name ? "input-error" : ""
                  }`}
                  {...register("name", { required: "Name is required" })}
                  value={name}
                  ref={(el) => {
                    nameRef.current = el
                  }}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
                <button
                  type="button"
                  className="btn btn-primary w-full mt-4"
                  onClick={nextStep}
                  disabled={loading}
                >
                  Next
                </button>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="text-3xl font-bold mb-8">
                  Thank you, {name.trim() || "there"}! Now, what is your email
                  address?
                </h2>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`input input-bordered w-full mb-4 ${
                    errors.email ? "input-error" : ""
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  value={email}
                  ref={(el) => {
                    emailRef.current = el
                  }}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    className="btn"
                    onClick={prevStep}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={nextStep}
                    disabled={loading}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h2 className="text-3xl font-bold mb-8">
                  Great! One last thing, {name.trim() || "friend"}. What seems
                  to be the issue?
                </h2>
                <textarea
                  placeholder="Describe your issue"
                  className={`textarea textarea-bordered w-full mb-4 ${
                    errors.description ? "textarea-error" : ""
                  }`}
                  {...register("description", {
                    required: "Issue description is required",
                  })}
                  value={description}
                  ref={(el) => {
                    descriptionRef.current = el
                  }}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    className="btn"
                    onClick={prevStep}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
            {step === 4 && (
              <div>
                <h2 className="text-3xl font-bold mb-4">Thank you!</h2>
                <p className="mb-2">
                  Your issue has been received. We will get back to you shortly.
                </p>
                {successMessage && (
                  <p className="text-green-600 text-sm">{successMessage}</p>
                )}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="mt-8">
                  <Link href="/" className="btn mt-6">
                    Back to home
                  </Link>
                  <p className="mt-6 text-sm">or</p>
                  <button
                    className="btn btn-link mt-4"
                    onClick={resetFormAndStartNew}
                  >
                    Submit Another
                  </button>
                </div>
              </div>
            )}
          </SlideTransition>
        </form>
      </div>
    </div>
  )
}
