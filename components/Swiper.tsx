import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import left from '../public/left.svg'
import right from '../public/right.svg'
import s from './Swiper.module.css'
import { data } from './data'

const Swiper = () => {

    const animationTime: number = 3000
    const transitionTime: string = '0.3s'

    const swiperRef = useRef<HTMLDivElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const intervalIDRef = useRef<NodeJS.Timer | null>(null)

    const handleNext = ()=>{
        if(swiperRef.current && swiperRef.current.children.length > 0){

            const firstChild = swiperRef.current.children[0]

            swiperRef.current.style.transition = `all ${transitionTime} ease-out`

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
                    swiperRef.current.style.transition = `all ${transitionTime} ease-out`
                    swiperRef.current.style.transform = `translateX(0px)`
                }
            },0)

        }
    }

    // //Automatic Change
    // useEffect(()=>{

    //     if(intervalIDRef.current){
    //         clearInterval(intervalIDRef.current)
    //     }

    //     intervalIDRef.current = setInterval(()=>{
    //         handleNext()
    //     }, animationTime)
    
    //     return ()=> {
    //         if(intervalIDRef.current){
    //             clearInterval(intervalIDRef.current)
    //         }
    //     }

    // },[])

    // //clear interval when hover - OPTIONAL
    // useEffect(()=>{
    //     swiperRef.current?.addEventListener('mouseenter', ()=>{
    //         if(intervalIDRef.current)
    //         clearInterval(intervalIDRef.current)
    //     })
    //     swiperRef.current?.addEventListener('mouseleave', ()=>{
    //         intervalIDRef.current = setInterval(()=>{
    //             handleNext()
    //         }, animationTime)
    //     })

    //     //This will stop the animation if the window get blur to stop the animation when the user is not in the website. (Avoids Bugs).
    //     window.addEventListener('blur', ()=>{
    //         if(intervalIDRef.current)
    //         clearInterval(intervalIDRef.current)
    //     })
    //     window.addEventListener('focus', ()=>{
    //         if(intervalIDRef.current)
    //         clearInterval(intervalIDRef.current)
    //         intervalIDRef.current = setInterval(()=>{
    //             handleNext()
    //         }, animationTime)
    //     })
    
    //     return ()=> {
    //         //Remove clear interval when hover
    //         swiperRef.current?.removeEventListener('mouseenter', ()=>{
    //             if(intervalIDRef.current)
    //             clearInterval(intervalIDRef.current)
    //         })
    //         swiperRef.current?.removeEventListener('mouseleave', ()=>{
    //             intervalIDRef.current = setInterval(()=>{
    //                 handleNext()
    //             }, animationTime)
    //         })
    //         window.removeEventListener('blur', ()=>{
    //             if(intervalIDRef.current)
    //             clearInterval(intervalIDRef.current)
    //         })
    //         window.removeEventListener('focus', ()=>{
    //             if(intervalIDRef.current)
    //             clearInterval(intervalIDRef.current)
    //             intervalIDRef.current = setInterval(()=>{
    //                 handleNext()
    //             }, animationTime)
    //         })
    //     }
    // },[])
    
    useEffect(()=>{

        let isDragStart = false
        let prevPageX: number
        let prevScrollLeft: number
        let positionDiff:number

        const autoSlide = ()=>{

        }

        const dragStart = (e: any)=>{
            isDragStart = true

            prevPageX = e.pageX || e.touches[0].pageX
            if(containerRef.current)
            prevScrollLeft = containerRef.current.scrollLeft
        }

        const dragStop = ()=>{
            isDragStart = false
            autoSlide()
        }

        const dragging = (e:any)=>{
            if(containerRef.current && isDragStart){
                positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX

                console.log(prevScrollLeft - positionDiff)
                containerRef.current.scrollLeft = prevScrollLeft - positionDiff
            }
        }

        if(swiperRef.current && containerRef.current){
            if(window.innerWidth < 1000){
                swiperRef.current.addEventListener('touchmove',dragging)
                containerRef.current.addEventListener('touchstart',dragStart)
                containerRef.current.addEventListener('touchend',dragStop)
            }else{
                swiperRef.current.addEventListener('mousemove',dragging)
                containerRef.current.addEventListener('mousedown',dragStart)
                containerRef.current.addEventListener('mouseup',dragStop)
            }
        }
    },[])

  return (
    <>
        <div className={s.container} ref={containerRef} >

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
        </div>

        <div className={s.controlsContainer} >
            <button onClick={handlePrev}>
                <Image src={left} alt="" />
            </button>
            <button onClick={handleNext}>
                <Image src={right} alt="" />
            </button>
        </div>
    </>

  )
}

export default Swiper