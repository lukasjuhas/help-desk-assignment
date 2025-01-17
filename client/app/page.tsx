import Link from "next/link"

export default function HomePage() {
  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold mb-8">
        Welcome to the Help Desk! How can we help you today?
      </h1>
      <p>...</p>
      <p>...</p>
      <p>...</p>
      <p>...</p>
      <p>...</p>
      <h2 className="text-2xl font-bold mt-6 mb-6">Still having trouble?</h2>
      <Link href="/contact" className="btn btn-primary btn-lg">
        Contact us
      </Link>
    </div>
  )
}
