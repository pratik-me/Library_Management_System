class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if(err.code === 11000) {      // Will be used if we found two same values
        const statusCode = 400;
        const message = "Duplicate Field Value Entered"
        err = new ErrorHandler(message, statusCode);
    }

    if(err.name === "JSONWebTokenError") {
        const statusCode = 400;
        const message = "JSON Web Token is invalid. Try Again!!!";
        err = new ErrorHandler(message, statusCode);
    }

    if(err.name === "TokenExpiredError") {
        const statusCode = 400;
        const message = "JSON Web Token is invalid. Try Again!!!";
        err = new ErrorHandler(message, statusCode);
    }

    if(err.name === "CastError") {
        const statusCode = 400;
        const message = `Resource Not Found. Invalid : ${err.path}`;
        err = new ErrorHandler(message, statusCode);
    }

    // If there's more than one error then we will return a string containing all those errors separated by space
    const errorMessage = err.errors ? Object.values(err.errors).map((error => error.message)).join(" ") : err.message;

    return res.status(err.statusCode).json({
        success : false,
        message : errorMessage,
    })
}

export default ErrorHandler;