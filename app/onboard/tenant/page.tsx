import TenantProtectedRoute from "../../components/guard/TenantProtectedRoute";
import TenantDashboardScreen from "../../components/dashboard/tenant/TenantDashboardScreen";

const Page = () => {
  return (
    <div>
      <TenantProtectedRoute>
        <TenantDashboardScreen />
      </TenantProtectedRoute>
    </div>
  );
};

export default Page;
