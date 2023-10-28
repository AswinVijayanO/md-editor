import React, { useEffect, useState } from 'react'
import './App.css'
import { parseMD } from './utils/md-utils'
import { content } from './content'
function App() {
  const [text, setText] = useState(content)
  const [collapse, setCollapse] = useState(false)
  const [printPreview, setPrintPreview] = useState(false)

  useEffect(() => {
    if (printPreview) {
      setTimeout(() => { window.print() }, 1000)
      setTimeout(() => { setPrintPreview(false) }, 2000)
    }
  }, [printPreview])

  const print = () => {
    setPrintPreview(true)
  }
  return (
    <>
      <div className='container'>
        {!collapse && !printPreview && <div className='view left'>
          <textarea className='input-area' type='text' value={text} onChange={(e) => {
            setText(e.target.value)
          }}></textarea>
        </div>}
        <div className={`right markdown ${collapse||printPreview ? "coll" : "exp"}`} style={{ textAlign: 'left' }}>
          {!printPreview && <div className='view preview-top-bar'>
            <button onClick={() => setCollapse(t => !t)}>{collapse ? "✍️" : "👁️"}</button>
            <button onClick={print}>Print 🖨️</button>
          </div>}
          <div className='content-class' id="content">
            {
              parseMD(text)
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default App
