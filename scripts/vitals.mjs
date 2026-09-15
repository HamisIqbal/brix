import { chromium } from 'playwright'
const BASE='http://localhost:3210'
const routes=['/','/work','/services','/about','/contact']
const b = await chromium.launch()
const problems=[]
for (const r of routes) {
  const p = await (await b.newContext({ viewport:{width:1280,height:900} })).newPage()
  await p.addInitScript(()=>{
    window.__cls = 0; window.__lcp = 0
    new PerformanceObserver(l=>{ for(const e of l.getEntries()) if(!e.hadRecentInput) window.__cls += e.value })
      .observe({type:'layout-shift', buffered:true})
    new PerformanceObserver(l=>{ const es=l.getEntries(); window.__lcp = es[es.length-1]?.startTime || 0 })
      .observe({type:'largest-contentful-paint', buffered:true})
  })
  await p.goto(BASE+r, { waitUntil:'networkidle' })
  await p.waitForTimeout(2500)
  // Browsers finalise LCP at the first scroll or tap, but a scripted scrollTo
  // isn't input — so read it now, or the footer revealed below becomes "LCP".
  const lcp = await p.evaluate(() => Math.round(window.__lcp))
  // Scroll to trigger every reveal, then measure shift caused by animation.
  await p.evaluate(async()=>{ const s=innerHeight*0.8
    for(let y=0;y<document.body.scrollHeight;y+=s){scrollTo(0,y); await new Promise(r=>setTimeout(r,120))} })
  await p.waitForTimeout(1200)
  const v = await p.evaluate(()=>({ cls:+window.__cls.toFixed(4) }))
  v.lcp = lcp
  console.log(`${r.padEnd(11)} CLS ${String(v.cls).padEnd(8)} LCP ${v.lcp}ms`)
  if (v.cls > 0.02) problems.push(`${r}: CLS ${v.cls}`)
  if (v.lcp > 2500) problems.push(`${r}: LCP ${v.lcp}ms`)
  await p.close()
}
await b.close()
if (problems.length){ console.log('\nPROBLEMS:'); problems.forEach(x=>console.log(' -',x)); process.exit(1) }
console.log('\nCLS and LCP within budget on every route.')
