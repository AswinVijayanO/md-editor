import React, { useEffect, useState } from 'react'
import './App.css'
import { parseMD } from './utils/md-utils'
import { content } from './content'
function App() {
  const [text, setText] = useState(content)

  useEffect(() => {

  }, [])
  const print=()=>{

  }
  return (
    <>
      <div className='container'>
        <div className='left'>
          {/* {text} */}
          <textarea className='input-area' type='text' value={text} onChange={(e) => {
            setText(e.target.value)
          }}></textarea>
        </div>
        <div className={'right markdown'} style={{ textAlign: 'left' }}>
          <div className='preview-top-bar'>
          <button onClick={print}>Print 🖨️</button>
          </div>
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
