import { catchAsyncErrors } from "../Middlewares/catchAsyncError.js";
import ErrorHandler from "../Middlewares/errorMiddlewares.js";
import db from "../models/index.js"
import { calculateFine } from "../utils/fineCalculator.js";

const Borrow = db.borrow;
const Book = db.book;
const User = db.user;

export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const {email} = req.body;
    
    const book = await Book.findByPk(id);
    if(!book) return next(new ErrorHandler("Book not found.", 404));

    const user = await User.findOne({
        where : { email, accountVerified : true, }        
    });
    if(!user) return next(new ErrorHandler("User not found.", 404));

    if(book.quantity === 0) return next(new ErrorHandler("Book not available.", 400));

    const borrowedBooks = user.borrowedBooks || [];
    console.log(borrowedBooks);
    const isAlreadyBorrowed = borrowedBooks.find(
        (b) => String(b.bookId) === String(id) && b.returned === false
    );
    if(isAlreadyBorrowed) return next(new ErrorHandler("Book already borrowed.", 400));
    book.quantity -= 1;
    book.availability = book.quantity > 0;
    await book.save();

    borrowedBooks.push({
        bookId : book.id,
        bookTitle : book.title,
        borrowedDate : new Date(),
        dueDate : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        returned : false,
    });
    user.borrowedBooks = borrowedBooks;
    user.changed('borrowedBooks', true);
    await user.save();

    await Borrow.create({
        user : {
            id : user.id,
            name : user.name,
            email : user.email,
        },
        bookId : book.id,
        dueDate : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        price : book.price,
    });

    res.status(200).json({
        success : true,
        message : "Borrowed book recorded successfully.",
    });
});

export const returnBorrowBook = catchAsyncErrors(async (req, res, next) => {
    const {bookId} = req.params;
    const {email} = req.body;

    const book = await Book.findByPk(bookId);
    if(!book) return next(new ErrorHandler("Book not found.", 404));

    const user = await User.findOne({
        where : { email, accountVerified : true, }
    });
    if(!user) return next(new ErrorHandler("User not found.", 404));

    const borrowedBook = user.borrowedBooks || [];
    const isAlreadyBorrowed = borrowedBook.find(
        (b) => String(b.bookId) === String(bookId) && b.returned === false
    );
    if(!isAlreadyBorrowed)
        return next(new ErrorHandler("You have not borrowed this book.", 400));
    isAlreadyBorrowed.returned = true;
    user.changed('borrowedBooks', true);
    await user.save();

    book.quantity += 1;
    book.availability = book.quantity > 0;
    await book.save();

    const borrow = await Borrow.findOne({
        where : {
            bookId : bookId,
            "user.email" : email,
            returnDate : null,
        },
    });
    if(!borrow) return next(new ErrorHandler("You have not borrowed this book.", 400));
    borrow.returnDate = new Date();
    const fine = calculateFine(borrow.dueDate);
    borrow.fine = fine;
    await borrow.save();

    res.status(200).json({
        success : true,
        message : fine !== 0 ? `This book has been returned successfully. The total charges, including fine, is Rs. ${book.price + fine}` : 
            `This book has been returned successfully. The total charges are Rs. ${book.price}`
    })
});

export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
    const borrowedBooks = req.user.borrowedBooks || [];
    res.status(200).json({
        success : true,
        borrowedBooks,
    })
});

export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
    const borrowedBooks = await Borrow.findAll();
    res.status(200).json({
        success : true,
        borrowedBooks,
    })
});