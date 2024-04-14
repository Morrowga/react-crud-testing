const Button = ({btnBg,btnText, textColor, onClick}) => {
    return (
        <button type="button" onClick={onClick} className={`${btnBg} p-2 w-100 rounded text-sm px-3 text-${textColor}`}>{btnText}</button>
    )
};

export default Button;