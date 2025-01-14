const RadioButton = ({ label, description, icon, checked, onChange }) => {
    return (
        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
            <input
                type="radio"
                className="appearance-none h-6 w-6 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                checked={checked}
                value={label}
                onChange={onChange}
            />
            <div className="flex items-center">
                {icon && <span className="mr-2">{icon}</span>}
                <div>
                    <div className="text-sm">{label}</div>
                    {description && <div className="text-xs text-gray-500">{description}</div>}
                </div>
            </div>
        </label>
    );
};

export default RadioButton;