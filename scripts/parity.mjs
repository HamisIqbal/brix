import { chromium } from 'playwright'
const BASE='http://localhost:3210'
const routes=['/','/work','/services','/about','/contact']
const problems=[]
const b = await chromium.launch()

// "Final frames identical" means the settled layout matches, not that two PNGs
// are byte-equal — the video frame and film grain guarantee they never are.
async function settle(route, reducedMotion) {
  const p = await (await b.newContext({ viewport:{width:1280,height:900}, reducedMotion })).newPage()
  await p.goto(BASE+route, { waitUntil:'networkidle' })
  await p.waitForTimeout(1400)
  await p.evaluate(async()=>{ const s=innerHeight*0.8
    for(let y=0;y<document.body.scrollHeight;y+=s){scrollTo(0,y); await new Promise(r=>setTimeout(r,110))}
    scrollTo(0,0) })
  await p.waitForTimeout(1600)
  const snap = await p.evaluate(()=>{
    const out = { height: document.body.scrollHeight, hidden: 0, nodes: [] }
    for (const el of document.querySelectorAll('h1,h2,h3,p,figure,img,li,a,button')) {
      // offsetTop/offsetHeight are layout positions: unaffected by the
      // transforms that parallax legitimately leaves in place, so this compares
      // the settled document rather than the composited frame.
      const cs = getComputedStyle(el)
      if (el.offsetWidth === 0 && el.offsetHeight === 0) continue
      // The hero carousel only mounts its later slides when it can rotate,
      // which reduced motion never does. It's an absolutely placed backdrop,
      // so it has no bearing on layout either way.
      if (el.closest('[data-hero="plate"]')) continue
      if (cs.opacity === '0' || cs.visibility === 'hidden') out.hidden++
      let top = 0
      for (let n = el; n; n = n.offsetParent) top += n.offsetTop
      out.nodes.push(top + ':' + el.offsetHeight)
    }
    return out
  })
  await p.close()
  return snap
}

for (const r of routes) {
  const a = await settle(r, 'no-preference')
  const c = await settle(r, 'reduce')
  const hDelta = Math.abs(a.height - c.height)
  const sameCount = a.nodes.length === c.nodes.length
  const matched = sameCount ? a.nodes.filter((n,i)=>n===c.nodes[i]).length : 0
  const pct = sameCount ? (matched / a.nodes.length) * 100 : 0
  console.log(`${r.padEnd(11)} height ${a.height}/${c.height} (Δ${hDelta})  nodes ${a.nodes.length}/${c.nodes.length}  geometry match ${pct.toFixed(1)}%  hidden ${a.hidden}/${c.hidden}`)
  if (!sameCount) problems.push(`${r}: node count differs (${a.nodes.length} vs ${c.nodes.length})`)
  else if (pct < 99) problems.push(`${r}: only ${pct.toFixed(1)}% of elements land in the same place`)
  if (hDelta > 8) problems.push(`${r}: page height differs by ${hDelta}px`)
  if (a.hidden !== c.hidden) problems.push(`${r}: hidden-element count differs (${a.hidden} vs ${c.hidden})`)
}
await b.close()
if (problems.length){ console.log('\nPROBLEMS:'); problems.forEach(p=>console.log(' -',p)); process.exit(1) }
console.log('\nReduced motion settles to the same layout as the animated path.')
