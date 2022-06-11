import * as u from '@virtuoso.dev/urx'
import { ScrollContainerState } from './interfaces'
import { recalcSystem } from './recalcSystem'

export const domIOSystem = u.system(
  ([{ recalcInProgress }]) => {
    const scrollContainerState = u.stream<ScrollContainerState>()
    const scrollTop = u.stream<number>()
    const deviation = u.statefulStream(0)
    const smoothScrollTargetReached = u.stream<true>()
    const statefulScrollTop = u.statefulStream(0)
    const viewportHeight = u.stream<number>()
    const scrollHeight = u.stream<number>()
    const headerHeight = u.statefulStream(0)
    const fixedHeaderHeight = u.statefulStream(0)
    const footerHeight = u.statefulStream(0)
    const scrollTo = u.stream<ScrollToOptions>()
    const scrollBy = u.stream<ScrollToOptions>()
    const scrollingInProgress = u.statefulStream(false)
    // bogus, has no effect
    const react18ConcurrentRendering = u.statefulStream(false)

    u.connect(u.pipe(scrollTop, u.mapTo(false)), recalcInProgress)

    u.connect(
      u.pipe(
        scrollContainerState,
        u.map(({ scrollTop }) => scrollTop)
      ),
      scrollTop
    )

    u.connect(
      u.pipe(
        scrollContainerState,
        u.map(({ scrollHeight }) => scrollHeight)
      ),
      scrollHeight
    )

    u.connect(scrollTop, statefulScrollTop)

    return {
      // input
      scrollContainerState,
      scrollTop,
      viewportHeight,
      headerHeight,
      fixedHeaderHeight,
      footerHeight,
      scrollHeight,
      smoothScrollTargetReached,
      react18ConcurrentRendering,

      // signals
      scrollTo,
      scrollBy,

      // state
      statefulScrollTop,
      deviation,
      scrollingInProgress,
    }
  },
  u.tup(recalcSystem),
  { singleton: true }
)
