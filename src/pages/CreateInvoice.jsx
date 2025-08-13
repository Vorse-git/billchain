/**
 * @file CreateInvoice.jsx
 * @description Page component for creating a new invoice. It orchestrates the form input
 *              and a live preview. The core business logic for form management and submission
 *              is abstracted into the `useInvoiceForm` custom hook.
 * @requires react
 * @requires react-router-dom
 * @requires ../hooks/useInvoiceForm - Custom hook for invoice form logic.
 * @requires react-hot-toast - For displaying user notifications.
 */

// --- React & Routing ---
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
//import CreateInvoiceForm from '../components/forms/CreateInvoiceForm';

// --- Business Logic (Custom Hooks & Constants) ---
import { useInvoiceForm } from '../hooks/useInvoiceForm';
// --- UI Components ---
import Sidebar from "../components/ui/Sidebar.jsx";
import Navbar from "../components/ui/Navbar.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import CreateInvoiceForm from "../components/features/CreateInvoice/CreateInvoiceForm.jsx";
import InvoicePreview from "../components/features/CreateInvoice/InvoicePreview.jsx";
import Button from "../components/ui/Button/Button.jsx";
/**
 * @description SVG icons defined as local components. This is a practical approach for simple,
 *              single-use icons, as it avoids creating separate files for minor assets.
 */
const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const CancelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const InfoIconPlaceholder = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-gray-400 mb-3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
);
/**
 * @description Defines the initial structure and default values for the invoice form.
 *              Using a constant ensures a consistent shape and facilitates form resetting.
 */
const initialFormData = {
    invoiceNumber: "", invoiceDate: null, dueDate: null, validUntil: null,
    estimatedDeliveryDate: null, shippingMethod: "",
    billFrom: { companyName: "", address: "", city: "", phone: "", email: "" },
    billTo: { companyName: "", address: "", city: "", phone: "", email: "" },
    items: [{ description: "", quantity: "", unitPrice: "", total: 0 }],
    subtotal: 0, tax: 0, shipping: 0, discount: 0, totalDue: 0,
    paymentTerms: "", paymentMethods: "",
    bankInfo: { companyName: "", bankName: "", accountNumber: "", routingNumber: "" },
    notes: "",
};

const CreateInvoice = () => {
    // --------------------------------------------------------------------
    // 1. STATE & HOOKS
    // --------------------------------------------------------------------
    const navigate = useNavigate();

    // State specific to this page's UI logic (template selection).

    // The `useInvoiceForm` hook encapsulates all form-related business logic (state, validation, submission).
    // This keeps the `CreateInvoice` component clean and focused on presentation (a "presentational component").
    const {
        formData,
        errors,
        isSaving,
        selectedTemplate,
        sequenceIsLoading,
        handleInputChange,
        handleNestedInputChange,
        handleItemChange,
        handleAddItem,
        handleRemoveItem,
        handleTemplateChange,
        handleSaveInvoice,
    } = useInvoiceForm(initialFormData);

    // --------------------------------------------------------------------
    // 2. UI-SPECIFIC LOGIC & SIDE EFFECTS
    // --------------------------------------------------------------------

    const previewContainerRef = useRef(null); // Ref to measure the preview container's height.
    const [containerHeight, setContainerHeight] = useState('auto'); // State to dynamically set the form container's height.

    // This effect synchronizes the height of the form container with the preview container.
    useEffect(() => {
        const calculateHeight = () => {
            if (previewContainerRef.current) {
                const previewHeight = previewContainerRef.current.offsetHeight;
                // Add a small buffer (+5px) to the height for better visual spacing.
                setContainerHeight(previewHeight > 0 ? previewHeight + 5 : 'auto');
            } else {
                setContainerHeight('auto');
            }
        };

        // A small delay ensures the DOM has rendered fully before we measure it.
        const timerId = setTimeout(calculateHeight, 100);
        window.addEventListener('resize', calculateHeight); // Recalculate on window resize.

        // Cleanup function: essential for preventing memory leaks.
        return () => {
            clearTimeout(timerId);
            window.removeEventListener('resize', calculateHeight);
        };
    }, [selectedTemplate, formData]); // Dependencies: re-run when template or data changes, as this affects preview height.

    // --------------------------------------------------------------------
    // 3. EVENT HANDLERS
    // --------------------------------------------------------------------

    // Handles the cancel action, with a confirmation dialog to prevent accidental data loss.
    const handleCancel = () => {
        if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
            navigate("/dashboard");
        }
    };

    // Wrapper function to call the save logic from the hook.
    // This keeps the component's click handler simple and declarative.
    const onSaveClick = () => {
        handleSaveInvoice();
    };

    // --------------------------------------------------------------------
    // 4. STATIC CONFIGURATION DATA
    // --------------------------------------------------------------------

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "My Invoices", path: "/myinvoices" },
        { label: "Create Invoice", path: "/createinvoice" },
    ];

    const templateOptions = [
        { value: "", label: "Select Invoice Type..." },
        { value: "standard_invoice", label: "Standard Invoice" },
        { value: "proforma_invoice", label: "Proforma Invoice" }
    ];

    // --------------------------------------------------------------------
    // 5. RENDER METHOD (JSX)
    // --------------------------------------------------------------------
    return (
        <div className="flex bg-white min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <div className="px-6 pb-6">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>

                {/* Page Header and Action Buttons */}
                <div className="px-6 py-1 pb-6 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h1 className="text-4xl font-bold text-[#1b1b1b]">Create Invoice</h1>
                        <p className="text-gray-500 py-2 text-lg">Fill out the form to generate a new invoice.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outlined" size="large" startAdornment={<CancelIcon />} onClick={handleCancel} disabled={isSaving}>Cancel</Button>
                        <Button variant="primary" size="large" startAdornment={<SaveIcon />} onClick={onSaveClick} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Invoice'}
                        </Button>
                    </div>
                </div>

                {/* Main Content Area (Form & Preview) */}
                <div className="px-6 pb-6 flex flex-row gap-6 items-start flex-grow overflow-hidden">
                    {/* Left Column: Form */}
                    <div
                        className="flex-1 border border-gray-200 rounded-2xl p-6 overflow-y-auto"
                        style={{ height: typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight }}
                    >
                        <CreateInvoiceForm
                            formData={formData}
                            errors={errors}
                            selectedTemplate={selectedTemplate}
                            templateOptions={templateOptions}
                            sequenceIsLoading={sequenceIsLoading}
                            onTemplateChange={handleTemplateChange}
                            onInputChange={handleInputChange}
                            onNestedInputChange={handleNestedInputChange}
                            onItemChange={handleItemChange}
                            onAddItem={handleAddItem}
                            onRemoveItem={handleRemoveItem}
                        />
                    </div>

                    {/* Right Column: Preview */}
                    <div
                        ref={previewContainerRef}
                        className="w-[500px] flex-shrink-0 px-6 pb-6 pt-6 bg-[#F3F4F4] rounded-2xl"
                    >
                        {/* Conditional rendering: show preview or a placeholder. */}
                        {(selectedTemplate === "standard_invoice" || selectedTemplate === 'proforma_invoice') ? (
                            <>
                                <h2 className="text-xl font-semibold text-[#1b1b1b] mb-4">Invoice Preview</h2>
                                <div className="overflow-auto max-h-[calc(100vh-250px)]">
                                    <InvoicePreview
                                        formData={formData}
                                        selectedTemplate={selectedTemplate}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center min-h-[200px]">
                                <InfoIconPlaceholder />
                                <p className="text-gray-500">
                                    Please select an invoice template <br /> to see a preview.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateInvoice;