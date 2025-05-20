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

export function statusComponent({ status }: { status: string }) {
    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'promoted':
                return styles.promoted;
            case 'completed':
                return styles.completed;
            case 'failed':
                return styles.failed;
            case 'dropout':
                return styles.dropout;
            default:
                return {};
        }
    };

    return (
        <span style={{
            ...styles.finalResultStatus,
            ...getStatusStyle(status)
        }}>
            {status}
        </span>
    )

}