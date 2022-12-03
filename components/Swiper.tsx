import Image from 'next/image'
import React, { useRef } from 'react'
import left from '../public/left.svg'
import right from '../public/right.svg'
import s from './Swiper.module.css'
import { data } from './data'

const Swiper = () => {

    const swiperRef = useRef<HTMLDivElement | null>(null)

    const handleNext = ()=>{
        if(swiperRef.current && swiperRef.current.children.length > 0){

            const firstChild = swiperRef.current.children[0]

            swiperRef.current.style.transition = `all 0.3s ease-out`

            const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth

            swiperRef.current.style.transform = `translateX(-${childWidth}px)`

            const transition = ()=>{
                if(swiperRef.current){
                    swiperRef.current.style.transition = `none`
                    swiperRef.current.style.transform = `translateX(0px)`
                    swiperRef.current.appendChild(firstChild)

                    swiperRef.current.removeEventListener('transitionend', transition)
                }
            }

            swiperRef.current.addEventListener('transitionend', transition)

        }
    }
    
    const handlePrev = ()=>{
        if(swiperRef.current && swiperRef.current.children.length > 0){

            const lastChildIndex = swiperRef.current.children.length - 1
            
            const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth
            
            const lastChild = swiperRef.current.children[lastChildIndex]

            swiperRef.current.insertBefore(lastChild, swiperRef.current.firstChild)

            swiperRef.current.style.transition = 'none'
            swiperRef.current.style.transform = `translateX(-${childWidth}px)`

            setTimeout(()=>{
                if(swiperRef.current){
                    swiperRef.current.style.transition = `all 0.3s ease-out`
                    swiperRef.current.style.transform = `translateX(0px)`
                }
            },0)

        }
    }

  return (
    <div className={s.container} >

        <div className={s.slideContainer} ref={swiperRef} >

            {data?.map((item, index)=>(
                <div key={index} className={s.slide}>

                    <Image src={item[0]} alt="" quality={100} />

                    <p className={s.textSlide} >
                        {item[1]}
                    </p>

                </div>
            ))}

        </div>

        <div className={s.controlsContainer} >
            <button onClick={handlePrev}>
                <Image src={left} alt="" />
            </button>
            <button onClick={handleNext}>
                <Image src={right} alt="" />
            </button>
        </div>
        
    </div>
  )
}

export default Swiper