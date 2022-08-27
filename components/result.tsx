import { useRef, useEffect } from 'react'

const U_HEAVY_CHECK_MARK = '\u2714'
const U_HEAVY_CROSS_MARK = '\u274C'

export default function Result({ isCorrect, continueAction }) {
  const audioRef = useRef()
  const audioSrc = 'audio/' + (isCorrect ? 'correct' : 'incorrect') + '.ogg'
  useEffect(
    () => {
      audioRef.current.play()
      setTimeout(continueAction, 1000)
    },
    []
  )
  return (
    <div className="flex flex-col items-center">
      <span className="text-8xl m-4 p-4">{ isCorrect ? U_HEAVY_CHECK_MARK : U_HEAVY_CROSS_MARK }</span>
      <audio ref={audioRef} src={audioSrc} />
    </div>
  )
}
