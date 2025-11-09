import React, { useState } from "react";
import placeHolder from "../assets/placeholder.jpg";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import { useDispatch, useSelector } from "react-redux";
import { addNewAdmin } from "../store/slices/userSlice";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";

const AddNewAdmin = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result)
      };
      reader.readAsDefault(file);
      setAvatar(file);
    }
  }

  const handleAddNewAdmin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    dispatch(addNewAdmin(formData));
  };

  return (
    <>
      <h1 className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
        <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
          <div className="p-6">
            <header className="flex justify-between items-center mb-7 pb-5 border-b-[1px] border-black">
              <div className="flex items-center gap-3">
                <img
                  src={keyIcon}
                  alt="key-icon"
                  className="bg-gray-300 p-5 rounded-lg"
                />
                <h3 className="text-left font-bold">Add New Admin</h3>
              </div>
              <img
                src={closeIcon}
                alt="close-icon"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              />
            </header>

            <form onSubmit={handleAddNewAdmin}>
              <div className="flex flex-col items-center mb-6">
                <label htmlFor="avatarInput" className="cursor-pointer">
                  <img src={placeHolder} alt="avatar" className="w-24 h-24 rounded-full object-cover"/>
                  <input type="file" id="avatarInput" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </form>
          </div>
        </div>
      </h1>
    </>
  );
};

export default AddNewAdmin;
