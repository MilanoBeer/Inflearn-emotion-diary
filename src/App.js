import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useRef, useReducer, useEffect } from 'react'
// import Pages
import Home from './pages/Home';
import New from './pages/New';
import Diary from './pages/Diary';
import Edit from './pages/Edit';
import { axios } from 'axios';

// Reducer
const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case 'INIT': {
      return action.data;
    }
    case 'CREATE': {
      const newItem = {
        ...action.data,
      };
      //새로운  state를 새로 할당하기 
      newState = [newItem, ...state];
      break;
    }
    case 'REMOVE': {
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    case 'EDIT': {
        newState = state.map((it) => it.id === action.data.id ? { ...action.data } : it
      );
      break;
    }
    default:
      return state;
  }

  // localStorage
  localStorage.setItem("diary", JSON.stringify(newState)); 
  return newState; 
};

// Redux : 
export const DiaryStateContext = React.createContext();  
export const DiaryDispatchContext = React.createContext(); 
// 날짜 계산하기 
//console.log(new Date().getTime()) => 1656642850517


function App() {
  const [data, dispatch] = useReducer(reducer, []);

  // localstorage의 데이터 가져와서 기초값으로 셋팅하기
  useEffect(()=>{
  const localData = localStorage.getItem('diary'); 
  if(localData){
    // id를 기준으로 내림차순으로 정렬 -> 첫번째 인덱스 -> 가장 높은 수 
    const diaryList = JSON.parse(localData).sort((a, b) => parseInt(b.id) - parseInt(a.id)); 
    dataId.current = parseInt(diaryList[0].id ) + 1

    console.log(diaryList);
    console.log(dataId);

    // 초기값으로 설정하자 -> action => dispatch
    dispatch({type: 'INIT', data: diaryList}); 
  }
}, []);

  // api test
  const [user, setUser] = useState(""); 

  // useEffect(()=>{
  //   localStorage.setItem("item1", 10); 
  //   localStorage.setItem("item2", 10); 
  //   // 객체는 JSON 직렬화를 적용해서! 저장해야함 
  //   localStorage.setItem("item3", JSON.stringify({value: 30})); 
  // },[]); 

  /* CREATE */
  const dataId = useRef(6);
  // 받아야 할 것들 생각해서 받기.. / 작성할때, 언제 생성한지도 넣을거니가 
  const onCreate = (date, content, emotion) => {
    dispatch({type: "CREATE", data: {
      id: dataId.current,
      date : new Date(date).getTime(),
      content, 
      emotion
    }})
    dataId.current += 1; 
  };
  // REMOVE
  const onRemove = (targetId) => {
    dispatch({type: "REMOVE", targetId})
  }
  // EDIT
  // 다 수정할거니까, 다 받아와야함 
  const onEdit = (targetId, date, content, emotion)=>{
    dispatch({
      type:"EDIT", 
      data:{
        id: targetId, 
        date: new Date(date).getTime(), 
        content, 
        emotion
      }
    })
  }

  return (
  <DiaryStateContext.Provider value={data}>
  <DiaryDispatchContext.Provider value={{ 
    onCreate,
    onEdit,
    onRemove,
  }}>
    <BrowserRouter>
      <div className="App">
      <h1>{user.id}</h1>
      <h1>{user.username}</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<New />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/diary/:id" element={<Diary />} />
        </Routes>
      </div>
    </BrowserRouter>
    </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
