import React, { useCallback, useEffect, useState } from "react";
import {
  apiDeleteProduct,
  apiGetAllProducts,
  apiHiddenProduct,
} from "../../../apis";
import { formatMoney } from "../../../utils/helpers";
import moment from "moment";
import { InputOptions, Pagination } from "../../../components";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import UpdateProduct from "./UpdateProduct";
import Swal from "sweetalert2";
import { sortByQuantity } from "../../../utils/contants";
import path from "../../../utils/path";

const ManageProduct = () => {
  const [params] = useSearchParams();
  const [q, setQ] = useState("");
  const [mapProduct, setMapProduct] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editProduct, setEditProduct] = useState(null);
  const [update, setUpdate] = useState(false);
  const [sort, setSort] = useState("");
  const navigate = useNavigate();

  const render = useCallback(() => {
    setUpdate(!update);
  }, update);

  const fetchGetProducts = async (params) => {
    const page = Number(params.page) || 1;
    const pageSize = Number(params.pageSize) || 12;
    const sortValue = sort || "createdAt";
    const response = await apiGetAllProducts({
      params,
      sort: sortValue,
      page,
      pageSize,
    });
    setMapProduct(response.data.products);
    setFilterProduct(response.data.products);
    setTotalCount(response.data.counts);
  };

  useEffect(() => {
    fetchGetProducts(params);
  }, [params, update]);

  useEffect(() => {
    const filtered = mapProduct.filter((product) => {
      return product.title.toLowerCase().includes(q);
    });
    setFilterProduct(filtered);
  }, [q, mapProduct]);

  const handleDeleteProduct = async (pid) => {
    Swal.fire({
      title: "Are you sure...",
      text: "Are you ready remove this product?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiHiddenProduct(pid);
        if (response) {
          Swal.fire({
            icon: "success",
            text: response.data.deletedProduct,
          });
          render();
        }
      }
    });
  };
  const changeValue = useCallback(
    (value) => {
      setSort(value);
    },
    [sort]
  );
  useEffect(() => {
    if (sort) {
      navigate({
        pathname: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
        search: createSearchParams({
          sort,
        }).toString(),
      });
    }
  }, [sort]);

  return (
    <div className="w-full relative">
      {editProduct && (
        <div className="absolute inset-0 bg-sky-100 h-[1900px]">
          <UpdateProduct
            setEditProduct={setEditProduct}
            editProduct={editProduct}
            render={render}
          />
        </div>
      )}
      <h1 className="h-[60px] flex justify-between items-center text-2xl font-bold px-4 border-b border-sky-300">
        <span>Manage Products</span>
      </h1>
      <div className="w-full p-4">
        <div className="flex justify-between items-center px-10">
          <div className="w-full">
            <InputOptions
              value={sort}
              changeValue={changeValue}
              Options={sortByQuantity}
            />
          </div>
          <div className="flex justify-end p-1">
            <input
              type="text"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
              }}
              placeholder="Search..."
              className="px-4 py-2 rounded-sm my-2 border w-[500px] outline-none placeholder:text-sm placeholder:italic"
            />
          </div>
        </div>
        <form>
          <table className="table text-left w-full mb-3 border-b border-sky-300">
            <thead className="bg-sky-500 text-white border text-[15px] rounded-sm">
              <tr>
                <th className="px-4 py-2">Order</th>
                <th className="px-4 py-2">Avatar</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Brand</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Sold</th>
                <th className="px-4 py-2">Ratings</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterProduct?.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    <img
                      src={item.avatar}
                      alt="avatar"
                      className="w-12 h-12 object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">
                    {item.title.length > 20
                      ? `${item.title.slice(0, 20)}...`
                      : item.title}
                  </td>

                  <td className="px-4 py-2">{item.brand.title}</td>
                  <td className="px-4 py-2">{item.category.title}</td>
                  <td className="px-4 py-2">{`${formatMoney(
                    item.price
                  )} VND`}</td>
                  <td className="px-4 py-2 text-center">{item.quantity}</td>
                  <td className="px-4 py-2 text-center">{item.sold}</td>
                  <td className="px-4 py-2 text-center">{item.totalRatings}</td>
                  <td className="px-4 py-2">
                    {moment(item.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-2 flex mt-4 ">
                    <div
                      onClick={() => {
                        setEditProduct(item);
                      }}
                      className="cursor-pointer bg-green-500 hover:bg-green-700 text-white px-3 py-2 rounded mr-3 flex justify-center items-center"
                    >
                      Edit
                    </div>

                    <div
                      onClick={() => {
                        handleDeleteProduct(item._id);
                      }}
                      className="cursor-pointer bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded"
                    >
                      Delete
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
        <div className="w-full flex justify-center items-center">
          <Pagination totalCount={totalCount} />
        </div>
      </div>
    </div>
  );
};

export default ManageProduct;
