import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Sidebar from "../layout/SideBar";
import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import MyborrowedBooks from "../components/MyBorrowedBooks";
import Users from "../components/Users";

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponenet, setSelectedComponenet] = useState("");

  const {user, isAuthenticated} = useSelector(state => state.auth);

  // if(!isAuthenticated) {
  //   return <Navigate to={"/login"}/>
  // }

  return (
    <>
      <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
        <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center bg-black rounded-md h-9 w-9 text-white">
          <GiHamburgerMenu className="text 2xl" onClick={() => setIsSideBarOpen(!isSideBarOpen)}/>
        </div>
        <Sidebar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} setSelectedComponent={setSelectedComponenet}/>

        {
          (
            () => {
              switch (selectedComponenet) {
                case "Dashboard":
                  return user?.role === "User" ? (
                    <UserDashboard />
                  ) : (
                    <AdminDashboard />
                  )
                  break;
                case "Books" :
                  return <BookManagement />
                  break;
                case "Catalog" :
                  if(user.role === "Admin") return <Catalog />
                  break;
                case "Users" :
                  if(user.role === "Admin") return <Users />
                  break;
                  case "My Borrowed Books" :
                    if(user.role === "Admin") return <MyborrowedBooks />
                    break;
                default :
                  return user?.role === "User" ? (
                    <UserDashboard />
                  ) : (
                    <AdminDashboard />
                  );
                  break;
              }
            }
          )()
        }
      </div>
    </>
  )
};

export default Home;
