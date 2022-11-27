import {useState, useEffect} from 'react'
import './App.css';
import AddNote from './components/AddNote'

import Notes from './components/NoteDrawn'
function App() {
  const [notes, setNotes] = useState([])
  const [show, setShow] = useState(false)
  const [now, setNow] = useState()
  const [draw, setDraw] = useState(false)
  const [lines, setLines] = useState([])
  
  const [linestore, setLinesStore] = useState([])
  useEffect(()=>{
    setLines(JSON.parse(localStorage.getItem('lines') || '[]' ))
  }, [])

  useEffect(()=>{
    setLinesStore([])
  }, [])
  useEffect(()=>{
    setNotes(JSON.parse(localStorage.getItem('notes') || '[]' ))
  }, [])
  const close = () => {
    setShow(false)
    setNow(undefined)
    setNotes(JSON.parse(localStorage.getItem('notes') || '[]' ))
  }
  const deleteNote = (i) => {
    let arr = [...notes]
    arr.splice(i, 1)
    setNotes(arr)
    localStorage.setItem('notes', JSON.stringify(arr))
  }
  const editNote = (i) => {
    setNow(i)
    setShow(true)
  }
  const openDrawBoard = (i) => {
    setDraw(true)
  }
  return (
    <div className="App">
      {
        !show && <div>
          <nav className="flex">
            <h1>notes</h1>
            <button onClick={()=>{setShow(true)}}>add</button>
          </nav>
          <ul className="flex card-box">
            {
              notes.map((note, i)=>{
                console.log(note)
                console.log(i)
                return <li key={i} className="card">
                  <h2 className="flex">
                    {note.title}
                    <span>
                      <button onClick={()=>{deleteNote(i)}}>✖</button>
                      <button onClick={()=>{editNote(i)}}>✍</button>
                    </span>
                  </h2>
                  <p><span>{note.time}</span></p>
                </li>
              })
            }
          </ul>
      
        </div>
      }
      {show && <AddNote close={close} now={now} />}
    </div>
  );
}

export default App;
