export const verifyAdmin = (req, _, next) => {
    if (req.user?.role !== "admin"){
        throw new ApiError(403, "Admin access only")
    }
    next()
}