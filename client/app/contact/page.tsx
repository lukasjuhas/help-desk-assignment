"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import Link from "next/link"
import SlideTransition from "../components/SlideTransition"

type FormData = {
  name: string
  email: string
  issue: string
}

export default function FormFlow() {
  const [step, setStep] = useState(1)

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    clearErrors,
    watch,
  } = useForm<FormData>({ mode: "onBlur" }) // Errors trigger on blur, not input.

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Form Submitted:", data)
    setStep(4) // Go to the confirmation step
  }

  const nextStep = async () => {
    const isValid = await trigger() // Validate the current step
    if (isValid) setStep((prev) => prev + 1)
  }

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const handleInputChange = (field: keyof FormData, value: string) => {
    setValue(field, value) // Update the form field value
    clearErrors(field) // Clear errors for the field
  }

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault() // Prevent form submission
      await nextStep() // Trigger next step validation
    }
  }

  const name = watch("name") || ""

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
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
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
                <button
                  type="button"
                  className="btn btn-primary w-full mt-4"
                  onClick={nextStep}
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
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
                <div className="flex justify-between mt-4">
                  <button type="button" className="btn" onClick={prevStep}>
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={nextStep}
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
                    errors.issue ? "textarea-error" : ""
                  }`}
                  {...register("issue", {
                    required: "Issue description is required",
                  })}
                  onChange={(e) => handleInputChange("issue", e.target.value)}
                ></textarea>
                {errors.issue && (
                  <p className="text-red-500 text-sm">{errors.issue.message}</p>
                )}
                <div className="flex justify-between mt-4">
                  <button type="button" className="btn" onClick={prevStep}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            )}
            {step === 4 && (
              <div>
                <h2 className="text-3xl font-bold mb-4">Thank you!</h2>
                <p>
                  Your issue has been received. We will get back to you shortly.
                </p>
                <div className="mt-8">
                  <Link href="/" className="btn mt-6">
                    Back to home
                  </Link>
                  <p className="mt-6 text-sm">or</p>
                  <button
                    className="btn btn-link mt-4"
                    onClick={() => setStep(1)}
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
