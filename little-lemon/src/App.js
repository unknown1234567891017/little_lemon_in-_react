import React, { useState, useEffect } from "react";
import "./App.css";

/*
  Little Lemon - single-file app
  - Menu categories: Burgers, Pizza, Desserts
  - Booking form with simple availability check
  - Reservations stored in localStorage under "little-lemon-reservations"
  - All components are inside this single file (as requested)
*/

const DEFAULT_MENU = [
  {
    id: "burgers",
    title: "Burgers",
    items: [
      { id: "b1", name: "Classic Beef Burger", desc: "Beef patty, lettuce, tomato, cheese", price: 650 },
      { id: "b2", name: "Spicy Chicken Burger", desc: "Crispy chicken, spicy mayo, pickles", price: 560 },
      { id: "b3", name: "Veggie Burger", desc: "House veg patty, lettuce, tomato", price: 480 }
    ]
  },
  {
    id: "pizza",
    title: "Pizza",
    items: [
      { id: "p1", name: "Margherita", desc: "Tomato, fresh mozzarella, basil", price: 900 },
      { id: "p2", name: "Peri Peri Chicken", desc: "Chicken, peri peri sauce, onions", price: 1150 },
      { id: "p3", name: "Seafood Special", desc: "Prawns, calamari, herbs", price: 1500 }
    ]
  },
  {
    id: "desserts",
    title: "Desserts",
    items: [
      { id: "d1", name: "Gulab Jamun", desc: "Traditional syrup-soaked sweet", price: 220 },
      { id: "d2", name: "Chocolate Brownie", desc: "Warm brownie with ice cream", price: 350 },
      { id: "d3", name: "Kulfi", desc: "Traditional ice cream", price: 200 }
    ]
  }
];

const STORAGE_KEY = "little-lemon-reservations";

function Header() {
  return (
    <header className="ll-header">
      <div className="container">
        <h1>Little Lemon</h1>
        <p className="tagline">Book a table • Explore our Pakistani-style menu</p>
      </div>
    </header>
  );
}

function Menu({ menu, onAddToCart }) {
  const [active, setActive] = useState(menu[0]?.id || "");

  return (
    <section className="menu container">
      <h2>Our Menu</h2>
      <nav className="menu-tabs">
        {menu.map((cat) => (
          <button
            key={cat.id}
            className={`tab ${active === cat.id ? "active" : ""}`}
            onClick={() => setActive(cat.id)}
            aria-pressed={active === cat.id}
          >
            {cat.title}
          </button>
        ))}
      </nav>

      <div className="menu-list">
        {menu.map((cat) =>
          cat.id === active ? (
            <div key={cat.id} className="category">
              <h3>{cat.title}</h3>
              <div className="items">
                {cat.items.map((it) => (
                  <article key={it.id} className="menu-item">
                    <div>
                      <h4>{it.name}</h4>
                      <p className="desc">{it.desc}</p>
                    </div>
                    <div className="menu-item-right">
                      <div className="price">Rs {it.price}</div>
                      <button onClick={() => onAddToCart(it)} className="btn small">Add</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </section>
  );
}

function BookingForm({ onBook, existingReservations, capacity = 8 }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setMessage(null);
  }, [name, date, time, guests, phone]);

  function reset() {
    setName("");
    setDate("");
    setTime("");
    setGuests(2);
    setPhone("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !date || !time || !phone.trim()) {
      setMessage({ type: "error", text: "Please fill name, date, time and phone." });
      return;
    }

    // Check availability: count reservations at same date & time
    const sameSlot = existingReservations.filter(
      (r) => r.date === date && r.time === time
    );

    if (sameSlot.length >= capacity) {
      setMessage({ type: "error", text: `No tables available at ${date} ${time}. Try another time.` });
      return;
    }

    const reservation = {
      id: Date.now().toString(),
      name: name.trim(),
      date,
      time,
      guests: Number(guests),
      phone: phone.trim()
    };

    onBook(reservation);
    setMessage({ type: "success", text: "Reservation confirmed!" });
    reset();
  }

  return (
    <section className="booking container">
      <h2>Book a Table</h2>
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="row">
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
          </label>
          <label>
            Phone
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03xx-xxxxxxx" />
          </label>
        </div>

        <div className="row">
          <label>
            Date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label>
            Time
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>

        <div className="row">
          <label>
            Guests
            <input type="number" min="1" max="20" value={guests} onChange={(e) => setGuests(e.target.value)} />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn">Reserve Table</button>
        </div>

        {message && (
          <div className={`message ${message.type === "error" ? "error" : "success"}`}>
            {message.text}
          </div>
        )}
      </form>
      <p className="small-note">Tip: capacity per time slot is {capacity} tables (simple demo check)</p>
    </section>
  );
}

function ReservationsList({ reservations, onDelete }) {
  if (!reservations.length) {
    return (
      <section className="container reservations">
        <h2>Your Reservations</h2>
        <p>No reservations yet.</p>
      </section>
    );
  }

  return (
    <section className="container reservations">
      <h2>Your Reservations</h2>
      <ul>
        {reservations.map((r) => (
          <li key={r.id} className="reservation">
            <div>
              <strong>{r.name}</strong> — {r.date} at {r.time} — {r.guests} guests
              <div className="phone">📞 {r.phone}</div>
            </div>
            <div>
              <button className="btn small danger" onClick={() => onDelete(r.id)}>Cancel</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Footer() {
  return (
    <footer className="ll-footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Little Lemon — Simple booking demo</p>
      </div>
    </footer>
  );
}

export default function App() {
  const [menu] = useState(DEFAULT_MENU);
  const [cart, setCart] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // load reservations from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setReservations(JSON.parse(stored));
    } catch (err) {
      console.error("Error reading reservations:", err);
    }
  }, []);

  useEffect(() => {
    // persist reservations
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    } catch (err) {
      console.error("Error saving reservations:", err);
    }
  }, [reservations]);

  function handleAddToCart(item) {
    setCart((c) => [...c, item]);
  }

  function handleBook(reservation) {
    setReservations((r) => [reservation, ...r]);
  }

  function handleDeleteReservation(id) {
    setReservations((r) => r.filter((x) => x.id !== id));
  }

  return (
    <div className="App">
      <Header />

      <main>
        <Menu menu={menu} onAddToCart={handleAddToCart} />

        <section className="container cart">
          <h2>Your Order</h2>
          {cart.length === 0 ? (
            <p>No items added yet. Click "Add" on the menu.</p>
          ) : (
            <div className="cart-list">
              {cart.map((it, idx) => (
                <div key={idx} className="cart-item">
                  <div>{it.name}</div>
                  <div>Rs {it.price}</div>
                </div>
              ))}
              <div className="cart-total">
                <strong>Total:</strong> Rs {cart.reduce((s, i) => s + i.price, 0)}
              </div>
              <div className="cart-actions">
                <button className="btn" onClick={() => { setCart([]); alert("Order cleared (demo)."); }}>Clear Order</button>
              </div>
            </div>
          )}
        </section>

        <BookingForm onBook={handleBook} existingReservations={reservations} capacity={8} />

        <ReservationsList reservations={reservations} onDelete={handleDeleteReservation} />
      </main>

      <Footer />
    </div>
  );
}