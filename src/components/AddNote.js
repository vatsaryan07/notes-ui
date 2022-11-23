import {useState, useEffect} from 'react'
import Notes from './NoteDrawn'
import Select from 'react-select';

function App(props) {
  const [content, setContent] = useState([])
  const [title, setTitle] = useState('')
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
  let flag = false
 
  useEffect(()=>{
    let notes = JSON.parse(localStorage.getItem('notes') || '[]')
    let note = (notes[props.now] || {})
    let arr = []
    if(typeof props.now !== 'undefined') {
        arr = [...note.content]
        setTitle(note.title)
    }
    let len = Math.floor((window.innerHeight - 50 ) / 40)
    for(let i = arr.length ;i<len;i++) {
        arr[i] =  ''
    }
    setContent(arr)
    window.onmousedown = e => {
        flag = e.pageX< 150 && e.pageY< 150
    }
    window.onmouseup = e => {
        if(flag) {
            if(e.pageX > (window.innerWidth - 100) && e.pageY> (window.innerHeight - 100)) {
                // delete all
                let arr = [...content]
                for(let i = arr.length ;i<len;i++) {
                   
                    arr[i] =  ''
                }
                setContent(arr)
            }
            flag = false
        }
        let txt = document.Selection?document.Selection.createRange().text:window.getSelection().toString()
        console.log(txt)
        
    }
    
  }, [])
  const save = () => {
    if(!title) {
        alert('please input note title')
        return
    }
    let notes = JSON.parse(localStorage.getItem('notes') || '[]')
    let date = new Date()
  
    if(typeof props.now === 'undefined') {
        console.log('add')
        notes.push({
            time: date.toLocaleDateString() + ' ' + date.toLocaleTimeString(),
            content,
            title
        })

    }else {
        console.log('edit')
        notes[props.now].title = title
        notes[props.now].time = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
        notes[props.now].content = content
        
    }
    localStorage.setItem('notes', JSON.stringify(notes))
    props.close()
  }
  const setIpt = (e, i) => {
    var arr = [...content]
    arr[i] = e.target.value
    setContent(arr)
  }
  const deleteRowContent = (i) => {
    var arr = [...content]
    arr[i] = ''
    setContent(arr)
  }
  const handleChange = (e) =>{
    setSelectedOption(e);
  }
  return (
    <div className="modal">
      <nav className="flex">
        <h1>add note</h1>
        <input value={title} onInput={(e)=>{setTitle(e.target.value)}} placeholder="please input title" />
        <button onClick={save}>save</button>
      </nav>
      <Select placeholder = 'Show Draw Board' values = {selectedOption} options={data} onChange={handleChange}/>
      {/* <Notes/> */}
      {selectedOption && selectedOption.value &&<Notes prelines={lines}/>}
      {console.log(selectedOption)}
      <form>
          {
              content.map((item, i) => {
                return <div　className="relative">
                    <input value={item} onInput={(e)=>{setIpt(e, i)}} />
                    {item &&　<button type="button" onClick={()=>{deleteRowContent(i)}}>✖</button>}
                    
                </div>
              })
          }
          
      </form>
    </div>
  );
}

export default App;
