import Link from 'next/link'
import { ImHome3 } from 'react-icons/im'

export default function Layout({ voiceSelector, children }) {
  return (
    <>
    <div className="container flex flex-col items-center">
      <div className="flex items-center p-4 m-4">
        <Link href="/">
          <a className="m-4"> <ImHome3 /> </a>
        </Link>
        <Link href="/numbers">
          <a className="m-4"> 1 2 3 </a>
        </Link>
      </div>
      <div className="flow-root">
        { children }
      </div>
    </div>
    <div className="mt-4">{voiceSelector}</div>
    </>
  )
}
