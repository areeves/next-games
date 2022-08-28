import { useRef } from 'react'

import '../styles/globals.css'

import Layout from '../components/layout.tsx'
import VoiceSelector from '../components/voice-selector'

function MyApp({ Component, pageProps }) {
  const voiceControl = useRef()
  const voiceSelector = <VoiceSelector ref={voiceControl} />

  return (
    <Layout voiceSelector={voiceSelector}>
      <Component {...pageProps} voiceControl={voiceControl} />
    </Layout>
  )
}

export default MyApp
