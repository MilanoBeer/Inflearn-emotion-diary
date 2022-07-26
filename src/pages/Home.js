import { useContext, useEffect, useState } from 'react';
import { DiaryStateContext } from '../App';

// import Component
import MyHeader from './../components/MyHeader';
import MyButton from './../components/MyButton';
import DiaryList from '../components/DiaryList';

const Home = () => {
  const diaryList = useContext(DiaryStateContext);
  const [data, setData] = useState([]);

  const [curDate, setCurDate] = useState(new Date());
  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;

  // useEffect : 월이 바뀌면, 그 월에 해당하는 일기들만 보여주기
  useEffect(() => {
    if (diaryList.length >= 1) {
      const firstDay = new Date(curDate.getFullYear(), curDate.getMonth(), 1).getTime();
      //console.log(new Date(firstDay));

      const lastDay = new Date(curDate.getFullYear(), 
      curDate.getMonth() + 1, 0, 23, 59, 59).getTime(); //  밀리세컨즈

      console.log(new Date(lastDay));

      //=> 현재 달의 첫날, 마지막날 사이의 데이터 //필터링
      setData(diaryList.filter((it) => firstDay <= it.date && it.date <= lastDay));
    } else {
      setData([]);
    }
  }, [diaryList, curDate]);

  useEffect(()=>{
    console.log(data); 
  }, [data]);

  // 월 +- 기능 만들기
  const increaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() + 1));
  };

  const decreaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() - 1));
  };
  return (
    <div>
      <MyHeader
        headText={headText}
        leftChild={<MyButton text={'<'} onClick={decreaseMonth} />}
        rightChild={<MyButton text={'>'} onClick={increaseMonth} />}
      />
      <DiaryList diaryList={data}/>
    </div>
  );
};

export default Home;
