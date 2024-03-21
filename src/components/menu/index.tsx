import styles from './menu.module.css';

interface MenuProps {
  onChangeColor: (color: string) => void;
  setMenuVisible: (isVisible: boolean) => void;
}

const Menu: React.FC<MenuProps> = ({ onChangeColor, setMenuVisible }) => {
    const colors = ["SkyBlue", "DodgerBlue", "Turquoise", "SteelBlue" ];

  return (
    <div className={styles.menuContainer}>
      <button
        className={styles.closeButton}
        onClick={() => setMenuVisible(false)}
      >
        ✖️
      </button>
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onChangeColor(color)}
          className={styles.colorButton}
          style={{ backgroundColor: color }}
        >
          {color}
        </button>
      ))}
    </div>
  );
};

export default Menu;
