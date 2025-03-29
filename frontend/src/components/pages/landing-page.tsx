import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>WorkSync | Internal Login</title>
        <meta name="description" content="WorkSync internal platform login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-3xl font-bold text-[#E31937]">Work</span>
            <span className="text-3xl font-bold text-gray-900">Sync</span>
          </div>
          <button className="bg-[#E31937] hover:bg-[#c01731] text-white font-medium py-2 px-6 rounded-md transition-colors">
            Login
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Simplifying Hybrid Workplaces
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Streamline Office Supply Management for Your Hybrid Team
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              A centralized platform that connects remote and in-office employees to efficiently manage supplies, maintenance requests, and suggestions.
            </p>
          </div>
          
          <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Login to WorkSync</h2>            
            <div className="mt-6 text-center text-sm text-gray-500">
              Need help? Contact <a href="mailto:it@company.com" className="text-[#E31937] hover:text-[#c01731]">IT Support</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}