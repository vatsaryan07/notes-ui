import { React } from 'react';
import { Stage, Layer, Line,Rect } from 'react-konva';
import { useEffect, useState, useRef } from 'react';
import { clear } from '@testing-library/user-event/dist/clear';


var gest_record = []
var gest_list = []
const Notes = ({prelines, onClearLines, clearLines}) => {
    console.log(prelines)
    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);
    useEffect(()=>{
        console.log(localStorage.getItem('lines'))
        if(localStorage.getItem('lines')){
            console.log("empty condition")
            setLines([...JSON.parse(localStorage.getItem('lines'))])
        }
      }, [])
    useEffect(() => {
        //loadImage();
    }, [clearLines])
    
    const handleMouseDown = (e) => {
        gest_record = []
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        gest_record.push([pos.x,pos.y])
        console.log(pos.x)
        setLines([...lines, { points: [pos.x, pos.y] }]);
    };
    
    const handleMouseMove = (e) => {
        // no drawing - skipping
        if (!isDrawing.current) {
          return;
        }
        
        console.log("yeet?")
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        console.log(point.x,point.y)
        gest_record.push([point.x,point.y])
        console.log(gest_record)
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
        console.log(gest_record[gest_record.length - 1][0])
        console.log(gest_record[gest_record.length - 1][1])
        console.log(lines)
        var flag = false
        if((gest_record[0][0]<100 && gest_record[0][1]<100) && (gest_record[gest_record.length - 1][0]>1530 && gest_record[gest_record.length - 1][1]>915) ||
        (gest_record[gest_record.length - 1][0]<30 && gest_record[gest_record.length - 1][1]<30) && (gest_record[0][0]>915 && gest_record[0][1]>915)){
            flag = true
            console.log("Calling clear")
            var stage = e.target.getStage()
            stage.clear()
            setLines([])
            localStorage.setItem('lines',[])
            setLines([])
        }
        // console.log(gest_record[0])
        gest_list.push(gest_record)
        // console.log(gest_record)
        console.log(lines)
        if(flag == false){

            localStorage.setItem('lines',JSON.stringify(lines))
        }
        // console.log(JSON.stringify(lines))
        var k = JSON.stringify(lines)
        // setLines
        console.log(localStorage.getItem('lines'))
        // e.target.getStage().clear()
        // setLines([])
        console.log(JSON.parse(k))
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
                <Rect
          x={1900}
          y={50}
          width={50}
          height={50}
          fill = "grey"
          shadowBlur={10}
        />
                    {lines.map((line, i) => (
                        <Line
                        key={i}
                        points={line.points}
                        stroke="#df4b26"
                        strokeWidth={2}
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