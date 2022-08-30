import { useReducer, useState, useEffect } from 'react'

import Result from '../components/result'

const CIRCLE = '\u25EF'

interface numbersReducerState {
  phase: 'pre-round'|'playing'|'correct'|'incorrect'|'reset',
  level: number,
  objects: string[],
  remaining: string[][]
}
interface numbersReducerSimpleAction { type: 'begin'|'continue' }
interface numbersReducerAnswerAction { type: 'answer', value: number }
interface numbersReducerResetAction { type: 'reset', value: string[][] }
type numbersReducerAction = numbersReducerSimpleAction | numbersReducerResetAction | numbersReducerAnswerAction

const initialState: numbersReducerState = {
  phase: 'reset',
  level: 1,
  remaining: [ ],
  objects: [ ],
}

const reducer = (state: numbersReducerState, action: numbersReducerAction): numbersReducerState => {
  // level generation handled by an effect which passes in the remaining rounds
  if(state.phase === 'reset' && action.type === 'reset') {
    return { ...state, phase: 'pre-round', objects: [], remaining: action.value }
  }
  // begin, pre-round -> playing (triggered by usePreroundEffect)
  if(state.phase === 'pre-round' && action.type === 'begin') {
    return {
      phase: 'playing',
      level: state.level,
      objects: state.remaining[0],
      remaining: state.remaining.slice(1)
    }
  }
  // answer, playing -> correct/incorrect
  if(state.phase === 'playing' && action.type === 'answer') {
    const isCorrect = action.value === state.objects.length
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

const useResetEffect = (state, dispatch) => {
  useEffect(
    () => {
      const rounds = Array(state.level)
        .fill(0)
        .map( (_,i) => i+1 )
        .map( i => Array(i).fill(CIRCLE) )
      // select rounds in random order to populate the level
      const value = []
      while(rounds.length) {
        value.push( rounds.splice( Math.floor( Math.random() * rounds.length), 1)[0] )
      }
      dispatch( { 'type': 'reset', value } )
    },
    [state, dispatch]
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

export default function Numbers({ voiceControl }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  useResetEffect(state, dispatch )
  usePreRoundEffect(state, dispatch, voiceControl)

  if(state.phase === 'correct' || state.phase === 'incorrect') {
    return <Result isCorrect={state.phase === 'correct'} continueAction={() => dispatch({type: 'continue'} )} />
  }

  const objects = state.objects.map((o,i) => <span className="p-4" key={i}>{o}</span>)
  const buttons = []
  for(let i = 1; i <= state.level; i++) {
    const onClick = () => dispatch({ type: 'answer', value: i })
    buttons.push( <button key={i} onClick={onClick} className="m-4 px-4 py-2 border rounded-xl">{i}</button> )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex m-4 text-6xl"> {objects} </div>
      <div className="flex m-4 text-2xl"> {buttons} </div>
    </div>
  )
}
