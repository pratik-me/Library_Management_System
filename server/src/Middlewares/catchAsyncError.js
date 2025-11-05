export const catchAsyncErrors = (func) => {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next)).catch(next);   // Run func(req, res, next) If error run next
    }
}