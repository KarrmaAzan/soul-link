// define props for the action button

type ActionButtonProps = {
    //function that runs when the button is clicked
    onClick: () => void;
};

// floating action button component

function ActionButton({onClick}: ActionButtonProps) {
    return (
        <button className="action-button" onClick={onClick}>
            +
        </button>
    );
}

export default ActionButton;