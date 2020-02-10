import Immutable from 'immutable'

const fade = Immutable.Record({
  id: '',
  type: 'bounce',
  entry: true,
  direction: 'left',
  opacityLimit: 100
})

export default fade
