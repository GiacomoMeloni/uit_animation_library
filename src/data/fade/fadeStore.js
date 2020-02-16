import { ReduceStore } from 'flux/utils'
import animationDispatcher from '../animationDispatcher'
import fade from './fadeObject'
import fadeActionTypes from './fadeActionTypes'
import style from '../styleObject'
import Immutable from 'immutable'

class FadeStore extends ReduceStore {
  constructor () {
    super(animationDispatcher)
  }

  getInitialState () {
    return Immutable.OrderedMap()
  }

  reduce (state, action) {
    switch (action.type) {
      case fadeActionTypes.NEW_FADE:
        return state.set(
          action.id,
          fade({
            id: action.id,
            entry: action.entry,
            entryDirection: action.entryDirection,
            opacityLimit: action.opacityLimit,
            style: style({
              duration: action.duration,
              timing: action.timing,
              delay: action.delay,
              iterations: action.iterations,
              direction: action.direction,
              fillMode: action.fillMode,
              playState: action.playState
            })
          })
        )

      case fadeActionTypes.CHANGE_FADE_VALUE:
        if (state.get(action.id).has(action.key)) {
          return state.setIn([action.id, action.key], action.value)
        } else if (action.key.startsWith('style.')) {
          action.key = action.key.substr(6)

          if (state.get(action.id).style.has(action.key)) {
            return state.setIn([action.id, 'style', action.key], action.value)
          } else {
            throw Error('style of fade does not have a property ' + action.key)
          }
        } else {
          throw Error('fade does not have a property ' + action.key)
        }

      default:
        return state
    }
  }
}

export default new FadeStore()
