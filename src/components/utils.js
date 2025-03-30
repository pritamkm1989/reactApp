export const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // Full stars
    const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Half star if the decimal is >= 0.5
    const emptyStars = 5 - fullStars - halfStars; // Remaining empty stars (total stars = 5)

    return (
        <>
            {/* Render Full Stars */}
            {Array(fullStars).fill('⭐').map((_, index) => (
                <span key={`full-${index}`} className="text-yellow-500">⭐</span>
            ))}

            {/* Render Half Stars */}
            {halfStars > 0 && (
                <span className="text-yellow-500">⭐</span>
            )}

            {/* Render Empty Stars */}
            {Array(emptyStars).fill('☆').map((_, index) => (
                <span key={`empty-${index}`} className="text-yellow-500">☆</span>
            ))}
        </>
    );
};