import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex p-4 m-4">
      <Link href="/numbers">
        <a className="p-6 m-2 border rounded-xl no-underline text-6xl">
          1&nbsp;2&nbsp;3
        </a>
      </Link>
    </div>
  )
}
