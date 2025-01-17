"use client" // Required to enable client-side interactivity

import { useState } from "react"

export default function TicketForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Example: POST the data to your backend
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        alert("Ticket submitted successfully!")
        setFormData({ name: "", email: "", description: "" }) // Reset form
      } else {
        alert("Error submitting ticket")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe your issue"
          value={formData.description}
          onChange={handleChange}
          className="textarea textarea-bordered w-full"
        />
      </div>
      <button type="submit" className="btn btn-primary w-full">
        Submit
      </button>
    </form>
  )
}
