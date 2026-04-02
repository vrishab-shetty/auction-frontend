function App() {
  return (
    <div className="min-h-screen bg-brand-white flex items-center justify-center p-4">
      <div className="bg-brand-primary p-12 rounded-lg shadow-2xl text-center">
        <h1 className="text-5xl font-extrabold text-brand-white mb-6">
          Auction Management System
        </h1>
        <div className="flex justify-center gap-4">
          <button className="bg-brand-secondary text-brand-primary px-6 py-2 rounded font-bold hover:opacity-90 transition">
            Start Bidding
          </button>
          <button className="bg-brand-neutral text-brand-white px-6 py-2 rounded font-bold hover:opacity-90 transition">
            View Auctions
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
