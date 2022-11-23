import { React } from 'react';
import { Stage, Layer, Line,Rect } from 'react-konva';
import { useEffect, useState, useRef } from 'react';
import { clear } from '@testing-library/user-event/dist/clear';


var gest_record = []
var gest_list = []
var p = []
for(var i=50;i<window.innerHeight;i++){
    // console.log(i)
    if(i%100 == 50){
        // console.log(i)
        p.push(i);
    }
}
// console.log(p)
const Notes = (props) => {
    // console.log(props.title)
    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);
    useEffect(()=>{
    //     // console.log(localStorage.getItem('linestore'))
    if(localStorage.getItem('linestore')){
        var store = JSON.parse(localStorage.getItem('linestore'))
        var k = store.filter((val)=> val.title === props.title)
        // console.log(k[0].lines)
        setLines([...k[0].lines])
        // console.log(store[0].title)
        // store.map((note,i)=>{
        //     if(note.title === props.title){
        //         setLines([...note.lines])
        //     }
        // })
    }
    },[])
    // console.log()
    // useEffect(()=>{
    //     console.log(localStorage.getItem('lines'))
    //     if(localStorage.getItem('lines')){
    //         console.log("empty condition")
    //         setLines([...JSON.parse(localStorage.getItem('lines'))])
    //     }
    //   }, [])
    useEffect(() => {
        //loadImage();
    }, [props.clearLines])
    
    const handleMouseDown = (e) => {
        gest_record = []
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        gest_record.push([pos.x,pos.y])
        // console.log(pos.x)
        setLines([...lines, { points: [pos.x, pos.y] }]);
    };
    
    const handleMouseMove = (e) => {
        // no drawing - skipping
        if (!isDrawing.current) {
          return;
        }
        
        // console.log("yeet?")
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        // console.log(point.x,point.y)
        gest_record.push([point.x,point.y])
        // console.log(gest_record)
        // To draw line
        let lastLine = lines[lines.length - 1];
        
        if(lastLine) {
            // add point
            lastLine.points = lastLine.points.concat([point.x, point.y]);
                
            // replace last
            lines.splice(lines.length - 1, 1, lastLine);
            
            setLines(lines.concat());
        }
        
    };
    
    const handleMouseUp = (e) => {
        isDrawing.current = false;
        // gest_record.push(e.getStage.getPointerPosition().x,e.getStage.getPointerPosition().y)
        console.log("starting x and y")
        console.log(gest_record[0][0])
        console.log(gest_record[0][1])
        

        console.log("ending x and y")
        console.log(gest_record[gest_record.length - 1][0])
        console.log(gest_record[gest_record.length - 1][1])
        console.log(lines)
        var flag = false

        if(
            gest_record[0][0] >= 2175 && 
            gest_record[0][0] <= 2225 &&
            gest_record[0][1]%100 >= 35 &&
            gest_record[0][1]%100 <= 65)
            {
                console.log("line removal condition")
                var num = gest_record[0][1]
                var points = [0,num- num%100+75,window.innerWidth - 285,num- num%100+75]
                console.log(points)
                lines.splice(lines.length-1, 1, {points:points, tool:'eraser',width:100});
                console.log(lines)
                setLines([...lines, {points:points, tool:'eraser',width:100}])

                let prevstore = JSON.parse(localStorage.getItem('linestore'))
                let exist_flag = false
                prevstore.map((note,i)=>{
                    if(note.title === props.title && exist_flag === false){
                        note.lines = lines
                        exist_flag = true
                    }
                    else if(note.title === props.title && exist_flag === true){
                        console.log(i)
                        prevstore = prevstore.filter((val,ind)=>{return ind !== i})
                    }
                })
                if(exist_flag === false){
                    prevstore.push({lines:lines,title : props.title})
                }
                localStorage.setItem('linestore',JSON.stringify(prevstore))
            }
        if((gest_record[0][0]<100 && gest_record[0][1]<100) && (gest_record[gest_record.length - 1][0]>1530 && gest_record[gest_record.length - 1][1]>915) ||
        (gest_record[gest_record.length - 1][0]<30 && gest_record[gest_record.length - 1][1]<30) && (gest_record[0][0]>915 && gest_record[0][1]>915)){
            flag = true
            console.log("Calling clear")
            var stage = e.target.getStage()
            stage.clear()
            setLines([])
            localStorage.setItem('lines',[])
            setLines([])
            console.log(lines)
            let prevstore = JSON.parse(localStorage.getItem('linestore'))
            let exist_flag = false
            prevstore.map((note,i)=>{
                if(note.title === props.title && exist_flag === false){
                    note.lines = []
                    exist_flag = true
                }
                else if(note.title === props.title && exist_flag === true){
                    console.log(i)
                    prevstore = prevstore.filter((val,ind)=>{return ind !== i})
                }
            })
            if(exist_flag === false){
                prevstore.push({lines:lines,title : props.title})
            }
            localStorage.setItem('linestore',JSON.stringify(prevstore))
        }

        // lines.map((line,i)=>{
        //     console.log(line.tool)
        // })
        // console.log(gest_record[0])
        gest_list.push(gest_record)
        // console.log(gest_record)
        console.log(lines)
        if(flag === false){

            localStorage.setItem('lines',JSON.stringify(lines))
            let linestore = []
            let prevstore = JSON.parse(localStorage.getItem('linestore'))
            let exist_flag = false
            prevstore.map((note,i)=>{
                if(note.title === props.title && exist_flag === false){
                    note.lines = lines
                    exist_flag = true
                }
                else if(note.title === props.title && exist_flag === true){
                    console.log(i)
                    prevstore = prevstore.filter((val,ind)=>{return ind !== i})
                }
            })
            if(exist_flag === false){
                prevstore.push({lines:lines,title : props.title})
            }
            localStorage.setItem('linestore',JSON.stringify(prevstore))
        }
        // console.log(JSON.stringify(lines))
        // var k = JSON.stringify(lines)
        // setLines
        // console.log(localStorage.getItem('lines'))
        // e.target.getStage().clear()
        // setLines([])
        // console.log(JSON.parse(k))
        // setLines([...JSON.parse(k)])
    };

    return (
        <div className=" text-center text-dark">
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                className="canvas-stage"
            >
                <Layer id='draw_layer'>
                    {
                        p.map(element => {
                            return <Rect x= {2200}
                            key = {element}
                            y={element}
                            width={50}
                            height={50}
                            fill = "grey"
                            shadowBlur={10}
                          />
                        })
                    }
                    {lines.map((line, i) => (
                        <Line
                        key={i}
                        points={line.points}
                        stroke="#df4b26"
                        strokeWidth={line.width? line.width :2}
                        tension={0.5}
                        lineCap="round"
                        globalCompositeOperation={
                            line.tool === 'eraser' ? 'destination-out' : 'source-over'
                        }
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    )
}

export default Notes;