/**
 * @file invoiceService.js
 * @description This service module handles all API interactions related to invoices.
 *              It encapsulates Axios configuration, data transformation logic, and
 *              CRUD operations, providing a clean interface for the UI components.
 * @author Your Name/Team
 */

// ============================================================================
// IMPORTS
// ============================================================================
import { getCurrentUserToken } from './authService';
import apiClient from '../api/axiosClient';
// This constant provides a mapping between frontend-friendly template names and backend-expected enum values.
import { mapFormTypeToApiType } from '../constants/invoiceConstants';

/**
 * @description A pre-configured Axios instance for all API calls.
 *              Centralizing this configuration makes it easy to manage base URLs,
 *              headers, and interceptors across the entire application.
 */

// ============================================================================
// DATA TRANSFORMATION LOGIC
// ============================================================================

/**
 * Transforms the frontend form data into the specific JSON structure expected by the backend API.
 * This function is CRITICAL as it acts as an "Adapter" or "Translator" layer, decoupling the
 * frontend's data model from the backend's DTO (Data Transfer Object).
 * @param {object} formData - The raw data object from the `useInvoiceForm` hook.
 * @param {string} selectedTemplate - The template key selected by the user (e.g., 'standard_invoice').
 * @returns {object} The transformed payload ready to be sent to the API.
 * @throws {Error} If an invalid template type is provided.
 */

export const reserveInvoiceSequence = async () => {
    try {
        const token = await getCurrentUserToken();

        if (!token) {
            throw new Error("Acción no autorizada. Por favor, inicie sesión.");
        }

        const response = await apiClient.post(
            '/invoices/reserve-global-sequence',
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        handleApiError(error, 'reserveInvoiceSequence');
    }
};
const transformFormDataForApi = (formData, selectedTemplate) => {
    const {
        billFrom, billTo, items, tax, shipping, discount, paymentMethods, bankInfo,
        ...commonFields
    } = formData;

    // Convert the frontend template key to the backend's expected enum string (e.g., 'STANDARD').
    const apiTemplateType = mapFormTypeToApiType(selectedTemplate);
    if (!apiTemplateType) {
        throw new Error("Invalid template type selected. Cannot create payload.");
    }

    // --- 1. Map common fields to the backend's `CreateInvoiceInput` DTO ---
    const payload = {
        // Mapping: Frontend `invoiceNumber` corresponds to backend `id`.
        id: commonFields.invoiceNumber,
        template_type: apiTemplateType,
        // Ensure dates are formatted as 'YYYY-MM-DD' and handle null values gracefully.
        issue_date: commonFields.invoiceDate ? new Date(commonFields.invoiceDate).toISOString().split('T')[0] : null,

        issuer: {
            company_name: billFrom.companyName,
            address: billFrom.address,
            // Mapping: Combine city/state/zip into a single field as expected by the backend.
            city_state_zip: billFrom.city,
            phone_number: billFrom.phone,
            email: billFrom.email,
        },
        client: {
            company_name: billTo.companyName,
            address: billTo.address,
            city_state_zip: billTo.city,
            phone_number: billTo.phone,
            email: billTo.email,
        },
        items: items
            // Filter out any empty items the user might have added but not filled in.
            .filter(item => item.description && item.description.trim() !== "")
            .map(item => ({
                description: item.description,
                quantity: parseFloat(item.quantity) || 0,
                // Mapping: Frontend `unitPrice` corresponds to backend `unit_price`.
                unit_price: parseFloat(item.unitPrice) || 0,
            })),

        // Ensure numeric fields are correctly parsed as numbers.
        tax_percentage: parseFloat(tax) || 0,
        shipping: parseFloat(shipping) || 0,
        discount: parseFloat(discount) || 0,
        payment_methods: paymentMethods, // This is already a string in the form, so it maps directly.
        specific_data: {}, // This will be populated based on the template type.
    };

    // --- 2. Map template-specific data into the `specific_data` field ---
    let specificDataObject = {};
    if (apiTemplateType === 'STANDARD') {
        specificDataObject = {
            due_date: commonFields.dueDate ? new Date(commonFields.dueDate).toISOString().split('T')[0] : null,
            payment_terms: commonFields.paymentTerms,
            notes: commonFields.notes,
            payment_info: {
                bank_name: bankInfo.bankName,
                account_number: bankInfo.accountNumber,
                routing_number: bankInfo.routingNumber,
            }
        };
    } else if (apiTemplateType === 'PROFORMA') {
        specificDataObject = {
            valid_until: commonFields.validUntil ? new Date(commonFields.validUntil).toISOString().split('T')[0] : null,
            payment_terms: commonFields.paymentTerms,
            // Mapping: Proforma notes map to `additional_terms` in the backend.
            additional_terms: commonFields.notes,
            shipping_info: {
                estimated_delivery_date: commonFields.estimatedDeliveryDate ? new Date(commonFields.estimatedDeliveryDate).toISOString().split('T')[0] : null,
                shipping_method: commonFields.shippingMethod,
                // Note: The backend expects `shipping_address`, which is not in our form. We send an empty string.
                shipping_address: ""
            }
        };
    }

    // Assign the populated specific data object directly to the payload.
    payload.specific_data = specificDataObject;

    return payload;
};


// ============================================================================
// API SERVICE FUNCTIONS (CRUD OPERATIONS)
// ============================================================================

/**
 * Centralized error handler for API calls. It extracts the most relevant
 * error message and logs the full error for debugging.
 * @param {Error} error - The error object caught from Axios.
 * @param {string} context - The name of the function where the error occurred (for logging).
 * @throws {Error} Throws a new, cleaner error to be caught by the UI layer.
 */
const handleApiError = (error, context) => {
    const errorMessage =
        error.response?.data?.message || // Prefer a structured message from the backend
        error.response?.data?.error ||   // Fallback to a generic error field
        error.message ||                 // Fallback to the Axios error message
        `An unexpected error occurred in ${context}.`;

    console.error(`API Service Error - ${context}:`, error.response || error);
    throw new Error(errorMessage);
};

// --- CREATE ---
/**
 * Creates a new invoice by transforming form data and sending it to the API.
 * @param {object} formData - The raw data from the form.
 * @param {string} selectedTemplate - The key for the selected template.
 * @returns {Promise<object>} The data of the newly created invoice from the API.
 */
export const createInvoice = async (formData, selectedTemplate) => {
    try {
        const apiPayload = transformFormDataForApi(formData, selectedTemplate);
        console.log("CREATE Payload Sent to API:", JSON.stringify(apiPayload, null, 2)); // Useful for debugging
        const response = await apiClient.post('/invoices', apiPayload);
        return response.data;
    } catch (error) {
        handleApiError(error, 'createInvoice');
    }
};

// --- READ (Single) ---
/**
 * Fetches a single invoice by its ID.
 * @param {string} invoiceId - The ID of the invoice to retrieve.
 * @returns {Promise<object>} The invoice data.
 */
export const getInvoiceById = async (invoiceId) => {
    try {
        const response = await apiClient.get(`/invoices/${invoiceId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, 'getInvoiceById');
    }
};

// --- READ (All) ---
/**
 * Fetches a list of all invoices, with an optional filter for status.
 * @param {string} [status] - Optional status to filter invoices (e.g., 'Paid', 'Pending').
 * @returns {Promise<Array<object>>} A list of invoices.
 */
export const getInvoices = async (status) => {
    try {
        const params = status ? { status } : {};
        const response = await apiClient.get('/invoices', { params });
        return response.data;
    } catch (error) {
        handleApiError(error, 'getInvoices');
    }
};

// --- UPDATE ---
/**
 * Updates an existing invoice.
 * @param {string} invoiceId - The ID of the invoice to update.
 * @param {object} updateData - An object containing only the fields to be updated (e.g., { status: 'Paid' }).
 * @returns {Promise<object>} The updated invoice data.
 */
export const updateInvoice = async (invoiceId, updateData) => {
    try {
        // Note: Update payloads are often simpler and may not need the full transformation.
        const response = await apiClient.put(`/invoices/${invoiceId}`, updateData);
        return response.data;
    } catch (error) {
        handleApiError(error, 'updateInvoice');
    }
};

// --- DELETE ---
/**
 * Deletes an invoice by its ID.
 * @param {string} invoiceId - The ID of the invoice to delete.
 * @returns {Promise<object>} A confirmation message.
 */
export const deleteInvoice = async (invoiceId) => {
    try {
        await apiClient.delete(`/invoices/${invoiceId}`);
        return { message: "Invoice deleted successfully" };
    } catch (error) {
        handleApiError(error, 'deleteInvoice');
    }
};