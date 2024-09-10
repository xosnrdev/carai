import type { RefObject } from 'react'
import type { TabView } from './index.types'

export { scrollActiveTabIntoView }

function isTabVisible({ tabElement, parentElement }: TabView): boolean {
    const tabRect = tabElement.getBoundingClientRect()
    const parentRect = parentElement.getBoundingClientRect()

    return tabRect.left >= parentRect.left && tabRect.right <= parentRect.right
}

function computeIdealScrollPosition({
    tabElement,
    parentElement,
    tabWidth,
    tabIndexMap,
}: {
    tabWidth: number
    tabIndexMap: Map<string, number>
} & TabView): number {
    const chunkWidth = parentElement.clientWidth
    const tabIndex = tabIndexMap.get(tabElement.id) ?? 0
    let scrollLeft = tabIndex * tabWidth - chunkWidth / 2 + tabWidth / 2

    scrollLeft = Math.max(
        0,
        Math.min(scrollLeft, parentElement.scrollWidth - chunkWidth)
    )

    return scrollLeft
}

function handleCircularScrolling({
    tabIndex,
    numTabs,
    parentElement,
}: {
    tabIndex: number
    numTabs: number
    parentElement: HTMLElement
}): void {
    if (numTabs === 0) return

    const tabWidth = parentElement.scrollWidth / numTabs
    const scrollPosition = (tabIndex * tabWidth) % parentElement.scrollWidth

    parentElement.scroll({
        left: scrollPosition,
        behavior: 'smooth',
    })
}

function scrollActiveTabIntoView(
    activeTabRef: RefObject<HTMLElement>,
    tabIndexMap: Map<string, number>
): void {
    if (!activeTabRef.current) return

    const tabElement = activeTabRef.current
    const parentElement = tabElement.parentElement

    if (!parentElement) return

    if (!isTabVisible({ tabElement, parentElement })) {
        const tabWidth = tabElement.offsetWidth
        const idealScrollLeft = computeIdealScrollPosition({
            tabElement,
            parentElement,
            tabWidth,
            tabIndexMap,
        })

        parentElement.scroll({
            left: idealScrollLeft,
            behavior: 'smooth',
        })

        const tabIndex = tabIndexMap.get(tabElement.id) ?? 0
        const numTabs = parentElement.children.length

        handleCircularScrolling({ tabIndex, numTabs, parentElement })
    }
}
