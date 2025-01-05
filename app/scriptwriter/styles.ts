
export const BASE_SIZE = '2.8rem';

export const MESSAGE_STYLE = {
    padding: '1.4rem 1.8rem',
    borderRadius: '2.4rem',
    maxWidth: '70%',
    marginBottom: '0.4rem',
    fontSize: BASE_SIZE,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    lineHeight: 1.2,
    position: 'relative' as const,
};

export const BLUE_BUBBLE = {
    ...MESSAGE_STYLE,
    backgroundColor: '#0A84FF',
    color: 'white',
    marginLeft: 'auto',
    marginRight: '5%',
};

export const GRAY_BUBBLE = {
    ...MESSAGE_STYLE,
    backgroundColor: '#E9E9EB',
    color: 'black',
    marginRight: 'auto',
    marginLeft: '5%',
};

export const MESSAGE_GROUP_STYLE = {
    marginBottom: '1.6rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.2rem',
};

export const TIME_STYLE = {
    fontSize: '1.6rem',
    color: '#86868B',
    marginBottom: '2.4rem',
    marginTop: '1.2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    textAlign: 'center' as const,
};

export const DELIVERED_STYLE = {
    fontSize: '1.4rem',
    color: '#86868B',
    textAlign: 'right' as const,
    marginRight: '7%',
    marginTop: '0.4rem',
};