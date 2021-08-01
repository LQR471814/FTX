import { RefObject } from "react"
import "styling/Root.css"

const unique_ids: {
    [key: string]: number
} = {}

export function uniqueId(prefix: string) {
    if (!unique_ids[prefix])
        unique_ids[prefix] = 0

    unique_ids[prefix]++
    return `${prefix}_${unique_ids[prefix]}`
}

export function transitionEffect(element: HTMLElement, callback: (e: TransitionEvent) => void) {
    element.addEventListener("transitionend", (e: TransitionEvent) => {
        callback(e)
    }, { once: true })
}

export function transitionEffectOffset(element: HTMLElement, callback: (element: HTMLElement) => void, offset?: number) {
    const cs = window.getComputedStyle(element)
    let waitTime = parseFloat(cs.transitionDelay) * 1000 + parseFloat(cs.transitionDuration) * 1000

    if (offset) waitTime += offset

    setTimeout(() => { callback(element) }, waitTime)
}

export function setWithoutTransition(element: HTMLElement, properties: {}) {
    const originalTransition = window.getComputedStyle(element).transition
    element.style.transition = "none"
    Object.assign(element.style, properties)
    setTimeout(
        () => {
            element.style.transition = originalTransition
        }, 10
    )
}

export function refToHTMLElement(ref: RefObject<any>) {
    return ref.current! as HTMLElement
}

export function clickElement(target: HTMLElement) {
    const e = new MouseEvent('click', {})
    target.dispatchEvent(e)
}
