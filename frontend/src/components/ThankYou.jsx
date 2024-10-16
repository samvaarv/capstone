import React from "react";
import { Link } from "react-router-dom";

const Thankyou = () => {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-md md:text-4xl font-light mb-8 uppercase tracking-2 md:leading-10">Thank you for booking</h2>
        <p className="uppercase tracking-widest font-extralight">
          Confirmation email has been sent to your email address. Give us 24hr
          to reply you back. Have any questions? Feel free to 
          <Link to="/contact" className="font-semibold hover:underline"> CONTACT US</Link>
        </p>
        <img src="../letter.png" alt="Letter or message image" className="w-1/5 mx-auto mt-8 mb-16" />
        <Link
          to="/homepage"
          className="text-dark text-base border border-dark hover:text-white hover:bg-dark transition py-2 px-7"
        >
          BACK TO HOME
        </Link>
      </section>
    </>
  );
}

export default Thankyou;
