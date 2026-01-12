import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) setList(res.data.products);
      else toast.error(res.data.message);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const removeProduct = async (id) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchList();
      } else toast.error(res.data.message);
    } catch {
      toast.error("Failed to remove product");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-3 font-semibold">All Products</p>

      {list.map((item) => (
        <div
          key={item._id}
          className="grid grid-cols-5 gap-2 items-center border p-2"
        >
          <img
            className="w-12"
            src={item.image?.[0] || ""}
            alt={item.name}
          />
          <p>{item.name}</p>
          <p>{item.category}</p>
          <p>
            {currency}
            {item.price}
          </p>
          <button
            onClick={() => removeProduct(item._id)}
            className="text-red-500"
          >
            X
          </button>
        </div>
      ))}
    </>
  );
};

export default List;
