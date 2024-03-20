interface MenuProps {
    onChangeColor: (color: string) => void;
  }
  
  const Menu: React.FC<MenuProps> = ({ onChangeColor }) => {
    const colors = ['red', 'blue', 'green'];
  
    return (
      <div>
        {colors.map(color => (
          <button key={color} onClick={() => onChangeColor(color)} style={{ backgroundColor: color }}>
            {color}
          </button>
        ))}
      </div>
    );
  };
  
  export default Menu;