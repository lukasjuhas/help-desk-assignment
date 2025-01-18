import Link from "next/link"

export default function HomePage() {
  return (
    <div className="text-center py-10 px-4 pt-28">
      <div className="w-full max-w-4xl m-auto">
        <h1 className="text-3xl font-bold mb-8">
          Welcome to the Help Desk! <br />
          <small>How can we help you today?</small>
        </h1>

        <div className="mb-16">
          <input
            type="text"
            placeholder="Search for help topics..."
            className="input input-bordered input-lg w-full max-w-lg"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="card bg-white shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer">
            <h3 className="text-xl font-bold mb-2">Common Issues</h3>
            <p className="text-sm text-gray-600">
              Find solutions to frequently encountered problems.
            </p>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer">
            <h3 className="text-xl font-bold mb-2">Getting Started</h3>
            <p className="text-sm text-gray-600">
              Learn how to make the most out of our services.
            </p>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer">
            <h3 className="text-xl font-bold mb-2">FAQ</h3>
            <p className="text-sm text-gray-600">
              Explore answers to commonly asked questions.
            </p>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer">
            <h3 className="text-xl font-bold mb-2">Technical Support</h3>
            <p className="text-sm text-gray-600">
              Get help with troubleshooting technical problems.
            </p>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer">
            <h3 className="text-xl font-bold mb-2">Tutorials</h3>
            <p className="text-sm text-gray-600">
              Follow step-by-step guides for various features.
            </p>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer">
            <h3 className="text-xl font-bold mb-2">Latest News</h3>
            <p className="text-sm text-gray-600">
              Stay updated with announcements and updates.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-16 mb-6">Still having trouble?</h2>
        <Link href="/contact" className="btn btn-primary btn-lg min-w-56">
          Contact Us
        </Link>
      </div>
    </div>
  )
}
