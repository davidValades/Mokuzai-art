import { sendGAEvent } from "@next/third-parties/google";

interface GaItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}

function toGaItem(item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}): GaItem {
  return {
    item_id: item.id,
    item_name: item.name,
    price: item.price,
    quantity: item.quantity,
  };
}

export function gaAddToCart(item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) {
  sendGAEvent("event", "add_to_cart", {
    currency: "EUR",
    value: item.price * item.quantity,
    items: [toGaItem(item)],
  });
}

export function gaRemoveFromCart(item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) {
  sendGAEvent("event", "remove_from_cart", {
    currency: "EUR",
    value: item.price * item.quantity,
    items: [toGaItem(item)],
  });
}

export function gaBeginCheckout(
  items: { id: string; name: string; price: number; quantity: number }[],
  value: number,
) {
  sendGAEvent("event", "begin_checkout", {
    currency: "EUR",
    value,
    items: items.map(toGaItem),
  });
}

export function gaPurchase(
  items: { id: string; name: string; price: number; quantity: number }[],
  value: number,
  transactionId: string,
) {
  sendGAEvent("event", "purchase", {
    currency: "EUR",
    value,
    transaction_id: transactionId,
    items: items.map(toGaItem),
  });
}
