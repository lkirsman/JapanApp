import { useEffect, useState } from 'react'

// Curated static reference for the trip. Phrases are romaji (Latin script) +
// English meaning — a travel phrasebook, no Japanese characters in the UI.

const EMERGENCY = [
  { label: 'Police', value: '110' },
  { label: 'Fire / Ambulance', value: '119' },
  { label: 'Japan Visitor Hotline (24h, EN)', value: '050-3816-2787' },
]

const SECTIONS: { title: string; icon: string; items: string[] }[] = [
  {
    title: 'Money',
    icon: '💴',
    items: [
      'Currency is the yen (¥). Cash is still king at small shops and restaurants.',
      'Use IC cards (Suica / Pasmo in your phone wallet) for trains, buses and convenience stores.',
      '7-Eleven and Japan Post ATMs reliably accept foreign cards for cash withdrawals.',
      'No tipping — it can even cause confusion. Pay into the little tray at registers.',
    ],
  },
  {
    title: 'Getting around',
    icon: '🚆',
    items: [
      'Google Maps is excellent for trains — it gives platforms, lines and exact fares.',
      'Tap in and out with your IC card; it just works across most networks.',
      'Trains stop around midnight — check the last train if you are out late.',
      'Stand left on escalators in Tokyo, right in Osaka.',
    ],
  },
  {
    title: 'Connectivity',
    icon: '📶',
    items: [
      'Keep the eSIM / pocket Wi-Fi topped up; coverage is great except deep in the mountains.',
      'Free Wi-Fi at most stations, convenience stores and cafés.',
      'Download offline Google Maps for each city before you go.',
    ],
  },
  {
    title: 'Etiquette',
    icon: '🙏',
    items: [
      'Keep phone calls off and voices low on trains.',
      'Take shoes off where you see a step up or slippers waiting (ryokan, some restaurants).',
      'Do not eat while walking; finish snacks by the shop.',
      'Carry a small bag for trash — public bins are rare.',
    ],
  },
]

const PHRASES: { romaji: string; meaning: string }[] = [
  { romaji: 'Konnichiwa', meaning: 'Hello' },
  { romaji: 'Arigatou gozaimasu', meaning: 'Thank you' },
  { romaji: 'Sumimasen', meaning: 'Excuse me / sorry' },
  { romaji: 'Onegaishimasu', meaning: 'Please' },
  { romaji: 'Ikura desu ka?', meaning: 'How much is it?' },
  { romaji: 'Eigo ga hanasemasu ka?', meaning: 'Do you speak English?' },
  { romaji: 'Oishii!', meaning: 'Delicious!' },
  { romaji: 'Kanpai!', meaning: 'Cheers!' },
]

const PACKING = [
  'Passports + travel insurance',
  'IC card set up in phone wallet',
  'Power adapter (Type A, 100V) + portable charger',
  'Comfortable walking shoes',
  'Some cash (yen) for day one',
  'Any medications + copies of prescriptions',
  'Coin purse (you will collect coins)',
  'Small foldable bag for shopping / trash',
  'Compact umbrella',
]

const PACK_KEY = 'trip_packing_v1'

export default function TripEssentials() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      setChecked(JSON.parse(localStorage.getItem(PACK_KEY) ?? '{}'))
    } catch {
      setChecked({})
    }
  }, [])

  const toggle = (item: string) => {
    setChecked((prev) => {
      const next = { ...prev, [item]: !prev[item] }
      localStorage.setItem(PACK_KEY, JSON.stringify(next))
      return next
    })
  }

  const packedCount = PACKING.filter((i) => checked[i]).length

  return (
    <div className="space-y-8">
      <div>
        <p className="section-title text-brand">Essentials</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold">Good to know</h1>
      </div>

      <section>
        <h2 className="mb-2 font-display text-lg font-extrabold">🆘 Emergency</h2>
        <ul className="space-y-2">
          {EMERGENCY.map((e) => (
            <li key={e.value}>
              <a
                href={`tel:${e.value.replace(/[^0-9+]/g, '')}`}
                className="flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3"
              >
                <span className="text-sm font-semibold">{e.label}</span>
                <span className="font-display text-lg font-bold text-brand">{e.value}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {SECTIONS.map((s) => (
        <section key={s.title}>
          <h2 className="mb-2 font-display text-lg font-extrabold">
            {s.icon} {s.title}
          </h2>
          <ul className="space-y-2">
            {s.items.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section>
        <h2 className="mb-2 font-display text-lg font-extrabold">🗣️ Handy phrases</h2>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
          {PHRASES.map((p) => (
            <li key={p.romaji} className="flex items-center justify-between px-4 py-2.5">
              <span className="font-semibold">{p.romaji}</span>
              <span className="text-sm text-muted">{p.meaning}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-extrabold">🎒 Packing checklist</h2>
          <span className="text-xs text-muted">
            {packedCount}/{PACKING.length}
          </span>
        </div>
        <ul className="space-y-2">
          {PACKING.map((item) => (
            <li key={item}>
              <button
                type="button"
                onClick={() => toggle(item)}
                className="flex w-full items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-left active:scale-[0.99]"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs text-white ${
                    checked[item] ? 'border-brand bg-brand' : 'border-line'
                  }`}
                  aria-hidden
                >
                  {checked[item] ? '✓' : ''}
                </span>
                <span className={`text-sm ${checked[item] ? 'text-muted line-through' : ''}`}>{item}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
