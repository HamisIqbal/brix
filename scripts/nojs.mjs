import { chromium } from 'playwright'
const BASE='http://localhost:3210'
const routes=['/','/work','/services','/about','/contact','/work/red-brick-mailbox-column']
const problems=[]
const b = await chromium.launch()
for (const r of routes) {
  const p = await (await b.newContext({ viewport:{width:1280,height:900}, javaScriptEnabled:false })).newPage()
  const res = await p.goto(BASE+r, { waitUntil:'load' })
  if (!res || res.status()>=400) problems.push(`${r}: HTTP ${res?.status()}`)
  await p.waitForTimeout(600)
  const info = await p.evaluate(()=>{
    const h1=document.querySelector('h1')
    const hidden=[...document.querySelectorAll('[data-reveal]')].filter(e=>{
      const cs=getComputedStyle(e); const r=e.getBoundingClientRect()
      return cs.opacity==='0' || cs.visibility==='hidden' || (r.height===0 && (e.textContent||'').trim())
    }).length
    return { h1: h1?.textContent?.trim().slice(0,40) || null,
      links: document.querySelectorAll('a[href^="/"]').length,
      images: document.images.length, hidden, text: document.body.innerText.trim().length }
  })
  if (!info.h1) problems.push(`${r}: no <h1> without JS`)
  if (info.links < 5) problems.push(`${r}: only ${info.links} internal links without JS`)
  if (info.hidden > 0) problems.push(`${r}: ${info.hidden} elements hidden without JS`)
  if (info.text < 400) problems.push(`${r}: only ${info.text} chars of text without JS`)
  console.log(r.padEnd(34), `h1="${info.h1}" links=${info.links} imgs=${info.images} text=${info.text}`)
  await p.close()
}
await b.close()
if (problems.length){ console.log('\nPROBLEMS:'); problems.forEach(p=>console.log(' -',p)); process.exit(1) }
console.log('\nEvery route renders complete and navigable without JavaScript.')
