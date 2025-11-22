const Control = () => {
  return (
    <div>
      <div className="w-full flex justify-end mb-4">
        <button className="px-4 py-2 bg-blue-600 !text-white text-sm rounded-lg hover:bg-blue-700 transition">
          Nazorat qo‘shish
        </button>
      </div>

      <div className="flex items-start justify-between w-full p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 text-black text-sm font-bold bg-purple-100 rounded-full">
            1
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-gray-800 !m-0 font-semibold text-sm leading-tight">
              Aziziddin Nasafiy “Insoni komil” asarining falsafiy tahlili
            </p>

            <p className="text-gray-600 !m-0 text-xs">
              Tadqiqotchi:{" "}
              <span className="font-medium">
                Xasanova Shoxida Sadriddinovna
              </span>
            </p>

            <p className="text-gray-500 !m-0 text-xs italic">
              Universitet:{" "}
              <span className="font-medium">Andijon davlat universiteti</span>
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
              <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                2025
              </span>
              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                Usta
              </span>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                Milliy
              </span>
              <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                Nazoratchi
              </span>
              <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                Tugallandi
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-md bg-blue-200 px-5 py-1.5 text-blue-600 hover:text-blue-800 cursor-pointer transition">
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

export default Control;
