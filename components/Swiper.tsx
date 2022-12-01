import Image from 'next/image'
import React from 'react'
import left from '../public/left.jpg'
import right from '../public/right.jpg'
import s from './Swiper.module.css'
import { data } from './data'

const Swiper = () => {

  return (
    <div className={s.container} >

        <div className={s.slideContainer} >

            {data?.map((item, index)=>(
                <div key={index} className={s.slide}>

                    <div>
                        <Image src={item[0]} alt="" />
                    </div>

                    <p className={s.textSlide} >
                        {item[1]}
                    </p>

                </div>
            ))}

        </div>

        <div>
            <button>
                <Image src={left} alt="" />
            </button>
            <button>
                <Image src={right} alt="" />
            </button>
        </div>
        
    </div>
  )
}

export default Swiper