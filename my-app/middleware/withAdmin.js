import { useAuth } from '../context/AuthContext';

const withAdmin = (Component) => {
  return (props) => {
    const { user } = useAuth();

    if (!user) {
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4 text-white">Access Denied</h1>
          <p className="text-white">You need to be logged in to access this feature.</p>
        </div>
      );
    }

    if (!user.isAdmin) { // Assuming `isAdmin` is a property on the user object
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4 text-white">Feature in Progress</h1>
          <p className="text-white">This feature is in progress. Please check back later.</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default withAdmin;
