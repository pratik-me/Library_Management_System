import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleRecordBookPopup } from "./popUpSlice";

const borrowSlice = createSlice({
    name : "borrow",
    initialState : {
        loading : false,
        error : null,
        userBorrowedBooks : [],
        allBorrowedBooks : [],
        message : null,
    },
    reducers : {
        fetchUserborrowedBooksRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        fetchUserborrowedBooksSuccess(state, action) {
            state.loading = false;
            state.userBorrowedBooks = action.payload;
        },
        fetchUserborrowedBooksFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        recordBookRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        recordBookSuccess(state, action) {
            state.loading = false;
            state.message = action.payload;
        },
        recordBookFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.message = null;
        },

        fetchAllborrowedBooksRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        fetchAllborrowedBooksSuccess(state, action) {
            state.loading = false;
            state.allBorrowedBooks = action.payload;
        },
        fetchAllborrowedBooksFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        returnBookRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        returnBookSuccess(state, action) {
            state.loading = false;
            state.message = action.payload;
        },
        returnBookFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.message = null;
        },

        resetBorrowSlice(state) {
            state.loading = false;
            state.error = null;
            state.message = null;
        }
    }
});

export const fetchUserBorrowedBooks = () => async (dispatch) => {
    dispatch(borrowSlice.actions.fetchUserborrowedBooksRequest());
    await axios.get("http://localhost:4000/api/v1/borrow/my-borrowed-books", {withCredentials : true}).then(res => {
        dispatch(borrowSlice.actions.fetchUserborrowedBooksSuccess(res.data.borrowedBooks));
    }).catch(err => {
        dispatch(borrowSlice.actions.fetchUserborrowedBooksFailed(err.response.data.message));
    })
}

export const fetchAllBorrowedBooks = () => async (dispatch) => {
    dispatch(borrowSlice.actions.fetchAllborrowedBooksRequest());
    await axios.get("http://localhost:4000/api/v1/borrow/borrowed-books-by-users", {withCredentials : true}).then(res => {
        dispatch(borrowSlice.actions.fetchAllborrowedBooksSuccess(res.data.borrowedBooks));
    }).catch(err => {
        dispatch(borrowSlice.actions.fetchAllborrowedBooksFailed(err.response.data.message));
    })
}

export const recordBorrowBooks = (email, id) => async (dispatch) => {
    dispatch(borrowSlice.actions.recordBookRequest());
    await axios.post(`http://localhost:4000/api/v1/borrow/record-borrow-book/${id}`, {email}, {
        withCredentials : true,
        headers : {
            "Content-Type" : "application/json",
        }
    }).then(res => {
        dispatch(borrowSlice.actions.recordBookSuccess(res.data.message));
        dispatch(toggleRecordBookPopup())
    }).catch(err => {
        dispatch(borrowSlice.actions.recordBookFailed(err.response.data.message));
    });
}

export const returnBook = (email, id) => async (dispatch) => {
    dispatch(borrowSlice.actions.returnBookRequest());
    await axios.put(`http://localhost:4000/api/v1/borrow/return-borrowed-book/${id}`, {email}, {
        withCredentials : true,
        headers : {
            "Content-Type" : "application/json"
        },
    }).then(res => {
        dispatch(borrowSlice.actions.returnBookSuccess(res.data.message))
    }).catch(err => {
        dispatch(borrowSlice.actions.returnBookFailed(err.response.data.message));
    })
};

export const resetBorrowSlice = () => (dispatch) => {
    dispatch(borrowSlice.actions.resetBorrowSlice());
};

export default borrowSlice.reducer