import { useReducer, useState, useEffect } from 'react'

import Result from '../components/result'

export interface Round {
  objects: any[],
  options: any[],
  target: any
}

interface gameReducerState {
  phase: 'pre-round'|'playing'|'correct'|'incorrect'|'reset',
  level: number,
  current: Round|null,
  remaining: Round[]
}

interface numbersReducerSimpleAction { type: 'begin'|'continue' }
interface numbersReducerAnswerAction { type: 'answer', value: any }
interface numbersReducerResetAction { type: 'reset', value: Round[] }
type numbersReducerAction = numbersReducerSimpleAction | numbersReducerResetAction | numbersReducerAnswerAction

const initialState: numbersReducerState = {
  phase: 'reset',
  level: 1,
  remaining: [ ],
  current: null
}

const reducer = (state: numbersReducerState, action: numbersReducerAction): numbersReducerState => {
  // level generation handled by an effect which passes in the remaining rounds
  if(state.phase === 'reset' && action.type === 'reset') {
    return { ...state, phase: 'pre-round', current: null, remaining: action.value }
  }
  // begin, pre-round -> playing (triggered by usePreroundEffect)
  if(state.phase === 'pre-round' && action.type === 'begin') {
    return {
      phase: 'playing',
      level: state.level,
      current: state.remaining[0],
      remaining: state.remaining.slice(1)
    }
  }
  // answer, playing -> correct/incorrect
  if(state.phase === 'playing' && action.type === 'answer') {
    const isCorrect = action.value === state.current.target
    return { ...state, phase: isCorrect ? 'correct' : 'incorrect' }
  }
  // continue, correct -> pre-round/ reset (lvl+1)
  if(action.type === 'continue' && state.phase === 'correct') {
    if(state.remaining.length) {
      return { ...state, phase: 'pre-round' }
    } else {
      return { ...state, phase: 'reset', level: state.level + 1 }
    }
  }
  // continue, incorrect -> reset
  if( action.type === 'continue' && state.phase === 'incorrect' ) {
    return { ...state, phase: 'reset' }
  }

  console.warn('unexpected reducer action/state', {state, action})
  return state
}

const useResetEffect = (state, dispatch, roundFactory) => {
  useEffect(
    () => {
      if(state.phase === 'reset') {
        dispatch( { 'type': 'reset', roundFactory(state.level) } )
      }
    },
    [state, dispatch, roundFactory]
  )
}

const usePreRoundEffect = (state, dispatch, voiceControl) => {
  useEffect(
    () => {
      if(state.phase === 'pre-round') {
        voiceControl.current.say('How many circles?')
        dispatch({type: 'begin'})
      }
    },
    [state, dispatch]
  )
}

export default function GameComponent({ voiceControl, roundFactory  }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  useResetEffect(state, dispatch )
  usePreRoundEffect(state, dispatch, voiceControl)

  if(state.phase === 'correct' || state.phase === 'incorrect') {
    return <Result isCorrect={state.phase === 'correct'} continueAction={() => dispatch({type: 'continue'} )} />
  }

  const objects = state.current.objects.map((o,i) => <span className="p-4" key={i}>{o}</span>)
  const buttons = state.current.options.map((o,i) => {
    const onClick = () => dispatch({ type: 'answer', value: i })
    return <button key={i} onClick={onClick} className="m-4 px-4 py-2 border rounded-xl">{o}</button> )
  })

  return (
    <div className="flex flex-col items-center">
      <div className="flex m-4 text-6xl"> {objects} </div>
      <div className="flex m-4 text-2xl"> {buttons} </div>
    </div>
  )
}
