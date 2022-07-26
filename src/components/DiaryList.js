import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import Component
import MyButton from './MyButton';
import DiaryItem from './DiaryItem'
// 최신순
const sortOptionList = [
  { value: 'latest', name: '최신순' },
  { value: 'oldest', name: '오래된 순' },
];

//감정 상태 리스트
const filterOptionList = [
  { value: 'all', name: '전부다' }, // 이거 선택하면, name의 이름으로 state에 저장
  { value: 'good', name: '좋은 감정만' },
  { value: 'bad', name: '안좋은 감정만' },
];

// 정렬기능 : 필요한 props 3개
// 필터기준 / 정렬기준을 바꾸는 setSort /
const ControlMenu = React.memo(({ value, onChange, optionList }) => {

  useEffect(()=>{
    console.log("control menu");
  })

  return (
    // setSortType메소드임
    <select className="ControlMenu" value={value} onChange={(e) => onChange(e.target.value)}>
      {optionList.map((it, idx) => (
        <option kye={idx} value={it.value}>
          {it.name}
        </option>
      ))}
      ;
    </select>
  );
});

const DiaryList = ({ diaryList }) => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState('all');

  // 정렬기준 저장할 state // 초기 기본 sort type은 latest
  const [sortType, setSortType] = useState('latest');

  // 선택한 기준에 따라, 데이터 정렬하기 => 정렬된 리스트를 반환
  const getProcessDiaryList = () => {
    const filterCallBack = (item) => {
      if (filter === 'good') {
        return parseInt(item.emotion) <= 3;
      } else {
        return parseInt(item.emotion) > 3;
      }
    };

    const compare = (a, b) => {
      if (sortType === 'latest') {
        return parseInt(b.date) - parseInt(a.date);
      } else {
        return parseInt(a.date) - parseInt(b.date);
      }
    };

    // 문자열로 바꿨다가, 다시 JSON으로 만들어서, copy에 넣기 / 원본 건드리지 않으려고..
    const copyList = JSON.parse(JSON.stringify(diaryList));

    const filteredList = filter === 'all' ? copyList : copyList.filter((it) => filterCallBack(it));

    // 정렬 결과 담기 => 객체단위 정렬 -> 비교함수 만들기 / 전달
    // const sortedList = copyList.sort(compare);
    const sortedList = filteredList.sort(compare);

    return sortedList;
  };

  return (
    <div className="DiaryList">
      <div className="menu_wrapper">
        <div className="left_col">
          <ControlMenu value={sortType} onChange={setSortType} optionList={sortOptionList}></ControlMenu>
          <ControlMenu value={filter} onChange={setFilter} optionList={filterOptionList}></ControlMenu>
        </div>
        <div className="right_col">
          <MyButton type={'positive'} text={'새 일기쓰기'} onClick={() => navigate('/new')} />
        </div>
      </div>

      {getProcessDiaryList().map((it) => (
        <DiaryItem key={it.id} {...it}>{it.content}</DiaryItem>
      ))}
    </div>
  );
};

DiaryList.defaultProps = {
  diaryList: [],
};

export default DiaryList;
