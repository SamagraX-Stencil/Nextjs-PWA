import React, { useEffect, useState } from "react";
import { cards } from "@component/config/cards";

const FoodCards = () => {
  const [data, setData]: any = useState();

  useEffect(() => {
    setData(cards);
  }, []);

  return (
    <div>
      <div className="bg-green-100 pb-10 pt-6 min-h-screen font-regular ">
        <h1 className="mt-4 mb-8 text-center text-3xl font-bold">Sample Cards</h1>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data && data?.map((card: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-bold mb-2">{card.name}</h2>
              <p className="text-gray-600 mb-4">{card.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  {card.views} Views
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  {card.likes} Likes
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodCards;
