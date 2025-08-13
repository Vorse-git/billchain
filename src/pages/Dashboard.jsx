// src/pages/Dashboard.jsx

// =========================================================================
//  IMPORTS
// =========================================================================
import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../services/dashboardService'; // Service for fetching dashboard data

// UI & Feature Components
import Sidebar from "../components/ui/Sidebar.jsx";
import Navbar from "../components/ui/Navbar.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import Card from "../components/ui/Card.jsx";
import ErrorDisplay from '../components/ui/ErrorDisplay.jsx';
import PieChartComponent from "../components/features/graphics/PieChart.jsx";
import TotalInvoicesIssuedCard from "../components/features/graphics/TotalInvoicesIssuedCard.jsx";
import TotalInvoicesPaymentCard from "../components/features/graphics/TotalInvoicesPaymentCard.jsx";
import BarChartComponent from "../components/features/graphics/BarChartComponent.jsx";
import TableComponent from "../components/features/graphics/TableComponent.jsx";

// =========================================================================
//  HELPER COMPONENTS
// =========================================================================

/**
 * A simple, self-contained loading indicator component.
 * Displayed while the main dashboard data is being fetched.
 */
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full w-full">
      <p className="text-lg text-gray-500">Loading Dashboard...</p>
    </div>
);

// =========================================================================
//  MAIN COMPONENT
// =========================================================================

/**
 * The main Dashboard page.
 * This component acts as an orchestrator, responsible for:
 * 1. Fetching all necessary data for the dashboard from `dashboardService`.
 * 2. Managing the loading and error states for the data fetch.
 * 3. Assembling the page layout with shared components like Sidebar and Navbar.
 * 4. Passing the fetched data down to specialized child components for visualization (charts, tables, etc.).
 */
const Dashboard = () => {


  // =========================================================================
  //  DATA FETCHING EFFECT
  // =========================================================================
  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['dashboardData'], // A unique key for the dashboard data.
    queryFn: getDashboardData,    // The function that fetches the data.
  }); // The empty dependency array `[]` ensures this effect runs only once after the initial render.

  // =========================================================================
  //  RENDER-RELATED DATA
  // =========================================================================
  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
  ];

  // =========================================================================
  //  CONDITIONAL RENDERING: LOADING STATE
  // =========================================================================
  // While data is being fetched, display a loading layout.
  // This prevents the component from trying to render charts with `null` data, which would cause an error.
  if (isLoading || isError) {
    return (
        <div className="flex min-h-screen bg-white">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 flex">
              {isLoading && <LoadingSpinner />}
              {isError && <ErrorDisplay message={error.message} />}
            </main>
          </div>
        </div>
    );
  }
  // 5. ADDED: A final guard clause to ensure dashboardData exists before rendering.
  // This prevents crashes if the API were to return an empty response unexpectedly.
  if (!dashboardData) {
    return (
        <div className="flex min-h-screen bg-white">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 flex">
              <ErrorDisplay message="No data was returned from the server." />
            </main>
          </div>
        </div>
    );
  }

  // =========================================================================
  //  JSX RENDER: MAIN DASHBOARD
  // =========================================================================
  return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-white">
          <Navbar />
          <main className="flex-1">
            <div className="px-6 pb-6">
              <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>


            {/* Page Header */}
            <div className="px-6 py-1 pb-6">
              <h1 className="text-5xl font-bold text-[#1b1b1b]">Hi, Nicolás!</h1>
              <p className="text-gray-500 py-2 text-lg">What are we doing today?</p>
            </div>

            {/* Action Cards Section */}
            <div className="px-6 pb-6 gap-y-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card title="Create Invoice" description="Create invoices from scratch or use a template." link="/createinvoice" image="/Create-invoice.svg" />
              <Card title="Generate Report" description="Download your company's billing report." link="#" image="/Report.svg" />
              <Card title="My Invoices" description="Quickly and easily consult your company's invoices." link="/myinvoices" image="/My-invoices.svg" />
            </div>

            {/* --- Dashboard Metrics Grid --- */}
            {/* Data from the `dashboardData` state is passed as props to the visualization components. */}

            {/* First Row of Metrics: Status Pie Chart, KPI Cards, Pending Payments Table */}
            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <PieChartComponent data={dashboardData.invoicesStatus} />
              <div className="flex flex-col h-full gap-6">
                <TotalInvoicesIssuedCard number={dashboardData.cards.totalInvoicesIssued} />
                <TotalInvoicesPaymentCard number={dashboardData.cards.totalInvoicesPayment} />
              </div>
              <div className="flex flex-col h-full">
                <TableComponent data={dashboardData.pendingPayments} />
              </div>
            </div>

            {/* Second Row of Metrics: Monthly Revenue Bar Chart */}
            <div className="px-6 pb-6 grid grid-cols-1 md:auto gap-6 items-stretch">
              <div className="md:col-span-2 flex flex-col">
                <BarChartComponent data={dashboardData.monthlyRevenue} />
              </div>
            </div>
          </main>
        </div>
      </div>
  );
};

export default Dashboard;