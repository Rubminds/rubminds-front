import React, { useCallback, useEffect, useState } from 'react';
import * as S from './style';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { FaRegPaperPlane } from 'react-icons/fa';

import useInput from '../../../../hooks/useInput';
import { Python } from '../../../../assets/imgs';
import { MailUserModal } from '../../..';

const MailPost = ({ postId, setChatroomNum, me }) => {
  const [chats, setChats] = useState([]); //전체 채팅내용
  const [postTitle, setPostTitle] = useState('게시글제목'); //게시글 제목
  const [writerId, setWriterId] = useState(null);
  const [effectSwitch, setEffectSwitch] = useState(false);
  const [modalOpenId, setModalOpenId] = useState(-1); //유저 클릭시 모달에 전달할 유저 아이디
  const [userInput, onChangeUserInput, setUserInput] = useInput(''); //유저가 입력한 내용
  const dispatch = useDispatch();

  const onBackClick = useCallback(() => {
    setChatroomNum(null);
  }, [setChatroomNum]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/chat/${postId}?page=1&size=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      console.log(response.data);
      setChats(response.data.chats);
      setPostTitle(response.data.postTitle);
      setWriterId(response.data.writerId);
    };
    me && fetchData();
  }, [me, effectSwitch]);

  const sendMsg = useCallback(
    async e => {
      e.preventDefault();
      const trimedInput = userInput.replace(/ /g, '');
      if (trimedInput !== null && trimedInput !== '') {
        const response = await axios.post(
          '/chat',
          { postId, content: userInput },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        );
        console.log(response.data);
      }
      setUserInput('');
      setEffectSwitch(prev => !prev);
      e.target.children[0].value='';
    },
    [postId, userInput, setUserInput],
  );

  const openUserModal = useCallback((e, senderId) => {
    e.stopPropagation();
    setModalOpenId(senderId);
  }, []);

  const closeUserModal = useCallback(() => {
    setModalOpenId(-1);
  }, []);

  return (
    <S.ContentWrapper onClick={closeUserModal}>
      <S.Header onClick={onBackClick}>
        <S.BackBtn />
        <S.PostTitle>{postTitle}</S.PostTitle>
      </S.Header>

      <S.Content>
        <S.Messages>
          {chats.map(v => (
            <S.MessageRow key={v.id}>
              <S.UserInfo>
                <S.UserAvatar src={v.avatar} onClick={e => openUserModal(e, v.senderId)} />
                <S.InfoWrapper>
                  <S.Nickname>{v.senderNickname}</S.Nickname>
                  <S.SendTime>{v.createAt}</S.SendTime>
                </S.InfoWrapper>
              </S.UserInfo>
              <S.Msg>{v.content}</S.Msg>
            </S.MessageRow>
          ))}
        </S.Messages>
        <S.InputWrapper onSubmit={sendMsg}>
          <S.Input type="text" onChange={onChangeUserInput} />
          <S.SendBtn type="submit">
            <FaRegPaperPlane />
          </S.SendBtn>
        </S.InputWrapper>
        {modalOpenId > 0 && <MailUserModal />}
      </S.Content>
    </S.ContentWrapper>
  );
};

export default MailPost;
