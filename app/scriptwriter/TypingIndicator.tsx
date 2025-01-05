import { useCurrentFrame } from 'remotion';
import { GRAY_BUBBLE } from './styles';

const TypingIndicator = () => {
    const frame = useCurrentFrame();

    return (
        <div style={{
            ...GRAY_BUBBLE,
            width: 'auto',
            padding: '0.8rem 1.2rem',
            opacity: 1,
            transform: `scale(1)`,
        }}>
            <div style={{
                display: 'flex',
                gap: '0.4rem',
                height: '1.2rem',
                alignItems: 'center',
            }}>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: '0.8rem',
                            height: '0.8rem',
                            borderRadius: '50%',
                            backgroundColor: '#86868B',
                            opacity: frame % 60 > i * 20 ? 1 : 0.4,
                            transition: 'opacity 0.2s',
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default TypingIndicator;
