import React from 'react'
import PropTypes from 'prop-types'
import getAnimation from '../../data/animation'
import CSSHandlerActions from '../../data/CSSHandler/CSSHandlerActions'
import bounceActions from '../../data/bounce/bounceActions'

function bounce ({
  id, bounces, topLimit, transformOrigin,
  duration, timing, delay, iterations, direction, fillMode, playState, ...rest
}) {
  const animation = getAnimation(id, duration, timing, delay, iterations, direction, fillMode, playState)

  if (!rest.bounce.state.has(id)) {
    bounceActions.newBounce(id, bounces, topLimit, transformOrigin)
  } else {
    const bounceObj = rest.bounce.state.get(id)

    animation.transfromOrigin = bounceObj.transformOrigin || 'center bottom'
    const rule = `@keyframes ${id} {\n${bounceKeyframes(bounceObj.bounces || 3, bounceObj.topLimit)}\n}`
    CSSHandlerActions.insertRule(rule, id)

    // test
    animation.animationIterationCount = 'infinite'
  }

  return (
    <div id={id} style={animation}>
      { rest.children }
    </div>
  )
}

// TODO: need to be tested to check if animation bounces effectively
function bounceKeyframes (bounces, topLimit) {
  const frames = bounces * 2
  const linspace = Math.floor(100 / frames)
  // if topLimit not null or zero
  if (!topLimit) {
    topLimit = bounces * 10
  }

  let originFrame = 'from,\n'
  let translate = topLimit
  let multiplier = bounces - 1
  let bounceFrame = '\n\n' + Math.floor(linspace * 1.5) + '% {\n' +
    '   -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n' +
    '   animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n' +
    '   -webkit-transform: translate3d(0, ' + -translate + 'px, 0);\n' +
    '   transform: translate3d(0, ' + -translate + 'px, 0);\n' +
    '}'

  for (const i in [...Array(frames).keys()]) {
    if (i % 2 === 0) {
      originFrame += (i > 0 ? linspace * i : linspace) + '%,\n'
    } else {
      if (i > 1) {
        translate = Math.floor(multiplier / bounces * topLimit)
        if (multiplier === 1) {
          translate /= 2
        }
        bounceFrame += '\n\n' + linspace * i + '% {\n' +
          '   -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n' +
          '   animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n' +
          '   -webkit-transform: translate3d(0, ' + -translate + 'px, 0);\n' +
          '   transform: translate3d(0, ' + -translate + 'px, 0);\n' +
          '}'

        multiplier -= 1
      }
    }
  }

  originFrame += 'to {\n' +
    '   -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n' +
    '   animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n' +
    '   -webkit-transform: translate3d(0, 0, 0);\n' +
    '   transform: translate3d(0, 0, 0);\n' +
    '}'

  return originFrame + bounceFrame
}

export function setBounces (value) {
  bounceActions.changeValue(this.id, 'bounces', value)
}

export function setTopLimit (value) {
  bounceActions.changeValue(this.id, 'topLimit', value)
}

export function setTransformOrigin (value) {
  bounceActions.changeValue(this.id, 'transformOrigin', value)
}

bounce.propTypes = {
  id: PropTypes.string,
  anim: PropTypes.object,
  transformOrigin: PropTypes.string,
  bounces: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  topLimit: PropTypes.number,
  duration: PropTypes.string,
  timing: PropTypes.string,
  delay: PropTypes.string,
  iterations: PropTypes.string,
  direction: PropTypes.string,
  fillMode: PropTypes.string,
  playState: PropTypes.string
}

export default bounce
