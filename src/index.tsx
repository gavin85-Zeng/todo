import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { v4 as uuidv4 } from 'uuid';

type TodoData = {
    id: string,
    text: string,
    clickFlag?: boolean,
}

type TodoCtrl = {
    add?: (data: TodoData) => void,
    del?: (uuid: string) => void,
    list?: TodoData[]
}

const sampleTasks:TodoData[] = [
    {   
        id: uuidv4(),
        text: 'Take a cut nap'
    },
    {   
        id: uuidv4(),
        text: 'Bug eggs',
        clickFlag: true,
    },
    {   
        id:uuidv4(), 
        text: 'Read a book'
    },
]

const Todo = () => {
    const style:CSSProperties = {
        margin: '40px auto',
    }

    const [list, setList] = useState<TodoData[]>([]);

    useEffect(() => {
        sampleTasks.map(d => handleAdd(d));
        return () => {
            setList([]);
        }
    }, [])

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
    const inputEl = useRef<HTMLInputElement>(null);
    
    const addEl = () => {
        if(inputEl.current !== null && inputEl.current.value !== ''){
            let data:TodoData = {
                id: uuidv4(),
                text: inputEl.current.value
            }
            add !== undefined ?  add(data) : console.log('[Error] add function undefined!');
            inputEl.current.value = '';
        }else{
            alert('Please key-in tasks...');
        }
    }

    const handleClick = () => {
        addEl();
    }    
    
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if(event.key === 'Enter'){
            addEl();
        }
    }

    return (
        <div className="header">
            <h2>To Do List</h2>
            <input type='text' ref={inputEl} onKeyDown={handleKeyDown} className="todoInput" placeholder='Tasks...' />
            <input type='button' onClick={handleClick} value="Add" className="addBtn" />
        </div>
    )
}

const TodoList:React.FC<TodoCtrl> = (props) => {
    const {del, list, children} = props;
    const handleDel = (event: React.MouseEvent) => {
        const uuid:string | null = event.currentTarget.getAttribute('data-key');
        if(uuid !== null && del !== undefined){
            del(uuid);
            console.log(`[DEBUG] Remove uuid: ${uuid}`);
        }
    }

    return (
        <ul className="margin0">
            { list !== undefined && list.length !== 0  ? list.map( (v, i) => <TodoContainer key={v.id} uuid={v.id} text={v.text} del={handleDel} idx={i} defaultChk={v.clickFlag} /> ) : null }
        </ul>
    )
}

const TodoContainer:React.FC<{text:string, uuid:string, del: (event: React.MouseEvent) => void, idx:number, defaultChk:boolean | undefined}> = (props) => {
    const {text, uuid, del, idx, defaultChk} = props;
    const [clickFlag, setClickFlag] = useState(false);
    
    useEffect(() => {
        if(defaultChk !== undefined && defaultChk === true)
            setClickFlag(!clickFlag);
    }, [])

    const handleClick = () => {
        setClickFlag(!clickFlag);
    }
    return(
        <li className={`${idx % 2 === 0 ? 'single' : 'double'} ${clickFlag === true ? 'checked' : ''}`} onClick={handleClick}> 
            <p className="liParagraph">{text}</p>
            <span data-key={uuid} onClick={del} className="del">{'\u00D7'}</span>
        </li>
    )
}

render(<Todo />, document.querySelector('#root'));