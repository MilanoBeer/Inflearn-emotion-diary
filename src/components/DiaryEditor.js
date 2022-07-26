/* eslint-disable*/
import { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// import Component
import MyButton from './MyButton';
import MyHeader from './MyHeader';
import EmotionItem from './EmotionItem';
import { DiaryDispatchContext } from '../App';

import { getStringDate } from '../util/date.js';
import { emotionList } from '../util/emotion';

const DiaryEditor = ({isEdit, originData}) => {
  const contentRef = useRef();
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState(3);
  const [date, setDate] = useState(getStringDate(new Date()));
  
  const navigate = useNavigate();

  const {onCreate, onEdit, onRemove} = useContext(DiaryDispatchContext);

  const handleSubmit = () => {
    if(content.length < 1){
        contentRef.current.focus(); 
        return; 
    }

    // onEdit
    if(window.confirm(isEdit ? "일기를 수정하시겠습니까?" : "새로운 일기를 작성하시겠습니까?")){
        if(!isEdit){
            onCreate(date, content, emotion)
        }else{
            onEdit(originData.id, date, content, emotion);
        }
    }

    //작성완료되면, home으로 보내기 
    // 옵션: 일기 작성하는 페이지로 뒤로가기로 못오도록 막기 
    navigate('/', {replace: true})
  }

  useEffect(()=>{
    if(isEdit){
        // 날짜 부분 edit에 맞게 바꾸기. 
        setDate(getStringDate(new Date(parseInt(originData.date))));
        // emotion  
        setEmotion(originData.emotion);
        setContent(originData.content);
    }else{

    }
  }, [isEdit, originData])

  const handleClickEmote = useCallback((emotion) => {
    setEmotion(emotion);
  });

  // in 수정페이지 : 삭제하기 버튼 클릭시 실행 함스 
  const handleRemove = ()=>{
    if(window.confirm('정말 삭제하시겠습니까?')){
      onRemove(originData); 
      // 삭제시, 홈으로 돌려보내기  
      navigate('/', {replace: true})
    }
  } 


  return (
    <div className="DiaryEditor">
      <div>
        <MyHeader
          headText={ isEdit ? "일기 수정하기": "새 일기쓰기"}
          rightChild={
            isEdit && (
              <MyButton onClick={handleRemove} text={'삭제하기'} type={"negative"} />
            )
          }
          leftChild={<MyButton onClick={() => navigate(-1)} text="< 뒤로가기" />}
        ></MyHeader>
      </div>
      <div>
        <section>
          <h4>오늘은 언제인가요?</h4>
          <div className="input_box">
            <input className="input_date" type="date" vlaue={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </section>
        <section>
          <h4>오늘의 감정</h4>
          <div className="input_box emotion_list_wrapper">
            {emotionList.map((it) => (
              <EmotionItem
                key={it.emotion_id}
                {...it}
                onClick={handleClickEmote}
                isSelected={it.emotion_id === emotion}
              ></EmotionItem>
            ))}
          </div>
        </section>
        <section>
          <h4>오늘의 일기</h4>
          <div className="input_box text_wrapper">
            <textarea
              placeholder="오늘은 어땠나요"
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </section>
        <section>
          <div className="control_box">
            <MyButton text={'취소하기'} onClick={() => navigate(-1)} />
            <MyButton
              text={'작성완료'}
              type={'positive'}
                onClick={handleSubmit}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default DiaryEditor;
