import React, { useCallback, useEffect, useState } from 'react';
import * as S from './style';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { FaRegPaperPlane } from 'react-icons/fa';

import useInput from '../../../../hooks/useInput';
import { MailUserModal } from '../../..';
import { addTeamUser } from '../../../../modules/team';

const MailPost = ({ postId, setChatroomNum, me, modalOpenId, openUserModal, step }) => {
  const [chats, setChats] = useState([]); //전체 채팅내용
  const [postTitle, setPostTitle] = useState('게시글제목'); //게시글 제목
  const [writerId, setWriterId] = useState(null); //게시글 작성자
  const [effectSwitch, setEffectSwitch] = useState(false);

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
      e.target.children[0].value = '';
    },
    [postId, userInput, setUserInput],
  );

  const checkReserveMsg = msg => {
    return msg.includes('sdnimbur@');
  };

  const onOKButtonClick = useCallback(() => {
    const okConfirm = window.confirm('정말로 수락하시겠습니까?');
    if (okConfirm) {
      dispatch(addTeamUser({ teamId: postId, userId: me.id }));
      
    }
  }, []);

  return (
    <>
      <S.Header onClick={onBackClick}>
        <S.BackBtn />
        <S.PostTitle>{postTitle}</S.PostTitle>
      </S.Header>
      <S.Content>
        {chats.map(v => (
          <S.MessageRow key={v.id}>
            <S.UserInfo>
              <S.UserAvatar src={v.avatar} onClick={e => openUserModal(e, v.senderId)} />
              <S.InfoWrapper>
                <S.Nickname onClick={e => openUserModal(e, v.senderId)}>
                  {v.senderNickname}
                </S.Nickname>
                <S.SendTime>
                  {v.createAt.split('T')[0]}&nbsp;{v.createAt.split('T')[1]}
                </S.SendTime>
              </S.InfoWrapper>
            </S.UserInfo>
            <S.Msg>
              {checkReserveMsg(v.content) ? `${v.content.split('@')[3]}을 초대했습니다` : v.content}
              {parseInt(v.content.split('@')[3]) === me.id && (
                <>
                  <br />
                  <S.OkButton onClick={onOKButtonClick}>수락하기</S.OkButton>
                </>
              )}
            </S.Msg>
          </S.MessageRow>
        ))}
      </S.Content>
      <S.InputWrapper onSubmit={sendMsg}>
        <S.Input type="text" onChange={onChangeUserInput} />
        <S.SendBtn type="submit">
          <FaRegPaperPlane />
        </S.SendBtn>
      </S.InputWrapper>
      {modalOpenId > 0 && (
        <MailUserModal
          userId={modalOpenId}
          postId={postId}
          me={me}
          step={step}
          writerId={writerId}
          setEffectSwitch={setEffectSwitch}
        />
      )}
    </>
  );
};

export default MailPost;
