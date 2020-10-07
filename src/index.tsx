import React, { CSSProperties, FunctionComponent, useRef, useState } from "react";
import { render } from "react-dom";
import { v4 as uuidv4 } from 'uuid';

type TodoData = {
    id: string,
    text: string
}
type TodoCtrl = {
    add?: (data: TodoData) => void,
    del?: (uuid: string) => void,
    list?: TodoData[]
}


const Todo = () =>{
    const style:CSSProperties = {
        margin: '40px auto',
    }

    const [list, setList] = useState<TodoData[]>([]);

    const handleAdd = (data: TodoData) => {
        setList(prevArray => [...prevArray, data]);
    }

    const handleDel = (uuid:string) => {
        setList(list.filter(item => item.id !== uuid));
    }

    return (
        <div style={style}>
            <TodoInput add={handleAdd}/>
            <TodoList list={list} del={handleDel}/>
        </div>
    )
}

const TodoInput:React.FC<TodoCtrl> = (props) => {
    const {add} = props;
    const style:CSSProperties = {
        display: 'flex',
        padding: '5px',
        flexWrap: 'wrap',
        gap: '5px',
    }

    const inputEl = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        if(inputEl.current !== null && inputEl.current.value !== ''){
            let data:TodoData = {
                id: uuidv4(),
                text: inputEl.current.value
            }
            add !== undefined ?  add(data) : console.log('[Error] add function undefined!');
            inputEl.current.value = '';
        }
    }    

    return (
        <div style={style}>
            <input type='text' ref={inputEl} placeholder='tasks' />
            <button type='button' onClick={handleClick}>Add</button>
        </div>
    )
}

const TodoList:React.FC<TodoCtrl> = (props) => {
    const {del, list, children} = props;
    const handleDel = (event: React.MouseEvent) => {
        const uuid:string | null = event.currentTarget.getAttribute('data-key');
        const text:string | null = event.currentTarget.textContent;
        if(uuid !== null && del !== undefined){
            del(uuid);
            console.log(`[DEBUG] Remove task: ${text} uuid: ${uuid}`);
        }
    }

    return (
        <>
            { list !== undefined && list.length !== 0  ? list.map( (v) => <TodoContainer key={v.id} uuid={v.id} text={v.text} del={handleDel} /> ) : null }
        </>
    )
}

const TodoContainer:React.FC<{text:string, uuid:string, del: (event: React.MouseEvent) => void}> = (props) => {
    const {text, uuid, del} = props;
    const style:CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '5rem',
    }

    return(
        <div style={style} >
            <input type="checkbox" id={uuid}/>
            <label htmlFor={uuid}>{text}</label>
            <div data-key={uuid} onClick={del}>X</div>
        </div>
    )
}

render(<Todo />, document.querySelector('#root'));