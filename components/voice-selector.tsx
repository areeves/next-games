import { useState, useEffect, forwardRef, useImperativeHandle, MutableRefObject } from 'react'
import { ImUser, ImUserCheck } from 'react-icons/im'
import ReactCountryFlag from 'react-country-flag'

interface Sayable {
  say(msg:string): Promise<void>
}

export default forwardRef<Sayable>( function VoiceSelector(props, ref: MutableRefObject<Sayable|null>) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>( [] )
  const [voice, setVoice] = useState<SpeechSynthesisVoice|null>( null )

  useEffect(
    () => {
      const synth = window.speechSynthesis
      const onVoicesChanged = event => {
        setVoices(event.target.getVoices())
      }
      synth.addEventListener('voiceschanged', onVoicesChanged)
      return () => synth.removeEventListener('voiceschanged', onVoicesChanged)
    }, []
  )

  const [sayName, setSayName] = useState<string|null>(null)
  useEffect(
    () => {
      if(ref.current && sayName) {
        ref.current.say(sayName)
        setSayName(null)
      }
    },
    [sayName]
  )

  useImperativeHandle(ref, () => ({
    async say(msg: string) {
      return new Promise( (resolve, reject) => {
        const utter = new SpeechSynthesisUtterance(msg)
        utter.voice = voice
        utter.onend = () => resolve()
        utter.onerror = (e) => reject(e)
        window.speechSynthesis.speak(utter)
      })
    }
  }))

  const clickVoice = v => {
    setVoice(v)
    setSayName(v.name)
  }
  const buttons = voices.map(
    (v,i) => {
      const flag = <ReactCountryFlag countryCode={ v.lang.slice(-2)} svg />
      const ico = voice === v ? <ImUserCheck /> : <ImUser />
      return <button key={i} onClick={() => clickVoice(v)} className="p-2 m-2 flex flex-col">{flag}{ico}</button>
    }
  )

  return <div className="mt-4 p-4 flex items-center text-4xl">{buttons }</div>
})
