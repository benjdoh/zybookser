import { sleep, waitForSelector, waitForSelectorAll } from './utils'

export async function startAnimationPlayer() {
  console.log('Starting animation player:', new Date())

  const animations = await waitForSelectorAll('.animation-controls')

  const isAnswering: Promise<void>[] = []

  for (const animation of animations) {
    isAnswering.push(play(animation))
  }

  await Promise.all(isAnswering)

  console.log('Done animation player:', new Date())

  async function play(animation: HTMLElement) {
    const playButton = await waitForSelector('button.start-graphic', { element: animation })
    if (!playButton) return
    playButton.click()

    const buttons = await waitForSelectorAll('button.step', { element: animation })

    for (const button of buttons) {
      while (button.className.includes('disabled')) {
        await sleep(100)
      }

      button.click()
    }
  }
}

export async function startMultipleChoices() {
  console.log('Starting multiple choices:', new Date())

  const questions = await waitForSelectorAll('.multiple-choice-question')

  const isAnswering: Promise<void>[] = []

  for (const question of questions) {
    isAnswering.push(answer(question))
  }

  await Promise.all(isAnswering)

  console.log('Done multiple choices:', new Date())

  async function answer(question: HTMLElement) {
    const chevron = await waitForSelector('.chevron-container > div', { element: question })

    if (!chevron) return
    if (chevron.getAttribute('aria-label') === 'Question completed') return

    const choices = await waitForSelectorAll('input', { element: question })

    for (const choice of choices) {
      choice.click()

      await sleep(1000)

      const chevron = await waitForSelector('.chevron-container > div', { element: question })

      if (!chevron) continue
      if (chevron.getAttribute('aria-label') === 'Question completed') return
    }
  }
}

export async function startShortQuestions() {
  console.log('Starting short questions:', new Date())

  const questions = await waitForSelectorAll('.short-answer-question')

  const isAnswering: Promise<void>[] = []

  for (const question of questions) {
    isAnswering.push(answer(question))
  }

  await Promise.all(isAnswering)

  console.log('Done short questions:', new Date())

  async function answer(question: HTMLElement) {
    const chevron = await waitForSelector('.question-chevron', { element: question })
    if (!chevron || chevron.getAttribute('aria-label') === 'Question completed') return

    const showAnswer = await waitForSelector('.show-answer-button', { element: question })
    if (!showAnswer) return

    showAnswer.click()
    await sleep(1000)
    showAnswer.click()

    const textarea = await waitForSelector<HTMLTextAreaElement>('textarea', { element: question })
    const forfeitedAnswer = await waitForSelector('.forfeit-answer', { element: question })
    const checkButton = await waitForSelector('.check-button', { element: question })

    if (!textarea || !forfeitedAnswer || !checkButton) return

    textarea.value = forfeitedAnswer.textContent || ''

    await sleep(1000)

    checkButton.click()

    await sleep(1000)
  }
}

export async function startActivities() {
  await Promise.all([startAnimationPlayer(), startMultipleChoices(), startShortQuestions()])
}
