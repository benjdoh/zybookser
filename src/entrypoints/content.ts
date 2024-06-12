import { waitForSelectorAll, waitForSelector } from '../lib/utils'
import { createRouter } from 'radix3'
import { checkChapters } from '../lib/overview'
import { startActivities } from '../lib/activities'

function main() {
  const isInChapter = location.href.includes('chapter')

  if (isInChapter) return startActivities()

  checkChapters()
}

export default defineContentScript({
  matches: ['*://learn.zybooks.com/zybook/*'],
  async main() {
    let oldHref = document.location.href

    const observer = new MutationObserver(() => {
      if (oldHref === document.location.href) return

      oldHref = document.location.href

      main()
    })

    observer.observe(document.body, { childList: true, subtree: true })

    main()
  },
})
