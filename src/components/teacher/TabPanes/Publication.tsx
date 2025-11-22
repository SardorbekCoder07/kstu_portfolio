const Publication = () => {
  return (
    <div>
      <div className="w-full flex justify-end mb-4">
        <button className="px-4 py-2 bg-blue-600 !text-white text-sm rounded-lg hover:bg-blue-700 transition">
          Nashr qo‘shish
        </button>
      </div>
      <div className="flex items-center justify-between w-full p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        {/* Chap qism: Raqam + Sarlavha + Taglar */}
        <div className="flex items-center gap-3">
          {/* Raqam doirasi */}
          <div className="flex items-center justify-center w-8 h-8 text-black text-sm font-bold bg-blue-100 rounded-full">
            1
          </div>

          {/* Matn va taglar */}
          <div className="flex flex-col gap-1.5">
            {/* Sarlavha */}
            <h3 className="text-gray-900 !m-0 font-semibold text-sm leading-tight">
              Uilyam Djems ijodida haqiqiy muammo yechimi
            </h3>

            {/* Qisqa izoh */}
            <p className="text-gray-600 !m-0 text-xs">
              "ISTF" ilmiy-uslubiy jurnal maxsus soni.
            </p>

            {/* Taglar */}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                2025
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                Faqat birinchi muallif
              </span>
            </div>
          </div>
        </div>

        {/* O‘ng qism: PDF yuklash */}
        <div className="flex items-center gap-2 rounded-md bg-blue-200 px-5 py-1.5 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-[12px] font-medium">PDF FAYLI</span>
        </div>
      </div>
    </div>
  );
};

export default Publication;
