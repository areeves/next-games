import { useReducer } from 'react'

import Result from '../components/result.tsx'

const initialState = {
  phase: 'playing',
  level: 1,
  remaining: [],
  objects: [ '\u25EF' ],
}

const reducer = (state, action) => {
  if(state.phase === 'playing' && typeof action === 'number') {
    let {phase, level, remaining, objects} = state
    remaining = remaining.slice() // copy values so we don't modify incoming state var
    const resetLvl = () => {
      remaining = Array(level).fill(0).map((_,i)=>i+1).sort(() => Math.random() - 0.5)
      console.log({remaining})
    }
    if(action === objects.length) {
      // correct
      phase = 'correct'
      if(remaining.length === 0) {
        // level complete
        level++
        resetLvl()
      }
    } else {
      // incorrect
      phase = 'incorrect'
      resetLvl()
    }
    // next round
    objects = Array(remaining.pop()).fill('\u25EF')
    return {
      phase,
      level,
      remaining,
      objects,
    }
  }
  if((state.phase === 'correct' || state.phase === 'incorrect') && action === 'continue') {
    return {
      ...state,
      phase: 'playing',
    }
  }
  console.warn({msg:'unexpected reducer action', state, action})
  return state
}
export default function Numbers() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const objects = state.objects.map((o,i) => <span className="p-4" key={i}>{o}</span>)
  const buttons = []
  for(let i = 1; i <= state.level; i++) {
    const onClick = () => dispatch(i)
    buttons.push( <button key={i} onClick={() => dispatch(i)} className="m-4 px-4 py-2 border rounded-xl">{i}</button> )
  }

  if(state.phase === 'correct' || state.phase === 'incorrect') {
    return <Result isCorrect={state.phase === 'correct'} continueAction={() => dispatch('continue')} />
  }
  return (
    <div className="flex flex-col items-center">
      <div className="flex m-4 text-6xl"> {objects} </div>
      <div className="flex m-4 text-2xl"> {buttons} </div>
    </div>
  )
}
