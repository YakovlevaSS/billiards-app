interface MenuProps {
    onChangeColor: (color: string) => void;
  }
  
  const Menu: React.FC<MenuProps> = ({ onChangeColor }) => {
    const colors = ['red', 'green', 'blue', 'yellow'];
  
    return (
      <div>
        {colors.map((color, index) => (
          <button key={index} onClick={() => onChangeColor(color)}>
            {color}
          </button>
        ))}
      </div>
    );
  };
  
  export default Menu;