import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import path from "../../utils/path";
import Swal from "sweetalert2";

const FinalRegister = () => {
  const { status } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (status === "failed") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Đăng ký không thành công",
      }).then(() => {
        navigate(`/${path.LOGIN}`);
      });
    }
    if (status === "success") {
      Swal.fire({
        icon: "success",
        text: "Register is successfully. Please go login~",
      }).then(() => {
        navigate(`/${path.LOGIN}`);
      });
    }
  }, []);

  return <div className="h-screen w-screen bg-gray-100"></div>;
};

export default FinalRegister;
