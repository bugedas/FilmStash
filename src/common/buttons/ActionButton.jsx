import './ActionButton.scss';

export default function ActionButton({onWhite, children, onClick, sx}) {
    return (
        <button style={{...sx}} className={`action-button ${onWhite && 'on-white'}`} onClick={onClick}>
            {children}
        </button>
    )
}