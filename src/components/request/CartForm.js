class CartForm {
    constructor(category, subcategory, type, brand, issueDescription, uploadedImage, street, landmark, city, state, email, mobile) {
        this.category = category;
        this.subcategory = subcategory;
        this.type = type;
        this.brand = brand;
        this.issueDescription = issueDescription;
        this.uploadedImage = uploadedImage;
        this.address = {
            street: street,
            landmark: landmark,
            city: city,
            state: state,
            email: email,
            mobile: mobile
        };
    }

    validate() {
        let errors = [];


        if (!this.category) errors.push({ field: 'category', message: "Category is required" });
        if (!this.subcategory) errors.push({ field: 'subcategory', message: "Subcategory is required" });
        if (!this.type) errors.push({ field: 'type', message: "Service type is required" });
        if (!this.brand) errors.push({ field: 'brand', message: "Brand type is required" });
        if (!this.issueDescription) errors.push({ field: 'issueDescription', message: "Issue description is required" });
        if (!this.address.street) errors.push({ field: 'street', message: "Street is required" });
        if (!this.address.city) errors.push({ field: 'city', message: "City is required" });
        if (!this.address.state) errors.push({ field: 'state', message: "Pin Numbrer is required" });
        if (!this.address.email) errors.push({ field: 'email', message: "Email Id is required" });
        if (!this.address.mobile) errors.push({ field: 'mobile', message: "Mobile Number is required" });
        if (!/\S+@\S+\.\S+/.test(this.address.email)) {
            errors.push({ field: 'email', message: "Invalid Email Id" });
        }

        if (!/^\d{10}$/.test(this.address.mobile)) {
            errors.push({ field: 'mobile', message: "Mobile Number must be 10 digits" });
        }

        if (!/^\d{4}$/.test(this.address.state) && !/^\d{6}$/.test(this.address.state)) {
            errors.push({ field: 'state', message: "PIN must be 4 or 6 digits" });
        }

        return errors;
    }
}

export default CartForm;