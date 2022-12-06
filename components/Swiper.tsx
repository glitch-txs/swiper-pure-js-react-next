import Image from 'next/image'
import React, { use, useEffect, useRef, useState } from 'react'
import left from '../public/left.svg'
import right from '../public/right.svg'
import s from './Swiper.module.css'
import { data } from './data'

const Swiper = () => {

    const animationTime: number = 3000
    const transitionTime: string = '0.3s'

    //IMPORTANT. Number of Slides will generate the width of the slideContainer
    const numberOfSlides: number = data.length

    //The number by which the width of the slide will be divided by to decide where to move when dragging stops.
    const offsetPresition: number = 3

    const swiperRef = useRef<HTMLDivElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const intervalIDRef = useRef<NodeJS.Timer | null>(null)

    const [inView, setInView] = useState<boolean>(false)
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    function getTranslateX(myElement: HTMLDivElement) {
        const style = window.getComputedStyle(myElement)
        const matrix = new WebKitCSSMatrix(style.transform)
        return matrix.m41
    }

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
            if(currentIndex == swiperRef.current.children.length - 1){
                setCurrentIndex(0)
            } else {
                setCurrentIndex(prev => prev + 1)
            }
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
            if(currentIndex == 0){
                setCurrentIndex(swiperRef.current.children.length - 1)
            } else {
                setCurrentIndex(prev => prev - 1)
            }
        }
    }

    const handleGoTo = (index: number)=>{
        if(currentIndex == index){
            return
        }else if(currentIndex < index){
        //Goes fordward
            if(swiperRef.current && swiperRef.current.children.length > 0){

                const IndexDif = index - currentIndex

                swiperRef.current.style.transition = `all ${transitionTime} ease-out`

                const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth

                swiperRef.current.style.transform = `translateX(-${childWidth * (IndexDif)}px)`

                const transition = ()=>{
                    if(swiperRef.current){
                        swiperRef.current.style.transition = `none`
                        swiperRef.current.style.transform = `translateX(0px)`
                        for(let i = 0; i < IndexDif; i++){
                            const firstChild = swiperRef.current.children[0]
                            swiperRef.current.appendChild(firstChild)
                        }

                        swiperRef.current.removeEventListener('transitionend', transition)
                    }
                }

                swiperRef.current.addEventListener('transitionend', transition)
                    setCurrentIndex(index)
            }
        }else if(currentIndex > index){
        //Goes backward
        if(swiperRef.current && swiperRef.current.children.length > 0){

            const IndexDif = currentIndex - index

            const lastChildIndex = swiperRef.current.children.length - 1
            
            const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth
            
            for(let i = 0; i < IndexDif; i++){
                const lastChild = swiperRef.current.children[lastChildIndex]
                swiperRef.current.insertBefore(lastChild, swiperRef.current.firstChild)
            }

            swiperRef.current.style.transition = 'none'
            swiperRef.current.style.transform = `translateX(-${childWidth * IndexDif}px)`

            setTimeout(()=>{
                if(swiperRef.current){
                    swiperRef.current.style.transition = `all ${transitionTime} ease-out`
                    swiperRef.current.style.transform = `translateX(0px)`
                }
            },0)
            setCurrentIndex(index)
        }
        }
    }

    //Trigger when component is in View
    useEffect(()=>{
        setInView(false)
        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[])=>{
            if(entries[0].isIntersecting){
                setInView(true)
            } else {
                return
            }
        },{ threshold: 0.6, })

        if(containerRef.current)
        observer.observe(containerRef.current)

        return ()=> {
            if(containerRef.current)
            observer.unobserve(containerRef.current)
        }
    },[])

    //Automatic Change - OPTIONAL
    // useEffect(()=>{

    //     if(intervalIDRef.current){
    //         clearInterval(intervalIDRef.current)
    //     }

    //     if(inView){
    //         intervalIDRef.current = setInterval(()=>{
    //             handleNext()
    //         }, animationTime)
        
    //         //This will stop the animation if the window get blur to stop the animation when the user is not in the website. (Avoids Bugs).
    //         window.addEventListener('blur', ()=>{
    //             if(intervalIDRef.current)
    //             clearInterval(intervalIDRef.current)
    //         })
    //         window.addEventListener('focus', ()=>{
    //             if(intervalIDRef.current)
    //             clearInterval(intervalIDRef.current)
    //             intervalIDRef.current = setInterval(()=>{
    //                 handleNext()
    //             }, animationTime)
    //         })
    //     } else {
    //         if(intervalIDRef.current){
    //             clearInterval(intervalIDRef.current)
    //         }

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


    //     return ()=> {
    //         if(intervalIDRef.current){
    //             clearInterval(intervalIDRef.current)
    //         }
            
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

    // },[inView])

    //Stop automation when hover - OPTIONAL
    // useEffect(()=>{

    //     if(inView){
    //         if(window.innerWidth < 900){
    //             swiperRef.current?.addEventListener('touchstart', ()=>{
    //                 if(intervalIDRef.current)
    //                 clearInterval(intervalIDRef.current)
    //             })
    //             swiperRef.current?.addEventListener('touchend', ()=>{
    //                 intervalIDRef.current = setInterval(()=>{
    //                     handleNext()
    //                 }, animationTime)
    //             })
    //         } else {
    //             swiperRef.current?.addEventListener('mouseenter', ()=>{
    //                 if(intervalIDRef.current)
    //                 clearInterval(intervalIDRef.current)
    //             })
    //             swiperRef.current?.addEventListener('mouseleave', ()=>{
    //                 intervalIDRef.current = setInterval(()=>{
    //                     handleNext()
    //                 }, animationTime)
    //             })
    //         }
    //     } else {
    //         swiperRef.current?.removeEventListener('mouseenter', ()=>{
    //             if(intervalIDRef.current)
    //             clearInterval(intervalIDRef.current)
    //         })
    //         swiperRef.current?.removeEventListener('mouseleave', ()=>{
    //             intervalIDRef.current = setInterval(()=>{
    //                 handleNext()
    //             }, animationTime)
    //         })
    //         swiperRef.current?.removeEventListener('touchstart', ()=>{
    //             if(intervalIDRef.current)
    //             clearInterval(intervalIDRef.current)
    //         })
    //         swiperRef.current?.removeEventListener('touchend', ()=>{
    //             intervalIDRef.current = setInterval(()=>{
    //                 handleNext()
    //             }, animationTime)
    //         }) 
    //     }

    
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
    //         swiperRef.current?.removeEventListener('touchstart', ()=>{
    //             if(intervalIDRef.current)
    //             clearInterval(intervalIDRef.current)
    //         })
    //         swiperRef.current?.removeEventListener('touchend', ()=>{
    //             intervalIDRef.current = setInterval(()=>{
    //                 handleNext()
    //             }, animationTime)
    //         })
    //     }
    // },[inView])
    
    //Draggable
    useEffect(()=>{

        let posX1: number;
        let posX2: number;

        if(containerRef.current && inView){
            containerRef.current.addEventListener("touchstart", dragStart);
            containerRef.current.addEventListener("mousedown", dragStart);
        } else if (containerRef.current) {
            containerRef.current.removeEventListener("touchstart", dragStart)
            containerRef.current.removeEventListener("mousedown", dragStart)
        }

        function dragMove(e:any) {
            if(swiperRef.current){
            const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth

            if (e.type == "touchmove") {
                posX2 = posX1 - e.touches[0].clientX;
              } else {
                posX2 = posX1 - e.clientX;
              }

              const currentTranslateX = - getTranslateX(swiperRef.current)
            
              //prevent white space when going to far to the left else will move the slider while dragging
              if(currentTranslateX <= 0 || currentTranslateX >  childWidth * 2){
                return
              } else {
                swiperRef.current.style.transform = `translateX(${-posX2 - childWidth}px)`;
              }
            }

          }
          
        function dragEnd() {
            if(swiperRef.current && containerRef.current){

                const translateOffset = getTranslateX(swiperRef.current)

                const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth
                if (translateOffset + childWidth < -1 * childWidth / offsetPresition && swiperRef.current && swiperRef.current.children.length > 0) {
                    //Go to Next slide

                    swiperRef.current.style.transform = `translateX(${-childWidth}px)`
            
                    const firstChild = swiperRef.current.children[0]
                    const secondtChild = swiperRef.current.children[1]
            
                    swiperRef.current.style.transition = `all ${transitionTime} ease-out`
            
                    swiperRef.current.style.transform = `translateX(${-childWidth * 2}px)`
            
                    const transition = ()=>{
                        if(swiperRef.current){
                            swiperRef.current.style.transition = `none`
                            swiperRef.current.style.transform = `translateX(0px)`
                            swiperRef.current.appendChild(firstChild)
                            swiperRef.current.appendChild(secondtChild)
            
                            swiperRef.current.removeEventListener('transitionend', transition)
                        }
                    }
            
                    swiperRef.current.addEventListener('transitionend', transition)
                    if(currentIndex == swiperRef.current.children.length - 1){
                        setCurrentIndex(0)
                    } else {
                        setCurrentIndex(prev => prev + 1)
                    }

                } else if (translateOffset + childWidth > childWidth / offsetPresition) {
                    //Go to Prev slide
                    swiperRef.current.style.transition = `all ${transitionTime} ease-out`
                    swiperRef.current.style.transform = `translateX(0px)`
                    if(currentIndex == 0){
                        setCurrentIndex(swiperRef.current.children.length - 1)
                    } else {
                        setCurrentIndex(prev => prev - 1)
                    }
                } else {
                    //Stay in the current slide
                    const transition = ()=>{
                        if(swiperRef.current){
                            const firstChild = swiperRef.current.children[0]
                            swiperRef.current.style.transition = `none`
                            swiperRef.current.style.transform = `translateX(0px)`
                            swiperRef.current.appendChild(firstChild)
            
                            swiperRef.current.removeEventListener('transitionend', transition)
                        }
                    }
                    //transition doesn't work if distance is 0 so:
                    if(translateOffset + childWidth == 0){
                        const firstChild = swiperRef.current.children[0]
                        swiperRef.current.style.transform = `translateX(0px)`
                        swiperRef.current.appendChild(firstChild)
                    } else {
                        swiperRef.current.style.transition = `all ${transitionTime} ease-out`
                        swiperRef.current.style.transform = `translateX(${-childWidth}px)`
                        swiperRef.current.addEventListener('transitionend', transition)
                    }
                }

                containerRef.current.removeEventListener("touchmove", dragMove)
                containerRef.current.removeEventListener("mousemove", dragMove)
                containerRef.current.removeEventListener("touchend", dragEnd)
                containerRef.current.removeEventListener("mouseup", dragEnd)
            }
        }

        function dragStart(e:any) {
            if(containerRef.current && swiperRef.current){
                swiperRef.current.style.transition = 'none'

                //Add prev image in case is dragedd to left
                const lastChildIndex = swiperRef.current.children.length - 1
            
                const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth
                
                const lastChild = swiperRef.current.children[lastChildIndex]
                swiperRef.current.insertBefore(lastChild, swiperRef.current.firstChild)

                swiperRef.current.style.transition = 'none'
                swiperRef.current.style.transform = `translateX(${-childWidth}px)`
                //

                if (e.type == "touchstart") {
                  posX1 = e.touches[0].clientX;

                  containerRef.current.addEventListener("touchmove", dragMove);
                  containerRef.current.addEventListener("touchend", dragEnd);
                } else {
                  posX1 = e.clientX;
              
                  containerRef.current.addEventListener("mouseup", dragEnd);
                  containerRef.current.addEventListener("mousemove", dragMove);
                }
            }            
        }

        return ()=>{
            if(containerRef.current){
                containerRef.current.removeEventListener("touchstart", dragStart)
                containerRef.current.removeEventListener("mousedown", dragStart)
                containerRef.current.removeEventListener("touchmove", dragMove)
                containerRef.current.removeEventListener("mousemove", dragMove)
                containerRef.current.removeEventListener("touchend", dragEnd)
                containerRef.current.removeEventListener("mouseup", dragEnd)
            }
        }

    },[inView])

  return (
    <>
        <div className={s.container} ref={containerRef} >

            <div className={s.slideContainer} ref={swiperRef} style={ { width: `calc(100% * ${numberOfSlides})` } } >

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
        <div className={s.goToContainer}>
                    <button onClick={()=>handleGoTo(0)}>
                        Go To 0
                    </button>
                    <button onClick={()=>handleGoTo(1)}>
                        Go To 1
                    </button>
                    <button onClick={()=>handleGoTo(2)}>
                        Go To 2
                    </button>
                    <button onClick={()=>handleGoTo(3)}>
                        Go To 3
                    </button>
        </div>
    </>

  )
}

export default Swiper