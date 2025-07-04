
import React from "https://esm.sh/react@18";
import ReactDOM from "https://esm.sh/react-dom@18";
import { useState } from "https://esm.sh/react@18";

function MomentumGame() {
  const allCards = [
    { name: "Handball", type: "momentum", value: 1, color: "red" },
    { name: "Bounce", type: "momentum", value: 1, color: "red" },
    { name: "Kick", type: "momentum", value: 1, color: "red" },
    { name: "Torpedo", type: "momentum", value: 3, color: "red" },
    { name: "Banana", type: "momentum", value: 3, color: "red" },
    { name: "Handball", type: "momentum", value: 1, color: "blue" },
    { name: "Bounce", type: "momentum", value: 1, color: "blue" },
    { name: "Kick", type: "momentum", value: 1, color: "blue" },
    { name: "Torpedo", type: "momentum", value: 3, color: "blue" },
    { name: "Banana", type: "momentum", value: 3, color: "blue" },
  ];

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const [deck, setDeck] = useState(shuffle([...allCards]));
  const [hand, setHand] = useState([]);
  const [chain, setChain] = useState([]);
  const [actionsLeft, setActionsLeft] = useState(3);
  const [colorLock, setColorLock] = useState(null);

  const drawCard = () => {
    if (hand.length < 7 && deck.length > 0) {
      const [card, ...rest] = deck;
      setHand([...hand, card]);
      setDeck(rest);
    }
  };

  const playCard = (card, index) => {
    if (actionsLeft <= 0) return;
    if (colorLock && card.color !== colorLock) return;
    const newHand = [...hand];
    newHand.splice(index, 1);
    setHand(newHand);
    setChain([...chain, card]);
    setActionsLeft(actionsLeft - 1);
    if (!colorLock) setColorLock(card.color);
  };

  const endTurn = () => {
    setActionsLeft(3);
    setColorLock(null);
    while (hand.length < 7 && deck.length > 0) {
      const [card, ...rest] = deck;
      hand.push(card);
      setDeck(rest);
    }
    setHand([...hand]);
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Momentum: The Aussie Rules Card Game</h1>
      <p><strong>Actions Left:</strong> {actionsLeft} | <strong>Colour:</strong> {colorLock || "Any"}</p>
      <button onClick={drawCard}>Draw</button>
      <button onClick={endTurn}>End Turn</button>

      <h2>Your Hand</h2>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {hand.map((card, i) => (
          <div
            key={i}
            onClick={() => playCard(card, i)}
            style={{
              border: `2px solid ${card.color}`,
              padding: "0.5rem",
              cursor: "pointer",
              width: "100px",
              background: "#fff"
            }}
          >
            <strong>{card.name}</strong><br />
            <span style={{ fontSize: "0.85em" }}>{card.type}</span><br />
            {card.value ? `+${card.value}` : ""}
          </div>
        ))}
      </div>

      <h2>Momentum Chain</h2>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {chain.map((card, i) => (
          <div
            key={i}
            style={{
              border: `2px solid ${card.color}`,
              padding: "0.5rem",
              background: "#eef",
              width: "100px"
            }}
          >
            <strong>{card.name}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MomentumGame />);
