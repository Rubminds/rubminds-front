import React, { useCallback, useState, useEffect } from 'react';
import * as S from './style.js';
import { AiOutlineEdit, AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { MdPersonAdd } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

import { DetailInfo, UserListModal } from '../..';
import { likePost, changePostStatus } from '../../../modules/post';

//게시글 상세정보.
//진행 원, 모집유형 등의 정보 담은 컴포넌트
const PostTotalInfo = ({ post, modalOpen, closeModal, openModal, me }) => {
  const [members, setMembers] = useState([]);
  const combinedSkills = post.postSkills.concat(post.customSkills);
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/team/${post.teamId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setMembers(response.data.teamUsers);
    };
    fetchData();
  }, []);

  const onEditPage = () => {
    history.push(`/editpost/${id}`);
  };

  const onLikeClick = useCallback(() => {
    dispatch(likePost(post.id));
  }, [dispatch, post.id]);

  const onStatusCircleClick = useCallback(() => {
    console.log('open team members');
    me && openModal();
  }, [openModal]);

  const onChangeStatusClick = useCallback(
    status => () => {
      dispatch(changePostStatus({ postId: post.id, content: { postStatus: status } }));
      window.location.replace(`/post/${post.id}`);
    },
    [post.id, dispatch],
  );
  return (
    <S.PostDetailInfo>
      <S.DetailInfoWrapper>
        <S.DetailUserInfo>
          <S.AuthorAvatar src={post.writer.avatar} /> &nbsp;
          {post.writer.nickname}
        </S.DetailUserInfo>
        <DetailInfo title="모집유형" info={post.kinds} />
        <DetailInfo title="기술스택" info={combinedSkills} />
        <DetailInfo title="회의형태" info={post.meeting} />
        <DetailInfo title="지역" info={post.region} />
        <S.FileContainer>
          {post.files.map((v, i) => (
            <S.UploadedFile download href={v.url} key={i}>
              첨부파일
            </S.UploadedFile>
          ))}
        </S.FileContainer>
      </S.DetailInfoWrapper>

      <S.DetailInfoWrapper width="30%" Group>
        {modalOpen ? (
          <UserListModal
            headcount={post.headcount}
            closeModal={closeModal}
            writerId={post.writer.id}
            teamId={post.teamId}
            members={members}
            meId={me.id}
            postStatus={post.postsStatus}
          />
        ) : (
          <>
            <S.GroupBox>
              {me && me.id === post.writer.id ? (
                <>
                  {post.postsStatus === 'RECRUIT' ? (
                    <>
                      <S.DetailInfoContent toBtn onClick={onChangeStatusClick('WORKING')}>
                        모집 종료하기
                      </S.DetailInfoContent>
                      <S.DetailInfoContent>
                        <div onClick={onEditPage}>
                          <AiOutlineEdit /> &nbsp;수정
                        </div>
                      </S.DetailInfoContent>
                    </>
                  ) : post.postsStatus === 'WORKING' ? (
                    <>
                      <S.DetailInfoContent
                        toBtn
                        onClick={onChangeStatusClick('RANKING')}
                        blue="true"
                      >
                        평가 후 완료하기
                      </S.DetailInfoContent>
                      <S.DetailInfoContent toBtn onClick={onChangeStatusClick('RECRUIT')}>
                        onClick={onChangeStatusClick('RECRUIT')}
                        모집중으로 변경
                      </S.DetailInfoContent>

                      <S.DetailInfoContent>
                        <AiOutlineEdit /> &nbsp;수정
                      </S.DetailInfoContent>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <S.DetailInfoContent>
                  <MdPersonAdd /> &nbsp;모집자와 채팅하기
                </S.DetailInfoContent>
              )}

              <S.DetailInfoContent>
                {post.isLike ? (
                  <S.LikeWrapper onClick={onLikeClick}>
                    <AiFillStar color="#E4DC00" /> &nbsp;찜 취소
                  </S.LikeWrapper>
                ) : (
                  <S.LikeWrapper onClick={onLikeClick}>
                    <AiOutlineStar color="#E4DC00" />
                    &nbsp;찜 하기
                  </S.LikeWrapper>
                )}
              </S.DetailInfoContent>
            </S.GroupBox>
            <S.DetailInfoContent>
              <S.PostStatusCircle status={post.postsStatus} onClick={onStatusCircleClick}>
                <label>{post.postsStatus}</label>
                {post.kinds !== 'SCOUT' && (
                  <label>
                    {members.length}/{post.headcount}
                  </label>
                )}
              </S.PostStatusCircle>
            </S.DetailInfoContent>
          </>
        )}
      </S.DetailInfoWrapper>
    </S.PostDetailInfo>
  );
};

export default PostTotalInfo;
