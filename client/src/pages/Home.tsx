import React, { useCallback, useEffect, useRef, useState } from "react";
import { CartItem, Category, FoodItem } from "../types/types";
import MenuIcon from "../components/MenuIcon";
import CategoryFilter from "../components/CategoryFilter";
import FoodItemCard, { formatPrice } from "../components/FoodItemCard";
import Cart, { cartItemKey } from "../components/Cart";
import BillDownload from "../components/BillDownload";
import { placeOrder, getFoods } from "../utils/api";

const Home: React.FC = () => {
  const [category, setCategory] = useState<Category>("All");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuError, setMenuError] = useState("");
  const [orderError, setOrderError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [table, setTable] = useState("");
  const [search, setSearch] = useState("");
  const [diet, setDiet] = useState("All");
  const [announcement, setAnnouncement] = useState("");
  const [quantitySelection, setQuantitySelection] = useState<
    Record<string, "Full" | "Half">
  >({});
  const sending = useRef(false);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setMenuError("");
    try {
      const data = await getFoods();
      if (!Array.isArray(data)) throw new Error("Invalid menu response");
      setFoodItems(data);
    } catch {
      setMenuError("We couldn’t load the menu. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const categories: Category[] = [
    "All",
    ...Array.from(new Set(foodItems.map((item) => item.category))),
  ];
  const filtered = foodItems.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      (diet === "All" || item.type === diet) &&
      `${item.name} ${item.description || ""} ${item.category}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
  );
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0,
  );
  const count = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

  const addToCart = (item: FoodItem) => {
    if (orderPlaced || sending.current) return;
    const id = item._id || item.id!;
    const quantity = quantitySelection[id] || "Full";
    const entry: CartItem = {
      ...item,
      quantity,
      price: quantity === "Half" ? item.price / 2 : item.price,
      cartQuantity: 1,
    };
    setCart((prev) =>
      prev.some((p) => cartItemKey(p) === cartItemKey(entry))
        ? prev.map((p) =>
            cartItemKey(p) === cartItemKey(entry)
              ? { ...p, cartQuantity: p.cartQuantity + 1 }
              : p,
          )
        : [...prev, entry],
    );
    setAnnouncement(
      `${item.name}, ${quantity.toLowerCase()} portion added to your order.`,
    );
    setOrderError("");
  };
  const changeQuantity = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          cartItemKey(item) === key
            ? { ...item, cartQuantity: item.cartQuantity + delta }
            : item,
        )
        .filter((item) => item.cartQuantity > 0),
    );
  };
  const clearCart = () => {
    setCart([]);
    setOrderPlaced(false);
    setOrderError("");
    setName("");
    setPhone("");
    setTable("");
    setAnnouncement("");
  };
  const confirmOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.length || sending.current) return;
    if (!name.trim() || !phone.trim() || !table.trim()) {
      setOrderError("Please fill in your name, phone number and table number.");
      return;
    }
    sending.current = true;
    setSubmitting(true);
    setOrderError("");
    try {
      await placeOrder({
        name: name.trim(),
        phone: phone.trim(),
        table: table.trim(),
        items: cart.map((item) => ({
          name: item.name,
          quantity: item.cartQuantity,
          price: item.price,
        })),
        total,
      });
      setOrderPlaced(true);
      setAnnouncement("Your order has been placed successfully.");
    } catch {
      setOrderError(
        "Your order wasn’t placed. Please try again; your cart is still here.",
      );
    } finally {
      sending.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div className="menu-app">
      <header className="site-header">
        <a href="#menu" className="brand" aria-label="Restro home">
          <span className="brand-mark" aria-hidden="true">
            r.
          </span>
          <span>
            restro<span className="brand-dot">.</span>
          </span>
        </a>
        <nav className="header-nav" aria-label="Main navigation">
          <a href="#menu" className="current">
            Our menu
          </a>
          <a href="#order">Your order</a>
        </nav>
        <a href="#order" className="header-cart">
          <MenuIcon name="bag" size={16} /> <span>Your order</span>
          <b>{count}</b>
        </a>
      </header>
      <main className="page-layout">
        <div className="menu-column">
          <section className="menu-hero" aria-labelledby="hero-heading">
            <div className="hero-copy">
              <p className="eyebrow">
                <span /> BIG FLAVOURS. HAPPY TABLES.
              </p>
              <h1 id="hero-heading">
                A little hungry?
                <br />
                <em>Go big on flavour.</em>
              </h1>
              <p>
                Your favourites, freshly prepared.
                <br />
                Find your next craving and make it a meal.
              </p>
              <a href="#menu" className="primary-button">
                Explore the menu <span aria-hidden="true">→</span>
              </a>
              <div className="hero-note">
                <span aria-hidden="true">✦</span> Pick it. Order it. Enjoy it.
              </div>
            </div>
            <div className="hero-art">
              <span className="hero-ring" />
              <img
                src="/images/menu-burger.svg"
                alt="Illustration of a stacked burger with cheese, lettuce and tomato"
              />
              <span className="flavour-stamp">
                STACKED
                <br />
                <b>WITH</b>
                <br />
                FLAVOUR
              </span>
              <span className="hero-spark spark-one" aria-hidden="true">
                ✦
              </span>
              <span className="hero-spark spark-two" aria-hidden="true">
                ✦
              </span>
            </div>
          </section>
          <div className="service-strip">
            <span>
              <b aria-hidden="true">♨</b> Freshly prepared
            </span>
            <span>
              <b aria-hidden="true">◷</b> Made to order
            </span>
            <span>
              <b aria-hidden="true">♡</b> Something for everyone
            </span>
          </div>
          <section
            id="menu"
            className="menu-section"
            aria-labelledby="menu-heading"
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">FIND YOUR FAVOURITE</p>
                <h2 id="menu-heading">
                  The good stuff<span>.</span>
                </h2>
              </div>
              <label className="search-box">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  aria-label="Search menu"
                  placeholder="What are you craving?"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
            </div>
            <CategoryFilter
              selected={category}
              onChange={setCategory}
              categories={categories}
            />
            <div className="menu-toolbar">
              <p>
                {loading
                  ? "Preparing your menu…"
                  : `${filtered.length} ${filtered.length === 1 ? "item" : "items"} to choose from`}
              </p>
              <div
                className="diet-filters"
                role="group"
                aria-label="Dietary preference"
              >
                {["All", "Veg", "Non-Veg"].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={diet === value}
                    className={diet === value ? "selected" : ""}
                    onClick={() => setDiet(value)}
                  >
                    {value === "All" ? "All food" : value}
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <div className="menu-state" role="status">
                <span className="loading-spinner" /> Bringing the menu to your
                table…
              </div>
            ) : menuError ? (
              <div className="menu-state" role="alert">
                <h3>Just a little pause.</h3>
                <p>{menuError}</p>
                <button
                  type="button"
                  className="primary-button"
                  onClick={loadMenu}
                >
                  Try again
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="menu-state">
                <h3>
                  {foodItems.length
                    ? "No cravings matched."
                    : "The menu is on its way."}
                </h3>
                <p>
                  {foodItems.length
                    ? "Try another search or browse all our dishes."
                    : "No dishes are available yet. Please check back shortly."}
                </p>
                {foodItems.length > 0 && (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                      setSearch("");
                      setCategory("All");
                      setDiet("All");
                    }}
                  >
                    Show all items
                  </button>
                )}
              </div>
            ) : (
              <div className="food-grid">
                {filtered.map((item) => (
                  <FoodItemCard
                    key={item._id || item.id}
                    item={item}
                    portion={quantitySelection[item._id || item.id!] || "Full"}
                    onPortionChange={(quantity) =>
                      setQuantitySelection((prev) => ({
                        ...prev,
                        [item._id || item.id!]: quantity,
                      }))
                    }
                    onOrder={addToCart}
                    disabled={orderPlaced || submitting}
                  />
                ))}
              </div>
            )}
          </section>
          <footer className="menu-footer">
            <span className="footer-brand">restro.</span>
            <p>Good food. Good company. Great choices.</p>
            <a href="#menu">Back to menu ↑</a>
          </footer>
        </div>
        <aside
          id="order"
          className="order-panel"
          aria-labelledby="order-heading"
        >
          <div className="order-heading">
            <div>
              <p className="eyebrow">LET’S MAKE IT A MEAL</p>
              <h2 id="order-heading">
                Your order<span>.</span>
              </h2>
            </div>
            <span className="order-count">{count}</span>
          </div>
          <div className="dine-in">
            <MenuIcon name="utensils" size={24} />
            <div>
              <b>Dine-in</b>
              <p>Fresh from our kitchen to your table</p>
            </div>
          </div>
          {orderPlaced ? (
            <div className="order-success">
              <span aria-hidden="true">✓</span>
              <h3>You’re all set!</h3>
              <p>
                Your order is in. Sit back and get ready for something
                delicious.
              </p>
              <BillDownload
                cart={cart}
                total={total}
                name={name}
                phone={phone}
                table={table}
              />
              <button
                type="button"
                className="primary-button"
                onClick={clearCart}
              >
                Start a new order
              </button>
            </div>
          ) : (
            <>
              <Cart
                cart={cart}
                onIncrement={(key) => changeQuantity(key, 1)}
                onDecrement={(key) => changeQuantity(key, -1)}
                onClear={clearCart}
                disabled={submitting}
              />
              <div className="order-total">
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <form className="checkout-form" onSubmit={confirmOrder}>
                <fieldset disabled={submitting}>
                  <legend>Your table details</legend>
                  <label>
                    Your name
                    <input
                      autoComplete="name"
                      required
                      placeholder="e.g. Alex"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <div className="details-row">
                    <label>
                      Phone number
                      <input
                        type="tel"
                        autoComplete="tel"
                        required
                        placeholder="Your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </label>
                    <label>
                      Table number
                      <input
                        required
                        placeholder="e.g. 05"
                        value={table}
                        onChange={(e) => setTable(e.target.value)}
                      />
                    </label>
                  </div>
                </fieldset>
                {orderError && (
                  <p role="alert" className="order-error">
                    {orderError}
                  </p>
                )}
                <button
                  className="checkout-button"
                  type="submit"
                  disabled={!cart.length || submitting}
                >
                  {submitting ? "Placing your order…" : "Place order"}
                  <span aria-hidden="true">→</span>
                </button>
                <p className="checkout-note">
                  {cart.length
                    ? "Prepared after you place your order."
                    : "Add something delicious to get started."}
                </p>
              </form>
            </>
          )}
        </aside>
      </main>
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
      {count > 0 && (
        <a href="#order" className="mobile-cart">
          <span>
            {count} {count === 1 ? "item" : "items"} · {formatPrice(total)}
          </span>
          <b>View order →</b>
        </a>
      )}
    </div>
  );
};
export default Home;
