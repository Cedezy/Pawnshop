export const handlePhotoChange = (e, setPreview) => {
    const file = e.target.files?.[0];

    if (!file) {
        setPreview("");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
};
