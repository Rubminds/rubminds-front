import React from 'react'
import axios from 'axios'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { CgProfile } from 'react-icons/cg'
import * as S from './style'

import { DropDown } from '../../../components'
import useInput from '../../../hooks/useInput'
import { useDispatch } from 'react-redux'
import { signupUser } from '../../../modules/user'

const SignUpPageRight = () => {
  const dispatch = useDispatch()
  const { accessToken, signupCheck } = useParams()
  const imgInput = useRef()
  const [dropDownOptions, setDropDownOptions] = useState([])
  const [nickname, onChangeNickname] = useInput('')

  const [job, onChangeJob, setJob] = useInput('')
  const [introduce, onChangeIntroduce] = useInput(null)

  // attachment : img URL (for Server)
  const [attachMent, setAttachment] = useState(null)
  const [fileInfo, setFileInfo] = useState(null)


  const [skill, setSkill] = useState(); 
  const [skillId, setSkillId] = useState([])
  const [skillName, setSkillName] = useState([])

  useEffect(() => {
    axios
    .get('https://dev.rubminds.site/api/skills', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      },
    })
    .then(res => {
      let temp = res.data.skills;
      setSkill(temp); 
      temp.map((value) => {
        skillName.push(value.name) 
      })
    })
    localStorage.setItem('accessToken', accessToken)
    return () => {
      localStorage.setItem('signupCheck', signupCheck)
    }
  }, [])

  useEffect(()=>{
    if (skill != 'undefined' && skill != null){
      let index = skill.findIndex(v=>v.name == dropDownOptions[dropDownOptions.length-1]);
      skillId.push(skill[index].id);
      console.log(skillId);
    }
  },[dropDownOptions]);

  const onProfileUpload = useCallback(() => {
    imgInput.current.click()
  }, [])

  const onProfileURL = useCallback(
    e => {
      let reader = new FileReader()
      setFileInfo(e.target.files[0])
      reader.readAsDataURL(e.target.files[0])
      reader.onloadend = finished => {
        setAttachment(finished.target.result)
        e.target.value = ''
      }
    },
    [attachMent, fileInfo]
  )

  const onDeleteURL = useCallback(() => {
    setFileInfo(null)
    setAttachment(null)
  }, [fileInfo, attachMent])

  const onSubmitHandler = useCallback(
    e => {
      e.preventDefault()

      console.log('제출');
      let data = [{
        nickName : `${nickname}`, 
        job : `${job}`, 
        skillSet : `${skillId}`,
        introduce : `${introduce}` 
      }]
      

      const formData = new FormData()
      if (fileInfo) {
        formData.append('profileImg', fileInfo)
      }

      formData.append('userInfo',  new Blob([JSON.stringify(data)], {type: "application/json"}))

      // for (var key of formData.keys()) {

      //   console.log(key);
      
      // }
      
      // for (var value of formData.values()) {
      
      //   console.log(value);
      
      // }
      

      axios.post('https://dev.rubminds.site/api/user/signup', formData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        }
      })
      .then((res)=> {
        console.log(res.data); 
      })
    },
    [attachMent, nickname, job, dropDownOptions, introduce]
  )
  return (
    <S.SignUpPageRightWrapper>
      <S.MainTitle fontSize="5rem" fontWeight="bold">
        Sign Up
      </S.MainTitle>

      <S.SignUpPageInnerForm onSubmit={onSubmitHandler}>
        <S.ProfileWrapper>
          {attachMent ? (
            <>
              <img
                src={attachMent}
                width="150px"
                style={{ display: 'block', borderRadius: '5000px' }}
                onClick={onDeleteURL}
              />
            </>
          ) : (
            <CgProfile size="100" onClick={onProfileUpload} />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onProfileURL}
            hidden
            ref={imgInput}
          />
        </S.ProfileWrapper>

        {/* 닉네임 */}

        <S.MainTitle
          marginTop="7.5%"
          marginBottom="7.5%"
          fontSize="2rem"
          aquired
        >
          닉네임
        </S.MainTitle>
        <S.NickNameWrapper>
          <S.NickNameBox name="nickName" onChange={onChangeNickname} required />
          <S.CheckBox
            onClick={() => {
              alert('중복체크 중!')
            }}
          >
            중복 체크
          </S.CheckBox>
        </S.NickNameWrapper>

        {/* 직업 */}
        <S.MainTitle marginTop="7.5%" marginBottom="7.5%" fontSize="2rem">
          직업
        </S.MainTitle>
        <S.JobWrapper>
          <S.JobCheckBtn
            name="학생"
            onClick={e => {
              setJob(e.target.name)
              e.preventDefault()
            }}
            name={'학생'}
            selected={job}
          >
            학생
          </S.JobCheckBtn>
          <S.JobCheckBtn
            name="직장인"
            onClick={e => {
              setJob(e.target.name)
              e.preventDefault()
            }}
            name={'직장인'}
            selected={job}
          >
            직장인
          </S.JobCheckBtn>
        </S.JobWrapper>

        {/* 기술 스택 */}
        <S.MainTitle marginTop="7.5%" marginBottom="7.5%" fontSize="2rem">
          기술 스택
        </S.MainTitle>
        <DropDown
          dropDownOptions={dropDownOptions}
          setDropDownOptions={setDropDownOptions}
          style={{ width: '100%' }}
          options={skillName}
        ></DropDown>

        {/* 자기소개 */}
        <S.MainTitle
          marginTop="7.5%"
          marginBottom="7.5%"
          fontSize="2rem"
          aquired
        >
          자기소개
        </S.MainTitle>
        <S.Introduce onChange={onChangeIntroduce} />
        <S.SubmitBtn onClick={onSubmitHandler}>회원 가입</S.SubmitBtn>
        <S.Clear></S.Clear>
      </S.SignUpPageInnerForm>
    </S.SignUpPageRightWrapper>
  )
}

export default SignUpPageRight
