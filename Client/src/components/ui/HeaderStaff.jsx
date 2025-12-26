import React from 'react'
import logo from '../../assets/logo.png'

const HeaderStaff = () => {
    return (
        <header className="h-40 flex items-center justify-center bg-white border-b border-gray-200">
            <div className="flex items-center gap-4 px-4 sm:px-6">
                
                <img src={logo} alt="Logo" className="h-16 w-16 md:h-28 md:w-28 object-contain rounded-full shadow-lg ring-4 ring-yellow-100" />
                <div className='text-center'>
                    <h2 className="text-xl sm:text-3xl font-extrabold text-gray-700 tracking-tight uppercase">
                        F.A. Pawnshop Management System
                    </h2>
                    <span className='text-sm'>
                        Warlito Pulmones 7016, Pagadian City, Zamboanga del Sur
                    </span>
                </div>
            </div>
        </header>
    )
}

export default HeaderStaff