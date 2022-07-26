import MyButton from "./MyButton";
import { useNavigate } from 'react-router-dom';
import React from 'react'; 

function DiaryItem({ id, emotion, content, date }) {
    const navigate = useNavigate(); 

    const goDetail = () => {
        navigate(`/diary/${id}`);
      };

      const goEdit = () => {
        navigate(`/edit/${id}`);
      };

  const env = process.env;
  env.PUBLIC_URL = env.PUBLIC_URL || '';


  const strDate = new Date(parseInt(date)).toLocaleDateString();


  return (
    <div className="DiaryItem">
      <div onClick={goEdit} className="emotion_img_wrapper">
        <img src={process.env.PUBLIC_URL + `assets/emotion${emotion}.png`} />
      </div>
      <div onClick={goEdit} className="info_wrapper">
        <div className="diary_date">{strDate}</div>
        <div className="diary_content_preview">{content.slice(0, 25)}</div>
      </div>
      <div className="btn_wrapper">
        <MyButton onClick={goEdit} text={"수정하기"}></MyButton>
      </div>
    </div>
  );
}

export default React.memo(DiaryItem);
