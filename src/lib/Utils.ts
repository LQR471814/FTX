import { IconAssets } from "components/Common/Icon"
import { RefObject } from "react"

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

const fileMapping: {
    [key: string]: IconAssets
} = {
    "audio": IconAssets.f_audio,
    "font": IconAssets.f_font,
    "image": IconAssets.f_image,
    "video": IconAssets.f_video,
    "text": IconAssets.f_document,
    "application/pdf": IconAssets.f_pdf,
    "application/zip": IconAssets.f_archive,
    "application/gzip": IconAssets.f_archive,
}

export function getFileLogo(mimeStr: string) {
    for (const typeStr of Object.keys(fileMapping)) {
        if (mimeStr.includes(typeStr)) {
            return fileMapping[typeStr]!
        }
    }
    return IconAssets.f_default
}

const filesizeUnits: {
    exponent: number,
    label: string,
}[] = [
    {
        exponent: 12,
        label: "TB",
    },
    {
        exponent: 9,
        label: "GB",
    },
    {
        exponent: 6,
        label: "MB",
    },
    {
        exponent: 3,
        label: "KB",
    },
    {
        exponent: 0,
        label: "B",
    },
]

export function getFilesizeLabel(size: number) {
    for (const unit of filesizeUnits) {
        if (size >= 10**unit.exponent) {
            return (size / 10**unit.exponent).toFixed(2) + " " + unit.label
        }
    }
    return size + " B"
}