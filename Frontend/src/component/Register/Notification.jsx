const Notification = ({ showSuccess, apiError }) => (
    <>
        {showSuccess && (
            <div className="fixed top-6 right-6 z-50">
                <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in-down transition-transform duration-500">
                    <span>🎉</span> Registration successful! Redirecting...
                </div>
            </div>
        )}
        {apiError && (
            <div className="fixed top-6 right-6 z-50">
                <div className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in-down transition-transform duration-500">
                    <span>❌</span> {apiError}
                </div>
            </div>
        )}
    </>
);
export  default  Notification;