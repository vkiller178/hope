import showdown from 'showdown'

const converter = new showdown.Converter()
converter.setFlavor('github')

export default converter
