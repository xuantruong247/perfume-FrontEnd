import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { InputForm, Loading } from "../../components";
import { useSelector } from "react-redux";
import moment from "moment";
import avatar from "../../assets/image/avatar.png";
import { useDispatch } from "react-redux";
import { apiUpdateCurrent } from "../../apis";
import Swal from "sweetalert2";
import { getCurrent } from "../../redux/user/asyncAction";
import { showModal } from "../../redux/category/categorySlide";
import { useNavigate, useSearchParams } from "react-router-dom";
import path from "../../utils/path";

const Personal = () => {
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
  } = useForm();
  const dispatch = useDispatch();
  const { current } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const naviagate = useNavigate();
  useEffect(() => {
    reset({
      avatar: current?.avatar,
      firstname: current?.firstname,
      lastname: current?.lastname,
      email: current?.email,
      mobile: current?.mobile,
      address: current?.address,
      numberBank: current?.numberBank,
      nameBank: current?.nameBank,
    });
  }, [current]);

  const handleUpdateInfor = async (data) => {
    const formData = new FormData();
    if (data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }
    delete data.avatar;

    for (let i of Object.entries(data)) {
      formData.append(i[0], i[1]);
    }
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    const response = await apiUpdateCurrent(formData);
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
    if (response) {
      dispatch(getCurrent());
      Swal.fire({
        icon: "success",
        text: "Update user successfully!",
      });
      if (searchParams.get("redirect")) {
        naviagate(`/${path.MEMBER}/${path.MY_CART}`);
      } else if (searchParams.get("redirectHistory")) {
        naviagate(`/${path.MEMBER}/${path.HISTORY}`);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...!",
        text: "Something went wrong",
      });
    }
  };
  return (
    <div>
      <h1 className="h-[60px] flex justify-between items-center text-2xl font-bold px-4 border-b border-sky-300">
        <span>Personal</span>
      </h1>
      <form onSubmit={handleSubmit(handleUpdateInfor)}>
        <div className="w-3/5 mx-auto my-4 flex flex-col gap-16">
          <InputForm
            label={"Firstname"}
            register={register}
            fullWidth
            errors={errors}
            id={"firstname"}
            validate={{ required: "Require fill." }}
          />
          <InputForm
            label={"Lastname"}
            register={register}
            fullWidth
            errors={errors}
            id={"lastname"}
            validate={{ required: "Require fill." }}
          />
          <InputForm
            label={"Address"}
            register={register}
            fullWidth
            errors={errors}
            id={"address"}
            validate={{ required: "Require fill." }}
          />
          <InputForm
            label={"Number Bank"}
            register={register}
            fullWidth
            errors={errors}
            id={"numberBank"}
            validate={{ required: "Require fill." }}
          />
          <InputForm
            label={"Name Bank"}
            register={register}
            fullWidth
            errors={errors}
            id={"nameBank"}
            validate={{ required: "Require fill." }}
          />
          <InputForm
            label={"Email address"}
            register={register}
            fullWidth
            errors={errors}
            id={"email"}
            disabled // Thêm thuộc tính disabled vào trường input
            validate={{
              required: "Require fill.",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                message: "invalid email address",
              },
            }}
          />
          <InputForm
            label={"Phone"}
            register={register}
            fullWidth
            errors={errors}
            id={"mobile"}
            type="number"
            validate={{
              required: "Require fill.",
              pattern: {
                value: /^(09|03|07|08|05)+[0-9]{8}$/gi,
                message: "invalid phone number",
              },
            }}
          />
        </div>
        <div className="flex justify-between mt-14 w-3/5 mx-auto">
          <div className="">
            <div className="flex flex-col mx-auto">
              <div className="flex gap-2">
                <span className="font-medium">Account status:</span>
                <span>{current?.isBlocked ? "Blocked" : "Actived"}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="font-medium">Role:</span>
                <span>{current?.role}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="font-medium">Create At:</span>
                <span>{moment(current?.createdAt).fromNow()}</span>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <span className="font-medium">Profile image:</span>
                <label htmlFor="file">
                  <img
                    src={current?.avatar || avatar}
                    alt="avatar"
                    className="w-20 h-20 object-cover rounded-full ml-10 cursor-pointer"
                  />
                </label>
                <input type="file" id="file" hidden {...register("avatar")} />
              </div>
            </div>
          </div>
          <div></div>
        </div>
        {isDirty && (
          <div className="w-full flex justify-center mt-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded"
            >
              Update information
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Personal;
