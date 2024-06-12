type Options<T = HTMLElement> = {
  element?: T
  timeout?: number
  interval?: number
}

export function waitForSelector<T extends HTMLElement = HTMLElement, K extends HTMLElement = HTMLElement>(
  selector: string,
  opts?: Options<K>
): Promise<T | null> {
  const { timeout = 5000, interval = 100 } = opts || {}

  return new Promise((resolve, reject) => {
    const maxTries = timeout / interval
    let tries = 0

    const check = () => {
      const element = (opts?.element || document).querySelector<T>(selector)
      if (element) {
        resolve(element)
      } else if (tries >= maxTries) {
        resolve(null)
      } else {
        tries++
        setTimeout(check, interval)
      }
    }

    check()
  })
}

export function waitForSelectorAll<T extends HTMLElement = HTMLElement, K extends HTMLElement = HTMLElement>(
  selector: string,
  opts?: Options<K>
): Promise<NodeListOf<T>> {
  const { timeout = 5000, interval = 100 } = opts || {}

  return new Promise((resolve, reject) => {
    const maxTries = timeout / interval
    let tries = 0

    const check = () => {
      const element = (opts?.element || document).querySelectorAll<T>(selector)

      if (element.length > 0 || tries >= maxTries) {
        resolve(element)
      } else {
        tries++
        setTimeout(check, interval)
      }
    }

    check()
  })
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function mutationObserver(element: HTMLElement, callback: MutationCallback, config?: MutationObserverInit) {
  const observer = new MutationObserver(callback)
  observer.observe(element, config)
  return observer.disconnect
}
