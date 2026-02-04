'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Divider } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  upvoteAnswerThunk,
  downvoteAnswerThunk,
  replyAnswerThunk,
  fetchRepliesThunk,
} from '@/app/redux/features/answers/answerSlice';

interface AnswerItemProps {
  answer: any;
  level?: number;
}

const AnswerItem: React.FC<AnswerItemProps> = ({ answer, level = 0 }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.users.currentUser);

  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showAllReplies, setShowAllReplies] = useState(false);
  const userId = user?.id;
  const answerId = answer.id;

  useEffect(() => {
    if (!answer.replies || answer.replies.length === 0) {
      dispatch(fetchRepliesThunk(answer.id));
    }
  }, [answer.id, dispatch]);

  const handleReplySubmit = async () => {
    if (!user || !replyText.trim()) return;

    await dispatch(
      replyAnswerThunk({
        answerId: answer.id,
        payload: { answer: replyText, userId: user.id },
      })
    );

    setReplyText('');
    setShowReply(false);

    dispatch(fetchRepliesThunk(answer.id));
  };

  const isParent = level === 0;
  const visibleReplies =
    isParent && !showAllReplies
      ? answer.replies?.slice(0, 3)
      : answer.replies;

  return (
    <Box
      sx={{
        p: 2,
        mb: 1.5,
        border: '1px solid #dcdcdc',
        borderRadius: 2,
        ml: level * 4,
        backgroundColor: '#fff',
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: answer.content }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <Button size="small" onClick={() => dispatch(upvoteAnswerThunk({ answerId, userId }))}>
          ▲
        </Button>

        <span>{answer.score || 0}</span>

        <Button size="small" onClick={() => dispatch(downvoteAnswerThunk({ answerId, userId }))}>
          ▼
        </Button>

        <Button size="small" onClick={() => setShowReply(prev => !prev)}>
          Reply
        </Button>

        {answer.isValid && <span>✅</span>}
      </Box>

      {showReply && (
        <Box sx={{ mt: 1 }}>
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Write your reply…"
            style={{
              width: '100%',
              minHeight: 80,
              padding: 8,
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          />
          <Button
            size="small"
            variant="contained"
            sx={{ mt: 1 }}
            onClick={handleReplySubmit}
          >
            Submit Reply
          </Button>
        </Box>
      )}

      {answer.replies && answer.replies.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ mb: 1 }} />

          {visibleReplies.map((reply: any) => (
            <AnswerItem
              key={reply.id}
              answer={reply}
              level={level + 1}
            />
          ))}

          {isParent && answer.replies.length > 3 && (
            <Button
              size="small"
              sx={{ mt: 1, textTransform: 'none' }}
              onClick={() => setShowAllReplies(prev => !prev)}
            >
              {showAllReplies
                ? 'Show fewer replies'
                : `Show ${answer.replies.length - 3} more replies`}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AnswerItem;
