import Link from "next/link"
import Image from "next/image"
import HifiLogo from "../../public/hifi-logo.svg"

export default function Navbar() {
  return (
    <header className="py-2 px-6 flex justify-between items-center fixed top-0 left-0 w-full">
      <div>
        <Link href="/">
          <Image
            priority
            src={HifiLogo}
            alt="HIFI Help Desk"
            className="w-12 ml-14 lg:ml-0"
          />
        </Link>
      </div>
      <div>
        <aside>
          <nav>
            <ul className="menu menu-horizontal space-x-2">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/admin">Admin</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </header>
  )
}
