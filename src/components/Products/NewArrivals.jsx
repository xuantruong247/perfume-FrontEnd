import React, { memo, useEffect, useState } from "react";
import { apiGetAllProducts } from "../../apis";
import Slider from "react-slick";
import ItemProduct from "./ItemProduct";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 2,
};

const NewArrivals = () => {
  const [NewArrivals, setNewArrivals] = useState(null);

  const getAllProducts = async () => {
    const response = await apiGetAllProducts({ sort: "createdAt" });
    if (response.data?.products) {
        setNewArrivals(response.data?.products);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <div>
      <div className="w-full">
        <h3 className="font-semibold text-[20px] py-[15px] border-b-2 border-main">
          NEW PRODUCT
        </h3>
      </div>
      <div className="mt-4 mx-[-8px] h-[400px]">
        <Slider {...settings}>
          {NewArrivals?.map((product, index) => (
            <ItemProduct
              key={index}
              pid={product.id}
              productData={product}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default memo(NewArrivals);
