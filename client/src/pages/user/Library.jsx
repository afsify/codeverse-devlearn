import { useEffect, useState } from "react";
import { listOrder } from "../../api/services/userService";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../utils/alertSlice";
import UserLayout from "../../components/layout/UserLayout";

function Library() {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch(showLoading());
        const response = await listOrder();
        dispatch(hideLoading());
        const orderData = response.data.data;
        setOrders(orderData);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  return (
    <UserLayout>
      <div className="container mx-auto mt-5 p-2">
        <h1 className="text-2xl font-semibold mb-4">Your Library</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
              <img
                src={order.image}
                alt={order.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{order.title}</h2>
                <p className="text-gray-600">{order.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-lg font-semibold text-green-500">
                    ₹{order.price}
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 p-3 border-t border-gray-200">
                <p className="text-gray-600">Videos:</p>
                <ul className="pl-4">
                  {order.videos.map((video, index) => (
                    <li key={index} className="text-blue-500 hover:underline">
                      <a href={video} target="_blank" rel="noopener noreferrer">
                        Video {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}

export default Library;
