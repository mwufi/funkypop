'use client';

import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Player } from '@remotion/player';
import { interpolate } from 'remotion';

const MESSAGE_ANIMATION_DURATION = 30;
const MESSAGE_HEIGHT = 60; // Approximate height of each message for scroll calculations

type AnimationType = 'scale' | 'slideLeft' | 'slideRight' | 'fadeIn';

interface MessageProps {
  text: string;
  isReceived: boolean;
  delay: number;
  animationType?: AnimationType;
}

const getAnimationStyle = (
  frame: number,
  fps: number,
  animationType: AnimationType,
  isReceived: boolean
) => {
  const progress = spring({
    frame,
    fps,
    config: {
      damping: 12,
    },
  });

  switch (animationType) {
    case 'scale':
      return {
        transform: `scale(${interpolate(progress, [0, 1], [0.5, 1])})`,
        opacity: interpolate(progress, [0, 1], [0, 1]),
      };
    case 'slideLeft':
      return {
        transform: `translateX(${interpolate(progress, [0, 1], [-100, 0])}px)`,
        opacity: interpolate(progress, [0, 1], [0, 1]),
      };
    case 'slideRight':
      return {
        transform: `translateX(${interpolate(progress, [0, 1], [100, 0])}px)`,
        opacity: interpolate(progress, [0, 1], [0, 1]),
      };
    case 'fadeIn':
      return {
        opacity: progress,
      };
    default:
      return {};
  }
};

const Message: React.FC<MessageProps> = ({ 
  text, 
  isReceived, 
  delay,
  animationType = isReceived ? 'slideLeft' : 'slideRight'
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animationStyle = getAnimationStyle(frame - delay, fps, animationType, isReceived);

  return (
    <div
      style={{
        ...animationStyle,
        backgroundColor: isReceived ? '#e9e9eb' : '#007aff',
        color: isReceived ? 'black' : 'white',
        padding: '12px 16px',
        borderRadius: '20px',
        maxWidth: '70%',
        width: 'fit-content',
        fontSize: '16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        marginLeft: isReceived ? '0' : 'auto',
        marginRight: isReceived ? 'auto' : '0',
        transformOrigin: isReceived ? 'left' : 'right',
      }}
    >
      {text}
    </div>
  );
};

const MessageContainer: React.FC<{ children: React.ReactNode; show: boolean }> = ({ 
  children,
  show 
}) => {
  const opacity = show ? 1 : 0;
  
  return (
    <div style={{
      padding: '4px 0',
      opacity,
      display: 'flex',
      flexDirection: 'column',
      minHeight: MESSAGE_HEIGHT,
    }}>
      {children}
    </div>
  );
};

interface ConversationProps {
  typewriterMode?: boolean;
}

const Conversation: React.FC<ConversationProps> = ({ typewriterMode = false }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  
  const messages = [
    { text: "Hey! How's your day going? 😊", isReceived: true, animationType: 'fadeIn' as AnimationType },
    { text: "Pretty good! Just finished that project we talked about", isReceived: false },
    { text: "No way! Already? 😮", isReceived: true },
    { text: "Yep! Used some cool new tech called Remotion", isReceived: false },
    { text: "What's that? 🤔", isReceived: true },
    { text: "It lets you make videos with React! Check this out...", isReceived: false },
    { text: "This is actually made with code! 🚀", isReceived: false, animationType: 'scale' as AnimationType },
    { text: "That's incredible! 🤯", isReceived: true },
  ];

  // Calculate which messages are visible
  const currentMessageIndex = Math.floor(frame / MESSAGE_ANIMATION_DURATION);
  const messageProgress = (frame % MESSAGE_ANIMATION_DURATION) / MESSAGE_ANIMATION_DURATION;

  // Calculate scroll for each visible message
  const getScrollForMessage = (index: number) => {
    if (!typewriterMode || index < 0) return 0;
    
    const totalHeight = messages.length * MESSAGE_HEIGHT;
    const centerPosition = (index + 0.5) * MESSAGE_HEIGHT;
    const desiredScroll = centerPosition - height / 2;
    return Math.min(Math.max(0, desiredScroll), totalHeight - height);
  };

  // Get current and next scroll positions
  const currentScroll = getScrollForMessage(currentMessageIndex);
  const nextScroll = getScrollForMessage(currentMessageIndex + 1);

  // Interpolate between current and next scroll positions
  const scrollOffset = spring({
    frame,
    fps: 30,
    config: {
      damping: 20,
      mass: 0.5,
    },
  });

  const finalScrollOffset = interpolate(
    scrollOffset,
    [0, 1],
    [-currentScroll, -nextScroll]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'white',
        padding: '20px',
        overflow: 'hidden',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        transform: typewriterMode ? `translateY(${finalScrollOffset}px)` : undefined,
      }}>
        {messages.map((msg, index) => {
          const showMessage = frame >= index * MESSAGE_ANIMATION_DURATION;
          
          return (
            <MessageContainer key={index} show={showMessage}>
              <Message
                text={msg.text}
                isReceived={msg.isReceived}
                delay={index * MESSAGE_ANIMATION_DURATION}
                animationType={msg.animationType}
              />
            </MessageContainer>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default function ScriptWriter() {
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Player
        component={() => <Conversation typewriterMode={true} />}
        durationInFrames={MESSAGE_ANIMATION_DURATION * 8}
        fps={30}
        compositionWidth={375}
        compositionHeight={667}
        style={{
          width: '375px',
          height: '667px',
        }}
        controls
      />
    </div>
  );
}