// src/utils/analyzeSentiment.js
import Sentiment from 'sentiment'
const sentiment = new Sentiment()

export default function analyzeSentiment(text) {
  const corrections = {
    dont: "don't",
    cant: "can't",
    wont: "won't",
    wouldnt: "wouldn't",
    couldnt: "couldn't",
    shouldnt: "shouldn't",
    isnt: "isn't",
    arent: "aren't",
    wasnt: "wasn't",
    werent: "weren't",
    im: "I'm",
    ive: "I've",
    id: "I'd",
    ill: "I'll",
  }

  const correctedText = text
    .split(/\b/)
    .map((w) => corrections[w.toLowerCase()] || w)
    .join('')
  let adjustedText = correctedText.toLowerCase()

  const phrasePatches = [
    { pattern: /\bdon['’]?t feel so good\b/, replacement: 'feel a bit down' },
    { pattern: /\bdon['’]?t feel good\b/, replacement: 'feel unwell' },
    { pattern: /\bdon['’]?t feel great\b/, replacement: 'feel down' },
    { pattern: /\bi['’]?m not doing well\b/, replacement: 'i feel low' },
    { pattern: /\bi['’]?m not okay\b/, replacement: 'i feel off' },
    { pattern: /\bi['’]?m not fine\b/, replacement: 'i feel bad' },
    { pattern: /\bi['’]?m not great\b/, replacement: 'i feel down' },
    { pattern: /\bnothing feels right\b/, replacement: 'everything feels off' },
    { pattern: /\bi['’]?m struggling\b/, replacement: 'i feel overwhelmed' },
    {
      pattern: /\bi['’]?m tired of everything\b/,
      replacement: 'i feel hopeless',
    },
    { pattern: /\bi['’]?m drained\b/, replacement: 'i feel empty' },
    {
      pattern: /\bi wish i felt (better|okay|good)\b/,
      replacement: 'i feel low',
    },
    {
      pattern: /\bi guess i['’]?m (fine|okay)\b/,
      replacement: 'i feel unsure',
    },
    {
      pattern: /\blately,? nothing helps\b/,
      replacement: 'everything feels pointless',
    },
    {
      pattern: /\beven (sleep|food) (doesn['’]?t|does not) work\b/,
      replacement: 'i feel numb',
    },
    {
      pattern: /\bi feel (fine|okay),? i guess\b/,
      replacement: 'i feel unsure',
    },
  ]

  phrasePatches.forEach(({ pattern, replacement }) => {
    adjustedText = adjustedText.replace(pattern, replacement)
  })

  const result = sentiment.analyze(adjustedText)

  // extended negation handling for broader expression coverage
  const negationPatterns = [
    /\b(not|never|no|don['’]?t|doesn['’]?t|didn['’]?t|can't|couldn['’]?t|won['’]?t|wouldn['’]?t|shouldn['’]?t|isn['’]?t|aren['’]?t|wasn['’]?t|weren['’]?t|ain['’]?t)\b.*\b(feel|doing|look|seem|sound|get|be|being|seems)\b.*\b(good|great|happy|okay|fine|better|well)\b/i,
    /\b(?:not|don['’]?t|never)\s+(?:feel|like|want|enjoy|prefer|love|trust|believe|care|think|sleep)\b/i,
    /\b(?:nothing|no one|nobody|nowhere|none|never)\b.*\b(right|helps|matters|works)\b/i,
    /\b(?:tired|drained|exhausted|numb|empty|lost|broken|hopeless|useless|pointless)\b/i,
    /\b(?:can't|cannot)\b.*\b(cope|breathe|handle|deal)\b/i,
    /\b(?:struggling|suffering|hurting|crying|panicking)\b/i,
  ]

  if (
    result.score > 0 &&
    negationPatterns.some((pattern) => pattern.test(correctedText))
  ) {
    result.score *= -1
  }

  const score = result.score

  const keywords = [...new Set(result.words)]
    .filter(
      (word) =>
        word.length > 3 &&
        !['really', 'very', 'just', 'that', 'with', 'this', 'have'].includes(
          word.toLowerCase(),
        ),
    )
    .sort((a, b) => b.length - a.length)
    .slice(0, 3)

  const mood = score > 2 ? 'positive' : score < -2 ? 'negative' : 'neutral'

  return {
    mood,
    keywords,
  }
}
