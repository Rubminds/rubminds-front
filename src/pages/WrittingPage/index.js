import React, { useState, useCallback } from 'react'
import * as S from './style'
import { FaBook } from 'react-icons/fa'
import { MdPersonAdd } from 'react-icons/md'
import { HiUserGroup } from 'react-icons/hi'
import DropDown from '../../components/common/DropDown'
import { LandingDropdownOptions } from '../../constants'
import { AreaOptions } from '../../constants'


const WrittingPage = () => {

  const [recruitType, setRecruitType] = useState(null); 
  const [btnColor, setBtnColor] = useState(['white', 'white', 'white']); 
  const [title, setTitle] = useState(null); 
  const [skillSet, setSkillSet] = useState(null);
  const [meetEnviroment, setMeetEnviroment] = useState(null);
  const [recruitPeople, setRecuitPeople] = useState(null);
  const [area, setArea] = useState(null);
  const [mainText, setMainText] = useState(null);

  const [isScout , setIsScout] = useState(false);

  const onRecruitTypeHandler = useCallback((e)=>{
    setRecruitType(e.target.id);
    switch (e.target.id){
       case 'study' :
         setIsScout(false);
         setBtnColor(['#FBEAFF', 'white', 'white']);
          break;
       case 'scout' :
         setIsScout(true);
         setBtnColor(['white', '#FBEAFF', 'white']);
         break;
       case 'project' :
         setIsScout(false);
         setBtnColor(['white', 'white', '#FBEAFF']);
         break;
    }
  },[btnColor]);

const onTitleHandler = useCallback((e)=>{
  setTitle(e.target.value);
}, [title]);

const onMeetSelectHandler = useCallback((e)=>{
  setMeetEnviroment(e.target.value);
}, [meetEnviroment]);

const onRecruitPeopleHandler = useCallback((e)=> {
    setRecuitPeople(e.target.value);
}, [recruitPeople]);

const onAreaHandler = useCallback((e)=>{
  setArea(e.target.value);
},[area]);

const onMainTextHandler = useCallback((e)=> {
  setMainText(e.target.value);
}, [mainText]);

const onSubmitHandler = (e) => {
  e.preventDefault();

  console.log(recruitType, title, meetEnviroment, recruitPeople, area, mainText);

  const formData = new FormData();
  if (recruitPeople){
    formData.append('recruitPeople', recruitPeople);
  }

  formData.append('recruitType', recruitType);
  formData.append('title', title);
  formData.append('meetEnviroment', meetEnviroment);
  formData.append('recruitPeople', recruitPeople);
  formData.append('area', area);
  formData.append('mainText', mainText);

  // for (var key of formData.keys()) {
  //   console.log(key);
  // }
  //
  // for (var value of formData.values()) {
  //   console.log(value);
  // }


};

  return (
    <S.WrittingBackGround>
      <S.WrittingInnerForm onSubmit={onSubmitHandler}>
        {/* 모집 유형 */}
        <S.MainTitle fontSize="30px" marginBottom="3%">
          모집 유형
        </S.MainTitle>
        <S.CategoryWrapper>
          <S.CategoryCard id='study' backgroundColor = {btnColor[0]} onClick={onRecruitTypeHandler} >
            <FaBook fontSize="30px" />
            스터디
          </S.CategoryCard>
          <S.CategoryCard id='scout' backgroundColor = {btnColor[1]} onClick={onRecruitTypeHandler} >
            <MdPersonAdd fontSize="30px" />
            스카웃
          </S.CategoryCard>
          <S.CategoryCard id='project' backgroundColor = {btnColor[2]} onClick={onRecruitTypeHandler} >
            <HiUserGroup fontSize="30px" />
            프로젝트
          </S.CategoryCard>
        </S.CategoryWrapper>

        {/* 제목 */}
        <S.MainTitle fontSize="30px" marginTop="5%" marginBottom="3%">
          제목
        </S.MainTitle>
        <S.InputBox placeholder="제목을 입력하세요." onChange={onTitleHandler}/>

        {/* 기술 스택 */}
        <S.MainTitle fontSize="30px" marginTop="5%" marginBottom="3%">
          기술 스택
        </S.MainTitle>
        <DropDown
          style={{ width: '100%' }}
          options={LandingDropdownOptions}
        ></DropDown>

        <S.MiddleWrapper>
          {/* 회의 환경 */}
          <S.MeetEnviromentWrapper>
            <S.MainTitle fontSize="30px" marginTop="5%" marginBottom="3%">
              회의 환경
            </S.MainTitle>
            <S.MeetSelect onChange={onMeetSelectHandler}>
              <option selected disabled hidden>== 선택 ==</option>
              <option>온라인</option>
              <option>오프라인</option>
              <option>혼합</option>
              <option>상관없음</option>
            </S.MeetSelect>
          </S.MeetEnviromentWrapper>

          {
            !isScout &&
            (<S.RecruitPeopleWrapper>
            <S.MainTitle fontSize="30px" marginTop="5%" marginBottom="3%">
            모집인원
            </S.MainTitle>
            <S.InputBox type='number' min='0' width="30%" onChange={onRecruitPeopleHandler}/>
            <span>명</span>
            </S.RecruitPeopleWrapper>)
          }

        </S.MiddleWrapper>

        {/* 지역 */}
        <S.MainTitle fontSize="30px" marginTop="5%" marginBottom="3%">
          지역
        </S.MainTitle>
        <S.AreaSelect onChange={onAreaHandler}>
          <option selected disabled hidden>== 선택 ==</option>
          {AreaOptions.map((value,index) => {
            return <option key={index}>{value}</option>
          })}
        </S.AreaSelect>

        {/* 모집 내용 */}
        <S.MainTitle fontSize="30px" marginTop="5%" marginBottom="3%">
          모집 내용
        </S.MainTitle>
        <S.MainTextArea placeholder='프로젝트에 대한 자세한 설명을 부탁드립니다.' onChange={onMainTextHandler}>
        </S.MainTextArea>

        {/* 버튼 */}
        <S.BtnArea>
          <S.BtnLeftArea></S.BtnLeftArea>
          <S.BtnRightArea>
            <S.Btn backgroundColor = 'white' right='10'>취소</S.Btn>
            <S.Btn onClick={onSubmitHandler}>등록하기</S.Btn>
          </S.BtnRightArea>
        </S.BtnArea>

      </S.WrittingInnerForm>
    </S.WrittingBackGround>
  )
}

export default WrittingPage
