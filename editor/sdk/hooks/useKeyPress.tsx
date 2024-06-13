import { useEffect, useRef } from 'react'

type KeyPressCallback = (_event: KeyboardEvent) => void

interface UseKeyPressOptions {
	targetKey: string
	callback: KeyPressCallback
	modifier?: keyof KeyboardEvent
}

const useKeyPress = ({ targetKey, callback, modifier }: UseKeyPressOptions) => {
	const callbackRef = useRef(callback)

	useEffect(() => {
		callbackRef.current = callback
	}, [callback])

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			const isModifierPressed = modifier ? event[modifier] : true

			if (isModifierPressed && event.key === targetKey) {
				event.preventDefault()
				event.stopPropagation()
				callbackRef.current(event)
			}
		}

		window.addEventListener('keydown', handleKeyPress, true)
		return () => {
			window.removeEventListener('keydown', handleKeyPress, true)
		}
	}, [targetKey, modifier])
}

export default useKeyPress
