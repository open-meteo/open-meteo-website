import { writable as internal, type Writable } from 'svelte/store'

/**
 * Synchronize the store to an URL hash like: `#count=20&language=es`
 * 
 * @param initialValue
 * @returns 
 */
export function urlHashStore<T>(initialValue: T): Writable<T> {
    const browser = typeof (window) !== 'undefined' && typeof (document) !== 'undefined'
    const location = browser ? window.location : null
    const history = browser ? window.history : null
    const defaultValues = {...initialValue}

    function updateStorage(value: T) {
        let diff: Partial<T> = {};
        let count = 0
		for (const key in defaultValues) {
			if (defaultValues[key] !== value[key]) {
				diff[key] = value[key];
                count++
			}
		}
        if (count > 0) {
            // @ts-ignore
            history?.replaceState(null, "", `#${new URLSearchParams(diff)}`)
        }
        if (count == 0 && location?.hash && location?.hash.length > 0) {
            // Remove all hash parameters
            history?.replaceState(null, "", " ");
        }
    }
    function deserialize(url: string): T {
        let object = {...defaultValues}
        let index = url.indexOf("#");
        if (index !== -1) {
            for (const [key, value] of new URLSearchParams(url.substring(index + 1))) {
                // @ts-ignore
                if (defaultValues.hasOwnProperty(key)) {
                    // @ts-ignore
                    object[key as keyof typeof object] = value;
                }
            }
        }
        return object
    }

    const store = internal(initialValue, (set) => {
        const hash = location?.hash

        if (hash && hash.length > 0) {
            set(deserialize(hash))
        } else {
            updateStorage(initialValue)
        }

        if (browser) {
            const handleStorage = (event: HashChangeEvent) => {
                set(deserialize(event.newURL))
            }

            window.addEventListener("hashchange", handleStorage)

            return () => window.removeEventListener("hashchange", handleStorage)
        }
    })

    const { subscribe, set } = store

    return {
        set(value: T) {
            updateStorage(value)
            set(value)
        },
        update(callback: (value: T) => T) {
            return store.update((last) => {
                const value = callback(last)

                updateStorage(value)

                return value
            })
        },
        subscribe
    }
}