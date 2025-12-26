export const handleNumberChange = (e, setter) => {
    let value = e.target.value;

    // allow only numbers and dot
    value = value.replace(/[^0-9.]/g, "");

    // allow only one dot
    const parts = value.split(".");
    if (parts.length > 2) {
        value = parts[0] + "." + parts[1];
    }

    const [integerPart, decimalPart] = value.split(".");

    // add comma separators
    const formattedInt = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
    );

    setter(
        decimalPart !== undefined
            ? `${formattedInt}.${decimalPart}`
            : formattedInt
    );
};
