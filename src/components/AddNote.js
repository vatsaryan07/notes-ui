import { useState, useEffect, useRef } from 'react'
import Notes from './NoteDrawn'
import Select from 'react-select';
let Sentiment = require('sentiment');
function App(props) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [lines, setLines] = useState([]);
  const data = [
    {
      value: true,
      label: "show"
    },
    {
      value: false,
      label: "hide"
    },
  ]
  const handleChange = (e) => {
    setSelectedOption(e);
  }
  const [content, setContent] = useState([])
  const [title, setTitle] = useState('')
  const [action, setAction] = useState('')
  const [first, setFirst] = useState(true)
  const [sentiments, setSentiments] = useState([])
  let flag = false
  let colors = [
    'rgba(60, 179, 113, 0.4)',
    'rgba(120, 120, 120, 0.4)',
    'rgba(106, 90, 205, 0.4)',
    'rgba(255, 165, 0, 0.4)',
    'rgba(255, 0, 0, 0.4)',
    'rgba(0, 0, 255, 0.4)',
    'rgba(0, 255, 0, 0.4)',
    'rgba(255, 255, 0, 0.4)',
    'rgba(0, 255, 255, 0.4)',
    'rgba(255, 0, 255, 0.4)',
  ]
  let c = null
  let startX, startY, endX, endY = null;
  let ref = useRef()
  useEffect(() => {
    if (first) {
      setFirst(false)
      let notes = JSON.parse(localStorage.getItem('notes') || '[]')
      let note = (notes[props.now] || {})
      let arr = []
      if (typeof props.now !== 'undefined') {
        arr = [...note.content]
        setTitle(note.title)
      }
      let len = Math.floor((window.innerHeight - 50) / 40)
      for (let i = arr.length; i < len; i++) {
        arr[i] = ''
      }
      setContent(arr)
      setSentiments(note.sentiments || [])
    }
    ref.sentiments = sentiments


  }, [sentiments])
  // Click the cancel button
  const cancel = () => {
    props.close()
  }
  // Click the save button
  const save = () => {
    if (!title) {
      alert('please input note title')
      return
    }
    let notes = JSON.parse(localStorage.getItem('notes') || '[]')
    let date = new Date()

    if (typeof props.now === 'undefined') {
      notes.push({
        time: date.toLocaleDateString() + ' ' + date.toLocaleTimeString(),
        content,
        title,
        sentiments
      })

    } else {
      notes[props.now].title = title
      notes[props.now].time = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
      notes[props.now].content = content
      notes[props.now].sentiments = sentiments

    }
    localStorage.setItem('notes', JSON.stringify(notes))
    props.close()
  }
  // Set the content of a line according to the index
  const setIpt = (e, i) => {
    console.log(e.target.innerText, 8888)
    var arr = [...content]
    arr[i] = e.target.innerText
    setContent(arr)
  }
  // Remove an emotion analysis
  const removeSentiment = (i) => {
    let arr = [...(ref.sentiments || [])]
    arr.splice(i, 1)
    setSentiments(arr)
  }
  // Delete a line according to the index
  const deleteRowContent = (i) => {
    var arr = [...content]
    arr[i] = ''
    setContent(arr)
    sentiments.forEach((item, idx) => {
      if (item.rows.indexOf(i) != -1) {
        removeSentiment(idx)
      }
    });

  }
  // Click the tect button
  const rectAction = () => {
    setAction(action === 'rect' ? '' : 'rect')
  }
  // Click the Delete button
  const deleteAction = () => {
    setAction(action === 'delete' ? '' : 'delete')
  }
  // Move the mouse when deleting
  const deleteMouseMove = e => {
    let ctx = c.getContext("2d");
    ctx.strokeStyle = "red";
    let rect = c.getBoundingClientRect()
    ctx.lineTo(e.offsetX * (c.width / rect.width), e.offsetY * (c.height / rect.height));
    ctx.stroke();
  }
  // Move the mouse when selecting a rectangle
  const rectMouseMove = e => {
    endX = e.offsetX
    endY = e.offsetY
    let arr = [...(ref.sentiments || [])]
    let ele = arr[arr.length - 1]
    ele.left = startX < endX ? startX : endX
    ele.top = startY < endY ? startY : endY
    ele.w = Math.abs(endX - startX)
    ele.h = Math.abs(endY - startY)
    if (ele.w < 6 || ele.h < 6) {
      return
    }
    ele.style = {
      width: `${ele.w}px`,
      height: `${ele.h}px`,
      top: `${ele.top}px`,
      left: `${ele.left}px`,
      background: `${colors[(arr.length - 1) % 10]}`,
      border: '1px solid rgb(26,26,176)',
      zIndex: 1
    }
    setSentiments(arr)
    // localStorage.setItem('sentiments', JSON.stringify(arr))

  }
  // Release the mouse when the rectangle is selected
  const rectMouseUp = e => {
    window.removeEventListener('mousemove', rectMouseMove, false)
    window.removeEventListener('mouseup', rectMouseUp, false)

    let arr = [...(JSON.parse(JSON.stringify(ref.sentiments)) || [])]
    let ele = arr[arr.length - 1] || { style: {} }
    ele.style.zIndex = 10001

    if (!ele.w || !ele.h || ele.w < 6 || ele.h < 6) {
      arr.splice(arr.length - 1, 1)
    } else {
      let rowStart = startY / 40
      let rowEnd = endY / 40
      let colStart = startX / 9.6
      let colEnd = endX / 9.6
      if (rowStart > rowEnd) {
        let a = rowStart
        rowStart = rowEnd
        rowEnd = a
      }
      rowStart = rowStart - Math.floor(rowStart) < 0.45 ? Math.floor(rowStart) : Math.ceil(rowStart)
      rowEnd = rowEnd - Math.floor(rowEnd) > 0.6 ? Math.floor(rowEnd) : (Math.floor(rowEnd) - 1)

      if (colStart > colEnd) {
        let a = colStart
        colStart = colEnd
        colEnd = a
      }
      colStart = colStart - Math.floor(colStart) < 0.3 ? Math.floor(colStart) : Math.ceil(colStart)
      colEnd = colEnd - Math.floor(colEnd) > 0.6 ? Math.ceil(colEnd) : Math.floor(colEnd)

      let str = ''
      ele.rows = []
      for (let i = rowStart; i <= rowEnd && i < content.length; i++) {
        str += (content[i] || '').substring(colStart, colEnd) + ' '
        ele.rows.push(i)
      }
      ele.text = str.trim()
      console.log('select text:', ele.text)
      if (ele.text) {
        var sentiment = new Sentiment();
        var result = sentiment.analyze(str);
        // console.dir(result);    // Score: -2, Comparative: 
        ele.span = {}
        ele.span.html = `
                              score: ${result.score} <br />
                              comparative: ${result.comparative}<br/>
                              negative: ${result.negative.join('|')}<br/>
                              positive: ${result.positive.join('|')}`
        ele.span.style = {

          top: `${ele.top}px`,
          left: `${ele.left + ele.w}px`,
          background: 'white',
          color: `${colors[(arr.length - 1) % 10].replace(', 0.4', '')}`,
          border: '1px solid rgb(26,26,176)',
        }

      } else {
        arr.splice(arr.length - 1, 1)
      }
      startX = undefined; endY = undefined; startY = undefined; endX = undefined
    }
    // localStorage.setItem('sentiments', JSON.stringify(arr))
    setSentiments(arr)

  }
  // Press the mouse when selecting a rectangle
  const rectMouseDown = e => {
    startX = e.nativeEvent.offsetX
    startY = e.nativeEvent.offsetY
    // rectC =  e.target
    window.addEventListener('mouseup', rectMouseUp, false)
    window.addEventListener('mousemove', rectMouseMove, false)
    let sts = [...sentiments]
    sts.push({

    })
    setSentiments(sts)
  }
  let x1, y1, x2, y2, x3, y3, x4, y4;
  // When deleting, press the mouse
  const deleteMouseDown = e => {
    if (typeof x1 === 'undefined') {
      x1 = e.nativeEvent.offsetX
    } else {
      x3 = e.nativeEvent.offsetX
    }
    if (typeof y1 === 'undefined') {
      y1 = e.nativeEvent.offsetY
    } else {
      y3 = e.nativeEvent.offsetY
    }
    flag = e.nativeEvent.offsetX < 200 && e.nativeEvent.offsetY < 200
    c = e.target
    let ctx = c.getContext("2d");
    ctx.beginPath()
    let rect = c.getBoundingClientRect()
    ctx.lineTo(e.nativeEvent.offsetX * (c.width / rect.width), e.nativeEvent.offsetY * (c.height / rect.height));
    ctx.stroke();
    window.addEventListener('mousemove', deleteMouseMove, false);
    window.addEventListener('mouseup', deleteMouseUp, false)
  }
  // Determine which line to delete according to four coordinate points
  const judgeDel = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    if (!(Math.min(x1, x2) <= Math.max(x3, x4) && Math.min(y3, y4) <= Math.max(y1, y2) && Math.min(x3, x4) <= Math.max(x1, x2) && Math.min(y1, y2) <= Math.max(y3, y4)))
      return false;
    let u, v, w, z
    u = (x3 - x1) * (y2 - y1) - (x2 - x1) * (y3 - y1);
    v = (x4 - x1) * (y2 - y1) - (x2 - x1) * (y4 - y1);
    w = (x1 - x3) * (y4 - y3) - (x4 - x3) * (y1 - y3);
    z = (x2 - x3) * (y4 - y3) - (x4 - x3) * (y2 - y3);
    if ((u * v <= 0.00000001 && w * z <= 0.00000001)) {
      let denominator = (y2 - y1) * (x4 - x3) - (x1 - x2) * (y3 - y4);
      return -((y2 - y1) * (y4 - y3) * (x3 - x1)
        + (x2 - x1) * (y4 - y3) * y1
        - (x4 - x3) * (y2 - y1) * y3) / denominator;
    } else {
      return false
    }

  }
  // Release the mouse when deleting
  const deleteMouseUp = e => {
    if (typeof x2 === 'undefined') {
      x2 = e.offsetX
    } else {
      x4 = e.offsetX
    }
    if (typeof y2 === 'undefined') {
      y2 = e.offsetY
    } else {
      y4 = e.offsetY
    }
    let ctx = c.getContext("2d");
    ctx.closePath()
    window.removeEventListener('mousemove', deleteMouseMove, false)
    window.removeEventListener('mouseup', deleteMouseMove, false)
    if (flag) {
      if (e.offsetX > (window.innerWidth - 200) && e.offsetY > (window.innerHeight - 200)) {
        // delete all
        let arr = [...content]
        for (let i = 0; i < arr.length; i++) {
          arr[i] = ''
        }
        setContent(arr)
        setSentiments([])
      }
      flag = false
      setTimeout(() => {
        ctx.clearRect(0, 0, 10000, 10000);
      }, 200)
    } else {
      if (typeof x1 !== 'undefined' &&
        typeof y1 !== 'undefined' &&
        typeof x2 !== 'undefined' &&
        typeof y2 !== 'undefined' &&
        typeof x3 !== 'undefined' &&
        typeof y3 !== 'undefined' &&
        typeof x4 !== 'undefined' &&
        typeof y4 !== 'undefined') {
        let y = judgeDel(x1, y1, x2, y2, x3, y3, x4, y4)
        if (y) {
          let index = Math.floor(y / 40)
          // delete index row
          deleteRowContent(index)
        }
        x1 = undefined
        x2 = undefined
        x3 = undefined
        x4 = undefined
        y1 = undefined
        y2 = undefined
        y3 = undefined
        y4 = undefined
        setTimeout(() => {
          ctx.clearRect(0, 0, 10000, 10000);
        }, 200)
      }
    }

  }
  return (
    <div className="modal">
      {
        (sentiments || []).map((item, i) => {
          return <div onDoubleClick={() => { removeSentiment(i) }}>
            <div className="rect-text" style={item.style}></div>
            {item.span && <span className="rect-span" style={item.span.style} dangerouslySetInnerHTML={{ __html: item.span.html }} ></span>}

          </div>
        })
      }
      {action === 'delete' && <canvas height="400" width="800px" onMouseDown={deleteMouseDown} className="delete-canvas" />}
      {action === 'rect' && <div className="rect-canvas" onMouseDown={rectMouseDown}  ></div>}

      <nav className="flex">
        <h1>{typeof props.now === 'undefined'?'add' : 'edit'} note</h1>
        <input value={title} onInput={(e) => { setTitle(e.target.value) }} placeholder="please input title" />
        <button className={"rect-action " + (action === 'rect' ? 'active' : '')} onClick={rectAction}>rect</button>
        <button className={"delete-action " + (action === 'delete' ? 'active' : '')} onClick={deleteAction}>delete</button>
        <button onClick={cancel}>cancel</button>
        <button onClick={save}>save</button>
      </nav>
      <Select placeholder='Show Draw Board' values={selectedOption} options={data} onChange={handleChange} />
      {/* <Notes/> */}
      {selectedOption && selectedOption.value && <Notes title={title} />}
      {console.log(selectedOption)}
      <form>
        {
          content.map((item, i) => {
            return <div className="relative">
              <div key={i} suppressContentEditableWarning contentEditable="true" className="item" onBlur={(e) => { setIpt(e, i) }} >{item}</div>
              {/* {item &&　<button type="button" onClick={()=>{deleteRowContent(i)}}>✖</button>} */}

            </div>
          })
        }

      </form>

    </div>
  );
}

export default App;
