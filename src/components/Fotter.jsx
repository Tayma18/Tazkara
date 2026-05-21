import React from 'react'

function Fotter() {
  return (
    <footer className="w-full bg-[#0C0C0C] border-t border-gray-700 py-6 text-center text-sm text-gray-400 ">
      <div className="max-w-6xl mx-auto px-4">
        <p>&copy; 2026 جميع الحقوق محفوظة</p>
        <div className="mt-3 flex justify-center gap-4">
          <a href="#" className="hover:text-red-500 transition">الشروط</a>
          <a href="#" className="hover:text-red-500 transition">الخصوصية</a>
          <a href="#" className="hover:text-red-500 transition">المساعدة</a>
        </div>
      </div>
    </footer>
  )
}

export default Fotter