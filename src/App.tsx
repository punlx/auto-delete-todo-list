import { useState, useRef, useEffect } from 'react';
import './App.css';
import { data } from './constants';

interface Item {
  id: number;
  name: string;
  type: 'Fruit' | 'Vegetable';
}

const initialData: Item[] = data.map((item, index) => ({
  ...item,
  id: index,
}));

function App() {
  const [mainList, setMainList] = useState<Item[]>(initialData);
  const [fruitList, setFruitList] = useState<Item[]>([]);
  const [vegetableList, setVegetableList] = useState<Item[]>([]);

  const timeoutsRef = useRef<Record<number, number>>({});

  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  const moveItemBackToMain = (item: Item) => {
    if (timeoutsRef.current[item.id]) {
      clearTimeout(timeoutsRef.current[item.id]);
      delete timeoutsRef.current[item.id];
    }

    if (item.type === 'Fruit') {
      setFruitList((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      setVegetableList((prev) => prev.filter((i) => i.id !== item.id));
    }

    setMainList((prev) => [...prev, item]);
  };

  const moveItemToColumn = (item: Item) => {
    setMainList((prev) => prev.filter((i) => i.id !== item.id));

    if (item.type === 'Fruit') {
      setFruitList((prev) => [...prev, item]);
    } else {
      setVegetableList((prev) => [...prev, item]);
    }

    const timeoutId = setTimeout(() => {
      moveItemBackToMain(item);
    }, 5000);

    timeoutsRef.current[item.id] = timeoutId;
  };

  const handleClick = (item: Item, from: 'main' | 'fruit' | 'vegetable') => {
    if (from === 'main') {
      moveItemToColumn(item);
    } else {
      moveItemBackToMain(item);
    }
  };
  const renderList = (list: Item[], from: 'main' | 'fruit' | 'vegetable') => {
    return list.map((item) => (
      <div
        key={item.id}
        onClick={() => handleClick(item, from)}
        style={{
          cursor: 'pointer',
          border: '1px solid #ccc',
          marginBottom: '4px',
          padding: '6px',
          borderRadius: '4px',
          textAlign: 'center',
        }}
      >
        {item.name}
      </div>
    ));
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'space-between',
        padding: '16px',
      }}
    >
      {/* Main List */}
      <div style={{ flex: 1 }}>
        <h3>Main List</h3>
        {renderList(mainList, 'main')}
      </div>

      {/* Fruit Column */}
      <div style={{ flex: 1 }}>
        <h3>Fruit</h3>
        {renderList(fruitList, 'fruit')}
      </div>

      {/* Vegetable Column */}
      <div style={{ flex: 1 }}>
        <h3>Vegetable</h3>
        {renderList(vegetableList, 'vegetable')}
      </div>
    </div>
  );
}

export default App;
