import React, { useEffect, useState } from 'react'
import './App.css'
import { parseMD } from './utils/md-utils'

const content = `
\# A demo of \`react-markdown\`

\`react-markdown\` is a markdown component for React.

👉 Changes are re-rendered as you type.

👈 Try writing some markdown on the left.

## Overview

* Follows [CommonMark](https://commonmark.org)
* Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)
* Renders actual React elements instead of using \`dangerouslySetInnerHTML\`
* Lets you define your own components (to render \`MyHeading\` instead of \`'h1'\`)
* Has a lot of plugins
- HELLO
## Contents

Here is an example of a plugin in action [CommonMark](https://commonmark.org)
hello
`

function App() {
  const [text, setText] = useState(content)
  
  useEffect(()=>{
    
  },[])

  return (
    <>
    <div className='container'>
    <div className='left'>
      {/* {text} */}
      <textarea className='input-area' type='text' value={text} onChange={(e)=>{
        setText(e.target.value)
      }}></textarea>
    </div>
    <div className={'right markdown'} style={{textAlign: 'left'}}>
    {
    parseMD(text)
    }
    </div>
    </div>
    </>
  )
}

export default App
