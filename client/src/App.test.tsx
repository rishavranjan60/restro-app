import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import { getFoods, placeOrder } from "./utils/api";

jest.mock("./utils/api", () => ({
  getFoods: jest.fn(),
  placeOrder: jest.fn(),
}));
jest.mock("./components/BillDownload", () => () => <div>Order receipt</div>);
const menu = [
  {
    _id: "burger",
    name: "Classic Burger",
    category: "Pizza & Burger",
    price: 12,
    type: "Non-Veg",
    description: "Grilled and stacked",
    eta: "15 min",
    quantity: "Full",
  },
  {
    _id: "momo",
    name: "Veg Momo",
    category: "MoMo",
    price: 8,
    type: "Veg",
    description: "Steamed dumplings",
    eta: "10 min",
    quantity: "Full",
  },
];
const mockedGetFoods = getFoods as jest.Mock;
const mockedPlaceOrder = placeOrder as jest.Mock;
beforeEach(() => {
  jest.clearAllMocks();
  mockedGetFoods.mockResolvedValue(menu);
  mockedPlaceOrder.mockResolvedValue({});
});
const openMenu = async () => {
  render(<App />);
  await screen.findByRole("button", {
    name: "Add Classic Burger, full portion",
  });
};
const panel = () => screen.getByRole("complementary");
const fillDetails = () => {
  fireEvent.change(screen.getByLabelText("Your name"), {
    target: { value: "Alex" },
  });
  fireEvent.change(screen.getByLabelText("Phone number"), {
    target: { value: "123456789" },
  });
  fireEvent.change(screen.getByLabelText("Table number"), {
    target: { value: "5" },
  });
};

test("filters live dishes by search, category and diet", async () => {
  await openMenu();
  expect(screen.getByRole("button", { name: "Place order" })).toBeDisabled();
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "dumplings" },
  });
  expect(
    screen.queryByRole("button", { name: "Add Classic Burger, full portion" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Add Veg Momo, full portion" }),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "" } });
  fireEvent.click(screen.getByRole("button", { name: "Veg" }));
  expect(
    screen.queryByRole("button", { name: "Add Classic Burger, full portion" }),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Pizza & Burger/ }));
  expect(screen.getByText("No cravings matched.")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Show all items" }));
  expect(
    screen.getByRole("button", { name: "Add Classic Burger, full portion" }),
  ).toBeInTheDocument();
});

test("keeps half and full quantities separate, with correct totals and removals", async () => {
  await openMenu();
  fireEvent.click(
    screen.getByRole("button", { name: "Add Classic Burger, full portion" }),
  );
  fireEvent.change(screen.getByLabelText("Portion for Classic Burger"), {
    target: { value: "Half" },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Add Classic Burger, half portion" }),
  );
  fireEvent.click(
    screen.getByRole("button", {
      name: "Add one Classic Burger, half portion",
    }),
  );
  expect(within(panel()).getByText("€24.00")).toBeInTheDocument();
  const rows = panel().querySelectorAll(".cart-line");
  expect(
    within(rows[0] as HTMLElement).getByLabelText("Quantity"),
  ).toHaveTextContent("1");
  expect(
    within(rows[1] as HTMLElement).getByLabelText("Quantity"),
  ).toHaveTextContent("2");
  fireEvent.click(
    screen.getByRole("button", {
      name: "Remove one Classic Burger, full portion",
    }),
  );
  expect(
    screen.queryByRole("button", {
      name: "Add one Classic Burger, full portion",
    }),
  ).not.toBeInTheDocument();
  expect(panel().querySelector(".order-total")).toHaveTextContent("€12.00");
});

test("sends selected portions and customer details, then starts a new order", async () => {
  await openMenu();
  fireEvent.change(screen.getByLabelText("Portion for Classic Burger"), {
    target: { value: "Half" },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Add Classic Burger, half portion" }),
  );
  fillDetails();
  fireEvent.click(screen.getByRole("button", { name: "Place order" }));
  expect(await screen.findByText("You’re all set!")).toBeInTheDocument();
  expect(mockedPlaceOrder).toHaveBeenCalledWith({
    name: "Alex",
    phone: "123456789",
    table: "5",
    items: [{ name: "Classic Burger", quantity: 1, price: 6 }],
    total: 6,
  });
  fireEvent.click(screen.getByRole("button", { name: "Start a new order" }));
  expect(screen.getByRole("button", { name: "Place order" })).toBeDisabled();
  expect(screen.getByLabelText("Your name")).toHaveValue("");
});

test("preserves the cart after failed submission and prevents duplicate requests", async () => {
  let rejectOrder: (error: Error) => void = () => {};
  mockedPlaceOrder.mockImplementation(
    () =>
      new Promise((_resolve, reject) => {
        rejectOrder = reject;
      }),
  );
  await openMenu();
  fireEvent.click(
    screen.getByRole("button", { name: "Add Classic Burger, full portion" }),
  );
  fillDetails();
  fireEvent.click(screen.getByRole("button", { name: "Place order" }));
  expect(
    screen.getByRole("button", { name: "Placing your order…" }),
  ).toBeDisabled();
  fireEvent.submit(panel().querySelector("form")!);
  expect(mockedPlaceOrder).toHaveBeenCalledTimes(1);
  rejectOrder(new Error("Offline"));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Your order wasn’t placed",
  );
  expect(panel().querySelector(".order-total")).toHaveTextContent("€12.00");
  expect(screen.getByLabelText("Your name")).toHaveValue("Alex");
});

test("retries loading after an API error", async () => {
  mockedGetFoods.mockRejectedValueOnce(new Error("Offline"));
  render(<App />);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "We couldn’t load the menu",
  );
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  await screen.findByRole("button", {
    name: "Add Classic Burger, full portion",
  });
  expect(mockedGetFoods).toHaveBeenCalledTimes(2);
});

test("shows an honest empty state without fabricated dishes", async () => {
  mockedGetFoods.mockResolvedValue([]);
  render(<App />);
  expect(
    await screen.findByText("The menu is on its way."),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Place order" })).toBeDisabled();
});
