const styles = {
    finalResultStatus: {
        fontFamily: '"Roboto", sans-serif',
        fontWeight: 700,
        fontSize: '14px',
        textTransform: 'capitalize' as const,
    },
    promoted: {
        color: '#277314',
    },
    completed: {
        color: '#277314',
    },
    failed: {
        color: '#D64D4D',
    },
    dropout: {
        color: '#D64D4D',
    },
};

export function statusComponent({ option }: { option: { style: { color: string }, label: string, value: string } }) {

    return (
        <span style={{
            ...styles.finalResultStatus,
            ...option?.style
        }}>
            {option.label}
        </span>
    )

}