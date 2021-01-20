import * as u from '@virtuoso.dev/urx'
import { domIOSystem } from './domIOSystem'
import { WindowViewportInfo } from './interfaces'

export const windowScrollerSystem = u.system(([{ scrollTop, scrollTo, viewportHeight }]) => {
  const windowViewportRect = u.stream<WindowViewportInfo>()
  const windowScrollTop = u.stream<number>()
  const windowScrollTo = u.stream<ScrollToOptions>()
  const useWindowScroll = u.statefulStream(false)

  u.connect(
    u.pipe(
      u.combineLatest(windowScrollTop, windowViewportRect),
      u.map(([windowScrollTop, { offsetTop }]) => {
        return Math.max(0, windowScrollTop - offsetTop)
      })
    ),
    scrollTop
  )

  u.connect(
    u.pipe(
      scrollTo,
      u.withLatestFrom(windowViewportRect),
      u.map(([scrollTo, { offsetTop }]) => {
        return {
          ...scrollTo,
          top: scrollTo.top! + offsetTop,
        }
      })
    ),
    windowScrollTo
  )

  // u.subscribe(windowViewportRect, console.log)
  // u.subscribe(scrollTop, console.log)

  u.connect(u.pipe(windowViewportRect, u.map(u.prop('visibleHeight'))), viewportHeight)

  return {
    // config
    useWindowScroll,

    // input
    windowScrollTop,
    windowViewportRect,

    // signals
    windowScrollTo,
  }
}, u.tup(domIOSystem))
