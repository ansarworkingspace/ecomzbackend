import OrderModel from "../models/Order.model";

// Generate unique order number
export const generateOrderNumber = async (): Promise<string> => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const datePrefix = `ORD${year}${month}${day}`;

  // Find the last order number for today
  const lastOrder = await OrderModel.findOne({
    orderNumber: { $regex: `^${datePrefix}` },
  }).sort({ orderNumber: -1 });

  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
    sequence = lastSequence + 1;
  }

  return `${datePrefix}${sequence.toString().padStart(4, "0")}`;
};
