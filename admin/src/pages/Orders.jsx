import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        setOrders(res.data.orders.slice().reverse());
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch orders"
      );
      console.error(error);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: e.target.value },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchAllOrders();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3 className="font-semibold mb-4">Order Page</h3>

      {orders.map((order) => (
        <div
          key={order._id}
          className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 text-xs sm:text-sm text-gray-700"
        >
          <img src={assets.parcel_icon} className="w-12" alt="parcel" />

          <div>
            {order.items.map((item, i) => (
              <p key={i} className="py-0.5">
                {item.name} x {item.quantity} <span>{item.size}</span>
              </p>
            ))}

            <p className="mb-2 mt-3 font-medium">
              {order.address.firstName} {order.address.lastName}
            </p>

            <p>{order.address.street}</p>
            <p>
              {order.address.city}, {order.address.state},{" "}
              {order.address.country} - {order.address.zipcode}
            </p>
            <p>{order.address.phone}</p>
          </div>

          <div>
            <p>Items : {order.items.length}</p>
            <p className="mt-3">Method : {order.paymentMethod}</p>
            <p>Payment : {order.payment ? "Done" : "Pending"}</p>
            <p>Date : {new Date(order.date).toLocaleString()}</p>
          </div>

          <p className="font-semibold">
            {currency} {order.amount}
          </p>

          <select
            value={order.status}
            className="p-2 font-semibold"
            onChange={(e) => statusHandler(e, order._id)}
          >
            <option>Order Placed</option>
            <option>Packing</option>
            <option>Shipped</option>
            <option>Out for delivery</option>
            <option>Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default Orders;
