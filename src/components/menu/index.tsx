interface MenuProps {
  onChangeColor: (color: string) => void;
  setMenuVisible: (isVisible: boolean) => void;
}

const Menu: React.FC<MenuProps> = ({ onChangeColor, setMenuVisible }) => {
  const colors = ["red", "blue", "green"];

  return (
    <div>
      <button
        onClick={() => {setMenuVisible(false)}}
        style={{ float: "right", padding: "5px" }}
      >
        ✖️
      </button>
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onChangeColor(color)}
          style={{
            backgroundColor: color,
            border: "2px solid black",
          }}
        >
          {color}
        </button>
      ))}
    </div>
  );
};

export default Menu;
