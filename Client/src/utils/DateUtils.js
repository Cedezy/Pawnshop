export const getDaysArray = (year, month) => {
    if (!year || !month) {
        return Array.from({ length: 31 }, (_, i) => i + 1);
    }

    const daysInMonth = new Date(year, month, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};
