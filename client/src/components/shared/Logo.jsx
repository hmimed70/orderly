import logo from "../../assets/logo.jpg";

function Logo({ text }) {
  return (
    <div className="flex flex-col items-center">
      { text ?  
      <img
        className="w-40 md:w-48 lg:w-56 mb-6"
        src={logo}
        alt="Company Logo"
      /> : <img className="h-32 w-32" src={logo} alt="Company Logo" />
      }
      {/* Text Title */}
      {text && (
        <h1 className="text-xl lg:text-4xl font-semibold text-gray-800 dark:text-gray-200">
          Accès à Nk-Fulfillment
        </h1>
      )}

      {/* Text Description */}
      {text && (
        <p className="text-md lg:text-base mt-2 text-gray-600 dark:text-gray-400 max-w-xs">
          Connectez-vous en saisissant votre nom d'utilisateur et votre mot de
          passe pour accéder à la plateforme.
        </p>
      )}
    </div>
  );
}

export default Logo;
