import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to {{PROJECT_NAME}}
          </h1>
          <p className="text-gray-600 mb-6">
            Your Electron app is ready to go! Start building something amazing.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              <strong>TypeScript:</strong> {{TYPESCRIPT}}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Tailwind CSS:</strong> {{TAILWIND}}
            </p>
            <p className="text-sm text-gray-500">
              <strong>React Router:</strong> {{ROUTER}}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;