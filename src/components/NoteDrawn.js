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
        console.log(i)
        p.push(i);
    }
}
console.log(p)
const Notes = ({prelines, onClearLines, clearLines}) => {
    // console.log(prelines)
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
                lines.splice(lines.length-1, 1, points);
                setLines([...lines, {points:points, tool:'eraser'}])

                // return <Line points={points} strokeWidth = {100} stroke = "#000000" />
                // lastLine.points = lastLine.points.concat(points);
                // lastLine.tool = 'eraser'
                
                // let lastLine = lines[lines.length - 1]
                // console.log(lastLine)
                // lastLine.tool = 'eraser'
                // setLines(lines.concat());
                // // console.log(line.tool)
                // // return <Line points={points} globalCompositeOperation='source-over' strokeWidth={100} stroke={}/>
                // console.log(num)
                // var erasure = []
                // lines.map((line,i)=>{
                //     console.log(i)
                //     line.tool = 'eraser'
                //     console.log(line.tool)
                // //     for(var f=0;f<line.points.length;f+2){
                // //         console.log(line.points[f])
                // //     }
                // //     // line.points.map(j=>{
                // //     //     console.log(j)
                // //     // })
                // })
                // return <Line x={25} />
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
        }

        // lines.map((line,i)=>{
        //     console.log(line.tool)
        // })
        // console.log(gest_record[0])
        gest_list.push(gest_record)
        // console.log(gest_record)
        console.log(lines)
        if(flag == false){

            localStorage.setItem('lines',JSON.stringify(lines))
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
                        strokeWidth={line.tool ==='eraser'?150:2}
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