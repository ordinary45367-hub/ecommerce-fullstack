import "../Checkout.css";
function ShppingAddress() {
  return (
    <>
      <section className="address-container">
        <div className="address-title">Shipping Address</div>
        <form action="" method="post">
          <label htmlFor="firstName">First name</label>
          <input type="text" name="firstName" id="" />
          <label htmlFor="lastName">Last name</label>
          <input type="text" name="lastName" id="" />
          <div>
            <div className="d-flex">
              <div className="d-flex flex-column">
                <label htmlFor="country">Country</label>
                <input type="text" name="country" id="" />
              </div>
              <div className="d-flex flex-column">
                <label htmlFor="region">Region</label>
                <input type="text" name="region" id="" />
              </div>
            </div>
            <div className="d-flex">
              <div className="d-flex flex-column">
                <label htmlFor="city">City</label>
                <input type="text" name="city" id="" />
              </div>
              <div className="d-flex flex-column">
                <label htmlFor="phone">Phone</label>
                <input type="text" name="phone" id="" />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Continue To Payment
          </button>
        </form>
      </section>
    </>
  );
}
export default ShppingAddress;
