import PropTypes from "prop-types";

function AuthCard({ children }) {
  return (
    <section className="min-h-screen flex items-center  bg-gray-100 justify-center">
      <div className="flex rounded-2xl shadow-2xl max-w-4xl bg-white p-5 m-1 items-center">
        <div className="md:w-1/2 px-8 md:px-14">{children}</div>
        <div className="md:block hidden w-1/2">
          <img
            className="rounded-2xl"
            src="https://res.cloudinary.com/cloudverse/image/upload/v1695133216/CODEVERSE/tspkw9pa4hdxrxwzmsne.jpg"
            alt="Development"
          />
        </div>
      </div>
    </section>
  );
}

AuthCard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthCard;
