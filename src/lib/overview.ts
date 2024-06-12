import { waitForSelectorAll, waitForSelector } from '../lib/utils'

export async function checkActivities(activities: NodeListOf<HTMLElement>) {
  console.log('activities', activities)

  for (const activity of activities) {
    const modulePart = await waitForSelector<HTMLDivElement>('.participation.percentage', {
      element: activity,
    })

    console.log('modulePart', modulePart)
    if (!modulePart) continue

    const modulePartSore = parseFloat(modulePart.innerText)

    if (Number.isNaN(modulePartSore)) continue
    if (modulePartSore >= 100) continue

    const link = activity.querySelector('a')

    if (!link) continue

    location.href = link.href

    return true
  }

  return false
}

export async function checkSections<T extends NodeListOf<HTMLElement> = NodeListOf<HTMLDivElement>>(sections: T) {
  for (const section of sections) {
    const sectionPart = await waitForSelector<HTMLDivElement>('.participation.score', {
      element: section,
    })

    if (!sectionPart) continue

    const sectionPartSore = parseFloat(sectionPart.innerText)

    if (Number.isNaN(sectionPartSore)) continue
    if (sectionPartSore >= 100) continue

    section.querySelector('button')?.click()

    const activities = await waitForSelectorAll<HTMLLIElement>('li', {
      element: section,
    })

    if (await checkActivities(activities)) return true
  }

  return false
}

export async function checkChapters() {
  const chapters = await waitForSelectorAll('.table-of-contents-list > li')

  for (const chapter of chapters) {
    const chapterPart = await waitForSelector<HTMLDivElement>('.participation.score', {
      element: chapter,
    })

    if (!chapterPart) continue

    const chaptPartscore = parseFloat(chapterPart.innerText)

    if (Number.isNaN(chaptPartscore)) continue
    if (chaptPartscore >= 100) continue

    chapter.querySelector('button')?.click()

    const sections = await waitForSelectorAll('.section-list > li', {
      element: chapter,
    })

    if (await checkSections(sections)) return
  }
}
