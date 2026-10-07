/**
 * Load Razorpay SDK script dynamically
 * @returns {Promise<boolean>} Resolves to true when script is loaded
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if script is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    
    script.onload = () => {
      resolve(true);
    };
    
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

/**
 * Open Razorpay checkout modal
 * @param {Object} options - Razorpay checkout options
 * @param {Function} onSuccess - Success callback
 * @param {Function} onFailure - Failure callback
 * @param {Function} onDismiss - Modal dismiss callback
 */
export const openRazorpayCheckout = (options, onSuccess, onFailure, onDismiss) => {
  if (!window.Razorpay) {
    console.error("Razorpay SDK not loaded");
    onFailure && onFailure(new Error("Razorpay SDK not loaded"));
    return;
  }

  const razorpayOptions = {
    ...options,
    handler: function (response) {
      // Payment successful
      onSuccess && onSuccess(response);
    },
    modal: {
      ondismiss: function () {
        // User closed the modal
        onDismiss && onDismiss();
      },
    },
  };

  const razorpay = new window.Razorpay(razorpayOptions);
  
  razorpay.on("payment.failed", function (response) {
    // Payment failed
    onFailure && onFailure(response.error);
  });

  razorpay.open();
};
